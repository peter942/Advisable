# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Project view', type: :system do
  before do
    allow_any_instance_of(Application).to receive(:sync_to_airtable)
    allow_any_instance_of(Project).to receive(:sync_to_airtable)
    create(:full_application, status: 'Applied', score: 90, project: project)
  end

  let!(:project) { create(:project, status: 'Brief Confirmed') }
  let!(:application85) { create(:full_application, status: 'Applied', score: 85, project: project) }
  let!(:application80) { create(:full_application, status: 'Applied', score: 80, project: project) }

  it 'allows user to accept and reject matches' do
    project.user.account.complete_tutorial('recommendations')

    monday = Date.parse('monday')
    delta = monday > Time.zone.today ? 0 : 7
    next_monday = monday + delta

    authenticate_as project.user
    visit "/projects/#{project.uid}"

    # Handle first match
    click_on 'Accept'
    find("[aria-label='#{next_monday.strftime('%-d %b %Y, 10:00')}']").click
    find("[aria-label='#{next_monday.strftime('%-d %b %Y, 10:30')}']").click
    find("[aria-label='#{next_monday.strftime('%-d %b %Y, 11:00')}']").click
    find("[aria-label='#{next_monday.strftime('%-d %b %Y, 11:30')}']").click
    find("[aria-label='#{next_monday.strftime('%-d %b %Y, 12:00')}']").click
    find("[aria-label='#{next_monday.strftime('%-d %b %Y, 12:30')}']").click
    click_on 'Request Call'
    expect(page).to have_content(application85.specialist.account.name)

    # Accept second match, no need to select availability because its stored
    # from the first time.
    click_on 'Accept'
    click_on 'Request Call'
    expect(page).to have_content(application80.specialist.account.name)

    # Reject third match
    click_on 'Reject'
    within '*[role=dialog]' do
      choose "The application is too general", allow_label_click: true
      click_on "Continue"
      fill_in "feedback", with: "Meh"
      click_on 'Reject'
    end

    expect(page).to have_content(/you have been matched with 2/i)
  end

  it 'allows the viewer to reject an accepted candidate' do
    candidate =
      create(:application, project: project, status: 'Application Accepted')
    authenticate_as project.user
    visit "/projects/#{project.uid}/candidates/#{candidate.uid}"
    click_on 'Reject'
    within '*[role=dialog]' do
      choose "The application is too general", allow_label_click: true
      click_on "Continue"
      fill_in "feedback", with: "Meh"
      click_on 'Reject'
    end
    expect(page).to have_content('No Candidates')
  end

  context 'when the user hasnt added a password' do
    it 'allows the user to signup' do
      allow_any_instance_of(User).to receive(:sync_to_airtable)
      project.user.account.update_columns(password_digest: nil) # rubocop:disable Rails/SkipsModelValidations
      visit "/projects/#{project.uid}"
      fill_in 'password', with: 'testing123'
      fill_in 'passwordConfirmation', with: 'testing123'
      click_on 'Signup'
      expect(page).to have_current_path("/projects/#{project.uid}")
    end
  end
end
