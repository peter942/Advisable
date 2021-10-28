# frozen_string_literal: true
require "administrate/field/base"

class TextArrayField < Administrate::Field::Base
  def max
    options.fetch(:max, nil)
  end
end
