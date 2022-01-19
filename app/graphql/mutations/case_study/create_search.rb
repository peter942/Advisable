# frozen_string_literal: true

module Mutations
  module CaseStudy
    class CreateSearch < Mutations::BaseMutation
      description "Create a Case Study Search as the current User."
      graphql_name "CreateCaseStudySearch"

      argument :articles, [ID], required: false
      argument :business_type, String, required: false
      argument :categories, [ID], required: true
      argument :goals, [String], required: false
      argument :name, String, required: false
      argument :preferences, [String], required: false

      field :search, Types::CaseStudy::Search, null: false

      def authorized?(**_args)
        requires_client!
      end

      def resolve(**args)
        search = current_account_responsible_for do
          selected = ::CaseStudy::Article.where(uid: args[:articles]).pluck(:id)

          search = ::CaseStudy::Search.create!(
            user: current_user,
            name: args[:name],
            goals: args[:goals],
            preferences: args[:preferences],
            business_type: args[:business_type],
            selected:,
            results: selected
          )

          skill_ids = ::CaseStudy::Skill.where(article_id: selected).distinct.pluck(:skill_id)
          skill_category_ids = ::SkillCategory.where(slug: args[:categories]).pluck(:id)
          ::SkillCategorySkill.where(skill_id: skill_ids, skill_category_id: skill_category_ids).each do |scs|
            ::CaseStudy::Skill.create!(search:, skill_id: scs.skill_id)
          end

          search.refresh_results!
          search
        end

        {search:}
      end
    end
  end
end
