# frozen_string_literal: true

class Mutations::InviteUserToInterview < Mutations::BaseMutation
  include Mutations::Helpers::Account

  argument :application_id, ID, required: true
  argument :email, String, required: true
  argument :first_name, String, required: false
  argument :last_name, String, required: false

  field :user, Types::User, null: true

  def authorized?(application_id:, **args)
    requires_client!

    application = Application.find_by!(uid: application_id)
    return true if current_user == application.project.user

    raise ApiError::InvalidRequest.new("invalidApplication", "The application does not belong to signed in user.")
  end

  def resolve(application_id:, email:, **optional)
    invited_user = find_or_create_account_by_email!(email, optional)
    application = Application.find_by!(uid: application_id)
    UserMailer.invited_to_interview(current_user, invited_user, application).deliver_later
    WebhookEvent.trigger("user.invited_to_interview", WebhookEvent::Application.data_with_user(application, invited_user))

    {user: invited_user}
  end
end
