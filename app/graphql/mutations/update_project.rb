# frozen_string_literal: true

module Mutations
  class UpdateProject < Mutations::BaseMutation
    argument :company_description, String, required: false
    argument :description, String, required: false
    argument :goals, [String], required: false
    argument :id, ID, required: true
    argument :primary_skill, String, required: false
    argument :questions, [String], required: false
    argument :service_type, String, required: false
    argument :skills, [String], required: false
    argument :specialist_description, String, required: false
    # Set the characteristics for the project.
    argument :characteristics, [String], required: false
    # Set the list of required characteristics for the project.
    argument :accepted_terms, Boolean, required: false
    argument :required_characteristics, [String], required: false
    # Set how important industry experience is for the project. This was
    # introduced after the industry_experience_required and company_type_required
    # columns. These have been deprecated in favour of this column.
    argument :industry_experience_importance, Int, required: false
    # Sets how important location is for the project
    argument :likely_to_hire, Int, required: false
    argument :location_importance, Int, required: false

    field :project, Types::ProjectType, null: true

    def resolve(**args)
      project = Project.find_by_uid_or_airtable_id!(args[:id])
      project.assign_attributes(assign_attributes(args))
      update_skills(project, args)
      update_primary_skill(project, args[:primary_skill])
      project.save_and_sync_with_responsible!(current_account_id)

      {project:}
    end

    private

    def assign_attributes(args)
      args.slice(
        :goals,
        :description,
        :service_type,
        :company_description,
        :specialist_description,
        :questions,
        :characteristics,
        :required_characteristics,
        :accepted_terms,
        :likely_to_hire,
        :location_importance,
        :industry_experience_importance
      )
    end

    def update_skills(project, args)
      return if args[:skills].blank?

      skills = Skill.where(name: args[:skills])
      project.skills = skills

      project.project_skills.first.update(primary: true) if !args[:primary_skill] && skills.length == 1
    end

    def update_primary_skill(project, skill_name)
      return if skill_name.blank?

      primary_skill = Skill.find_by_name(skill_name)
      project.project_skills.where(primary: true).update_all(primary: false) # rubocop:disable Rails/SkipsModelValidations
      project.project_skills.find_or_create_by(skill: primary_skill).update(primary: true)
    end
  end
end
