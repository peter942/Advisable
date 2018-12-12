class Airtable::Skill < Airtable::Base
  self.table_name = "Skills"

  # Tells which active record model to sync data with.
  sync_with ::Skill
  sync_columns :name, :category

  sync_data do |skill|
    skill.profile = fields['Profile Skill'] == 'Yes'
  end
end
