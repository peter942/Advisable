# frozen_string_literal: true

class Interview < ApplicationRecord
  self.ignored_columns += %i[application_id]

  extend Memoist
  include Uid

  has_logidze

  VALID_STATUSES = [
    "Call Scheduled", "Call Completed", "Call Requested", "Call Reminded", "Need More Time Options",
    "More Time Options Added", "Specialist Requested Reschedule", "Client Requested Reschedule", "Specialist Declined"
  ].freeze

  SCHEDULABLE_STATUSES = [
    "Call Requested", "Call Reminded", "Client Requested Reschedule", "Specialist Requested Reschedule", "More Time Options Added"
  ].freeze

  belongs_to :specialist
  belongs_to :user
  has_one :video_call, dependent: :destroy
  has_one :consultation, dependent: :destroy
  has_many :messages, dependent: :destroy

  scope :requested, -> { where(status: "Call Requested") }
  scope :scheduled, -> { where(status: "Call Scheduled") }

  validates :status, inclusion: {in: VALID_STATUSES}

  def create_system_message!
    conversation = Conversation.by_accounts([specialist.account, user.account])
    conversation.new_message!(kind: "InterviewScheduled", interview: self, metadata: {starts_at:}, send_emails: false)
  end
end

# == Schema Information
#
# Table name: interviews
#
#  id                                 :bigint           not null, primary key
#  availability_note                  :string
#  call_requested_at                  :datetime
#  call_scheduled_at                  :datetime
#  client_requested_reschedule_at     :datetime
#  more_time_options_added_at         :datetime
#  reason                             :string
#  requested_more_time_options_at     :datetime
#  specialist_requested_reschedule_at :datetime
#  starts_at                          :datetime
#  status                             :string
#  time_zone                          :string
#  uid                                :string           not null
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  google_calendar_id                 :string
#  specialist_id                      :bigint           not null
#  user_id                            :bigint
#  zoom_meeting_id                    :string
#
# Indexes
#
#  index_interviews_on_application_id  (application_id)
#  index_interviews_on_specialist_id   (specialist_id)
#  index_interviews_on_uid             (uid) UNIQUE
#  index_interviews_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (application_id => applications.id)
#  fk_rails_...  (specialist_id => specialists.id)
#  fk_rails_...  (user_id => users.id)
#
