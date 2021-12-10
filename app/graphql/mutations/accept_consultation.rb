# frozen_string_literal: true

module Mutations
  class AcceptConsultation < Mutations::BaseMutation
    argument :consultation, ID, required: true

    field :interview, Types::Interview, null: true

    def authorized?(consultation:)
      requires_specialist!

      consultation = Consultation.find_by_uid_or_airtable_id!(consultation)
      ConsultationPolicy.new(current_user, consultation).accept?
    end

    def resolve(consultation:)
      ActiveRecord::Base.transaction do
        consultation = Consultation.find_by_uid_or_airtable_id!(consultation)
        create_system_message(consultation)
        project = get_project(consultation)
        application = create_application(project, consultation.specialist)
        interview = create_interview(application)
        consultation.update(
          interview: interview,
          status: "Accepted By Specialist",
          accepted_at: Time.zone.now
        )
        {interview: interview}
      end
    end

    private

    def create_system_message(consultation)
      return if consultation.messages.none?

      Message.create(
        conversation: consultation.messages.first.conversation,
        consultation: consultation,
        content: "consultations.accepted",
        kind: "system"
      )
    end

    def get_project(consultation)
      user = consultation.user
      project =
        user.projects.joins(project_skills: :skill).where(
          project_skills: {
            primary: true, skills: {name: consultation.skill&.name}
          }
        ).first
      project = create_new_project(consultation) if project.nil?
      project
    end

    def create_new_project(consultation)
      project = Project.create(
        user: consultation.user,
        skills: [consultation.skill],
        sales_status: "Open",
        status: "Project Created",
        service_type: "Consultation",
        primary_skill: consultation.skill,
        name: "#{consultation.user.company.name} - #{consultation.skill.name}"
      )
      project.sync_to_airtable
      project
    end

    def create_application(project, specialist)
      current_account_responsible_for do
        Application.create(
          project: project,
          status: "Applied",
          score: 90,
          specialist: specialist,
          trial_program: true,
          source: "consultation-request"
        )
      end
    end

    def create_interview(application)
      application.create_interview(status: "Call Requested", user: application.project.user)
    end
  end
end
