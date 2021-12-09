# frozen_string_literal: true

module Types
  class Account < Types::BaseType
    description "Type for the Account model."

    field :id, ID, null: false, method: :uid
    field :first_name, String, null: true
    field :last_name, String, null: true
    field :name, String, null: true
    field :avatar, String, null: true, method: :cached_avatar_url

    field :is_viewer, Boolean, null: true
    def is_viewer
      current_user.account == object
    end
  end
end
