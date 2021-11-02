# frozen_string_literal: true

# Sets an application status to 'Stopped Working'. This is when the client
# has decided to stop working with a freelancer.
module Mutations
  class StopWorking < Mutations::BaseMutation
    description <<~HEREDOC
      Sets a given applications status to 'Not Working'.
    HEREDOC

    argument :application, ID, required: true do
      description "The UID of the application."
    end

    argument :reason, String, required: false do
      description "The reason why the the client is ending the work."
    end

    field :application, Types::ApplicationType, null: true

    def authorized?(**args)
      application = Application.find_by_uid!(args[:application])
      policy = ApplicationPolicy.new(current_user, application)

      ApiError.not_authorized("You do not have permission to execute this mutation") unless policy.stop_working?

      ApiError.invalid_request("APPLICATION_STATUS_NOT_WORKING", "The application status must be 'Working'.") if application.status != "Working"

      true
    end

    def resolve(**args)
      application = Application.find_by_uid!(args[:application])

      Logidze.with_responsible(current_account_id) do
        application.update(status: "Stopped Working", stopped_working_reason: args[:reason])
      end

      {application: application}
    end
  end
end
