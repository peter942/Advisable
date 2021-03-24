# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::Guild::UpdateGuildPost do
  let(:specialist) { create(:specialist, :guild) }
  let!(:guild_post) { create(:guild_post, specialist: specialist, status: "draft") }
  let(:response_keys) { %w[updateGuildPost guildPost] }

  let(:guild_post_fields) do
    <<-GRAPHQL
      fragment GuildPostFields on PostInterface {
        id
        type
        title
        body
        status
        shareable
        author {
          id
        }
        guildTopics {
          id
          name
        }
        images {
          id
          url
        }
        coverImage {
          id
          url
        }
      }
    GRAPHQL
  end

  let(:query) do
    <<-GRAPHQL
    #{guild_post_fields}
    mutation {
      updateGuildPost(input: {
        guildPostId: "#{guild_post.id}"
      }) {
        guildPost {
          ...GuildPostFields
        }
      }
    }
    GRAPHQL
  end

  context "with a guild specialist" do
    subject(:update_guild_post) do
      lambda { |query|
        resp = AdvisableSchema.execute(
          query,
          context: {current_user: specialist}
        )
        resp.dig("data", *response_keys)
      }
    end

    it "errors if the post is not found or not scoped to current_user" do
      another = create(:specialist)
      guild_post.update!(specialist: another)
      resp = AdvisableSchema.execute(
        query,
        context: {current_user: specialist}
      )
      expect(resp["errors"][0]).to include({
        "message" => "Resouce was not found"
      })
    end

    describe "updating guild post attributes" do
      let(:guild_topics) { create_list(:guild_topic, 3) }
      let(:mutation) do
        lambda { |input|
          gql = input.map { |k, v| "#{k}: #{v.is_a?(String) ? "\"#{v}\"" : v}" }.join(', ')
          <<-GRAPHQL
        #{guild_post_fields}
        mutation {
          updateGuildPost(input: { #{gql} }) {
            guildPost {
              ...GuildPostFields
            }
          }
        }
          GRAPHQL
        }
      end

      it "updates title body and audience type" do
        input = {
          title: "this is a new title",
          body: "this is a new body",
          audienceType: "skills",
          guildPostId: guild_post.id
        }
        query = mutation[input]

        expect do
          update_guild_post.call(query)
          guild_post.reload
        end.to change(guild_post, :title).to("this is a new title").
          and change(guild_post, :body).to("this is a new body").
          and change(guild_post, :audience_type).to("skills")
      end

      it "updates shareable" do
        input = {
          guildPostId: guild_post.id,
          shareable: true
        }
        query = mutation[input]
        expect do
          update_guild_post.call(query)
          guild_post.reload
        end.to change(guild_post, :shareable).from(false).to(true)
      end

      it "does not change the status from published to draft" do
        guild_post.published!
        input = {
          guildPostId: guild_post.id,
          title: "this is a new title!"
        }

        query = mutation[input]

        expect do
          update_guild_post.call(query)
          guild_post.reload
        end.not_to change(guild_post, :status)
      end

      it "updates the topic names" do
        input = {
          guildPostId: guild_post.id,
          guildTopicNames: guild_topics.map(&:name)
        }
        query = mutation[input]

        expect do
          update_guild_post.call(query)
          guild_post.reload
        end.to change { guild_post.guild_topics.count }.from(0).to(3)
      end

      it "creates new topic names" do
        input = {
          guildPostId: guild_post.id,
          guildTopicNames: ["the razor crest"]
        }
        query = mutation[input]

        update_guild_post.call(query)
        new_topic = guild_post.reload.guild_topics.first

        expect(new_topic.name).to eq("the razor crest")
        expect(new_topic.slug).to eq("the-razor-crest")
        expect(new_topic.published).to eq(false)
      end

      it "does not change the status to draft if removed" do
        guild_post.removed!
        input = {
          guildPostId: guild_post.id,
          title: "new title"
        }
        query = mutation[input]
        update_guild_post.call(query)
        expect(guild_post.reload.status).to eq("removed")
      end

      it "does not change the status to published if removed" do
        guild_post.removed!
        input = {
          guildPostId: guild_post.id,
          publish: true
        }
        query = mutation[input]
        update_guild_post.call(query)
        expect(guild_post.reload.status).to eq("removed")
      end
    end
  end
end
