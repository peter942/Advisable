class Mutations::UpdateTask < Mutations::BaseMutation
  argument :id, ID, required: true
  argument :name, String, required: false
  argument :description, String, required: false
  argument :dueDate, GraphQL::Types::ISO8601DateTime, required: false
  argument :estimate, Float, required: false

  field :task, Types::TaskType, null: true
  field :errors, [Types::Error], null: true

  # def authorized?(**args)
  #   task = Task.find_by_airtable_id!(args[:id])
  #   policy = BookingPolicy.new(context[:current_user], booking)
  #   return true if policy.is_specialist_or_client
  #   return false, { errors: [{ code: "not_authorized" }] }
  # end

  def resolve(**args)
    task = Task.find_by_airtable_id!(args[:id])

    {
      task: Tasks::Update.call(
        task: task,
        attributes: args.except(:id)
      )
    }

    rescue Service::Error => e
      return { errors: [e] }
  end
end
