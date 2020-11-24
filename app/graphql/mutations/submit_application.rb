# Used to update an application record during the application process.
class Mutations::SubmitApplication < Mutations::BaseMutation
  argument :id, ID, required: true

  field :application, Types::ApplicationType, null: true
  field :errors, [Types::Error], null: true

  def resolve(**args)
    begin
      application = Application.find_by_uid_or_airtable_id!(args[:id])
      {
        application: Applications::Submit.call(application, current_account_id: current_account_id)
      }
    rescue Service::Error => e
      {
        errors: [e]
      }
    end
  end
end
