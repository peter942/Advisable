# frozen_string_literal: true

class Mutations::UpdatePreviousProject < Mutations::BaseMutation
  argument :previous_project, ID, required: true
  argument :client_name, String, required: false
  argument :confidential, Boolean, required: false
  argument :industries, [String], required: false
  argument :primary_industry, String, required: false
  argument :company_type, String, required: false
  argument :description, String, required: false
  argument :goal, String, required: false
  argument :skills, [String], required: false
  argument :primary_skill, String, required: false
  argument :public_use, Boolean, required: false
  argument :industry_relevance, Integer, required: false
  argument :location_relevance, Integer, required: false
  argument :cost_to_hire, Integer, required: false
  argument :execution_cost, Integer, required: false

  field :previous_project, Types::PreviousProject, null: true

  ALLOWED_ARGS_WHEN_PUBLISHED = %i[previous_project description].freeze

  def authorized?(**args)
    project = PreviousProject.find_by_uid(args[:previous_project])
    if project.draft == false && (args.keys - ALLOWED_ARGS_WHEN_PUBLISHED).any?
      ApiError.invalid_request(
              'projectPublished',
              'Can not save changes because the project has been published'
            )
    end
    true
  end

  def resolve(**args)
    project = PreviousProject.find_by_uid(args[:previous_project])
    project.assign_attributes(assignable_attrs(args))
    update_description(project, args)
    update_skills(project, args)
    update_industries(project, args)
    current_account_responsible_for { project.save }
    {previous_project: project}
  end

  private

  def assignable_attrs(**args)
    args.slice(
      :confidential,
      :client_name,
      :company_type,
      :goal,
      :public_use,
      :industry_relevance,
      :location_relevance,
      :cost_to_hire,
      :execution_cost
    )
  end

  def update_description(project, args)
    return if args[:description].blank?

    project.description = args[:description]
  end

  def update_skills(project, args)
    return if args[:skills].blank?

    skills = Skill.where(name: args[:skills])
    project.skills = skills

    if args[:primary_skill]
      primary_skill = Skill.find_by_name(args[:primary_skill])
      project.primary_project_skill.try(:update, primary: false)
      project.project_skills.find_or_create_by(skill: primary_skill).update(
        primary: true
      )
    end
  end

  def update_industries(project, args)
    return if args[:industries].blank?

    industries = Industry.where(name: args[:industries])
    project.industries = industries

    if args[:primary_industry]
      primary_industry = Industry.find_by_name(args[:primary_industry])
      project.project_industries.where(primary: true).update_all(primary: false) # rubocop:disable Rails/SkipsModelValidations
      project.project_industries.find_or_create_by(industry: primary_industry).update(primary: true)
    end
  end
end
