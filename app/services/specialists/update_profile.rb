# Service object to update a specialists profile. This is primarily
# used by the graphql update_profile mutation.
class Specialists::UpdateProfile < ApplicationService
  attr_accessor :specialist, :attributes
  attr_reader :responsible

  def initialize(specialist:, attributes:, responsible: nil)
    @specialist = specialist
    @attributes = attributes
    @responsible = responsible
  end

  def call
    specialist.assign_attributes(assignable_attributes)
    update_account
    attach_avatar
    attach_resume
    update_skills
    update_country

    success = Logidze.with_responsible(responsible&.id) do
      specialist.save
    end

    if success
      specialist.sync_to_airtable
      specialist
    else
      raise Service::Error.new(specialist.errors.full_messages.first)
    end
  end

  private

  # Select only the attributes we want to pass through to active record
  # assign_atttributes call
  def assignable_attributes
    attributes.slice(
      :bio,
      :city,
      :remote,
      :website,
      :linkedin,
      :public_use,
      :hourly_rate,
      :number_of_projects,
      :primarily_freelance
    )
  end

  def update_account
    specialist.account.update(attributes.slice(:email, :first_name, :last_name))
  end

  def attach_avatar
    return unless attributes[:avatar]

    specialist.avatar.attach(attributes[:avatar])
  end

  def attach_resume
    return unless attributes[:resume]

    specialist.resume.attach(attributes[:resume])
  end

  # Update the specialists skills if a skills attribute was passed.
  def update_skills
    return unless attributes[:skills]

    skills = Skill.where(name: attributes[:skills])
    specialist.skill_ids = skills.map(&:id)
  end

  # Update the country if it was passed
  def update_country
    return if attributes[:country].blank?

    country = Country.find_by(uid: attributes[:country]) || Country.find_by(alpha2: attributes[:country]) || Country.find_by(name: attributes[:country])
    specialist.country_id = country&.id
  end
end
