# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::UpdateProject do
  let(:project) { create(:project) }
  let(:query) do
    <<-GRAPHQL
    mutation {
      updateProject(input: {
        id: "#{project.airtable_id}",
        goals: ["This is a goal"],
        primarySkill: "Sales",
        description: "This is the description",
        serviceType: "Self-Service",
        companyDescription: "company description",
        specialistDescription: "specialist description",
        questions: ["This is a question?"],
        requiredCharacteristics: ["Required"],
        characteristics: ["Optional"],
        acceptedTerms: true
      }) {
        project {
          goals
          description
          serviceType
          companyDescription
          specialistDescription
          questions
          requiredCharacteristics
          optionalCharacteristics
          acceptedTerms
          primarySkill {
            id
            name
          }
        }
      }
    }
    GRAPHQL
  end

  let(:response) { AdvisableSchema.execute(query) }

  before do
    create(:skill, name: 'Sales')
    allow_any_instance_of(Project).to receive(:sync_to_airtable)
  end

  it 'sets the goals' do
    goals = response['data']['updateProject']['project']['goals']
    expect(goals).to eq(['This is a goal'])
  end

  it 'sets the primarySkill' do
    skill = response['data']['updateProject']['project']['primarySkill']['name']
    expect(skill).to eq('Sales')
  end

  it 'sets the description' do
    description = response['data']['updateProject']['project']['description']
    expect(description).to eq('This is the description')
  end

  it 'sets the serviceType' do
    type = response['data']['updateProject']['project']['serviceType']
    expect(type).to eq('Self-Service')
  end

  it 'sets the companyDescription' do
    description = response['data']['updateProject']['project']['companyDescription']
    expect(description).to eq('company description')
  end

  it 'sets the specialistDescription' do
    description = response['data']['updateProject']['project']['specialistDescription']
    expect(description).to eq('specialist description')
  end

  it 'sets the questions' do
    questions = response['data']['updateProject']['project']['questions']
    expect(questions).to eq(['This is a question?'])
  end

  it 'sets the requiredCharacteristics' do
    characteristic = response['data']['updateProject']['project']['requiredCharacteristics']
    expect(characteristic).to eq(%w[Required])
  end

  it 'sets the optionalCharacteristics' do
    characteristic = response['data']['updateProject']['project']['optionalCharacteristics']
    expect(characteristic).to eq(%w[Optional])
  end

  it 'accepts the terms' do
    terms = response['data']['updateProject']['project']['acceptedTerms']
    expect(terms).to be_truthy
  end
end
