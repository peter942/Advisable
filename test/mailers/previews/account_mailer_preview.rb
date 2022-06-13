# frozen_string_literal: true

class AccountMailerPreview < ActionMailer::Preview
  def zapier_email
    AccountMailer.zapier_email(random_account, "test", "<h1>test</h1><p>ha!</p>")
  end

  def notify_of_new_messages
    AccountMailer.notify_of_new_messages(
      random_account,
      random_conversation,
      random_conversation.messages.last(5).pluck(:id)
    )
  end

  def interview_rescheduled
    accounts = random_interview.accounts.order("RANDOM()").to_a
    rescheduler = accounts.pop
    AccountMailer.interview_rescheduled(accounts.sample, random_interview, rescheduler, random_message)
  end

  private

  def random_interview
    @random_interview ||= Interview.order("RANDOM()").first
  end

  def random_message
    @random_message ||= Message.order("RANDOM()").first
  end

  def random_account
    @random_account ||= Account.order("RANDOM()").first
  end

  def random_conversation
    message_conversations = Message.distinct.pluck(:conversation_id)
    @random_conversation ||= Conversation.where(id: message_conversations).order("RANDOM()").first
  end
end
