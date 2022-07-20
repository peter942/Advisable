# frozen_string_literal: true

require "open-uri"

module Airtable
  class CaseStudy < Airrecord::Table
    attr_reader :content_position

    self.base_key = ENV.fetch("AIRTABLE_DATABASE_KEY", nil)
    self.table_name = "Case Studies"

    has_many :insights, class: "Airtable::CaseStudyInsight", column: "Insights 2"

    def article_record
      ::CaseStudy::Article.find_or_create_by(airtable_id: id) do |article|
        article.specialist = ::Specialist.find_by!(airtable_id: fields["Specialist"].first)
        article.title = fields["Title"] # for slug
      end
    end

    def import!(testing: false)
      @content_position = 0

      if testing
        if ::Specialist.find_by(airtable_id: fields["Specialist"].first).nil?
          airspecialist = Airtable::Specialist.find(fields["Specialist"].first)
          existing = ::Account.find_by(email: airspecialist["Email Address"])
          existing&.update(email: "#{SecureRandom.hex}+#{existing.email}")
          airspecialist.sync
        end
        Airtable::SalesPerson.find(fields["Interviewer"].first).sync if ::SalesPerson.find_by(airtable_id: fields["Interviewer"].first).nil?

        Array(fields["Industry"]).each do |airtable_id|
          Airtable::Industry.find(airtable_id).sync if ::Industry.find_by(airtable_id:).nil?
        end

        Array(fields["Skills"]).each do |airtable_id|
          Airtable::Skill.find(airtable_id).sync if ::Skill.find_by(airtable_id:).nil?
        end
      end

      ActiveRecord::Base.transaction do
        article = ::CaseStudy::Article.find_or_initialize_by(airtable_id: id)

        article.specialist = ::Specialist.find_by!(airtable_id: fields["Specialist"].first)
        article.editor_url = fields["Case Study Editor Link"].first

        if fields["Interviewer"].present?
          sales_person = ::SalesPerson.find_by!(airtable_id: fields["Interviewer"])
          article.interviewer = Account.find_by(email: sales_person.email)
        end

        company = ::CaseStudy::Company.find_or_initialize_by(name: fields["Client Name"])
        company.business_type = fields["Company Focus"]
        company.website = fields["Client URL"]
        if fields["Client Logo"].present?
          url = URI.parse(fields["Client Logo"].first["url"])
          filename = File.basename(url.path)
          company.logo.attach(io: url.open, filename:)
        end
        company.save!
        CompanyFaviconFinderJob.perform_later(company)
        article.company = company

        article.sections = []

        background = article.sections.new(type: "background", position: 0)
        attach_heading(background, fields["Background Title"])
        attach_paragraph(background, fields["Background Text"])
        attach_images(background, Array(fields["Background Images"]))
        attach_links(background, Array(fields["Background Links"]))

        overview = article.sections.new(type: "overview", position: 1)
        attach_heading(overview, fields["Project Overview Title"])
        (1..7).each do |i|
          attach_heading(overview, fields["Step #{i} Title"], size: "h2")
          attach_paragraph(overview, fields["Step #{i} Details"])
          attach_images(overview, Array(fields["Step #{i} Images"]))
          attach_links(overview, Array(fields["Step #{i} Links"]))
        end

        outcome = article.sections.new(type: "outcome", position: 2)
        attach_heading(outcome, fields["Outcome Title"])
        attach_results(outcome, fields)
        attach_paragraph(outcome, fields["Outcome Text"])
        attach_images(outcome, Array(fields["Outcome Images"]))
        attach_links(outcome, Array(fields["Outcome Links"]))

        article.title = fields["Title"]
        article.subtitle = fields["Subtitle"]
        article.company_type = fields["Company Type"]
        article.freelancer_edits = fields["Freelancer Edits Required"]
        article.comment = fields["Advisable Comment"]
        article.editor_note = fields["Editor Note"]
        article.goals = fields["Goals"]
        article.score = fields["Score"]
        article.confidential = fields["Okay With Sharing"] != "Yes"
        article.targeting = fields["Additional Targeting Data"]
        article.published_at = Time.zone.now
        article.hide_from_search = fields["Hidden from Search"] == "Yes"
        article.save!

        attach_insights!(article)

        AttachCoverToArticleJob.perform_later(article)

        article.industries.destroy_all
        Array(fields["Industry"]).each do |airtable_id|
          industry = ::Industry.find_by!(airtable_id:)
          ::CaseStudy::Industry.find_or_create_by!(industry:, article:)
        end

        article.skills.destroy_all
        Array(fields["Skills"]).each do |airtable_id|
          skill = ::Skill.find_by!(airtable_id:)
          ::CaseStudy::Skill.find_or_create_by!(skill:, article:)
        end

        primary_skill = ::Skill.find_by!(airtable_id: fields["Primary Skill"].first)
        article.skills.find_by(skill: primary_skill).update!(primary: true)
        article
      end
    end

    private

    def attach_heading(section, field, size: "h1")
      return if field.blank?

      section.contents.new(type: "CaseStudy::HeadingContent", content: {size:, text: field}, position: content_position)
      increment_content_position
    end

    def attach_paragraph(section, field)
      return if field.blank?

      section.contents.new(type: "CaseStudy::ParagraphContent", content: {text: field}, position: content_position)
      increment_content_position
    end

    def attach_results(section, fields)
      results = []
      if fields["Key Result 1 Context"].present?
        1.upto(3).each { |i| results << {category: fields["Key Result #{i} Category"].strip, context: fields["Key Result #{i} Context"].strip, callout: fields["Key Result #{i} Callout"].strip} }
      else
        1.upto(3).each { |i| results << fields["Key Result #{i}"].strip }
      end
      section.contents.new(type: "CaseStudy::ResultsContent", content: {results:}, position: content_position)
      increment_content_position
    end

    def attach_links(section, field)
      return if field.blank?

      links = field.first.split("\n").compact_blank
      return if links.blank?

      section.contents.new(type: "CaseStudy::LinksContent", content: {links:}, position: content_position)
      increment_content_position
    end

    def attach_images(section, fields)
      return if fields.none?

      content = section.contents.new(type: "CaseStudy::ImagesContent", position: content_position)
      increment_content_position
      fields.each do |field|
        url = URI.parse(field["url"])
        filename = File.basename(url.path)
        content.images.attach(io: url.open, filename:)
      end
    end

    def increment_content_position
      @content_position += 1
    end

    def attach_insights!(article)
      insights.each do |air_insight|
        insight = article.insights.find_or_initialize_by(airtable_id: air_insight.id)
        insight.title = air_insight.fields["Insight Title"]
        insight.description = air_insight.fields["Insight Body"]
        insight.save!
      end
    end
  end
end
