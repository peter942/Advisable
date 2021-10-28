# frozen_string_literal: true

module Guild
  class Reaction < ApplicationRecord
    belongs_to :reactionable, polymorphic: true, counter_cache: :reactionable_count
    belongs_to :specialist

    has_many :notifications, inverse_of: "notifiable", foreign_key: "notifiable_id", dependent: :destroy

    # @guild_post.reactions.create!(specialist: current_user, kind: Guild::Reaction.kinds["thanks"])
    # @guild_post.reactions.find_by(specialist: current_user, kind: Guild::Reaction.kinds["thanks"]).destroy
    enum kind: {
      thanks: 0
      # ...
    }

    validates :specialist, uniqueness: {
      scope: %i[reactionable_type reactionable_id],
      message: "has already created a reaction for reactionable_type"
    }

    def create_notification!(read_at: nil)
      Notification.create!(
        account: reactionable.specialist.account,
        actor: specialist.account,
        action: "post_reaction",
        notifiable: self,
        read_at: read_at
      )
    end
  end
end

# == Schema Information
#
# Table name: guild_reactions
#
#  id                :uuid             not null, primary key
#  data              :jsonb
#  kind              :integer          default("thanks"), not null
#  reactionable_type :string
#  status            :integer          default(0), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  reactionable_id   :uuid
#  specialist_id     :bigint
#
# Indexes
#
#  index_guild_reactions_on_reactionable_type_and_reactionable_id  (reactionable_type,reactionable_id)
#  index_guild_reactions_on_specialist_id                          (specialist_id)
#  index_guild_reactions_on_specialist_reactionable                (specialist_id,reactionable_type,reactionable_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (specialist_id => specialists.id) ON DELETE => cascade
#
