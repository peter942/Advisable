# frozen_string_literal: true

module Toby
  module Resources
    class Payout < BaseResource
      model_name ::Payout
      attribute :uid, Attributes::String, readonly: true
      attribute :task, Attributes::BelongsTo
      attribute :company, Lookups::Payouts::CompanyName
      attribute :specialist, Attributes::BelongsTo
      attribute :task_name, Lookups::Tasks::Name
      attribute :vat_rate, Attributes::String, readonly: true
      attribute :amount, Attributes::Currency
      attribute :vat_amount, Attributes::Currency, readonly: true
      attribute :gross_amount, Attributes::Currency, readonly: true
      attribute :sourcing_fee, Attributes::Currency
      attribute :amount_without_fee, Attributes::Currency, readonly: true
      attribute :status, Attributes::String
      attribute :processed_at, Attributes::DateTime, readonly: true
      attribute :created_at, Attributes::DateTime, readonly: true
      attribute :updated_at, Attributes::DateTime, readonly: true

      action :process, label: "Mark as processed", if: ->(payout) { payout.processed_at.nil? }
      action :unprocess, label: "Mark as pending", unless: ->(payout) { payout.processed_at.nil? }

      def self.process(object, _context)
        return if object.processed_at?

        object.update!(processed_at: Time.zone.now, status: "processed")
      end

      def self.unprocess(object, _context)
        return unless object.processed_at?

        object.update!(processed_at: nil, status: "pending")
      end
    end
  end
end
