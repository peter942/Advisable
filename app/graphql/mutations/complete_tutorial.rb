# frozen_string_literal: true

# Marks a given tutorial as completed
module Mutations
  class CompleteTutorial < Mutations::BaseMutation
    argument :tutorial, String, required: true

    field :viewer, Types::ViewerUnion, null: true

    def authorized?(**_args)
      requires_current_user!
    end

    def resolve(tutorial:)
      current_user.account.complete_tutorial(tutorial)
      {viewer: current_user}
    end
  end
end
