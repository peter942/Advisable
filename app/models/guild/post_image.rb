# frozen_string_literal: true

module Guild
  class PostImage < ApplicationRecord
    include Resizable
    include Uid
    uid_prefix "gpi"

    belongs_to :post, class_name: "Guild::Post", foreign_key: "guild_post_id", inverse_of: "images"
    has_one_attached :image
    resize image: {resize_to_limit: [1600, 1600]}

    after_destroy :set_first_to_cover, if: :cover
    after_destroy :reduce_positions

    private

    def reduce_positions
      post.images.where("position > ?", position).find_each do |image|
        image.update(position: image.position - 1)
      end
    end

    def set_first_to_cover
      post.images.order(position: :asc).first.try(:update, cover: true)
    end
  end
end

# == Schema Information
#
# Table name: guild_post_images
#
#  id            :integer          not null, primary key
#  guild_post_id :uuid
#  uid           :string           not null
#  string        :string
#  position      :integer
#  cover         :boolean
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_guild_post_images_on_guild_post_id  (guild_post_id)
#  index_guild_post_images_on_string         (string)
#  index_guild_post_images_on_uid            (uid) UNIQUE
#
