class Mutations::DeleteTask < Mutations::BaseMutation
  argument :task, ID, required: true

  field :task, Types::TaskType, null: true
  field :errors, [Types::Error], null: true

  def authorized?(**args)
    task = Task.find_by_uid!(args[:task])
    policy = TaskPolicy.new(context[:current_user], task)
    return true if policy.is_specialist_or_client

    [false, {errors: [{code: "not_authorized"}]}]
  end

  def resolve(**args)
    task = Task.find_by_uid!(args[:task])
    policy = TaskPolicy.new(context[:current_user], task)
    raise Service::Error.new("tasks.cantDeleteAssigned") unless policy.delete

    task.stage = "Deleted"
    task.save_and_sync!

    {task: task}
  rescue Service::Error => e
    {errors: [e]}
  end
end
