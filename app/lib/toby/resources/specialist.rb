# frozen_string_literal: true

module Toby
  module Resources
    class Specialist < BaseResource
      model_name ::Specialist
      attribute :uid, Attributes::String, readonly: true
      attribute :email, Lookups::Accounts::Email
      attribute :application_stage, Attributes::Select, options: ::Specialist::VALID_APPLICATION_STAGES
      attribute :account, Attributes::BelongsTo
      attribute :consultation_url, Lookups::Specialists::ConsultationUrl, sortable: false
      attribute :unavailable_until, Attributes::Date
      attribute :username, Attributes::String
      attribute :bio, Attributes::LongText
      attribute :skills, Attributes::HasManyThrough
      attribute :industries, Attributes::HasManyThrough
      attribute :linkedin, Attributes::String
      attribute :website, Attributes::Url
      attribute :hourly_rate, Attributes::Currency
      attribute :sourcing_fee, Attributes::Integer
      attribute :country, Attributes::BelongsTo
      attribute :iban, Attributes::String
      attribute :bank_currency, Attributes::String
      attribute :created_at, Attributes::DateTime, readonly: true
      attribute :updated_at, Attributes::DateTime, readonly: true

      action :login_as, label: "Log in as this Specialist"

      def self.label(record, context)
        Lazy::Label.new(::Account, record.account_id, context) do |account|
          "#{account.name} (#{account.email})"
        end
      end

      def self.search(query)
        ::Specialist.joins(:account).where("accounts.email ILIKE ?", "%#{query}%")
      end

      def self.login_as(object, context)
        context[:session_manager].session[:admin_override] = object.to_global_id.to_param

        {url: Advisable::Application::ORIGIN_HOST}
      end
    end
  end
end
