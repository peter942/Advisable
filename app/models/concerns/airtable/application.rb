class Airtable::Application < Airtable::Base
  self.table_name = "Applications"

  belongs_to :specialist, class: 'Specialist', column: "Expert"

  sync_with ::Application
  sync_columns :score, :accepts_fee, :accepts_terms
  sync_column :hourly_rate_for_project, to: :rate
  sync_column :available_to_start, to: :availability
  sync_column :one_line_overview, to: :introduction
  sync_column :advisable_comment, to: :comment
  sync_column :rejected_reason, to: :rejection_reason
  sync_column :rejected_reason_comment, to: :rejection_reason_comment

  sync_data do |application|
    application.status = status_to_sync
    application.accepts_fee = fields['Accepts Fee'] == 'Yes'
    application.accepts_terms = fields['Accepts Terms'] == 'Yes'
    application.featured = fields['Featured Candidate'] == 'Yes'
    application.references_requested = fields['References Requested'] == 'Yes'

    specialist_id = fields["Expert"].try(:first)
    if specialist_id
      specialist = ::Specialist.find_by_airtable_id(specialist_id)
      specialist = Airtable::Specialist.find(specialist_id).sync if specialist.nil?
      application.specialist = specialist
    end

    project_id = fields["Client Project"].try(:first)
    if project_id
      project = ::Project.find_by_airtable_id(project_id)
      project = Airtable::Project.find(project_id).sync if project.nil?
      application.project = project
    end

    # for the questions field we find any fields that match the string
    # "Question N" and return an object for each question. This allows us to add
    # more questions to airtable without having to create a direct mapping to
    # each column.
    application.questions = fields.inject([]) do |questions, (key, val)|
      matches = key.match(/Question\s(?<number>\d)$/)
      if matches
        questions << {
          question: val,
          answer: fields["Answer #{matches[:number]}"]
        }
      end
      questions
    end
  end

  def status_to_sync
    status = fields['Application Status']
    # candidates that have a scheduled or complete interview status should still
    # be considered 'Application Accepted' so that they should up in the
    # "Introduced" view.
    if ["Interview Scheduled", "Interview Completed"].include?(status)
      return 'Application Accepted'
    end
    status
  end
end
