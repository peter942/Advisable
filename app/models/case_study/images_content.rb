# frozen_string_literal: true

module CaseStudy
  class ImagesContent < Content
    uid_prefix "csc"

    private

    # {type: "images"}
    def valid_content
      return if content.blank?

      errors.add(:content, "does not follow the type's requirements")
    end
  end
end

# == Schema Information
#
# Table name: case_study_contents
#
#  id         :integer          not null, primary key
#  uid        :string           not null
#  section_id :integer          not null
#  type       :string
#  position   :integer
#  content    :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_case_study_contents_on_section_id  (section_id)
#  index_case_study_contents_on_uid         (uid) UNIQUE
#
