# frozen_string_literal: true

module Toby
  module Filters
    class Includes
      def self.apply(records, attribute, value: [], **_opts)
        return records if value.empty?

        reflection = attribute.reflection

        if attribute.is_a?(Toby::Attributes::HasManyThrough)
          through = reflection.options[:through]
          association_id = reflection.source_reflection.association_primary_key
          records.includes(through => reflection.source_reflection.name).where(through => {reflection.name => {association_id => value}})
        else
          records.joins(attribute.name).where(attribute.name => {reflection.active_record_primary_key => value}).distinct
        end
      end
    end
  end
end
