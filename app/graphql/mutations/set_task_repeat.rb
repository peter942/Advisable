class Mutations::SetTaskRepeat < Mutations::BaseMutation
  argument :id, ID, required: true
  argument :repeat, String, required: false

  field :task, Types::TaskType, null: true
  field :errors, [Types::Error], null: true

  def authorized?(**args)
    task = Task.find_by_uid!(args[:id])
    policy = TaskPolicy.new(context[:current_user], task)
    return true if policy.set_repeating

    [false, {errors: [{code: 'not_authorized'}]}]
  end

  def resolve(**args)
    task = Task.find_by_uid!(args[:id])
    current_account_responsible_for { task.update(repeat: args[:repeat]) }
    task.sync_to_airtable

    {task: task}
  end
end
