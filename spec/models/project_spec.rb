# frozen_string_literal: true

require "rails_helper"

RSpec.describe Project do
  include_examples "Airtable::Syncable"
  it { is_expected.to have_many(:applications) }

  describe "#deposit" do
    context "when there is no deposit" do
      it "returns 0" do
        project = build(:project, deposit: nil)
        expect(project.deposit).to eq(0)
      end
    end

    context "when there is a deposit" do
      it "returns the deposit" do
        project = build(:project, deposit: 500)
        expect(project.deposit).to eq(500)
      end
    end
  end

  describe "#accepted_terms=" do
    it "sets accepted_terms_at to the current time" do
      project = create(:project, accepted_terms_at: nil)
      project.accepted_terms = true
      expect(project.accepted_terms_at).to be_within(1.second).of(Time.zone.now)
    end

    context "when accepted_terms_at is already set" do
      it "does not change the accepted_terms_at" do
        project = create(:project, accepted_terms_at: 5.days.ago)
        project.accepted_terms = true
        expect(project.accepted_terms_at).to be_within(1.second).of(5.days.ago)
      end
    end
  end

  describe "#deposit_paid" do
    context "when there is no deposit_paid" do
      it "returns 0" do
        project = build(:project, deposit_paid: nil)
        expect(project.deposit_paid).to eq(0)
      end
    end

    context "when there is a deposit_paid" do
      it "returns the deposit_paid" do
        project = build(:project, deposit_paid: 500)
        expect(project.deposit_paid).to eq(500)
      end
    end
  end

  describe "#deposit_owed" do
    context "when they have not paid any of the deposit" do
      it "returns the total amount" do
        project = build(:project, deposit: 1_000, deposit_paid: 0)
        expect(project.deposit_owed).to eq(1_000)
      end
    end

    context "when the deposit has been paid" do
      it "returns 0" do
        project = build(:project, deposit: 1_000, deposit_paid: 1_000)
        expect(project.deposit_owed).to eq(0)
      end
    end

    context "when some of the deposit has been paid" do
      it "returns the remainder" do
        project = build(:project, deposit: 1_000, deposit_paid: 500)
        expect(project.deposit_owed).to eq(500)
      end
    end
  end

  describe "#applications_open" do
    context "when sales_status is Won" do
      it "returns false" do
        project = create(:project, sales_status: "Won")
        expect(project.applications_open).to be_falsey
      end
    end

    context "when sales_status is Lost" do
      it "returns false" do
        project = create(:project, sales_status: "Lost")
        expect(project.applications_open).to be_falsey
      end
    end

    context "when sales_status is Open" do
      it "returns true" do
        project = create(:project, sales_status: "Open")
        expect(project.applications_open).to be_truthy
      end
    end

    context "when sales_status is nil" do
      it "returns true" do
        project = create(:project, sales_status: nil)
        expect(project.applications_open).to be_truthy
      end
    end
  end

  describe "#candidates" do
    it 'includes any candidates that have a status of "Application Accepted"' do
      project = create(:project)
      application =
        create(
          :application,
          project:, score: 75, status: "Application Accepted"
        )
      expect(project.candidates).to include(application)
    end

    it 'does not include any candidates that have a status of "Application Rejected"' do
      project = create(:project)
      application =
        create(
          :application,
          project:, score: 75, status: "Application Rejected"
        )
      expect(project.candidates).not_to include(application)
    end

    it 'includes any candidates that have a status of "Interview Scheduled"' do
      project = create(:project)
      application =
        create(
          :application,
          project:, score: 75, status: "Interview Scheduled"
        )
      expect(project.candidates).to include(application)
    end

    it 'includes any candidates that have a status of "Interview Completed"' do
      project = create(:project)
      application =
        create(
          :application,
          project:, score: 75, status: "Interview Completed"
        )
      expect(project.candidates).to include(application)
    end

    it 'includes any candidates that have a status of "Proposed"' do
      project = create(:project)
      application =
        create(:application, project:, score: 75, status: "Proposed")
      expect(project.candidates).to include(application)
    end

    it 'excludes any candidates that have a status of "Working"' do
      project = create(:project)
      application =
        create(:application, project:, score: 75, status: "Working")
      expect(project.candidates).not_to include(application)
    end

    it 'excludes any candidates that have a status of "Stopped Working"' do
      project = create(:project)
      application =
        create(
          :application,
          project:, score: 75, status: "Stopped Working"
        )
      expect(project.candidates).not_to include(application)
    end

    it 'excludes any candidates that have a status of "Invited To Apply"' do
      project = create(:project)
      application =
        create(
          :application,
          project:, score: 75, status: "Invited To Apply"
        )
      expect(project.candidates).not_to include(application)
    end

    it 'excludes any candidates that have a status of "Invitation Rejected"' do
      project = create(:project)
      application =
        create(
          :application,
          project:, score: 75, status: "Invitation Rejected"
        )
      expect(project.candidates).not_to include(application)
    end

    it 'excludes any candidates that have a status of "To Be Invited"' do
      project = create(:project)
      application =
        create(
          :application,
          project:, score: 75, status: "To Be Invited"
        )
      expect(project.candidates).not_to include(application)
    end
  end

  describe "project paused emails" do
    let(:project) { create(:project) }
    let!(:applied_candidate) { create(:application, project:, status: "Applied") }
    let!(:accepted_candidate) { create(:application, project:, status: "Application Accepted") }
    let!(:rejected_candidate) { create(:application, project:, status: "Application Rejected") }

    context "when status changed to paused" do
      it "schedules emails to non-rejected applicants" do
        project.update(sales_status: "Paused")
        expect(ActionMailer::MailDeliveryJob).to have_been_enqueued.with("SpecialistMailer", "project_paused", "deliver_now", {args: [project, applied_candidate]})
        expect(ActionMailer::MailDeliveryJob).to have_been_enqueued.with("SpecialistMailer", "project_paused", "deliver_now", {args: [project, accepted_candidate]})
        expect(ActionMailer::MailDeliveryJob).not_to have_been_enqueued.with("SpecialistMailer", "project_paused", "deliver_now", {args: [project, rejected_candidate]})
      end
    end

    context "when status was paused already" do
      let(:project) { create(:project, sales_status: "Paused") }

      it "does not schedule any emails" do
        expect { project.update(sales_status: "Paused") }.not_to have_enqueued_job
      end
    end
  end
end
