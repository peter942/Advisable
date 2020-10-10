class WebhooksController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  # https://www.twilio.com/docs/chat/webhook-events#webhook-bodies
  # This webhook sends an email notification for any new messages
  # for an **existing conversation**.  Notifications are only
  # sent out if the user isnt actively logged into the Guild or they
  # havent checked their new messages within the app.
  #
  # NOTE: There are no webhooks sent from Twilio for the beginning of a direct message.

  def twilio_chat
    ary = URI.decode_www_form(request.body.read)
    webhook = Hash[ary]

    if webhook["InstanceSid"] != ENV.fetch('TWILIO_SID')
      render json: {}, status: :unauthorized and return false
    end

    if webhook["EventType"] == "onMessageSent"
      client = TwilioChat::Client.new(identity: webhook["ClientIdentity"], channel_sid: webhook["ChannelSid"])
      client.check_membership

      # Find the intended recipient of the message
      channel_member_uids = JSON.parse(client.channel.attributes)["members"]&.values
      other_uid = channel_member_uids.find { |uid| uid != client.identity }
      other = client.chat_service.users(other_uid).fetch

      # Send an email notification if:
      #  a. the user isn't logged into the guild
      #  b. the user hasnt checked their new messages within the app
      unless other.is_online
        Guild::ChatMailer.new_message(
          recipient_uid: other_uid,
          sender_uid: client.identity,
          channel_sid: webhook["ChannelSid"],
          message_body: webhook["Body"]
        ).deliver_later
      end
    end
  rescue StandardError => e
    Rails.logger.error("Error with TwilioChat webhook #{e.message}")
  end
end