# frozen_string_literal: true

# Users and specialists have a completed_tutorials attribute which tracks the
# various product tutorials that they have complete.
module Tutorials
  extend ActiveSupport::Concern

  class_methods do
    attr_accessor :tutorials

    def register_tutorials(*tutorials)
      @tutorials ||= []
      @tutorials += tutorials.map(&:to_s)
    end
  end

  included do
    validate :valid_tutorials, if: :account

    def completed_tutorials=(tutorials)
      account[:completed_tutorials] = tutorials.reject(&:empty?)
    end

    # returns the array of completed tutorials
    def completed_tutorials
      account[:completed_tutorials] || []
    end

    # Adds a given tutorial to the completed_tutorials array
    def complete_tutorial(tutorial)
      return true if completed_tutorials.include?(tutorial)

      account.update(completed_tutorials: completed_tutorials + [tutorial])
    end

    def has_completed_tutorial?(tutorial)
      completed_tutorials.include?(tutorial)
    end

    private

    def valid_tutorials
      completed_tutorials.each do |tutorial|
        next if self.class.tutorials.include?(tutorial)

        errors.add(
          :completed_tutorials,
          "#{tutorial} is not a registered tutorial"
        )
      end
    end
  end
end
