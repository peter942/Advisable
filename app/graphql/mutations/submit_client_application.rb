# frozen_string_literal: true

module Mutations
  class SubmitClientApplication < Mutations::BaseMutation
    description "Submits a clients application"
    field :client_application, Types::ClientApplicationType, null: true

    def authorized?
      requires_client!

      return true if current_user.application_status == "Application Started"

      ApiError.invalid_request("APPLICATION_NOT_STARTED", "application status is #{current_user.application_status}")
    end

    def resolve
      current_account_responsible_for do
        current_user.application_status = "Submitted"
        current_user.save!
      end

      current_user.sync_to_airtable

      {client_application: current_user}
    end
  end
end
