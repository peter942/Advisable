# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Guild::CreateComment do
  let(:guild_post) { create(:guild_post) }
  let(:specialist) { build(:specialist, :guild) }
  let(:response_keys) { %w[createGuildComment guildComment] }

  let(:query) do
    <<-GRAPHQL
    mutation {
      createGuildComment(input: {
        guildPostId: "#{guild_post.id}",
        body: "This is a comment body"
      }) {
        guildComment {
          id
          body
          post {
            id
          }
          author {
            id
          }
        }
      }
    }
    GRAPHQL
  end

  it_behaves_like "guild specialist"

  context "with a guild specialist" do
    subject(:create_guild_comment) do
      resp = AdvisableSchema.execute(
        query,
        context: {current_user: specialist}
      )
      resp.dig("data", *response_keys)
    end

    it "creates a new guild comment" do
      expect { subject }.to change {
        guild_post.reload.comments_count
      }.by(1)
      expect(subject["body"]).to eq("This is a comment body")
    end

    it "creates a comment thats associated with the post" do
      expect(subject.dig("post", "id")).to eq(guild_post.id)
    end

    it "creates a comment belonging to the curret_user specialist" do
      expect(subject.dig("author", "id")).to eq(specialist.uid)
    end

    describe "child comments" do
      let(:guild_post) { create(:guild_post) }
      let(:guild_comment) { create(:guild_comment, post: guild_post) }
      let(:create_child_comment_query) do
        <<-GRAPHQL
        mutation {
          createGuildComment(input: {
            guildPostId: "#{guild_post.id}",
            body: "This is a child comment body",
            guildCommentId: "#{guild_comment.id}"
          }) {
            guildComment {
              id
              parentComment {
                id
              }
            }
          }
        }
        GRAPHQL
      end
      let(:resp) do
        AdvisableSchema.execute(create_child_comment_query, context: {current_user: specialist})
      end

      it "creates a child comment" do
        expect do
          resp
        end.to change { guild_comment.reload.child_comments.size }.by(1)
      end

      it "has an id thats different than the parent_comment id" do
        data = resp.dig("data", *response_keys)

        expect(data.dig("parentComment", "id")).to eq(guild_comment.id)
        expect(data["id"]).not_to eq(guild_comment.id)
      end
    end
  end
end
