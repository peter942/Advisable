# frozen_string_literal: true

require "csv"

module Toby
  module Mutations
    class GetCsv < GraphQL::Schema::Mutation
      include Helpers::Filter

      argument :resource, String, required: true
      argument :sort_by, String, required: false
      argument :sort_order, String, required: false
      argument :filters, [Types::FilterInput], required: false

      field :csv, Types::CsvType, null: false

      def resolve(resource:, filters: [], sort_by: "created_at", sort_order: "ASC")
        resource = resource_from(resource)
        records = resource.model.all.order(sort_by => sort_order)
        records = apply_filters(records, resource, filters)
        csv = CSV.generate(headers: true) do |rows|
          rows << resource.attributes.map(&:name)
          records.each do |record|
            rows << resource.attributes.map do |attribute|
              if attribute.respond_to?(:lazy_read_class)
                lazy = attribute.lazy_read_class.new(attribute, {}, record)
                lazy_resource = "Toby::Resources::#{lazy.lazy_model}".constantize
                rec = lazy.resolve
                if attribute.is_a?(Toby::Lookups::Lookup)
                  rec
                elsif rec.is_a?(Array)
                  rec.map { |r| lazy_resource.label(r, {}).resolve }
                elsif rec.present?
                  lazy_resource.label(rec, {}).resolve
                end
              else
                attribute.read(record)
              end
            end
          end
        end

        {csv: Struct.new(:content).new(Base64.encode64(csv))}
      end

      private

      # Handles simple stuff like Specialist =>Toby::Resources::Specialist
      # and also complex like CaseStudyArticle => Toby::Resources::CaseStudy::Article
      def resource_from(name, prefix = "")
        class_prefix = prefix.present? ? "#{prefix}::" : ""
        "Toby::Resources::#{class_prefix}#{name}".constantize
      rescue NameError
        split = name.split(/(?=[A-Z])/, 2)
        resource_from(split.last, prefix + split.first)
      end
    end
  end
end
