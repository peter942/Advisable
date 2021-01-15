# frozen_string_literal: true

class SpecialistMailer < ApplicationMailer
  layout "styled_mailer"

  def confirm(uid:, token:)
    @specialist = Specialist.find_by(uid: uid)
    @token = token
    mail(to: @specialist.account.email, subject: "Account Confirmation")
  end

  def verify_project(uid)
    @project = PreviousProject.find_by(uid: uid)
    @specialist = @project.specialist

    mail(
      to: @specialist.account.email,
      subject:
        "Validation Required: #{@project.primary_skill.try(:name)} with #{
          @project.client_name
        }"
    )
  end

  def inform_about_project(project_id, specialist_id)
    @project = Project.find(project_id)
    @specialist = Specialist.find(specialist_id)
    return if @specialist.account.unsubscribed?("Automated Invitations")

    mail(
      to: @specialist.account.email,
      subject: "New Freelance Opportunity: #{@project.primary_skill.name} with #{@project.industry} #{@project.company_type}"
    )
  end

  def project_paused(project, application)
    return if application.applied_at.blank?

    @project = project
    @application = application
    @sales_person = @project.user.sales_person || @project.sales_person
    mail(
      from: @sales_person.email_with_name,
      to: @application.specialist.account.email,
      subject: "#{@project.primary_skill.name} Project Has Been Paused"
    ) do |format|
      format.html { render layout: false }
    end
  end

  def interview_reschedule_request(interview)
    @interview = interview
    mail(
      from: interview.user.sales_person.email_with_name,
      to: interview.specialist.account.email,
      subject: 'Interview Reschedule Request'
    ) do |format|
      format.html { render layout: false }
    end
  end
end
