# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Interviews", type: :system do
  let(:user) do
    create(:user, availability:
      [
        2.days.from_now.change({hour: 10, min: 0, secs: 0}),
        2.days.from_now.change({hour: 10, min: 30, secs: 0}),
        2.days.from_now.change({hour: 11, min: 0, secs: 0}),
        2.days.from_now.change({hour: 11, min: 30, secs: 0})
      ])
  end

  before do
    allow_any_instance_of(Specialist).to receive(:sync_to_airtable)
    allow_any_instance_of(GoogleCalendar).to receive(:schedule_for_interview)
  end

  it "specialist can accept an interview request via messages" do
    interview = create(:interview, user:, status: "Call Requested")
    conversation = Conversation.by_accounts(interview.user, interview.specialist)
    message = conversation.new_message!(
      author: user.account,
      content: "Interview request message",
      kind: "InterviewRequest",
      interview:
    )

    authenticate_as(interview.specialist)
    visit("/messages/#{conversation.uid}")
    expect(page).to have_content(message.content)
    click_on("Respond")
    click_link("View availability")
    click_on(user.availability[0].strftime("%A"))
    find_all("a[class^=styles__Time]").first.click
    click_on("Confirm Call")
    expect(page).to have_content("Call Scheduled")
    expect(page).to have_content("#{user.availability[0].strftime("%H:%M")}")
  end

  it "allows the client to request to reschedule a call" do
    application = create(:application, status: "Application Accepted")
    interview = create(:interview, user: application.project.user, status: "Call Scheduled", application:)
    authenticate_as(interview.application.project.user)
    visit "/interviews/#{interview.uid}"
    click_on "Request To Reschedule"
    date = Time.zone.now.next_weekday.beginning_of_day
    find("[aria-label='#{date.strftime('%-d %b %Y, 10:00')}']").click
    find("[aria-label='#{date.strftime('%-d %b %Y, 10:30')}']").click
    find("[aria-label='#{date.strftime('%-d %b %Y, 11:00')}']").click
    find("[aria-label='#{date.strftime('%-d %b %Y, 11:30')}']").click
    find("[aria-label='#{date.strftime('%-d %b %Y, 12:00')}']").click
    find("[aria-label='#{date.strftime('%-d %b %Y, 12:30')}']").click
    click_on "Request To Reschedule"
    expect(page).to have_content("You have requested to reschedule your call")
  end

  context "when the client has requested to reschedule" do
    it "the specialist can schedule the interview" do
      interview = create(:interview, status: "Client Requested Reschedule", starts_at: 2.days.from_now, user:)
      authenticate_as interview.specialist
      visit "/interviews/#{interview.uid}"
      click_on user.availability[0].strftime("%A")
      find_all("a[class^=styles__Time]").first.click
      click_on "Confirm Call"
      expect(page).to have_content("has been scheduled!")
    end
  end

  it "allows the specialist to request to reschedule a call" do
    interview = create(:interview, status: "Call Scheduled", starts_at: 2.days.from_now, user:)
    authenticate_as interview.specialist
    visit "/interviews/#{interview.uid}"
    click_on "Request To Reschedule"
    fill_in "note", with: "No can do"
    click_on "Reschedule"
    expect(page).to have_content("You have requested to reschedule your call")
  end

  context "when specialist has requested to reschedule" do
    it "the client can update their availability" do
      application = create(:application, status: "Application Accepted")
      interview = create(:interview, user: application.project.user, status: "Specialist Requested Reschedule", application:)
      authenticate_as interview.user
      visit "/interviews/#{interview.uid}"
      date = Time.zone.now.next_weekday.beginning_of_day
      find("[aria-label='#{date.strftime('%-d %b %Y, 10:00')}']").click
      find("[aria-label='#{date.strftime('%-d %b %Y, 10:30')}']").click
      find("[aria-label='#{date.strftime('%-d %b %Y, 11:00')}']").click
      find("[aria-label='#{date.strftime('%-d %b %Y, 11:30')}']").click
      find("[aria-label='#{date.strftime('%-d %b %Y, 12:00')}']").click
      find("[aria-label='#{date.strftime('%-d %b %Y, 12:30')}']").click
      click_on "Update Availability"
      expect(page).to have_content("We have sent your availability")
    end
  end

  context "when more time options have been added" do
    it "allows the specialist can schedule the call" do
      interview = create(:interview, status: "More Time Options Added", starts_at: 2.days.from_now, user:)
      authenticate_as interview.specialist
      visit "/interviews/#{interview.uid}"
      click_on user.availability[0].strftime("%A")
      find_all("a[class^=styles__Time]").first.click
      click_on "Confirm Call"
      expect(page).to have_content("has been scheduled!")
    end
  end

  it "allows the user to invite a member of their team" do
    application = create(:application, status: "Application Accepted")
    interview = create(:interview, user: application.project.user, status: "Call Requested", application:)
    create(:user, account: create(:account, first_name: "Thomas"), company: application.project.user.company)
    create(:interview, application:, status: "Call Scheduled", starts_at: 2.days.from_now, user: application.project.user)
    authenticate_as(application.project.user)
    visit "/interviews/#{interview.uid}"
    click_on("Invite Others")
    click_on("Share with Thomas")
    expect(page).to have_content("Invite sent")
  end

  it "allows the user to invite a new member of their team" do
    allow_any_instance_of(User).to receive(:sync_to_airtable)
    application = create(:application, status: "Application Accepted")
    interview = create(:interview, user: application.project.user, status: "Call Requested", application:)
    create(:interview, application:, status: "Call Scheduled", starts_at: 2.days.from_now, user: application.project.user)
    authenticate_as(application.project.user)
    visit "/interviews/#{interview.uid}"
    click_on("Invite Others")
    fill_in("name", with: "Jim Halpert")
    fill_in("email", with: "jim@dundermifflin.com")
    click_on("Invite")
    expect(page).to have_content("Invite sent")
  end
end
