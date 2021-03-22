# frozen_string_literal: true

class Skill < ApplicationRecord
  include Uid
  include Airtable::Syncable

  has_many :specialist_skills, dependent: :destroy
  has_many :specialists, through: :specialist_skills
  has_many :user_skills, dependent: :destroy
  has_many :users, through: :user_skills
  has_many :duplicates, foreign_key: 'original_id', class_name: 'Skill', dependent: :destroy, inverse_of: :original
  has_many :project_skills, dependent: :destroy
  has_many :previous_projects, through: :project_skills, source: :project, source_type: 'PreviousProject'
  has_one :label, required: false, dependent: :nullify
  has_one :guild_topic, as: :topicable, class_name: 'Guild::Topic', required: false, dependent: :nullify
  belongs_to :original, class_name: 'Skill', optional: true

  validates :name, presence: true
  validates :airtable_id, presence: true

  scope :popular, -> { order(projects_count: :desc, specialists_count: :desc) }
end

# == Schema Information
#
# Table name: skills
#
#  id                         :bigint           not null, primary key
#  active                     :boolean
#  category                   :string
#  characteristic_placeholder :string
#  goal_placeholder           :string
#  name                       :string
#  profile                    :boolean
#  projects_count             :integer          default(0)
#  specialists_count          :integer          default(0)
#  uid                        :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  airtable_id                :string
#  original_id                :bigint
#
# Indexes
#
#  index_skills_on_airtable_id  (airtable_id)
#  index_skills_on_original_id  (original_id)
#  index_skills_on_uid          (uid)
#
# Foreign Keys
#
#  fk_rails_...  (original_id => skills.id)
#
