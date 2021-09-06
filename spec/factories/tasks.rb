FactoryBot.define do
  factory :task do
    application
    sequence(:airtable_id) { |id| "rectask#{id}" }
    sequence(:uid) { "tas_#{SecureRandom.hex[0..14]}" }
    name { "MyString" }
    stage { "MyString" }
    estimate { 100 }
    due_date { "2019-04-03 21:14:30" }
    description { "MyString" }
    submitted_for_approval_comment { "MyString" }
  end
end
