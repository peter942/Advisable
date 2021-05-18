# frozen_string_literal: true

class Interview < ApplicationRecord
  self.ignored_columns += %i[airtable_id]

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

  scope :scheduled, -> { where(status: 'Call Scheduled') }

  validates :status, inclusion: {in: VALID_STATUSES}

  def self.find_by_uid_or_airtable_id(id)
    airtable_id?(id) ? deprecated_find_by_airtable_id(id) : find_by(uid: id)
  end

  def self.deprecated_find_by_airtable_id(id)
    Sentry.capture_message("#find_by called with an Airtable ID", level: "debug")
    find_by(airtable_id: id)
  end

  def self.find_by_uid_or_airtable_id!(id)
    find_by_uid_or_airtable_id(id) || raise(ActiveRecord::RecordNotFound)
  end

  def self.airtable_id?(id)
    id =~ /^rec[^_]/
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
#  requested_more_time_options_at     :datetime
#  specialist_requested_reschedule_at :datetime
#  starts_at                          :datetime
#  status                             :string
#  time_zone                          :string
#  uid                                :string
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  application_id                     :bigint
#  user_id                            :bigint
#  zoom_meeting_id                    :string
#
# Indexes
#
#  index_interviews_on_airtable_id     (airtable_id)
#  index_interviews_on_application_id  (application_id)
#  index_interviews_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (application_id => applications.id)
#  fk_rails_...  (user_id => users.id)
#
