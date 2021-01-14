# frozen_string_literal: true

require "administrate/base_dashboard"

module Guild
  class PostDashboard < Administrate::BaseDashboard
    # ATTRIBUTE_TYPES
    # a hash that describes the type of each of the model's fields.
    #
    # Each different type represents an Administrate::Field object,
    # which determines how the attribute is displayed
    # on pages throughout the dashboard.
    ATTRIBUTE_TYPES = {
      specialist: SimpleBelongsToField,
      account: Field::HasOne.with_options(
        searchable: true,
        searchable_fields: %w[first_name last_name email]
      ),
      guild_topics: ActsAsTaggableField,
      # guild_topic_list: Field::String.with_options(searchable: false),
      images: Field::HasMany.with_options(class_name: "Guild::PostImage"),
      id: Field::String.with_options(searchable: false),
      type: Field::Select.with_options(searchable: false, collection: ->(_field) { Guild::Post::POST_TYPES }),
      body: Field::Text,
      title: Field::String,
      status: Field::Select.with_options(searchable: false, collection: ->(field) { field.resource.class.public_send(field.attribute.to_s.pluralize).keys }),
      reactionable_count: Field::Number,
      data: Field::String.with_options(searchable: false),
      created_at: Field::DateTime,
      updated_at: Field::DateTime,
      audience_notified_at: Field::DateTime,
      engagements_count: Field::Number,
      audience_type: Field::String.with_options(searchable: false, collection: ->(_field) { Guild::Post::AUDIENCE_TYPES }),
      pinned: Field::Boolean,
    }.freeze

    # COLLECTION_ATTRIBUTES
    # an array of attributes that will be displayed on the model's index page.
    #
    # By default, it's limited to four items to reduce clutter on index pages.
    # Feel free to add, remove, or rearrange items.
    COLLECTION_ATTRIBUTES = %i[
      title
      status
      created_at
      account
    ].freeze

    # SHOW_PAGE_ATTRIBUTES
    # an array of attributes that will be displayed on the model's show page.
    SHOW_PAGE_ATTRIBUTES = %i[
      specialist
      title
      guild_topics
      status
      type
      body
      created_at
      updated_at
      reactionable_count
      audience_type
      audience_notified_at
      pinned
    ].freeze

    # FORM_ATTRIBUTES
    # an array of attributes that will be displayed
    # on the model's form (`new` and `edit`) pages.
    FORM_ATTRIBUTES = %i[
      specialist
      title
      guild_topics
      type
      body
      status
      created_at
      updated_at
      reactionable_count
      audience_notified_at
      pinned
    ].freeze

    # COLLECTION_FILTERS
    # a hash that defines filters that can be used while searching via the search
    # field of the dashboard.
    #
    # For example to add an option to search for open resources by typing "open:"
    # in the search field:
    #
    #   COLLECTION_FILTERS = {
    #     open: ->(resources) { resources.where(open: true) }
    #   }.freeze
    COLLECTION_FILTERS = {
      published: ->(resources) { resources.published }
    }.freeze

    # Overwrite this method to customize how posts are displayed
    # across all pages of the admin dashboard.
    #
    def display_resource(post)
      post.title.try(:truncate, 24)
    end

    def collection_includes
      super + [specialist: :account]
    end
  end
end
