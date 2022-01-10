# frozen_string_literal: true

module Guild
  class CaseStudy < Post
    def self.create_from_article!(article)
      return unless article.is_a?(::CaseStudy::Article)
      return article.guild_post if article.guild_post

      labels = Label.joins(skill: [:case_study_skills]).merge(article.skills)
      create!(status: "published", specialist: article.specialist, labels:, article:)
    end

    def title
      return article.title if article.present?

      self[:title]
    end

    def excerpt
      article&.subtitle&.truncate(300)
    end
  end
end

# == Schema Information
#
# Table name: guild_posts
#
#  id                :uuid             not null, primary key
#  audience_type     :string
#  body              :text
#  boosted_at        :datetime
#  engagements_count :integer          default(0)
#  pinned            :boolean          default(FALSE)
#  resolved_at       :datetime
#  shareable         :boolean          default(FALSE)
#  status            :integer          default("draft"), not null
#  title             :string
#  type              :string           default("Post"), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  article_id        :bigint
#  specialist_id     :bigint
#
# Indexes
#
#  index_guild_posts_on_article_id      (article_id)
#  index_guild_posts_on_post_prompt_id  (post_prompt_id)
#  index_guild_posts_on_specialist_id   (specialist_id)
#
# Foreign Keys
#
#  fk_rails_...  (article_id => case_study_articles.id)
#  fk_rails_...  (specialist_id => specialists.id)
#
