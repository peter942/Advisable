# frozen_string_literal: true

module Types
  class BaseType < GraphQL::Schema::Object
    field_class BaseField

    def current_user
      context[:current_user]
    end

    private

    def requires_current_user!
      return true if current_user.present?

      ApiError.not_authenticated
    end

    def requires_guild_user!
      requires_current_user!
      return true if current_user&.guild

      ApiError.invalid_request("INVALID_PERMISSIONS", "Not a guild user")
    end
  end
end
