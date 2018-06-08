require "administrate/base_dashboard"

class WebhookConfigurationDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    name: Field::String,
    url: Field::String,
    type: Field::Select.with_options(collection: ["WebhookConfiguration::Application"]),
    criteria: WebhookCriteriaField
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :name,
    :url,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :id,
    :name,
    :url,
    :type,
    :criteria
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :name,
    :url,
    :type,
    :criteria
  ].freeze

  # Overwrite this method to customize how specialists are displayed
  # across all pages of the admin dashboard.
  #
  def display_resource(webhook_config)
    webhook_config.name
  end

  def permitted_attributes
    [:name, :type, :url, criteria: [:attribute, :operator, :value]]
  end
end
