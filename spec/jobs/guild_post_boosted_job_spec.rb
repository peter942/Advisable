# frozen_string_literal: true

require "rails_helper"

RSpec.describe GuildPostBoostedJob do
  subject(:enqueued_job) {
    described_class.perform_now(guild_post.id)
  }

  let(:guild_post) { create(:guild_post, :published) }
  let(:guild_topics) { create_list(:guild_topic, 5) }
  let(:specialist) { create(:specialist, :guild) }

  before do
    guild_topics.each { |g| specialist.follow(g) }
    guild_post.guild_topics = guild_topics
  end

  it "only enqueues one mail if there are multiple follows from the same specialist" do
    expect {
      enqueued_job
    }.to have_enqueued_mail(Guild::PostBoostMailer, :new_post).once
  end

  it "enqueues multiple mails for separate specialists" do
    another_follower = create(:specialist, :guild)
    another_follower.follow(guild_topics.first)

    expect {
      enqueued_job
    }.to have_enqueued_mail(Guild::PostBoostMailer, :new_post).twice
  end

  it "does not enqueue a mail for the author of the post" do
    guild_topics.each { |gt| guild_post.specialist.follow(gt) }
    expect(guild_post.specialist.follows.count).to eq(guild_topics.size)

    expect {
      enqueued_job
    }.not_to have_enqueued_mail(Guild::PostBoostMailer, :new_post).with({post: guild_post, follower_id: guild_post.specialist.id})
  end
end
