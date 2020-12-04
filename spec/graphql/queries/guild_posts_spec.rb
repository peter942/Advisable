require 'rails_helper'

RSpec.describe "guild posts query" do
  let(:guild_specialist) { build(:specialist, :guild) }
  let(:response_keys) { %w[guildPosts nodes] }
  let(:query) do
    <<-GRAPHQL
      #{guild_post_fields_fragment}
      {
        guildPosts(first: 10) {
          nodes {
            ...GuildPostFields
            ... on GuildPostAdviceRequired {
              needHelp
            }
          }
        }
      }
    GRAPHQL
  end

  let(:guild_post_fields_fragment) do
    <<-GRAPHQL
      fragment GuildPostFields on PostInterface {
        id
        type
        title
        body
        reacted
        reactionsCount
        commented
        commentsCount
        authored
        createdAtTimeAgo
        author {
          id
          name
          avatar
        }
        guildTopics {
          id
          name
        }
      }
    GRAPHQL
  end

  it_behaves_like "guild specialist"

  context "with filters" do
    let!(:guild_post) { create_list(:guild_post, 5) }
    let!(:opportunity) { create(:opportunity_guild_post) }

    describe "when filtered by type" do
      let(:query) {
        <<-GRAPHQL
          #{guild_post_fields_fragment}
          {
            guildPosts(first: 5, type: "Opportunity") {
              nodes {
                ...GuildPostFields
              }
            }
          }
        GRAPHQL
      }

      subject(:filtered_by_type) {
        resp = AdvisableSchema.execute(
          query,
          context: {current_user: guild_specialist}
        )
        resp.dig("data", *response_keys)
      }

      it "filters by the type of post" do
        expect(subject.size).to eq(1)
        expect(subject.size).to_not eq(Guild::Post.count)
        expect(subject.first).to include({
          "type" => "Opportunity",
          "id" => opportunity.id
        })
      end
    end

    describe "when filtered by topic" do
      let(:guild_topics) { create_list(:guild_topic, 2) }

      let(:query) {
        <<-GRAPHQL
          {
            guildPosts(first: 5, topicIds: ["#{guild_topics.first.id}"]) {
              nodes {
                guildTopics {
                  id
                }
              }
            }
          }
        GRAPHQL
      }

      subject(:filtered_by_topic) {
        resp = AdvisableSchema.execute(query, context: {current_user: guild_specialist})
        resp.dig("data", *response_keys)
      }
      before do
        opportunity.guild_topic_list.add(guild_topics.first)
        opportunity.save!
      end

      it "filters by a guild topic" do
        topic_results = subject[0]["guildTopics"]
        expect(topic_results.size).to eq(1)
        expect(topic_results.size).to_not eq(Guild::Topic.count)
        expect(topic_results[0]).to include({
          "id" => guild_topics.first.id
        })
      end
    end
  end

  context "with removed posts" do
    let(:shadow_ban_specialist) { create(:specialist, :guild) }
    let!(:removed_post) { create(:guild_post, status: "removed", specialist: shadow_ban_specialist) }
    let!(:published_post) { create(:guild_post, status: "published") }

    let(:query) {
      <<-GRAPHQL
        {
          guildPosts(first: 5) {
            nodes {
              ... on PostInterface {
                id
                status
              }
            }
          }
        }
      GRAPHQL
    }

    it "does not include removed posts" do
      feed_response = AdvisableSchema.execute(query, context: {current_user: guild_specialist})
      posts = feed_response.dig("data", *response_keys)

      expect(posts.count).to eq(1)
      expect(posts).to eq([published_post.slice("id", "status")])
    end

    it "includes removed posts if the viewer is the author" do
      feed_response = AdvisableSchema.execute(query, context: {current_user: shadow_ban_specialist})
      posts = feed_response.dig("data", *response_keys)

      expect(posts.count).to eq(2)
      expect(posts).to include(
        {
          "id" => removed_post.id,
          "status" => "removed"
        }
      )
    end
  end
end
