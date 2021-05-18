# frozen_string_literal: false

# Creates a new freelancer account
module Mutations
  class CreateFreelancerAccount < Mutations::BaseMutation
    description <<~HEREDOC
      Creates a new freelancer account
    HEREDOC

    argument :first_name, String, required: true do
      description 'The freelancers first name'
    end

    argument :last_name, String, required: true do
      description 'The freelancers last name'
    end

    argument :email, String, required: true do
      description 'The freelancers email address'
    end

    argument :phone, String, required: false do
      description 'The freelancers phone number'
    end

    argument :password, String, required: false do
      description 'The account password'
    end

    argument :skills, [String], required: false do
      description 'An array of skills'
    end

    argument :pid, String, required: false do
      description 'The project ID that they are signing up for.'
    end

    argument :campaign_name, String, required: false do
      description 'The name of the campaign they signed up from'
    end

    argument :campaign_source, String, required: false do
      description 'The source of the campaign they signed up from'
    end

    argument :referrer, String, required: false do
      description 'The rerrer they signed up from'
    end

    field :viewer, Types::ViewerUnion, null: false

    def resolve(**args)
      skills =
        (args[:skills] || []).map do |name|
          skill = Skill.find_by(name: name)
          if skill.nil?
            ApiError.invalid_request(
              'skillNotFound',
              "Skill '#{name}' does not exist"
            )
          end
          skill
        end

      account = Account.new(
        first_name: args[:first_name],
        last_name: args[:last_name],
        email: args[:email],
        password: args[:password]
      )

      specialist = Specialist.new(
        account: account,
        campaign_name: args[:campaign_name],
        campaign_source: args[:campaign_source],
        application_stage: 'Started',
        phone: args[:phone],
        pid: args[:pid],
        referrer: resolve_referrer(args[:referrer])
      )

      # frozen_string_literal: false
      # Creates a new freelancer account
      ApiError.invalid_request('emailTaken', 'This email is already being used by another account') if !account.valid? && specialist.valid? && account.errors.added?(:email, "has already been taken")

      specialist.skills = skills
      success = Logidze.with_responsible(specialist.account_id) do
        specialist.save
      end

      if success
        GeocodeAccountJob.perform_later(account, context[:client_ip])
        specialist.sync_to_airtable
        create_application_record(specialist, args[:pid])
        specialist.send_confirmation_email
      end

      login_as(account)

      {viewer: specialist.reload}
    end

    private

    # TODO: Make specialist referrer column a relationship to specialist table
    # to remove dependency on Airtable.
    def resolve_referrer(id)
      return nil if id.blank?
      return id if id.match?(/^rec[^_]/)

      Specialist.find_by_uid(id)&.airtable_id
    end

    # When a freelancer signs up, they may have come from a campaign that passed
    # a pid (project ID) as a query param. This can be sent with the signup
    # mutation to create an application record for that project.
    def create_application_record(specialist, pid)
      return unless pid

      project = Project.find_by_uid_or_airtable_id(pid)
      project = Airtable::Project.find(pid).sync if project.nil?
      return if project.blank?

      application = specialist.applications.create(project: project, status: 'Invited To Apply')
      application.sync_to_airtable({'Source' => 'new-signup'})
    end
  end
end
