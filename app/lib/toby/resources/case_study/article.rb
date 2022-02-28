# frozen_string_literal: true

module Toby
  module Resources
    module CaseStudy
      class Article < BaseResource
        model_name ::CaseStudy::Article
        attribute :uid, Attributes::String, readonly: true
        attribute :title, Attributes::String
        attribute :slug, Attributes::String
        attribute :specialist, Attributes::BelongsTo
        attribute :specialist_name, Lookups::CaseStudy::Articles::SpecialistName
        attribute :primary_skill, Lookups::CaseStudy::Articles::PrimarySkill
        attribute :skills, Attributes::HasMany
        attribute :score, Attributes::Integer
        attribute :hide_from_search, Attributes::Boolean
        attribute :published_at, Attributes::DateTime
        attribute :deleted_at, Attributes::DateTime

        def self.label(record, _context)
          record.title
        end

        def self.search(query)
          ::CaseStudy::Article.where("title ILIKE ?", "%#{query}%")
        end
      end
    end
  end
end
