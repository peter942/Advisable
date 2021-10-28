# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::DeleteJob do
  let(:user) { create(:user) }
  let!(:project) { create(:project, user: user, status: "Draft") }

  let(:query) do
    <<-GRAPHQL
    mutation {
      deleteJob(input: {
        id: "#{project.uid}",
      }) {
        id
      }
    }
    GRAPHQL
  end

  context "when a user is signed in" do
    before { allow_any_instance_of(Project).to receive(:remove_from_airtable) }

    it "deletes the project" do
      expect {
        AdvisableSchema.execute(query, context: {current_user: user})
      }.to change { user.projects.count }.by(-1)
    end
  end

  context "when there is no user signed in" do
    it "responds with a not_authenticated error code" do
      response = AdvisableSchema.execute(query, context: {current_user: nil})
      error = response["errors"].first["extensions"]["type"]
      expect(error).to eq("NOT_AUTHENTICATED")
    end
  end

  context "when the user is not the project owner" do
    it "responds with a not_authenticated error code" do
      response =
        AdvisableSchema.execute(query, context: {current_user: create(:user)})
      error = response["errors"].first["extensions"]["type"]
      expect(error).to eq("NOT_AUTHORIZED")
    end
  end

  context "when the project status is not draft" do
    let(:project) { create(:project, user: user, status: "Brief Confirmed") }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context: {current_user: user})
      error = response["errors"].first["extensions"]["type"]
      expect(error).to eq("INVALID_REQUEST")
    end
  end
end
