# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::RequestIntroduction do
  let(:application) { create(:application, status: "Applied") }
  let(:time) { 2.days.from_now.strftime("%Y-%m-%dT%H:%M:00Z") }

  let(:query) do
    <<-GRAPHQL
    mutation {
      requestIntroduction(input: {
        application: "#{application.uid}",
        availability: ["#{time}"],
        timeZone: "Dublin"
      }) {
        interview {
          id
          status
          startsAt
          timeZone
        }
      }
    }
    GRAPHQL
  end

  let(:context) { {current_user: application.project.user} }

  before do
    allow_any_instance_of(Types::Interview).to receive(:id).and_return(
      "created_1234"
    )
  end

  it "sets the interview status to Call Requested" do
    response = AdvisableSchema.execute(query, context: context)
    status = response["data"]["requestIntroduction"]["interview"]["status"]
    expect(status).to eq("Call Requested")
  end

  it "sets the interview time zone" do
    response = AdvisableSchema.execute(query, context: context)
    time_zone = response["data"]["requestIntroduction"]["interview"]["timeZone"]
    expect(time_zone).to eq("Dublin")
  end

  it "sets the application status to application accepted" do
    expect { AdvisableSchema.execute(query, context: context) }.to change {
      application.reload.status
    }.from("Applied").to("Application Accepted")
  end

  it "returns an error if the user is not logged in" do
    response = AdvisableSchema.execute(query, context: {current_user: nil})
    error = response["errors"][0]["extensions"]["code"]
    expect(error).to eq("NOT_AUTHENTICATED")
  end

  it "returns an error if the user does not have access" do
    response =
      AdvisableSchema.execute(query, context: {current_user: create(:user)})
    error = response["errors"][0]["extensions"]["code"]
    expect(error).to eq("NOT_AUTHORIZED")
  end

  it "creates a new interview record and sets call_requested_at" do
    AdvisableSchema.execute(query, context: context)
    interview = Interview.last
    expect(interview.call_requested_at).to be_within(1.second).of(Time.zone.now)
  end
end
