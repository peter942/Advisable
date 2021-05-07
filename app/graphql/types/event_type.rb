# frozen_string_literal: true

module Types
  class EventType < Types::BaseType
    description "Fields representing an Event"

    field :title, String, null: false
    field :description, String, null: false
    field :color, String, null: false
    field :url, String, null: true
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :host, Types::SpecialistType, null: false
    field :attendees, Types::SpecialistType.connection_type, null: false

    field :id, ID, null: false, method: :uid

    field :cover_photo_url, String, null: true, method: :resized_cover_photo_url

    field :attending, Boolean, null: false

    def attending
      object.attendees.exists?(current_user.id)
    end

    field :attendees_count, Integer, null: false
    def attendees_count
      object.attendees.count
    end

    field :published, Boolean, null: false
    def published
      !!object.published_at
    end
  end
end
