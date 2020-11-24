# Used to update an application record during the application process.
class Mutations::UpdateApplication < Mutations::BaseMutation
  class ApplicationQuestionInputType < GraphQL::Schema::InputObject
    argument :question, String, required: true
    argument :answer, String, required: true
  end

  argument :id, ID, required: true
  argument :introduction, String, required: false
  argument :availability, String, required: false
  argument :questions, [ApplicationQuestionInputType], required: false
  argument :references, [ID], required: false
  argument :rate, Float, required: false
  argument :accepts_fee, Boolean, required: false
  argument :accepts_terms, Boolean, required: false
  argument :project_type, String, required: false
  argument :monthly_limit, Int, required: false
  argument :trial_program, Boolean, required: false
  argument :auto_apply, Boolean, required: false

  field :application, Types::ApplicationType, null: true
  field :errors, [Types::Error], null: true

  def resolve(**args)
    {application: Applications::Update.call(id: args[:id], attributes: attributes(args), current_account_id: current_account_id)}
  rescue Service::Error => e
    {errors: [e]}
  end

  private

  def attributes(args)
    args.except(:id, :questions).merge(
      {
        questions:
          (args[:questions] || []).map do |question|
            {question: question.question, answer: question.answer}
          end
      }
    )
  end
end
