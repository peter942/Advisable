require 'rails_helper'

RSpec.describe Mutations::SendProposal do
  let(:project) { create(:project, status: 'Brief Confirmed') }
  let(:application) do
    create(:application, status: 'Interview Completed', project: project)
  end
  let(:query) do
    <<-GRAPHQL
    mutation {
      sendProposal(input: {
        application: "#{application.uid}",
        proposalComment: "This is the proposal comment"
      }) {
        application {
          id
          status
          proposalComment
        }
        errors {
          code
        }
      }
    }
    GRAPHQL
  end

  let(:context) { {current_user: application.specialist} }

  before do
    allow_any_instance_of(Application).to receive(:sync_to_airtable)
    allow_any_instance_of(Project).to receive(:sync_to_airtable)
  end

  it "sets the status to 'Proposed'" do
    response = AdvisableSchema.execute(query, context: context)
    status = response['data']['sendProposal']['application']['status']
    expect(status).to eq('Proposed')
  end

  it 'sets the proposalComment' do
    response = AdvisableSchema.execute(query, context: context)
    comment = response['data']['sendProposal']['application']['proposalComment']
    expect(comment).to eq('This is the proposal comment')
  end

  it 'sets the project status to Proposal Received' do
    expect { AdvisableSchema.execute(query, context: context) }.to change {
      application.reload.project.status
    }.from('Brief Confirmed').to('Proposal Received')
  end

  # rubocop:disable RSpec/MessageSpies
  it 'triggers a webhook' do
    expect(WebhookEvent).to receive(:trigger).with(
      'applications.proposal_sent',
      any_args
    )
    AdvisableSchema.execute(query, context: context)
  end
  # rubocop:enable RSpec/MessageSpies

  context 'when there is no logged in user' do
    let(:context) { {current_user: nil} }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      errors = response['data']['sendProposal']['errors']
      expect(errors[0]['code']).to eq('not_authorized')
    end
  end

  context 'when the client is logged in' do
    let(:context) { {current_user: application.project.user} }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      errors = response['data']['sendProposal']['errors']
      expect(errors[0]['code']).to eq('not_authorized')
    end
  end

  context 'when the logged in specialist is not the application specialist' do
    let(:context) { {current_user: create(:specialist)} }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      errors = response['data']['sendProposal']['errors']
      expect(errors[0]['code']).to eq('not_authorized')
    end
  end

  context 'when a Service::Error is thrown' do
    it 'includes it in the response' do
      error = Service::Error.new('service_error')
      allow(Proposals::Send).to receive(:call).and_raise(error)
      response = AdvisableSchema.execute(query, context: context)
      errors = response['data']['sendProposal']['errors']
      expect(errors[0]['code']).to eq('service_error')
    end
  end
end
