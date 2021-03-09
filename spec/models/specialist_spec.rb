# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Specialist do
  include_examples "uid"

  it { is_expected.to have_many(:applications) }
  it { is_expected.to have_many(:skills).through(:specialist_skills) }

  describe "#has_setup_payments" do
    it 'returns false if there is no bank_holder_name' do
      specialist = build(:specialist, bank_holder_name: nil)
      expect(specialist.has_setup_payments).to be_falsey
    end

    it 'returns false if there is no bank_holder_address' do
      specialist = build(:specialist, bank_holder_address: nil)
      expect(specialist.has_setup_payments).to be_falsey
    end

    it 'returns false if there is no bank_currency' do
      specialist = build(:specialist, bank_currency: nil)
      expect(specialist.has_setup_payments).to be_falsey
    end

    it 'returns true if they have provided all payment info' do
      specialist = build(:specialist, {
        bank_currency: "EUR",
        bank_holder_name: "Test Account",
        bank_holder_address: {
          "line1" => "line1",
          "line2" => "line2",
          "city" => "city",
          "state" => "state",
          "country" => "country",
          "postcode" => "postcode"
        }
      })
      expect(specialist.has_setup_payments).to be_truthy
    end
  end

  context "when guild" do
    let(:specialist) { create(:specialist) }

    describe "guild_joined_callbacks" do
      it "sets a date when a specialist joins the guild" do
        expect do
          specialist.update!(guild: true)
          specialist.reload
        end.to change(specialist, :guild_joined_date)
      end

      it "does not overwrite the original date" do
        specialist.update!(guild: true)
        expect do
          specialist.update!(guild: false)
        end.not_to change(specialist.reload, :guild_joined_date)
      end

      it "adds guild followables" do
        specialist.update!(guild: true)
        expect(GuildAddFollowablesJob).to have_been_enqueued.with(specialist.id)
      end
    end

    describe "guild_featured_member_at" do
      subject(:guild_feature_members) do
        described_class.guild_featured_members
      end

      let!(:spe_featured) { create(:specialist, :guild, guild_featured_member_at: Time.current) }
      let(:spe_not_featured) { create(:specialist, :guild) }
      let(:spe_non_guild) { create(:specialist) }

      it "only includes guild members who have the respective datetime" do
        expect(guild_feature_members.count).to eq(1)
        expect(guild_feature_members).to include(spe_featured)
      end
    end
  end

  describe "application stages" do
    let!(:specialist) { create(:specialist) }

    it "validates it" do
      update = specialist.update(application_stage: "NOT A VALID STATE")
      expect(update).to be_falsey
      expect(specialist.errors).to be_added(:application_stage, :inclusion, value: "NOT A VALID STATE")
    end
  end
end
