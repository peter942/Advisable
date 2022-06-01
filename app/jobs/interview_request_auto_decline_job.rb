# frozen_string_literal: true

class InterviewRequestAutoDeclineJob < ApplicationJob
  def perform
    Interview.reminded.where(created_at: ..4.days.ago).each do |interview|
      interview.messages.first&.conversation&.new_message!(kind: "InterviewAutoDeclined", interview:, send_emails: false)
      SpecialistMailer.interview_request_auto_declined(interview).deliver_later
      SlackMessageJob.perform_later(channel: "consultation_requests", text: "The consultation request to #{interview.specialist.name} from #{interview.user.name_with_company} was auto declined.")
      UserMailer.interview_request_auto_declined(interview).deliver_later
      interview.update(status: "Auto Declined")
    end
  end
end
