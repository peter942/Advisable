# frozen_string_literal: true

module Airtable::UnsubscribedFrom
  PREFIX = "Unsubscribe - "

  def sync_unsubscribed_from(user)
    user.account.unsubscribed_from = fields.map do |k, v|
      k.sub(PREFIX, "") if k.start_with?(PREFIX) && v == "Yes"
    end.compact
    user.account.save!
  end

  def push_unsubscribed_from(user)
    user.account.unsubscribed_from.each do |k|
      self[PREFIX + k] = "Yes"
    end
  end
end
