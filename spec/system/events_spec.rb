# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Events view", type: :system do
  let(:account) { create(:account) }
  let(:specialist) { create(:specialist, account:) }
  let(:host) { create(:specialist) }

  before do
    authenticate_as(specialist)
  end

  context "when viewing the events list" do
    it "displays a message if there are no events" do
      visit "/events"
      expect(page).to have_content("There are no upcoming Events")
    end

    it "shows if the viewer is attending" do
      event = create(:event, host:)
      visit "/events"
      expect(page).not_to have_content("Attending")

      event.attendees << specialist
      visit "/events"
      expect(page).to have_content("Attending")
      expect(page).to have_content("#{event.attendees.count} Attending")
    end

    it "includes older events that have ended" do
      create(:event, starts_at: 2.days.ago, ends_at: 1.day.ago, host:)
      visit "/events"

      expect(page).to have_content("Ended")
    end
  end
end
