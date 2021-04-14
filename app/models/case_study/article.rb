# frozen_string_literal: true

module CaseStudy
  class Article < ApplicationRecord
    belongs_to :specialist
    belongs_to :company, optional: true
    belongs_to :interviewer, class_name: "::Account"
    belongs_to :editor, class_name: "::Account"
    has_many :skills, dependent: :destroy
    has_many :industries, dependent: :destroy
    has_many :sections, dependent: :destroy
    has_many :contents, through: :sections
  end
end

# == Schema Information
#
# Table name: case_study_articles
#
#  id                     :uuid             not null, primary key
#  comment                :string
#  company_type           :string
#  confidential           :boolean
#  excerpt                :string
#  goals                  :jsonb
#  published_at           :datetime
#  score                  :integer
#  specialist_approved_at :datetime
#  subtitle               :string
#  title                  :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  company_id             :uuid
#  editor_id              :bigint           not null
#  interviewer_id         :bigint           not null
#  specialist_id          :bigint           not null
#
# Indexes
#
#  index_case_study_articles_on_company_id      (company_id)
#  index_case_study_articles_on_editor_id       (editor_id)
#  index_case_study_articles_on_interviewer_id  (interviewer_id)
#  index_case_study_articles_on_specialist_id   (specialist_id)
#
# Foreign Keys
#
#  fk_rails_...  (company_id => case_study_companies.id)
#  fk_rails_...  (editor_id => accounts.id)
#  fk_rails_...  (interviewer_id => accounts.id)
#  fk_rails_...  (specialist_id => specialists.id)
#
