require "rails_helper"

describe Projects::Confirm do
  context "when the project is pending approval" do
    let(:project) { create(:project, status: "Project Pending Approval") }

    before :each do
      airtable_record = double("Airtable::Project")
      allow(Airtable::Project).to receive(:find).with(project.airtable_id).and_return(airtable_record)
      allow(airtable_record).to receive(:[]=).with("Project Stage", "Project Confirmed")
      allow(airtable_record).to receive(:save)
    end

    it "sets the status to Project Confirmed" do
      expect {
        Projects::Confirm.call(project: project)
      }.to change {
        project.reload.status
      }.from("Project Pending Approval").to("Project Confirmed")
    end

    it 'returns the project' do
      response = Projects::Confirm.call(project: project)
      expect(response).to be_a(Project)
    end

    it 'syncs with airtable' do
      airtable_record = double("Airtable::Project")
      expect(Airtable::Project).to receive(:find).with(project.airtable_id).and_return(airtable_record)
      expect(airtable_record).to receive(:[]=).with("Project Stage", "Project Confirmed")
      expect(airtable_record).to receive(:save)
      Projects::Confirm.call(project: project)
    end
  end

  context "when the project is not pending approval" do
    let(:project) { double(Project, status: "Project Confirmed") }

    it "throws a service error" do
      expect {
        Projects::Confirm.call(project: project)
      }.to raise_error(Service::Error)
    end
  end

  context "when the deposit owed has not been paid" do
    let(:project) { double(Project, status: "Project Pending Approval", deposit_owed: 100_00) }

    it "throws a service error" do
      expect {
        Projects::Confirm.call(project: project)
      }.to raise_error(Service::Error)
    end
  end
end