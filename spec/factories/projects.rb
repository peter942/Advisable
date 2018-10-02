FactoryBot.define do
  factory :project do
    client
    currency "EUR"
    name "Firespring – Public Relations and Communications Marketing, Publicity"
    sequence(:airtable_id) { |id| "airtable_#{id}" }
  end
end
