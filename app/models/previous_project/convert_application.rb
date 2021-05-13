class PreviousProject::ConvertApplication
  attr_reader :application

  def initialize(application)
    @application = application
  end

  def self.run(application)
    new(application).run
  end

  def run
    raise 'Application already has a previous project' if application.previous_project.present?

    application.specialist.previous_projects.create(
      confidential: false,
      application: application,
      description: project.description,
      goal: project.goals.try(:first),
      client_name: project.user.company.name,
      validation_status: 'Validated',
      company_type: project.user.company.kind,
      contact_job_title: project.user.title,
      contact_first_name: project.user.account.first_name,
      contact_last_name: project.user.account.last_name,
      project_skills: project_skills,
      project_industries: project_industries,
      created_at: application.started_working_at || Time.zone.now
    )
  end

  private

  def project_skills
    project.project_skills.map do |ps|
      ProjectSkill.new(
        skill: ps.skill, primary: ps.skill.name == project.primary_skill
      )
    end
  end

  def project_industries
    return [] if project.industry.blank?

    [
      ProjectIndustry.new(
        industry: Industry.find_by_name(project.industry), primary: true
      )
    ]
  end

  def project
    application.project
  end
end
