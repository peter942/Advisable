# frozen_string_literal: true

class Mutations::Guild::CreateGuildPost < Mutations::BaseMutation
  description "Creates a new guild post"
  graphql_name "CreateGuildPost"

  argument :body, String, required: false
  argument :title, String, required: false
  argument :type, String, required: true

  field :guild_post, Types::Guild::PostInterface, null: true

  def authorized?(**args)
    requires_guild_user!
  end

  def resolve(type: nil, title: nil, body: nil)
    guild_post = Guild::Post.new(
      title: title,
      body: body,
      type: type,
      specialist_id: current_user.id
    )
    guild_post.save

    {guild_post: guild_post}
  end
end
