# frozen_string_literal: true

module Types
  class CustomerType < Types::BaseType
    field :id, ID, null: false
    field :name, String, null: false
    field :email, String, null: false
  end
end
