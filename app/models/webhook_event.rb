# WebhookEvent's are used to trigger webhooks. The actual event names are hard
# coded and an instance of WebhookEvent configures a webhook to be fired when a
# given event happens.
class WebhookEvent < ApplicationRecord
  EVENTS = [
    # specialists.forgotten_password_for_non_account is triggered when a forgotten
    # password email is requested for a specialist who has not yet setup their
    # account.
    "specialists.forgotten_password_for_non_account"
  ].freeze

  # self.trigger is used to trigger a webhook event.
  # WebhookEvent.trigger("event_name")
  def self.trigger(event, data = {})
    unless EVENTS.include?(event)
      return raise Error.new("#{event} is not a valid event")
    end

    where(event: event).each do |webhook_event|
      webhook = Webhook.create(url: webhook_event.url, data: data)
      WebhookJob.perform_later(webhook.id)
    end
  end

  class Error < StandardError
  end
end
