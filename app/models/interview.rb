# frozen_string_literal: true

class Interview < ApplicationRecord
  extend Memoist
  include Uid

  has_logidze

  VALID_STATUSES = [
    "Call Scheduled", "Call Completed", "Call Requested", "Need More Time Options",
    "More Time Options Added", "Specialist Requested Reschedule", "Client Requested Reschedule"
  ].freeze

  belongs_to :application
  belongs_to :user # An interview is scheduled with a specific user (client contact)
  has_one :specialist, through: :application
  has_one :video_call, dependent: :destroy

  scope :scheduled, -> { where(status: "Call Scheduled") }

  validates :status, inclusion: {in: VALID_STATUSES}

  def create_system_message!
    conversation = Conversation.by_accounts([specialist.account, user.account])
    conversation.new_message!(nil, "#{specialist.account.name} & #{user.account.name},\n\nNow that you've scheduled a call, you can use this thread to communicate.\n\nIf you have any questions or issues, don't hesitate to contact the Advisable team at hello@advisable.com.")
  end
end

# == Schema Information
#
# Table name: interviews
#
#  id                                 :integer          not null, primary key
#  application_id                     :integer
#  starts_at                          :datetime
#  status                             :string
#  time_zone                          :string
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  user_id                            :integer
#  availability_note                  :string
#  zoom_meeting_id                    :string
#  uid                                :string           not null
#  call_requested_at                  :datetime
#  call_scheduled_at                  :datetime
#  requested_more_time_options_at     :datetime
#  more_time_options_added_at         :datetime
#  client_requested_reschedule_at     :datetime
#  specialist_requested_reschedule_at :datetime
#  google_calendar_id                 :string
#
# Indexes
#
#  index_interviews_on_application_id  (application_id)
#  index_interviews_on_uid             (uid) UNIQUE
#  index_interviews_on_user_id         (user_id)
#
