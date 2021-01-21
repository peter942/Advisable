# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::RejectProposal do
  let(:application) do
    create(:application, {status: 'Proposed', rejection_reason: nil})
  end

  let(:query) do
    <<-GRAPHQL
    mutation {
      rejectProposal(input: {
        id: "#{application.uid}",
        reason: "This is the rejection reason",
        comment: "This is the rejection comment"
      }) {
        application {
          id
          status
        }
      }
    }
    GRAPHQL
  end

  let(:context) { {current_user: application.project.user} }

  before do
    allow_any_instance_of(Application).to receive(:sync_to_airtable)
  end

  it "sets the status to 'Application Rejected'" do
    response = AdvisableSchema.execute(query, context: context)
    status = response['data']['rejectProposal']['application']['status']
    expect(status).to eq('Application Rejected')
  end

  it 'triggers a webhook' do
    expect(WebhookEvent).to receive(:trigger).with(
      'applications.proposal_rejected',
      any_args
    )

    AdvisableSchema.execute(query, context: context)
  end

  it 'sets the rejection_reason' do
    expect { AdvisableSchema.execute(query, context: context) }.to change {
      application.reload.rejection_reason
    }.from(nil).
      to('This is the rejection reason')
  end

  it 'sets the rejection_reason_comment' do
    expect { AdvisableSchema.execute(query, context: context) }.to change {
      application.reload.rejection_reason_comment
    }.from(nil).
      to('This is the rejection comment')
  end

  context 'when there is no logged in user' do
    let(:context) { {current_user: nil} }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      error = response['errors'][0]
      expect(error['extensions']['code']).to eq('notAuthorized')
    end
  end

  context 'when the application status is not Proposed' do
    let(:application) { create(:application, status: 'Accepted') }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      error = response['errors'][0]
      expect(error['message']).to eq('applications.notProposed')
    end
  end
end
