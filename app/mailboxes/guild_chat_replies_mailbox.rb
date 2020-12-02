class GuildChatRepliesMailbox < ApplicationMailbox
  def process
    body = (mail.text_part || mail).body
    reply = EmailReplyParser.parse_reply(body.raw_source)

    encoded_regexp = /(?<encoded>.*)@#{ENV.fetch('GUILD_REPLIES_DOMAIN')}/

    @encoded = mail.to.first.match(encoded_regexp)
    unless @encoded
      # Fall back to the References header
      field = mail.header.fields.find { |f| f.name.include?("References") }
      @encoded = field.unparsed_value.match(/^<#{encoded_regexp}/)
    end

    if (chat_metadata = @encoded.try(:[], :encoded))

      # The previous recipient is now the sender after replying to an email
      sender_uid, recipient_uid, channel = chat_metadata.unpack1('m0').split(':')
      ChatDirectMessageJob.perform_later(
        message: reply,
        sender_uid: sender_uid,
        recipient_uid: recipient_uid
      )
    end
  end
end
