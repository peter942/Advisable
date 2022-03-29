# frozen_string_literal: true

# A Specialist specifically represents a specialist account. A client account is
# represented by the User model. Ideally these two models will eventually be
# merged to be different types of users.
#
# A specialist first applys to Advisable before they get an account. This
# application is also tracked in the specialist record. A specialist is
# considered an "account" once a password is set. The status of a specialists
# application is stored in the application_stage column.
#
class Specialist < ApplicationRecord
  include ::Airtable::Syncable
  include Uid
  include SpecialistOrUser
  include Subscriber
  include Resizable
  include ::Airtable::Syncable
  include ::Guild::SpecialistsConcern

  VALID_APPLICATION_STAGES = ["Started", "Submitted", "Invited To Interview", "Interview Scheduled", "Interview Completed", "Full Application", "On Hold", "Completed", "Accepted", "Rejected By Us", "Rejected By Them", "References Requested", "References Provided", "References Validated", "Kicked Off"].freeze
  REJECTED_STAGES = ["Rejected By Us", "Rejected By Them"].freeze
  DEFAULT_SOURCING_FEE = 800

  has_logidze

  belongs_to :country, optional: true
  belongs_to :referrer, class_name: "Specialist", inverse_of: :referred, optional: true
  belongs_to :interviewer, optional: true, class_name: "SalesPerson"

  has_many :payment_requests, dependent: :nullify
  has_many :payments, dependent: :nullify
  has_many :payouts, dependent: :nullify
  has_many :reviews, dependent: :destroy
  has_many :consultations, dependent: :destroy
  has_many :applications, dependent: :destroy
  has_many :interviews, through: :applications
  has_many :agreements, dependent: :destroy
  has_many :interviews, dependent: :destroy

  # Successful applications are applications that are either working or stopped working
  has_many :successful_applications, -> { where(status: ["Working", "Stopped Working"]) }, class_name: "Application", inverse_of: :specialist, dependent: :destroy
  has_many :specialist_skills, dependent: :destroy
  has_many :skills, through: :specialist_skills
  has_many :specialist_industries, dependent: :destroy
  has_many :industries, through: :specialist_industries
  has_many :answers, dependent: :destroy
  has_many :events, foreign_key: :host_id, inverse_of: :host, dependent: :nullify
  has_many :event_attendees, dependent: :destroy
  has_many :articles, class_name: "CaseStudy::Article", dependent: :destroy
  has_many :referred, class_name: "Specialist", foreign_key: :referrer_id, inverse_of: :referrer, dependent: :nullify

  has_many :article_skills, through: :articles, class_name: "CaseStudy::Skill", source: :skills
  has_many :case_study_skills, through: :article_skills, source: :skill

  # We also have an 'image' column in the specalists table. This is a deprecated
  # column that we used to use to store the avatar from airtable in.
  has_one_attached :resume
  has_one_attached :cover_photo
  resize cover_photo: {resize_to_limit: [2000, 2000]}

  validates :number_of_projects, inclusion: {in: %w[1-5 5-20 20+ None], message: "is invalid"}, allow_nil: true
  validates :application_stage, inclusion: {in: VALID_APPLICATION_STAGES}, allow_blank: true
  validates :username, uniqueness: true, allow_blank: true
  validate :valid_username

  scope :available, -> { where("unavailable_until IS NULL OR unavailable_until <= ?", Time.zone.now) }
  scope :not_rejected, -> { where.not(application_stage: REJECTED_STAGES) }
  scope :accepted, -> { where(application_stage: "Accepted") }

  before_save :update_timestamps, if: :will_save_change_to_application_stage?

  def accepted?
    application_stage == "Accepted"
  end

  def username_or_uid
    username || uid
  end

  def profile_path
    "/profile/#{username_or_uid}"
  end

  def send_confirmation_email
    token = account.create_confirmation_token
    SpecialistMailer.confirm(uid:, token:).deliver_later
  end

  # Whether or not the specialist has provided payment information. Returns true
  # if enough payment information has been provided.
  def has_setup_payments # rubocop:disable Naming/PredicateName
    bank_holder_name.present? && bank_holder_address.present? && bank_currency.present?
  end

  # sourcing_fee value is stored in basis points integers: 8% -> 800 bp
  def sourcing_fee_percentage
    (sourcing_fee.presence || DEFAULT_SOURCING_FEE) / BigDecimal("10000")
  end

  def self.find_by_username_or_id(username)
    if ::Specialist.valid_uid?(username)
      ::Specialist.find_by(uid: username)
    else
      ::Specialist.find_by(username:)
    end
  end

  def self.find_by_username_or_id!(username)
    find_by_username_or_id(username) || raise(ActiveRecord::RecordNotFound)
  end

  private

  def valid_username
    return if username.blank?

    errors.add(:username, "must be longer than 3 characters") if username.length < 3
    errors.add(:username, "must be alphanumeric") if /\W/.match?(username)
  end

  def update_timestamps
    column = "#{application_stage&.downcase&.gsub(/\s/, "_")}_at="
    return unless respond_to?(column)

    public_send(column, Time.current)
  end
end

# == Schema Information
#
# Table name: specialists
#
#  id                                :bigint           not null, primary key
#  accepted_at                       :datetime
#  application_interview_starts_at   :datetime
#  application_stage                 :string
#  application_status                :string
#  average_score                     :decimal(, )
#  bank_currency                     :string
#  bank_holder_address               :jsonb
#  bank_holder_name                  :string
#  bio                               :text
#  campaign_medium                   :string
#  campaign_name                     :string
#  campaign_source                   :string
#  case_study_status                 :string
#  city                              :string
#  community_accepted_at             :datetime
#  community_applied_at              :datetime
#  community_invited_to_call_at      :datetime
#  community_score                   :integer
#  community_status                  :string
#  guild                             :boolean          default(FALSE)
#  guild_calendly_link               :string
#  guild_featured_member_at          :datetime
#  guild_joined_date                 :datetime
#  hourly_rate                       :integer
#  iban                              :string
#  ideal_project                     :string
#  image                             :jsonb
#  instagram                         :string
#  interview_completed_at            :datetime
#  invited_to_interview_at           :datetime
#  linkedin                          :string
#  medium                            :string
#  member_of_week_email              :integer
#  number_of_projects                :string
#  pid                               :string
#  previous_work_description         :string
#  previous_work_results             :string
#  primarily_freelance               :boolean
#  project_count                     :integer
#  public_use                        :boolean
#  ratings                           :jsonb
#  remote                            :boolean
#  reviews_count                     :integer
#  sourcing_fee                      :integer
#  submitted_at                      :datetime
#  travel_availability               :string
#  trustpilot_review_status          :string
#  twitter                           :string
#  uid                               :string           not null
#  unavailable_until                 :date
#  username                          :citext
#  vat_number                        :string
#  website                           :string
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  account_id                        :bigint
#  airtable_id                       :string
#  application_interview_calendly_id :string
#  country_id                        :bigint
#  interviewer_id                    :bigint
#  referrer_id                       :bigint
#
# Indexes
#
#  index_specialists_on_account_id      (account_id) UNIQUE
#  index_specialists_on_airtable_id     (airtable_id)
#  index_specialists_on_country_id      (country_id)
#  index_specialists_on_interviewer_id  (interviewer_id)
#  index_specialists_on_referrer_id     (referrer_id)
#  index_specialists_on_uid             (uid) UNIQUE
#  index_specialists_on_username        (username) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (country_id => countries.id)
#  fk_rails_...  (interviewer_id => sales_people.id)
#  fk_rails_...  (referrer_id => specialists.id)
#
