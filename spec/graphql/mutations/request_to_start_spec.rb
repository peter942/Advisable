# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::RequestToStart do
  let(:application) { create(:application, status: "Working") }
  let(:task) { create(:task, stage: "Not Assigned", application:) }

  let(:query) do
    <<-GRAPHQL
    mutation {
      requestToStart(input: {
        task: "#{task.uid}",
      }) {
        task {
          id
          stage
        }
      }
    }
    GRAPHQL
  end

  let(:context) { {current_user: task.application.specialist} }

  it "sets the stage to 'Requested To Start'" do
    response = AdvisableSchema.execute(query, context:)
    stage = response["data"]["requestToStart"]["task"]["stage"]
    expect(stage).to eq("Requested To Start")
  end

  context "when the task does not have a name" do
    let(:task) { create(:task, stage: "Not Assigned", name: nil) }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context:)
      error = response["errors"][0]
      expect(error["message"]).to eq("tasks.nameRequired")
    end
  end

  context "when the task does not have a description" do
    let(:task) { create(:task, stage: "Not Assigned", description: nil) }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context:)
      error = response["errors"][0]
      expect(error["message"]).to eq("tasks.descriptionRequired")
    end
  end

  context "when the specialist doesn't have access to the project" do
    let(:context) { {current_user: create(:user)} }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context:)
      error = response["errors"][0]
      expect(error["extensions"]["code"]).to eq("NOT_AUTHORIZED")
    end
  end

  context "when there is no user" do
    let(:context) { {current_user: nil} }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context:)
      error = response["errors"][0]
      expect(error["extensions"]["code"]).to eq("NOT_AUTHORIZED")
    end
  end

  context "when the user is logged in" do
    let(:context) { {current_user: task.application.project.user} }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context:)
      error = response["errors"][0]
      expect(error["extensions"]["code"]).to eq("NOT_AUTHORIZED")
    end
  end

  context "when the task stage is Assigned" do
    let(:task) { create(:task, stage: "Assigned") }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context:)
      error = response["errors"][0]
      expect(error["message"]).to eq("Stage must be 'Not Assigned'")
    end
  end

  context "when the task stage is Working" do
    let(:task) { create(:task, stage: "Working") }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context:)
      error = response["errors"][0]
      expect(error["message"]).to eq("Stage must be 'Not Assigned'")
    end
  end

  context "when the task stage is Submitted" do
    let(:task) { create(:task, stage: "Submitted") }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context:)
      error = response["errors"][0]
      expect(error["message"]).to eq("Stage must be 'Not Assigned'")
    end
  end

  context "when the application status is not 'Working'" do
    let(:application) { create(:application, status: "Proposed") }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context:)
      error = response["errors"][0]
      expect(error["message"]).to eq("Application status is not 'Working'")
    end
  end
end
