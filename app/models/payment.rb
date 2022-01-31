# frozen_string_literal: true

class Payment < ApplicationRecord
  include Uid

  has_logidze

  URL_EXPIRES_AT = 1.hour.to_i
  VALID_STATUSES = %w[requires_payment_method requires_confirmation requires_action processing requires_capture canceled succeeded failed pending refunded].freeze
  VALID_PAYMENT_METHODS = ["Bank Transfer", "Stripe", "Deposit"].freeze

  belongs_to :company
  belongs_to :specialist
  belongs_to :task, optional: true
  belongs_to :payment_request, optional: true

  before_create :set_admin_fee

  validates :amount, presence: true
  validates :status, inclusion: {in: VALID_STATUSES}, allow_nil: true
  validates :payment_method, inclusion: {in: VALID_PAYMENT_METHODS}, allow_nil: true

  scope :with_status, ->(status) { where(status:) }

  def retries
    super.presence || 0
  end

  def amount_with_fee
    amount + admin_fee
  end

  def amount_to_be_paid
    amount_with_fee - deposit.to_i
  end

  def pdf_url(regenerate: false)
    self.pdf_key = nil if regenerate
    GeneratePaymentInvoiceJob.perform_now(self) if pdf_key.blank?
    obj = Aws::S3::Object.new(bucket_name: ENV["AWS_S3_BUCKET"], key: pdf_key)
    obj.presigned_url(:get, expires_in: URL_EXPIRES_AT)
  end

  def send_receipt!
    UserMailer.payment_receipt(self).deliver_later
  end

  def charge!
    return if status == "succeeded"

    use_deposit!

    if amount_to_be_paid.positive?
      if company.project_payment_method == "Bank Transfer"
        update!(payment_method: "Bank Transfer")
        Slack.message(channel: "payments", text: "New Bank Transfer for *#{company&.name}* (#{company_id}) with *#{specialist&.account&.name}* (#{specialist&.uid})!\nPayment: #{uid}")
      elsif payment_intent_id.blank?
        intent = Stripe::PaymentIntent.create(
          stripe_params.merge({confirm: true, off_session: true, payment_method: company.stripe_payment_method}),
          {idempotency_key: "#{uid}_off_session_#{retries}"}
        )
        update!(payment_intent_id: intent.id, status: intent.status, payment_method: "Stripe")

        if intent.status == "succeeded"
          send_receipt!
        else
          Slack.message(
            channel: "payments",
            text: " Payment for *#{company&.name}* (#{company_id}) with *#{specialist&.account&.name}* (#{specialist&.uid}) was not successful! Payment: #{uid}"
          )
        end
      end
    end

    self
  rescue Stripe::StripeError => e
    update!(status: "failed", payment_intent_id: e.json_body.dig(:error, :payment_intent, :id))
    Sentry.capture_exception(e, extra: {stripe_error: e.json_body[:error]})
    Slack.message(channel: "payments", text: "Something went wrong with the payment for *#{company&.name}* (#{company_id}) with *#{specialist&.account&.name}* (#{specialist&.uid})!\nPayment: #{uid}\nStripe Payment Intent ID: #{payment_intent_id}")
    create_on_session_intent!
    self
  end

  def refund!
    Stripe::Refund.create({payment_intent: payment_intent_id, metadata: {payment_type: "payment", payment: uid}})
  rescue Stripe::StripeError => e
    Sentry.capture_exception(e, extra: {stripe_error: e.json_body[:error]})
    Slack.message(channel: "payments", text: "Something went wrong with refundment of payment for *#{company&.name}* (#{company_id}) with *#{specialist&.account&.name}* (#{specialist&.uid})!\nPayment: #{uid}\nStripe Payment Intent ID: #{payment_intent_id}")
    self
  end

  private

  def use_deposit!
    return if task.nil? || deposit.to_i.positive?

    ActiveRecord::Base.transaction do
      project = task.application.project
      deposit_remaining = project.deposit_remaining
      if deposit_remaining >= amount_with_fee
        update!(deposit: amount_with_fee, payment_method: "Deposit", status: "succeeded")
        project.update!(deposit_used: project.deposit_used + amount_with_fee)
      elsif deposit_remaining.positive?
        update!(deposit: deposit_remaining)
        project.update!(deposit_used: project.deposit_used + deposit_remaining)
      end
    end
  end

  def create_on_session_intent!
    return if payment_intent_id.present?

    intent = Stripe::PaymentIntent.create(
      stripe_params.merge({setup_future_usage: "off_session"}),
      {idempotency_key: "#{uid}_on_session_#{retries}"}
    )
    update!(payment_intent_id: intent.id, status: intent.status, payment_method: "Stripe")
  rescue Stripe::StripeError => e
    Sentry.capture_exception(e, extra: {stripe_error: e.json_body[:error]})
  end

  def stripe_params
    {
      amount: amount_to_be_paid,
      currency: "usd",
      customer: company.stripe_customer_id,
      metadata: {
        payment_type: "payment",
        payment: uid,
        admin_fee:
      }
    }
  end

  def set_admin_fee
    return if admin_fee.present?

    self.admin_fee = (amount * company.admin_fee_percentage).round
  end
end

# == Schema Information
#
# Table name: payments
#
#  id                 :bigint           not null, primary key
#  admin_fee          :integer
#  amount             :integer
#  charged_at         :datetime
#  deposit            :integer
#  payment_method     :string
#  pdf_key            :string
#  retries            :integer
#  status             :string
#  uid                :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  company_id         :uuid             not null
#  payment_intent_id  :string
#  payment_request_id :bigint
#  specialist_id      :bigint           not null
#  task_id            :bigint
#
# Indexes
#
#  index_payments_on_company_id          (company_id)
#  index_payments_on_payment_request_id  (payment_request_id)
#  index_payments_on_specialist_id       (specialist_id)
#  index_payments_on_task_id             (task_id)
#  index_payments_on_uid                 (uid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (company_id => companies.id)
#  fk_rails_...  (payment_request_id => payment_requests.id)
#  fk_rails_...  (specialist_id => specialists.id)
#  fk_rails_...  (task_id => tasks.id)
#
