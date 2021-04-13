# frozen_string_literal: true

# A previous project represents previous work that a specialist has done with
# a client. This project can be a project that was completed off of the
# Advisable platform or one that was done on the advsiable platform.
#
# If the project was one completed on the Advisable platform, the specialits
# application record with that client will be set.
#
# A previous project can either be a draft or published. A project is marked as
# a draft by setting 'draft' to true.
#
#  Previous projects that are added by the specialist in their profile need to
# be verified by a contact who worked on the project. This is done via linkedin
# by comparing the client contact name with their linkedin name.
#
# == validation_status options
# [Pending] The project is pending verification.
# [Validated] The project has been verified.
# [Failed] The project validation has failed.
#
class PreviousProject < ApplicationRecord
  self.table_name = 'off_platform_projects'

  include Uid
  include Resizable

  has_logidze

  has_one_attached :contact_image
  resize contact_image: {resize_to_limit: [400, 400]}

  belongs_to :specialist
  has_one :account, through: :specialist
  # If the prpevious project belongs to an application then we know it is a
  # previous project that happened on Advisable.
  belongs_to :application, optional: true
  belongs_to :reviewed_by, class_name: 'SalesPerson', optional: true

  has_many :application_references, foreign_key: 'off_platform_project_id', inverse_of: :previous_project, dependent: :destroy
  has_many :reviews, as: :project, dependent: :destroy
  has_many :images, class_name: 'PreviousProjectImage', foreign_key: 'off_platform_project_id', inverse_of: :previous_project, dependent: :destroy
  has_one :cover_photo, -> { where cover: true }, class_name: 'PreviousProjectImage', foreign_key: 'off_platform_project_id', inverse_of: :previous_project

  # Project skills
  has_many :project_skills, as: :project, dependent: :destroy
  has_many :skills, through: :project_skills
  has_one :primary_project_skill, -> { where primary: true }, as: :project, class_name: 'ProjectSkill', inverse_of: :project
  has_one :primary_skill, through: :primary_project_skill, source: :skill

  # Project industries
  has_many :project_industries, as: :project, dependent: :destroy
  has_many :industries, through: :project_industries
  has_one :primary_project_industry, -> { where primary: true }, as: :project, class_name: 'ProjectIndustry', inverse_of: :project
  has_one :primary_industry, through: :primary_project_industry, source: :industry

  # Scopes
  scope :validated, -> { where(validation_status: 'Validated') }
  scope :validation_pending, -> { where(validation_status: 'Pending') }
  scope :validation_failed, -> { where(validation_status: 'Failed') }
  scope :on_platform, -> { where.not(application_id: nil) }
  scope :not_hidden, -> { where(hide_from_profile: [nil, false]) }
  scope :published, -> { where(draft: [false, nil]) }
  scope :draft, -> { where(draft: true) }

  # Every time a project is created, updated or destroyed we want to update the
  # associated specialists project count.
  after_destroy :update_specialist_project_count
  after_save :update_specialist_project_count

  def on_platform?
    application_id.present?
  end

  def contact_name
    output = contact_first_name
    output += " #{contact_last_name}" if contact_first_name.present?
    output
  end

  def contact_name=(name)
    self.contact_first_name = name.split.try(:[], 0)
    self.contact_last_name = name.split.try(:[], 1)
  end

  def self.for_project(specialist:, project:)
    project.applications.find_by_specialist_id(specialist.id).try(
      :previous_project
    )
  end

  private

  # Update the associated specialists project count
  def update_specialist_project_count
    return if specialist.blank?

    specialist.update_project_count
  end
end

# == Schema Information
#
# Table name: off_platform_projects
#
#  id                          :bigint           not null, primary key
#  advisable_score             :integer
#  can_contact                 :boolean
#  client_description          :text
#  client_name                 :string
#  company_type                :string
#  confidential                :boolean          default(FALSE)
#  contact_email               :string
#  contact_first_name          :string
#  contact_job_title           :string
#  contact_last_name           :string
#  contact_relationship        :string
#  cost_to_hire                :integer
#  description                 :text
#  description_requires_update :boolean
#  draft                       :boolean
#  execution_cost              :integer
#  goal                        :string
#  hide_from_profile           :boolean
#  industry                    :string
#  industry_relevance          :integer
#  location_relevance          :integer
#  pending_description         :string
#  primary_skill               :string
#  priority                    :integer
#  public_use                  :boolean
#  requirements                :text
#  results                     :text
#  uid                         :string
#  validated                   :boolean          default(FALSE)
#  validated_by_client         :boolean
#  validation_explanation      :string
#  validation_failed_reason    :string
#  validation_method           :string
#  validation_status           :string
#  validation_url              :string
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  application_id              :bigint
#  reviewed_by_id              :bigint
#  specialist_id               :bigint
#
# Indexes
#
#  index_off_platform_projects_on_application_id  (application_id)
#  index_off_platform_projects_on_reviewed_by_id  (reviewed_by_id)
#  index_off_platform_projects_on_specialist_id   (specialist_id)
#
# Foreign Keys
#
#  fk_rails_...  (specialist_id => specialists.id)
#
