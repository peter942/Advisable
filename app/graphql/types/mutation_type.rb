class Types::MutationType < GraphQL::Schema::Object
  EXCLUDED_CLASSES = [:BaseMutation, :Helpers, :Guild].freeze
  (Mutations.constants - EXCLUDED_CLASSES).each do |klass|
    public_send(:field, klass.to_s.underscore, mutation: "Mutations::#{klass}".constantize)
  end

  # Guild
  field :create_guild_comment, mutation: Mutations::Guild::CreateComment
  field :delete_guild_comment, mutation: Mutations::Guild::DeleteComment
  field :guild_update_last_read, mutation: Mutations::Guild::UpdateLastRead
  field :guild_update_post_reactions, mutation: Mutations::Guild::UpdatePostReactions
  field :create_chat_direct_message, mutation: Mutations::Guild::CreateChatDirectMessage
  field :update_chat_friendly_name, mutation: Mutations::Guild::UpdateChatFriendlyName
  field :create_guild_post, mutation: Mutations::Guild::CreateGuildPost
  field :update_guild_post, mutation: Mutations::Guild::UpdateGuildPost
  field :delete_guild_post_image, mutation: Mutations::Guild::DeleteGuildPostImage
  field :create_guild_post_image, mutation: Mutations::Guild::CreateGuildPostImage
  field :update_guild_post_image, mutation: Mutations::Guild::UpdateGuildPostImage
  field :delete_guild_post, mutation: Mutations::Guild::DeleteGuildPost
  field :follow_guild_topic, mutation: Mutations::Guild::FollowGuildTopic
  field :unfollow_guild_topic, mutation: Mutations::Guild::UnfollowGuildTopic
end
