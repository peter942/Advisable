# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::RequestMoreInterviewTimes do
  let(:interview) { create(:interview, status: 'Call Requested') }

  let(:query) do
    <<-GRAPHQL
    mutation {
      requestMoreInterviewTimes(input: {
        id: "#{interview.uid}",
        availabilityNote: "This is a note",
      }) {
        interview {
          status
        }
      }
    }
    GRAPHQL
  end

  let(:response) { AdvisableSchema.execute(query) }

  before do
    allow_any_instance_of(Interview).to receive(:sync_to_airtable)
  end

  it "sets the status to 'Need More Time Options'" do
    status =
      response['data']['requestMoreInterviewTimes']['interview']['status']
    expect(status).to eq('Need More Time Options')
  end

  it 'sets requested_more_time_options_at' do
    response
    expect(interview.reload.requested_more_time_options_at).to be_within(1.second).of(Time.zone.now)
  end

  context "when the status is not 'Call Requested'" do
    let(:interview) { create(:interview, status: 'Call Completed') }

    it 'returns an error' do
      error = response['errors'][0]['extensions']['code']
      expect(error).to eq('interview.notRequested')
    end
  end
end
