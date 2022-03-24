# frozen_string_literal: true

class UserMailerPreview < ActionMailer::Preview
  def invited_by_manager
    UserMailer.invited_by_manager(User.first, User.last)
  end

  def invited_to_review_applications
    UserMailer.invited_to_review_applications(User.first, User.last, random_project)
  end

  def invited_to_review_applications_with_application
    application = random_application
    UserMailer.invited_to_review_applications(User.first, User.last, application.project, application_id: application.uid)
  end

  def invited_to_interview
    UserMailer.invited_to_interview(User.first, User.last, random_application)
  end

  def case_study_searches_refreshed
    ApplicationRecord.uncached do
      searches = {random_search.id => [random_article.id], random_search.id => [random_article.id, random_article.id]}
      UserMailer.case_study_searches_refreshed(random_user, searches)
    end
  end

  def case_study_shared
    ApplicationRecord.uncached do
      shared_article = CaseStudy::SharedArticle.last
      UserMailer.case_study_shared(shared_article)
    end
  end

  def invoice_generated
    UserMailer.invoice_generated(Invoice.order("RANDOM()").first)
  end

  def payment_receipt
    UserMailer.payment_receipt(Payment.order("RANDOM()").first)
  end

  def consultation_declined
    UserMailer.consultation_declined(Consultation.order("RANDOM()").first, Message.order("RANDOM()").first)
  end

  def interview_declined
    UserMailer.interview_declined(Interview.order("RANDOM()").first, Message.order("RANDOM()").first)
  end

  def new_agreement
    agreement = Agreement.order("RANDOM()").first
    UserMailer.new_agreement(agreement)
  end

  %i[payment_request payment_request_reminder].each do |method|
    define_method(method) do
      UserMailer.public_send(method, random_payment_request)
    end
  end

  private

  def random_user
    User.order("RANDOM()").first
  end

  def random_search
    CaseStudy::Search.order("RANDOM()").first
  end

  def random_article
    CaseStudy::Article.order("RANDOM()").first
  end

  def random_interview
    Interview.order("RANDOM()").first
  end

  def random_project
    Project.order("RANDOM()").first
  end

  def random_application
    Application.order("RANDOM()").first
  end

  def random_payment_request
    PaymentRequest.order("RANDOM()").first
  end
end
