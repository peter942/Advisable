class Mutations::Guild::DeleteGuildPost < Mutations::BaseMutation
  graphql_name "DeleteGuildPost"

  argument :guild_post_id, ID, required: true

  field :guild_post, Types::Guild::PostInterface, null: true

  def authorized?(**args)
    requires_guild_user!
  end

  def resolve(**args)
    guild_post = current_user.guild_posts.find(args[:guild_post_id])
    guild_post.destroy
    {guild_post: guild_post}
  end
end
