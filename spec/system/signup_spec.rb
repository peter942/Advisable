# frozen_string_literal: true

require "system_helper"

RSpec.describe 'Signing up as a new user', type: :system do
  before do
    allow_any_instance_of(User).to receive(:sync_to_airtable)
  end

  it 'shows the user the account confirmation flow' do
    u = create(:user, account: create(:account, password: nil, confirmed_at: nil))
    visit "/signup/#{u.uid}"
    fill_in 'email', with: "#{Time.now.to_i}@test.com"
    fill_in 'password', with: 'testing123'
    fill_in 'passwordConfirmation', with: 'testing123'
    click_on 'Signup'
    expect(page).to have_content('Please confirm your account')
  end

  it 'shows an error when signup fails' do
    existing = create(:user)
    u = create(:user, account: create(:account, password: nil, confirmed_at: nil))
    visit "/signup/#{u.uid}"
    fill_in 'email', with: existing.account.email
    fill_in 'password', with: 'testing123'
    fill_in 'passwordConfirmation', with: 'testing123'
    click_on 'Signup'
    expect(page).to have_text(/account already exists/i)
  end
end
