# frozen_string_literal: true

module Mutations
  class UpdateTask < Mutations::BaseMutation
    argument :description, String, required: false
    argument :due_date, GraphQL::Types::ISO8601Date, required: false
    argument :estimate, Int, required: false
    argument :estimate_type, String, required: false
    argument :flexible_estimate, Int, required: false
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :trial, Boolean, required: false

    field :task, Types::TaskType, null: true

    def authorized?(**args)
      requires_current_user!

      task = Task.find_by!(uid: args[:id])
      policy = TaskPolicy.new(current_user, task)
      args.except(:id).each do |arg, _val|
        next if policy.public_send("update_#{arg}")

        ApiError.not_authorized("You do not have access to update this task")
      end

      true
    end

    def resolve(**args)
      @task = Task.find_by_uid!(args[:id])

      ApiError.invalid_request("APPLICATION_STATUS_NOT_WORKING", "Application status is 'Stopped Working'") if @task.application.status == "Stopped Working"

      @task.assign_attributes(args.except(:id, :trial))
      set_trial(args[:trial]) if args.key?(:trial)
      changes_allowed?

      # If the stage is "Quote Requested" and the estimate has changed then set
      # the status to "Quote Provided".
      if @task.estimate_changed? && ["Quote Requested"].include?(@task.stage)
        @task.stage = "Quote Provided"
        @task.quote_provided_at = Time.zone.now
      end

      # If the the name, dueDate or description was changed

      # clear the estimate if the client is making the edit

      # Set the stage to Not Assigned if the @task was Quote Provided

      if @task.name_changed? || @task.due_date_changed? || @task.description_changed?
        @task.estimate = nil if @task.estimate? && current_user.is_a?(::User)
        @task.flexible_estimate = nil if @task.flexible_estimate? && current_user.is_a?(::User)

        @task.stage = "Not Assigned" if @task.stage == "Quote Provided"
      end

      @task.sync_to_airtable if Logidze.with_responsible(current_account_id) { @task.save }

      @task.application.reload

      {task: @task}
    rescue Service::Error => e
      ApiError.service_error(e)
    end

    private

    def set_trial(trial) # rubocop:disable Naming/AccessorMethodName
      existing = @task.application.trial_task

      if existing.present? &&
         existing.stage.in?(%w[Assigned Working Submitted Approved Paid])
        raise Service::Error, "tasks.applicationHasActiveTrialTask"
      end

      if trial == true && existing && existing != @task
        existing.update(trial: false)
        existing.sync_to_airtable
      end

      @task.trial = trial
    end

    def changes_allowed?
      policy = TaskPolicy.new(current_user, @task)

      @task.changes.each do |att, _changes|
        raise Service::Error, "tasks.#{att}IsLocked" unless policy.public_send("update_#{att}")
      end
    end
  end
end
