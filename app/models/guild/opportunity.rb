# frozen_string_literal: true

module Guild
  class Opportunity < Post
  end
end

# == Schema Information
#
# Table name: guild_posts
#
#  id                 :uuid             not null, primary key
#  audience_type      :string
#  body               :text
#  boosted_at         :datetime
#  comments_count     :integer          default(0), not null
#  engagements_count  :integer          default(0)
#  pinned             :boolean          default(FALSE)
#  reactionable_count :integer          default(0), not null
#  resolved_at        :datetime
#  shareable          :boolean          default(FALSE)
#  status             :integer          default("draft"), not null
#  title              :string
#  type               :string           default("Post"), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  specialist_id      :bigint
#
# Indexes
#
#  index_guild_posts_on_specialist_id  (specialist_id)
#
# Foreign Keys
#
#  fk_rails_...  (specialist_id => specialists.id)
#
