# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::UpdateApplication do
  let(:specialist) { create(:specialist) }
  let(:project) { create(:project, questions: ['This is a question?']) }
  let(:application) do
    create(
      :application,
      {
        specialist: specialist,
        introduction: false,
        project: project,
        questions: []
      }
    )
  end

  before do
    allow_any_instance_of(Application).to receive(:sync_to_airtable)
  end

  context 'when updating the introduction' do
    let(:query) do
      <<-GRAPHQL
      mutation {
        updateApplication(input: {
          id: "#{application.uid}",
          introduction: "This is the intro"
        }) {
          application {
            introduction
          }
        }
      }
      GRAPHQL
    end

    it 'updates the introduction' do
      response = AdvisableSchema.execute(query)
      intro =
        response['data']['updateApplication']['application']['introduction']
      expect(intro).to eq('This is the intro')
    end
  end

  context 'when updating the availability' do
    let(:query) do
      <<-GRAPHQL
      mutation {
        updateApplication(input: {
          id: "#{application.uid}",
          availability: "2 Weeks"
        }) {
          application {
            availability
          }
        }
      }
      GRAPHQL
    end

    it 'updates the availability' do
      response = AdvisableSchema.execute(query)
      availability =
        response['data']['updateApplication']['application']['availability']
      expect(availability).to eq('2 Weeks')
    end
  end

  context 'when updating questions' do
    let(:question) { 'This is a question?' }
    let(:query) do
      <<-GRAPHQL
      mutation {
        updateApplication(input: {
          id: "#{application.uid}",
          questions: [{question: "#{question}",
            answer: "This is an answer"
          }]
        }) {
          application {
            id
          }
        }
      }
      GRAPHQL
    end

    it 'updates the questions' do
      expect { AdvisableSchema.execute(query) }.to change {
        application.reload.questions
      }.from([]).to([{'question' => 'This is a question?', 'answer' => 'This is an answer'}])
    end

    context 'when an invalid question is passed' do
      let(:question) { 'Not a question?' }

      it 'returns an error' do
        response = AdvisableSchema.execute(query)
        error = response['errors'][0]
        expect(error['extensions']['code']).to eq('invalid_question')
      end
    end
  end

  context 'when updating the references' do
    let(:previous_project) { create(:previous_project, specialist: specialist) }
    let(:query) do
      <<-GRAPHQL
      mutation {
        updateApplication(input: {
          id: "#{application.uid}",
          references: [
            "#{previous_project.uid}",
            "#{previous_project2.uid}"]
        }) {
          application {
            id
          }
        }
      }
      GRAPHQL
    end
    let(:previous_project2) do
      create(:previous_project, specialist: specialist)
    end

    before do
      create(:application, specialist: specialist)
    end

    it 'adds the references' do
      expect { AdvisableSchema.execute(query) }.to change {
        application.reload.references.count
      }.by(2)
    end
  end

  context 'when updating the rate' do
    let(:query) do
      <<-GRAPHQL
      mutation {
        updateApplication(input: {
          id: "#{application.uid}",
          rate: 100
        }) {
          application {
            rate
          }
        }
      }
      GRAPHQL
    end

    it 'updates the rate' do
      response = AdvisableSchema.execute(query)
      rate = response['data']['updateApplication']['application']['rate']
      expect(rate).to eq('100.0')
    end
  end

  context 'when updating accepts_fee' do
    let(:query) do
      <<-GRAPHQL
      mutation {
        updateApplication(input: {
          id: "#{application.uid}",
          acceptsFee: true
        }) {
          application {
            acceptsFee
          }
        }
      }
      GRAPHQL
    end

    it 'updates accepts_fee attribute' do
      response = AdvisableSchema.execute(query)
      accepts = response['data']['updateApplication']['application']['acceptsFee']
      expect(accepts).to be_truthy
    end
  end

  context 'when updating accepts_terms' do
    let(:query) do
      <<-GRAPHQL
      mutation {
        updateApplication(input: {
          id: "#{application.uid}",
          acceptsTerms: true
        }) {
          application {
            acceptsTerms
          }
        }
      }
      GRAPHQL
    end

    it 'updates accepts_fee attribute' do
      response = AdvisableSchema.execute(query)
      accepts = response['data']['updateApplication']['application']['acceptsTerms']
      expect(accepts).to be_truthy
    end
  end
end
