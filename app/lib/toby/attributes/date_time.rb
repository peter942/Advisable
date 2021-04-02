# frozen_string_literal: true

module Toby
  module Attributes
    class DateTime < BaseAttribute
      filter :is, Filters::DateEquals
      filter :is_after, Filters::DateAfter
      filter :is_before, Filters::DateBefore
      filter :is_empty, Filters::CheckNil
      filter :not_empty, Filters::CheckNotNil

      def type
        GraphQL::Types::ISO8601DateTime
      end

      def input_type
        GraphQL::Types::ISO8601DateTime
      end
    end
  end
end
