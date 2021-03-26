# frozen_string_literal: true

require "rails_helper"

RSpec.describe Skill do
  it { is_expected.to have_many(:specialists).through(:specialist_skills) }
  it { is_expected.to validate_presence_of(:name) }

  describe "#merge_with!" do
    let(:original) { create(:skill) }
    let(:duplicate) { create(:skill, original: original, airtable_id: "I REFUSE TO DIE") }

    let(:specialist) { create(:specialist) }
    let(:user) { create(:user) }
    let(:previous_project) { create(:previous_project) }
    let(:consultation) { create(:consultation) }
    let(:label) { create(:label, skill: duplicate) }
    let(:post) { create(:guild_post) }

    before do
      specialist.skills << duplicate
      user.skills << duplicate
      previous_project.skills << duplicate
      consultation.update(skill: duplicate)
    end

    it "does all the things" do
      expect(duplicate.specialists).to eq([specialist])
      expect(duplicate.users).to eq([user])
      expect(duplicate.previous_projects).to eq([previous_project])
      expect(duplicate.consultations).to eq([consultation])
      expect(original.projects_count).to eq(0)
      expect(original.specialists_count).to eq(0)

      original.merge_with!(duplicate: duplicate)
      original.reload

      expect(original.specialists).to eq([specialist])
      expect(original.users).to eq([user])
      expect(original.previous_projects).to eq([previous_project])
      expect(original.consultations).to eq([consultation])
      expect(original.projects_count).to eq(1)
      expect(original.specialists_count).to eq(1)
      expect(duplicate.airtable_id).to be_nil
      expect(described_class.where(id: duplicate.id)).to eq([])
    end

    context "with labels" do
      context "when it exists on original" do
        let(:original_label) { create(:label, skill: original) }
        let(:another_post) { create(:guild_post) }

        it "moves labelings" do
          post.labels << label
          another_post.labels << original_label
          expect(duplicate.label.guild_posts).to eq([post])

          original.merge_with!(duplicate: duplicate)

          expect(Label.where(id: label.id)).to eq([])
          expect(original.label.reload.guild_posts.pluck(:id)).to contain_exactly(post.id, another_post.id)
        end
      end

      context "when it doesn't exist on original" do
        it "updates its skill" do
          post.labels << label
          expect(duplicate.label.guild_posts).to eq([post])

          original.merge_with!(duplicate: duplicate)

          expect(original.reload.label.guild_posts).to eq([post])
          expect(label.skill).to eq(original)
        end
      end
    end
  end
end
