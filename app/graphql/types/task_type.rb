class Types::TaskType < Types::BaseType
  field :id, ID, null: false
  field :airtable_id, String, null: true
  field :stage, String, null: true
  field :name, String, null: true
  field :repeat, String, null: true
  field :estimate, Float, null: true
  field :due_date, GraphQL::Types::ISO8601DateTime, null: true
  field :description, String, null: true
  field :application, Types::ApplicationType, null: false
  field :created_at, GraphQL::Types::ISO8601DateTime, null: false

  def id
    object.uid
  end
end
