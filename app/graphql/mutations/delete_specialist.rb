# frozen_string_literal: true

module Mutations
  class DeleteSpecialist < Mutations::BaseMutation
    include Mutations::Helpers::Authentication

    field :status, String, null: true

    def authorized?
      requires_specialist!
    end

    def resolve
      current_user.account.disable!(delete: true)
      current_user.save_and_sync_with_responsible!(current_account_id)
      logout
      {status: "ok"}
    end
  end
end
