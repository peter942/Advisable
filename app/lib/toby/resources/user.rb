# frozen_string_literal: true

module Toby
  module Resources
    class User < BaseResource
      model_name ::User
      attribute :uid, Attributes::String, readonly: true
      attribute :account, Attributes::BelongsTo, labeled_by: :name
      attribute :company, Attributes::BelongsTo, labeled_by: :name
      attribute :country, Attributes::BelongsTo, labeled_by: :name
      attribute :application_status, Attributes::Select, options: ["Accepted", "Invited", "Active", "Access Granted"]
      attribute :created_at, Attributes::DateTime, readonly: true
      attribute :updated_at, Attributes::DateTime, readonly: true
    end
  end
end
