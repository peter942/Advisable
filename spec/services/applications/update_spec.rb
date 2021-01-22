# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Applications::Update do
  let(:specialist) { create(:specialist) }
  let(:project) { create(:project, questions: ['Is this a test?']) }
  let(:previous_project) { create(:previous_project, specialist: specialist) }

  let(:original_attributes) do
    {
      project: project,
      specialist: specialist,
      introduction: '...',
      availability: '1 Month',
      questions: [],
      rate: '',
      accepts_fee: nil,
      accepts_terms: nil
    }
  end

  let(:application) { create(:application, original_attributes) }

  let(:attributes) do
    {
      introduction: 'testing',
      availability: '3 Months',
      questions: [{question: 'Is this a test?', answer: "Yes it's a test"}],
      references: [previous_project.uid],
      rate: 90,
      accepts_fee: true,
      accepts_terms: true
    }
  end

  before do
    airtable_record = instance_double(Airtable::Application)
    allow(airtable_record).to receive(:push)
    allow(Airtable::Application).to receive(:find).and_return(airtable_record)
  end

  it 'updates the introduction' do
    described_class.call(
      id: application.uid, attributes: attributes
    )
    expect(application.reload.introduction).to eq(attributes[:introduction])
  end

  it "raises an error if the application doesn't exist" do
    expect {
      described_class.call(id: 'nope', attributes: attributes)
    }.to raise_error(ActiveRecord::RecordNotFound)
  end

  it 'updates the availability' do
    described_class.call(
      id: application.uid, attributes: attributes
    )
    expect(application.reload.availability).to eq(attributes[:availability])
  end

  describe 'when setting questions' do
    it 'assigns the answer based on the question' do
      described_class.call(
        id: application.uid, attributes: attributes
      )
      expect(application.reload.questions[0]['answer']).to eq("Yes it's a test")
    end

    context 'when passing a question that does not exist' do
      it 'raises an error' do
        expect {
          described_class.call(
            id: application.uid,
            attributes:
              attributes.merge(
                {
                  questions: [{question: 'Does this exist?', answer: 'Nope'}]
                }
              )
          )
        }.to raise_error(Service::Error, 'invalid_question')
      end
    end
  end

  describe 'assigning references' do
    it 'creates a new application_reference' do
      expect {
        described_class.call(
          id: application.uid, attributes: attributes
        )
      }.to change { application.references.count }.by(1)
    end

    it 'overrides any existing references' do
      previous_project = create(:project)
      application.references.create(project: previous_project)
      described_class.call(
        id: application.uid, attributes: attributes
      )
      application.reload
      projects = application.references.map(&:project)
      expect(projects).not_to include(previous_project)
    end

    context 'when an invalid ID is passed' do
      it 'raises and error' do
        expect {
          described_class.call(
            id: application.uid,
            attributes: attributes.merge({references: %w[oasindfoaoinsdfo]})
          )
        }.to raise_error(Service::Error, 'invalid_reference')
      end
    end
  end

  it 'updates the rate' do
    described_class.call(
      id: application.uid, attributes: attributes
    )
    expect(application.reload.rate).to eq(attributes[:rate])
  end

  it 'updates accepts_fee' do
    described_class.call(
      id: application.uid, attributes: attributes
    )
    expect(application.reload.accepts_fee).to eq(attributes[:accepts_fee])
  end

  it 'updates accepts_terms' do
    described_class.call(
      id: application.uid, attributes: attributes
    )
    expect(application.reload.accepts_terms).to eq(attributes[:accepts_terms])
  end
end
