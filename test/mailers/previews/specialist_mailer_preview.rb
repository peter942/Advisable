# frozen_string_literal: true

class SpecialistMailerPreview < ActionMailer::Preview
  def inform_about_project
    project = Project.order(Arel.sql("RANDOM()")).first
    specialist = Specialist.order(Arel.sql("RANDOM()")).first
    SpecialistMailer.inform_about_project(project.id, specialist.id)
  end

  def interview_reschedule_request
    SpecialistMailer.interview_reschedule_request(random_interview)
  end

  def project_paused
    application = Application.order(Arel.sql("RANDOM()")).first
    SpecialistMailer.project_paused(application.project, application)
  end

  %i[more_time_options_added interview_reminder first_interview_scheduled post_interview].each do |method|
    define_method(method) do
      SpecialistMailer.public_send(method, random_interview)
    end
  end

  private

  def random_interview
    Interview.order(Arel.sql("RANDOM()")).first
  end
end
