# frozen_string_literal: true

require "rails_helper"

RSpec.describe ZapierInteractorController, type: :request do
  let(:key) { ENV["ACCOUNTS_CREATE_KEY"] }

  describe "POST /create_application" do
    let(:specialist) { create(:specialist) }
    let(:project) { create(:project) }
    let(:application_params) { {comment: "This is a comment"} }
    let(:extra_application_params) { {} }
    let(:extra_params) { {specialist_id: specialist.uid, project_id: project.uid} }
    let(:params) { {application: application_params.merge(extra_application_params), key:}.merge(extra_params) }

    it "creates the application and returns its uid" do
      post("/zapier_interactor/create_application", params:)
      expect(response).to have_http_status(:success)
      application = Application.find_by(uid: JSON[response.body]["uid"])
      expect(application.comment).to eq("This is a comment")
    end

    context "when sending meta fields" do
      let(:extra_application_params) { {working_5_days_in_client_feedback: "No feedback"} }

      it "updates them" do
        post("/zapier_interactor/create_application", params:)
        expect(response).to have_http_status(:success)
        application = Application.find_by(uid: JSON[response.body]["uid"])
        expect(application.meta_fields["Working - 5 Days In - Client Feedback"]).to eq("No feedback")
      end
    end

    context "when specialist is missing" do
      let(:extra_params) { {project_id: project.uid} }

      it "returns error" do
        post("/zapier_interactor/create_application", params:)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON[response.body]["message"]).to eq("Couldn't find Specialist with [WHERE \"specialists\".\"uid\" IS NULL]")
      end
    end

    context "when project is missing" do
      let(:extra_params) { {specialist_id: specialist.uid} }

      it "returns error" do
        post("/zapier_interactor/create_application", params:)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON[response.body]["message"]).to eq("Couldn't find Project with [WHERE \"projects\".\"uid\" IS NULL]")
      end
    end

    context "when given unpermitted params" do
      let(:extra_application_params) { {trial_program: "1234"} }

      it "ignores the param" do
        post("/zapier_interactor/create_application", params:)
        uid = JSON[response.body]["uid"]
        application = Application.find_by(uid:)
        expect(application.trial_program).not_to eq("1234")
      end
    end

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/create_application", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /update_application" do
    let(:application) { create(:application) }
    let(:application_params) { {comment: "This is a comment", source: "And this is the source"} }
    let(:extra_application_params) { {} }
    let(:params) { {application: application_params.merge(extra_application_params), uid: application.uid, key:} }

    it "updates the application" do
      post("/zapier_interactor/update_application", params:)
      expect(response).to have_http_status(:success)
      application.reload
      expect(application.comment).to eq("This is a comment")
      expect(application.source).to eq("And this is the source")
    end

    context "when sending meta fields" do
      let(:extra_application_params) { {"working_5_days_in_client_feedback" => "No feedback"} }

      it "updates them" do
        post("/zapier_interactor/update_application", params:)
        expect(response).to have_http_status(:success)
        application.reload
        expect(application.meta_fields["Working - 5 Days In - Client Feedback"]).to eq("No feedback")
      end
    end

    context "when application has existing meta fields" do
      let(:application) { create(:application, meta_fields: {"Working - 5 Days In - Specialist Feedback" => "Not great. Not terrible.", "Working - 5 Days In - Client Feedback" => "Overwrite me."}) }

      let(:extra_application_params) { {"working_5_days_in_client_feedback" => "No feedback"} }

      it "does not overwrite them" do
        post("/zapier_interactor/update_application", params:)
        expect(response).to have_http_status(:success)
        application.reload
        expect(application.meta_fields["Working - 5 Days In - Specialist Feedback"]).to eq("Not great. Not terrible.")
        expect(application.meta_fields["Working - 5 Days In - Client Feedback"]).to eq("No feedback")
      end
    end

    context "when given unpermitted params" do
      let(:extra_application_params) { {trial_program: "1234"} }

      it "ignores the param" do
        post("/zapier_interactor/update_application", params:)
        expect(application.reload.trial_program).not_to eq("1234")
      end
    end

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/update_application", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /update_interview" do
    let(:interview) { create(:interview, status: "Call Scheduled") }
    let(:status) { "Call Requested" }
    let(:params) { {status:, uid: interview.uid, key:} }

    it "updates the interview and syncs to airtable" do
      post("/zapier_interactor/update_interview", params:)
      expect(response).to have_http_status(:success)
      expect(interview.reload.status).to eq("Call Requested")
    end

    context "when given wrong status" do
      let(:status) { "Not a valid status" }

      it "ignores the param" do
        post("/zapier_interactor/update_interview", params:)
        expect(response.status).to eq(422)
        expect(JSON[response.body]["message"]).to eq("Validation failed: Status is not included in the list")
      end
    end

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/update_interview", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /update_consultation" do
    let(:consultation) { create(:consultation, status: "Call Scheduled") }
    let(:status) { "Call Requested" }
    let(:params) { {status:, uid: consultation.uid, key:} }

    it "updates the consultation and syncs to airtable" do
      post("/zapier_interactor/update_consultation", params:)
      expect(response).to have_http_status(:success)
      expect(consultation.reload.status).to eq("Call Requested")
    end

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/update_consultation", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /update_user" do
    let(:account) { create(:account) }
    let(:user) { create(:user, account:, title: "Old Title", campaign_name: "Old Name") }
    let(:params) { {uid: user.uid, key:} }

    before { allow_any_instance_of(User).to receive(:sync_to_airtable) }

    it "updates allowed fields" do
      post("/zapier_interactor/update_user", params: params.merge(campaign_name: "New Name"))
      expect(response).to have_http_status(:success)
      expect(user.reload.campaign_name).to eq("New Name")
    end

    it "can nullify an allowed field" do
      post("/zapier_interactor/update_user", params: params.merge(campaign_name: "-"))
      expect(response).to have_http_status(:success)
      expect(user.reload.campaign_name).to be_nil
    end

    it "does not update field that is not allowed" do
      post("/zapier_interactor/update_user", params: params.merge(title: "New Title"))
      expect(response).to have_http_status(:success)
      expect(user.reload.title).to eq("Old Title")
    end

    it "updates owner" do
      sp = create(:sales_person)
      post("/zapier_interactor/update_user", params: params.merge(owner: sp.uid))
      expect(response).to have_http_status(:success)
      expect(user.company.reload.sales_person_id).to eq(sp.id)
    end

    it "can nullify owner" do
      sp = create(:sales_person)
      user.company.update!(sales_person_id: sp.id)
      post("/zapier_interactor/update_user", params: params.merge(owner: "-"))
      expect(response).to have_http_status(:success)
      expect(user.company.reload.sales_person_id).to be_nil
    end

    describe "updating unsubscriptions" do
      context "when unsubscribed is nil" do
        let(:account) { create(:account, unsubscribed_from: nil) }

        it "adds new" do
          post("/zapier_interactor/update_user", params: params.merge(unsubscribe_all: true), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq(["All"])
        end

        it "doesn't fail removal" do
          post("/zapier_interactor/update_user", params: params.merge(unsubscribe_all: false), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq([])
        end
      end

      context "when unsubscribed has content" do
        let(:account) { create(:account, unsubscribed_from: ["All"]) }

        it "doesn't duplicate existing ones" do
          post("/zapier_interactor/update_user", params: params.merge(unsubscribe_all: true), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq(["All"])
        end

        it "doesn't duplicate existing ones when empty param" do
          post("/zapier_interactor/update_user", params: params.merge(unsubscribe_all: nil), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq(["All"])
        end

        it "adds new" do
          post("/zapier_interactor/update_user", params: params.merge(unsubscribe_sms_alerts: true), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to match_array(["All", "SMS Alerts"])
        end

        it "doesn't fail removal" do
          post("/zapier_interactor/update_user", params: params.merge(unsubscribe_all: false), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq([])
        end
      end
    end

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/update_user", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /update_specialist" do
    let(:account) { create(:account) }
    let(:specialist) { create(:specialist, account:, community_status: "Old Status", campaign_name: "Old Name") }
    let(:params) { {uid: specialist.uid, key:} }

    before { allow_any_instance_of(Specialist).to receive(:sync_to_airtable) }

    it "updates allowed fields" do
      post("/zapier_interactor/update_specialist", params: params.merge(campaign_name: "New Name"))
      expect(response).to have_http_status(:success)
      expect(specialist.reload.campaign_name).to eq("New Name")
    end

    it "can nullify an allowed field" do
      post("/zapier_interactor/update_specialist", params: params.merge(campaign_name: "-"))
      expect(response).to have_http_status(:success)
      expect(specialist.reload.campaign_name).to be_nil
    end

    it "does not update field that is not allowed" do
      post("/zapier_interactor/update_specialist", params: params.merge(community_status: "New Status"))
      expect(response).to have_http_status(:success)
      expect(specialist.reload.community_status).to eq("Old Status")
    end

    it "updates interviewer" do
      sp = create(:sales_person)
      post("/zapier_interactor/update_specialist", params: params.merge(interviewer: sp.uid))
      expect(response).to have_http_status(:success)
      expect(specialist.reload.interviewer_id).to eq(sp.id)
    end

    it "can nullify interviewer" do
      sp = create(:sales_person)
      specialist.update!(interviewer_id: sp.id)
      post("/zapier_interactor/update_specialist", params: params.merge(interviewer: "-"))
      expect(response).to have_http_status(:success)
      expect(specialist.reload.interviewer_id).to be_nil
    end

    describe "updating unsubscriptions" do
      context "when unsubscribed is nil" do
        let(:account) { create(:account, unsubscribed_from: nil) }

        it "adds new" do
          post("/zapier_interactor/update_specialist", params: params.merge(unsubscribe_all: true), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq(["All"])
        end

        it "doesn't fail removal" do
          post("/zapier_interactor/update_specialist", params: params.merge(unsubscribe_all: false), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq([])
        end
      end

      context "when unsubscribed has content" do
        let(:account) { create(:account, unsubscribed_from: ["All"]) }

        it "doesn't duplicate existing ones" do
          post("/zapier_interactor/update_specialist", params: params.merge(unsubscribe_all: true), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq(["All"])
        end

        it "doesn't duplicate existing ones when empty param" do
          post("/zapier_interactor/update_specialist", params: params.merge(unsubscribe_all: nil), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq(["All"])
        end

        it "adds new" do
          post("/zapier_interactor/update_specialist", params: params.merge(unsubscribe_sms_alerts: true), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to match_array(["All", "SMS Alerts"])
        end

        it "doesn't fail removal" do
          post("/zapier_interactor/update_specialist", params: params.merge(unsubscribe_all: false), as: :json)
          expect(response).to have_http_status(:success)
          expect(account.reload.unsubscribed_from).to eq([])
        end
      end
    end

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/update_specialist", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /update_project" do
    let(:project) { create(:project, campaign_name: "Old Name", sales_status: "Old Status") }
    let(:params) { {uid: project.uid, key:} }

    before { allow_any_instance_of(Project).to receive(:sync_to_airtable) }

    it "updates allowed fields" do
      post("/zapier_interactor/update_project", params: params.merge(sales_status: "New Status"))
      expect(response).to have_http_status(:success)
      expect(project.reload.sales_status).to eq("New Status")
    end

    it "can nullify an allowed field" do
      post("/zapier_interactor/update_project", params: params.merge(sales_status: "-"))
      expect(response).to have_http_status(:success)
      expect(project.reload.sales_status).to be_nil
    end

    it "does not update field that is not allowed" do
      post("/zapier_interactor/update_project", params: params.merge(campaign_name: "New Name"))
      expect(response).to have_http_status(:success)
      expect(project.reload.campaign_name).to eq("Old Name")
    end

    describe "updating questions" do
      let(:project) { create(:project, questions: nil) }

      it "groups 2 into one array" do
        post("/zapier_interactor/update_project", params: params.merge(question_1: "First question", question_2: "Second question")) # rubocop:disable Naming/VariableNumber
        expect(response).to have_http_status(:success)
        expect(project.reload.questions).to match_array(["First question", "Second question"])
      end

      it "groups 1 into array of single element" do
        post("/zapier_interactor/update_project", params: params.merge(question_1: "First question", question_2: "")) # rubocop:disable Naming/VariableNumber
        expect(response).to have_http_status(:success)
        expect(project.reload.questions).to match_array(["First question"])
        post("/zapier_interactor/update_project", params: params.merge(question_2: "Second question")) # rubocop:disable Naming/VariableNumber
        expect(response).to have_http_status(:success)
        expect(project.reload.questions).to match_array(["Second question"])
      end

      it "does not change them if both params are empty" do
        project.update(questions: ["Existing question"])
        post("/zapier_interactor/update_project", params: params.merge(question_1: "", question_2: "")) # rubocop:disable Naming/VariableNumber
        expect(response).to have_http_status(:success)
        expect(project.reload.questions).to match_array(["Existing question"])
      end

      it "can nullify them" do
        post("/zapier_interactor/update_project", params: params.merge(question_1: "-", question_2: "-")) # rubocop:disable Naming/VariableNumber
        expect(response).to have_http_status(:success)
        expect(project.reload.questions).to match_array([])
      end
    end

    describe "updating characteristics" do
      let(:project) { create(:project, required_characteristics: nil, characteristics: nil) }

      it "works when both are provided" do
        post("/zapier_interactor/update_project", params: params.merge(required_characteristics: ["Swimming"], optional_characteristics: %w[Dancing Running]), as: :json)
        expect(response).to have_http_status(:success)
        expect(project.reload.required_characteristics).to match_array(["Swimming"])
        expect(project.reload.characteristics).to match_array(%w[Swimming Dancing Running])
      end

      it "does not duplicate them when optional contains required ones too" do
        post("/zapier_interactor/update_project", params: params.merge(required_characteristics: ["Swimming"], optional_characteristics: %w[Swimming Dancing Running]), as: :json)
        expect(response).to have_http_status(:success)
        expect(project.reload.required_characteristics).to match_array(["Swimming"])
        expect(project.reload.characteristics).to match_array(%w[Swimming Dancing Running])
      end

      it "can replace optional" do
        project.update(required_characteristics: ["Running"], characteristics: ["Dancing"])
        post("/zapier_interactor/update_project", params: params.merge(optional_characteristics: %w[Swimming]), as: :json)
        expect(response).to have_http_status(:success)
        expect(project.reload.required_characteristics).to match_array(%w[Running])
        expect(project.reload.characteristics).to match_array(%w[Running Swimming])
      end

      it "can replace required" do
        project.update(required_characteristics: ["Running"], characteristics: ["Dancing"])
        post("/zapier_interactor/update_project", params: params.merge(required_characteristics: ["Swimming"]), as: :json)
        expect(response).to have_http_status(:success)
        expect(project.reload.required_characteristics).to match_array(["Swimming"])
        expect(project.reload.characteristics).to match_array(%w[Dancing Swimming])
      end
    end

    describe "updating skills" do
      let!(:skill1) { create(:skill, name: "Swimming") }
      let!(:skill2) { create(:skill, name: "Running") }
      let!(:skill3) { create(:skill, name: "Dancing") }

      it "can add skills" do
        post("/zapier_interactor/update_project", params: params.merge(skills: %w[Swimming Running]), as: :json)
        expect(response).to have_http_status(:success)
        expect(project.reload.skills).to match_array([skill1, skill2])
      end

      it "can replace primary skill and move existing one to skills" do
        project.update(primary_skill: skill1)
        post("/zapier_interactor/update_project", params: params.merge(primary_skill: "Dancing"), as: :json)
        expect(response).to have_http_status(:success)
        expect(project.reload.primary_skill).to eq(skill3)
        expect(project.reload.skills).to match_array([skill1, skill3])
      end

      it "ignores non-existing skills" do
        post("/zapier_interactor/update_project", params: params.merge(skills: %w[Swimming Running Climbing]), as: :json)
        expect(response).to have_http_status(:success)
        expect(project.reload.skills).to match_array([skill1, skill2])
      end

      it "ignores non-existing primary skill" do
        project.update(primary_skill: skill1)
        post("/zapier_interactor/update_project", params: params.merge(primary_skill: "Climbing"), as: :json)
        expect(response).to have_http_status(:success)
        expect(project.reload.primary_skill).to eq(skill1)
        expect(project.reload.skills).to match_array([skill1])
      end
    end

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/update_project", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /update_task" do
    let(:task) { create(:task) }
    let(:stage) { "Quote Provided" }
    let(:params) { {stage:, uid: task.uid, key:} }

    it "updates the task and datetime field" do
      post("/zapier_interactor/update_task", params:)
      expect(response).to have_http_status(:success)
      task.reload
      expect(task.stage).to eq("Quote Provided")
      expect(task.quote_provided_at).to be_within(1.second).of(Time.zone.now)
      expect(task.quote_requested_at).to be_nil
    end

    context "when stage changes to approved" do
      let(:task) { create(:task, final_cost: 5000) }
      let(:stage) { "Approved" }

      before { allow(Stripe::PaymentIntent).to receive(:create).and_return(OpenStruct.new(id: "pi_#{SecureRandom.uuid}", status: "succeeded")) }

      it "updates the task and datetime field, and charges" do
        payout_count = Payout.count
        payment_count = Payment.count
        post("/zapier_interactor/update_task", params:)
        expect(response).to have_http_status(:success)
        task.reload
        expect(task.stage).to eq("Approved")
        expect(task.approved_at).to be_within(1.second).of(Time.zone.now)
        expect(task.quote_requested_at).to be_nil
        expect(Payout.count).to eq(payout_count + 1)
        expect(Payment.count).to eq(payment_count + 1)
      end
    end

    context "when stage doesn't have a corresponding datetime field" do
      let(:stage) { "Deleted" }

      it "updates the task and no datetime field" do
        post("/zapier_interactor/update_task", params:)
        expect(response).to have_http_status(:success)
        task.reload
        expect(task.stage).to eq("Deleted")
        expect(task.approved_at).to be_nil
        expect(task.quote_requested_at).to be_nil
      end
    end

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/update_task", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /create_magic_link" do
    let(:url) { "http://path.to/image.jpg" }
    let(:user) { create(:specialist) }
    let(:params) { {uid: user.uid, url:, key:} }

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/create_magic_link", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when specialist" do
      it "creates a magic link" do
        post("/zapier_interactor/create_magic_link", params:)
        expect(response).to have_http_status(:success)
        link = JSON[response.body]["magic_link"]
        expect(link).to include("&mluid=#{user.account.uid}")
      end
    end

    context "when user" do
      let(:user) { create(:user) }

      it "creates a magic link" do
        post("/zapier_interactor/create_magic_link", params:)
        expect(response).to have_http_status(:success)
        link = JSON[response.body]["magic_link"]
        expect(link).to include("&mluid=#{user.account.uid}")
      end
    end

    context "when account" do
      let(:user) { create(:account) }

      it "creates a magic link" do
        post("/zapier_interactor/create_magic_link", params:)
        expect(response).to have_http_status(:success)
        link = JSON[response.body]["magic_link"]
        expect(link).to include("&mluid=#{user.uid}")
      end
    end

    context "when provided expires_at" do
      let(:expires_at) { 1.month.from_now }

      it "creates a magic link" do
        post("/zapier_interactor/create_magic_link", params: params.merge(expires_at:))
        expect(response).to have_http_status(:success)
        link = JSON[response.body]["magic_link"]
        params = CGI.parse(URI.parse(link).query)
        magic = user.account.magic_links.where(path: "/image.jpg").find do |ml|
          ml.valid_token(params["mlt"].first)
        end
        expect(magic.expires_at.to_i).to eq(expires_at.to_i)
      end
    end
  end

  describe "POST /enable_guild" do
    let(:specialist) { create(:specialist, guild: false) }
    let(:params) { {uid: specialist.uid, key:} }

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/enable_guild", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    it "enables guild" do
      post("/zapier_interactor/enable_guild", params:)
      expect(response).to have_http_status(:success)
      expect(specialist.reload).to be_guild
      expect(GuildAddFollowablesJob).to have_been_enqueued.with(specialist.id)
    end
  end

  describe "POST /boost_guild_post" do
    let(:guild_post) { create(:guild_post, status: "published", labels: [create(:label)]) }
    let(:post_id) { guild_post.id }
    let(:params) { {post_id:, key:} }

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/boost_guild_post", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when post does not satisfy requirements for boosting" do
      let(:guild_post) { create(:guild_post) }

      it "returns a descriptive error" do
        post("/zapier_interactor/boost_guild_post", params:)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON[response.body]["error"]).to eq("Cannot boost a post with zero labels")
      end
    end

    it "boosts post" do
      post("/zapier_interactor/boost_guild_post", params:)
      expect(response).to have_http_status(:success)
      expect(Guild::Post.find(post_id).boosted_at).to be_present
    end
  end

  describe "POST /import_case_study" do
    let(:params) { {airtable_id: "asdf", key:} }
    let(:stub) { instance_double(Airtable::CaseStudy) }
    let(:article) { build_stubbed(:case_study_article, airtable_id: "asdf") }

    it "imports case study" do
      allow(Airtable::CaseStudy).to receive(:find).with("asdf").and_return(stub)
      allow(stub).to receive(:article_record).and_return(article)
      post("/zapier_interactor/import_case_study", params:)
      expect(response).to have_http_status(:success)
      expect(CaseStudyImportJob).to have_been_enqueued.with("asdf")
      json = JSON[response.body]
      expect(json["airtable_id"]).to eq("asdf")
      expect(json["uid"]).to eq(article.uid)
    end

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/import_case_study", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when case study not found in airtable" do
      it "tells so in the error response" do
        allow(Airtable::CaseStudy).to receive(:find).with("asdf").and_raise(Airrecord::Error, "HTTP 404: : ")
        post("/zapier_interactor/import_case_study", params:)
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON[response.body]
        expect(json["error"]).to eq("Case Study not found")
      end
    end

    context "when some other airtable error" do
      it "tells so in the error response" do
        allow(Airtable::CaseStudy).to receive(:find).with("asdf").and_raise(Airrecord::Error, "It's raining in them tables")
        post("/zapier_interactor/import_case_study", params:)
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON[response.body]
        expect(json["error"]).to eq("Airtable communication error")
      end
    end

    context "when something goes wrong when creating article" do
      it "tells so in the error response" do
        allow(Airtable::CaseStudy).to receive(:find).with("asdf").and_return(stub)
        allow(stub).to receive(:article_record).and_raise(ActiveRecord::RecordNotFound, "Couldn't find Specialist")
        post("/zapier_interactor/import_case_study", params:)
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON[response.body]
        expect(json["error"]).to eq("Something went wrong")
      end
    end
  end

  describe "POST /post_case_study_to_guild" do
    let(:article) { create(:case_study_article) }
    let(:params) { {uid: article.uid, key:} }

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/post_case_study_to_guild", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    it "creates guild post" do
      post("/zapier_interactor/post_case_study_to_guild", params:)
      expect(response).to have_http_status(:success)
      body = JSON[response.body]
      expect(body.keys).to include("post_id")
      expect(::Guild::Post.find(body["post_id"]).article_id).to eq(article.id)
    end

    context "when guild posts already exists" do
      let(:article) { create(:case_study_article) }
      let!(:guild_post) { create(:guild_post, article:) }

      it "returns the existing one" do
        post("/zapier_interactor/post_case_study_to_guild", params:)
        expect(response).to have_http_status(:success)
        body = JSON[response.body]
        expect(body.keys).to include("post_id")
        expect(body["post_id"]).to eq(guild_post.id)
      end
    end
  end

  describe "POST /send_email" do
    let(:user) { create(:specialist) }
    let(:params) { {uid: user.uid, subject: "Subject", body: "<h1>Heya!</h1>", key:} }

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/send_email", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when specialist" do
      it "sends the email" do
        post("/zapier_interactor/send_email", params:)
        expect(response).to have_http_status(:success)
        expect(ActionMailer::MailDeliveryJob).to have_been_enqueued.with("AccountMailer", "zapier_email", "deliver_now", {args: [user.account, "Subject", "<h1>Heya!</h1>"]})
      end
    end

    context "when user" do
      let(:user) { create(:user) }

      it "sends the email" do
        post("/zapier_interactor/send_email", params:)
        expect(response).to have_http_status(:success)
        expect(ActionMailer::MailDeliveryJob).to have_been_enqueued.with("AccountMailer", "zapier_email", "deliver_now", {args: [user.account, "Subject", "<h1>Heya!</h1>"]})
      end
    end

    context "when account" do
      let(:user) { create(:account) }

      it "sends the email" do
        post("/zapier_interactor/send_email", params:)
        expect(response).to have_http_status(:success)
        expect(ActionMailer::MailDeliveryJob).to have_been_enqueued.with("AccountMailer", "zapier_email", "deliver_now", {args: [user, "Subject", "<h1>Heya!</h1>"]})
      end
    end
  end

  describe "POST /send_finance_email" do
    let(:params) { {email: "test@test.com", key:} }

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/send_finance_email", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    it "generates the csv" do
      post("/zapier_interactor/send_finance_email", params:)
      expect(response).to have_http_status(:success)
      expect(GenerateFinanceCsvJob).to have_been_enqueued.with("test@test.com")
    end
  end

  describe "POST /create_message" do
    let(:user) { create(:user) }
    let(:account_ids) { [user.uid] }
    let(:params) { {uids: account_ids, author: user.uid, content: "Content", key:} }

    context "when no key" do
      let(:key) { "" }

      it "is unauthorized" do
        post("/zapier_interactor/create_message", params:)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe "creates a message" do
      let(:account_ids) { [user.uid, second_uid] }

      context "when specialist" do
        let(:second) { create(:specialist) }
        let(:second_uid) { second.uid }

        it "creates the message between user and second" do
          post("/zapier_interactor/create_message", params:)
          expect(response).to have_http_status(:success)
          uid = JSON[response.body]["conversation"]
          conversation = Conversation.find_by(uid:)
          expect(conversation.messages.count).to eq(1)
          expect(conversation.participants.pluck(:account_id)).to match_array([user.account_id, second.account_id])
          message = conversation.messages.last
          expect(message.author).to eq(user.account)
          expect(message.content).to eq("Content")
        end
      end

      context "when user" do
        let(:second) { create(:user) }
        let(:second_uid) { second.uid }

        it "creates the message between user and second" do
          post("/zapier_interactor/create_message", params:)
          expect(response).to have_http_status(:success)
          uid = JSON[response.body]["conversation"]
          conversation = Conversation.find_by(uid:)
          expect(conversation.messages.count).to eq(1)
          expect(conversation.participants.pluck(:account_id)).to match_array([user.account_id, second.account_id])
          message = conversation.messages.last
          expect(message.author).to eq(user.account)
          expect(message.content).to eq("Content")
        end
      end

      context "when account" do
        let(:second) { create(:specialist) }
        let(:second_uid) { second.account.uid }

        it "creates the message between user and second" do
          post("/zapier_interactor/create_message", params:)
          expect(response).to have_http_status(:success)
          uid = JSON[response.body]["conversation"]
          conversation = Conversation.find_by(uid:)
          expect(conversation.messages.count).to eq(1)
          expect(conversation.participants.pluck(:account_id)).to match_array([user.account_id, second.account_id])
          message = conversation.messages.last
          expect(message.author).to eq(user.account)
          expect(message.content).to eq("Content")
        end
      end

      context "with existing conversation" do
        let(:second) { create(:specialist) }
        let(:second_uid) { second.uid }

        it "creates a message in existing conversation" do
          conversation = Conversation.by_accounts([user.account, second.account])
          conversation.new_message!(second.account, "Existing message")
          post("/zapier_interactor/create_message", params:)
          expect(response).to have_http_status(:success)
          uid = JSON[response.body]["conversation"]
          conversation = Conversation.find_by(uid:)
          expect(conversation.messages.count).to eq(2)
          expect(conversation.participants.pluck(:account_id)).to match_array([user.account_id, second.account_id])
          message = conversation.messages.last
          expect(message.author).to eq(user.account)
          expect(message.content).to eq("Content")
        end
      end

      context "when no author" do
        let(:params) { {uids: account_ids, content: "Content", key:} }
        let(:second) { create(:specialist) }
        let(:second_uid) { second.uid }

        it "creates a system message between user and second" do
          post("/zapier_interactor/create_message", params:)
          expect(response).to have_http_status(:success)
          uid = JSON[response.body]["conversation"]
          conversation = Conversation.find_by(uid:)
          expect(conversation.messages.count).to eq(1)
          expect(conversation.participants.pluck(:account_id)).to match_array([user.account_id, second.account_id])
          message = conversation.messages.last
          expect(message.author).to be_nil
          expect(message).to be_system_message
          expect(message.content).to eq("Content")
        end
      end
    end
  end
end
