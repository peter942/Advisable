# frozen_string_literal: true

require "rails_helper"

RSpec.describe CaseStudy::LinksContent, type: :model do
  let(:links) { build(:case_study_links_content) }

  it "has a valid factory" do
    expect(links).to be_valid
  end
end
