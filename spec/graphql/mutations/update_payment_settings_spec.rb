# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::UpdatePaymentSettings do
  let(:specialist) { create(:specialist) }
  let(:context) { {current_user: specialist} }
  let(:query) do
    <<-GRAPHQL
    mutation {
      updatePaymentSettings(input: {
        bankHolderName: "Test Person",
        bankCurrency: "EUR",
        vatNumber: "1234",
        bankHolderAddress: {
          line1: "Bacon Street",
          city: "Egg City",
          state: "Clare",
          country: "IE",
          postcode: "N/A"
        }
      }) {
        specialist {
          id
          bankHolderName
          bankCurrency
          vatNumber
          bankHolderAddress {
            line1
            city
            state
            country
            postcode
          }
        }
      }
    }
    GRAPHQL
  end

  before do
    allow_any_instance_of(Specialist).to receive(:sync_to_airtable)
  end

  it "updates the specialists payment settings" do
    response = AdvisableSchema.execute(query, context: context)
    expect(response["data"]["updatePaymentSettings"]["specialist"]).to eq(
      {
        id: specialist.uid,
        bankHolderName: "Test Person",
        bankCurrency: "EUR",
        vatNumber: "1234",
        bankHolderAddress: {
          line1: "Bacon Street",
          city: "Egg City",
          state: "Clare",
          country: "IE",
          postcode: "N/A"
        }.stringify_keys
      }.stringify_keys
    )
  end

  context "when not logged in" do
    let(:context) { {current_user: nil} }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context: context)
      error = response["errors"][0]
      expect(error["extensions"]["code"]).to eq("notAuthenticated")
    end
  end

  context "when logged in as a User" do
    let(:context) { {current_user: create(:user)} }

    it "returns an error" do
      response = AdvisableSchema.execute(query, context: context)
      error = response["errors"][0]
      expect(error["extensions"]["code"]).to eq("MUST_BE_SPECIALIST")
    end
  end
end
