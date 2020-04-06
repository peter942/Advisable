require 'administrate/base_dashboard'

class SearchDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    uid: Field::String,
    created_at: Field::DateTime,
    user:
      Field::BelongsTo.with_options(
        searchable: true, searchable_field: 'email'
      ),
    skill: Field::String,
    industry: Field::String,
    industry_experience_required: Field::Boolean,
    company_type: Field::String,
    company_experience_required: Field::Boolean,
    recommended_project:
      Field::BelongsTo.with_options(class_name: 'PreviousProject'),
    updated_at: Field::DateTime
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[user skill industry created_at].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    uid
    created_at
    user
    skill
    industry
    industry_experience_required
    company_type
    company_experience_required
    recommended_project
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    user
    skill
    industry
    industry_experience_required
    company_type
    company_experience_required
    recommended_project
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
  COLLECTION_FILTERS = {}.freeze

  # Overwrite this method to customize how searches are displayed
  # across all pages of the admin dashboard.
  #
  def display_resource(search)
    search.uid
  end
end
