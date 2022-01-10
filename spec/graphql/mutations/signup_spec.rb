# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::Signup do
  let(:account) { create(:account, password: nil) }
  let(:user) { create(:user, account:) }
  let(:id) { user.uid }
  let(:email) { account.email }
  let(:password) { "testing123" }
  let(:session_manager) do
    SessionManager.new(session: OpenStruct.new, cookies: OpenStruct.new)
  end

  let(:query) do
    <<-GRAPHQL
    mutation {
      signup(input: {
        id: "#{id}",
        email: "#{email}",
        password: "#{password}",
        passwordConfirmation: "#{password}"
      }) {
        viewer {
          ... on User {
            id
          }
          ... on Specialist {
            id
          }
        }
      }
    }
    GRAPHQL
  end

  before do
    allow(session_manager).to receive(:login)
    allow_any_instance_of(User).to receive(:sync_to_airtable)
    allow_any_instance_of(Specialist).to receive(:sync_to_airtable)
  end

  def response
    AdvisableSchema.execute(
      query,
      context: {session_manager:}
    )
  end

  it "returns a viewer" do
    id = response["data"]["signup"]["viewer"]["id"]
    expect(id).to eq(user.uid)
  end

  context "when the user is a specialist" do
    let(:user) { create(:specialist, account:) }

    it "returns a viewer" do
      id = response["data"]["signup"]["viewer"]["id"]
      expect(id).to eq(user.uid)
    end
  end

  context "when the id is incorrect" do
    let(:id) { "wrong_id" }

    it "returns an error" do
      error = response["errors"][0]["extensions"]["code"]
      expect(error).to eq("NOT_FOUND")
    end
  end

  context "when the account already exists" do
    let(:user) { create(:user, account: create(:account, password: "testing123")) }

    it "returns an error" do
      error = response["errors"][0]["extensions"]["code"]
      expect(error).to eq("ACCOUNT_EXISTS")
    end

    it "doesnt login the user" do
      expect(session_manager).not_to receive(:login)
      response
    end
  end
end
