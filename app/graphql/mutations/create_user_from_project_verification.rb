class Mutations::CreateUserFromProjectVerification < Mutations::BaseMutation
  argument :previous_project, ID, required: true
  argument :email, String, required: true
  argument :fid, String, required: true

  field :user, Types::User, null: true

  def authorized?(previous_project:, email:, fid:)
    unless context[:oauth_viewer]
      raise ApiError::InvalidRequest.new(
              'notAuthenticated',
              'Not logged into Linkedin'
            )
    end

    true
  end

  def resolve(previous_project:, email:, fid:)
    project = PreviousProject.find_by_uid(previous_project)
    viewer = context[:oauth_viewer]

    unless BlacklistedDomain.email_allowed?(email)
      raise ApiError::InvalidRequest.new(
              'nonCorporateEmail',
              "The email #{email} is not allowed"
            )
    end

    account = Account.new(
      email: email,
      first_name: viewer.first_name,
      last_name: viewer.last_name,
      permissions: [:team_manager]
    )
    account.save!

    user = User.new(
      account: account,
      company: Company.new(name: Company.fresh_name_for(project.client_name)),
      company_name: project.client_name,
      company_type: project.company_type,
      fid: fid,
      contact_status: 'Application Started',
      campaign_source: 'validation',
      industry: project.primary_industry
    )
    user.save_and_sync_with_responsible!(current_account_id)
    AttachImageJob.perform_later(user, viewer.image)
    {user: user}
  rescue ActiveRecord::RecordInvalid
    if account.errors.added?(:email, :taken, value: email)
      raise ApiError::InvalidRequest.new("emailTaken", "The email #{email} is already used by another account.")
    elsif account.errors.added?(:email, :blank)
      raise ApiError::InvalidRequest.new("emailBlank", "Email is required.")
    else
      raise
    end
  end
end
