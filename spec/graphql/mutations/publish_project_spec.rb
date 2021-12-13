# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::PublishProject do
  let(:project) { create(:project, status: "Draft") }
  let(:context) { {current_user: project.user} }

  let(:query) do
    <<-GRAPHQL
    mutation {
      publishProject(input: {
        id: "#{project.uid}",
      }) {
        project {
          id
          status
        }
      }
    }
    GRAPHQL
  end

  before do
    allow_any_instance_of(Project).to receive(:sync_to_airtable)
  end

  it "sets the status to Pending Advisable Confirmation" do
    expect { AdvisableSchema.execute(query, context: context) }.to change {
      project.reload.status
    }.from("Draft").to("Pending Advisable Confirmation")
  end

  context "when logged in as another user" do
    let(:context) { {current_user: create(:user)} }

    it "returns a not authorized error" do
      response = AdvisableSchema.execute(query, context: context)
      error = response["errors"][0]["extensions"]["code"]
      expect(error).to eq("NOT_AUTHORIZED")
    end
  end

  context "when not logged in" do
    let(:context) { {current_user: nil} }

    it "returns a not authorized error" do
      response = AdvisableSchema.execute(query, context: context)
      error = response["errors"][0]["extensions"]["code"]
      expect(error).to eq("NOT_AUTHORIZED")
    end
  end

  context "when the project status is not draft" do
    let(:project) { create(:project, status: "Pending Advisable Confirmation") }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context: context)
      error = response["errors"][0]["extensions"]["code"]
      expect(error).to eq("ALREADY_PUBLISHED")
    end
  end
end
