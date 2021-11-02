# frozen_string_literal: true

module Mutations
  class RejectApplication < Mutations::BaseMutation
    argument :id, ID, required: true
    argument :message, String, required: false

    field :application, Types::ApplicationType, null: true

    def authorized?(**args)
      requires_current_user!
      application = Application.find_by!(uid: args[:id])
      policy = ApplicationPolicy.new(current_user, application)
      return true if policy.write?

      ApiError.not_authorized("You can not reject this application")
    end

    def resolve(**args)
      application = Application.find_by!(uid: args[:id])
      application.status = "Application Rejected"
      save_with_current_account!(application)
      send_message(application, args[:message]) if args[:message].present?

      {application: application}
    end

    private

    def send_message(application, content)
      specialist_account = application.specialist.account
      user_account = current_user.account
      conversation = Conversation.by_accounts([specialist_account, user_account])
      conversation.new_message!(user_account, content)
    end
  end
end
