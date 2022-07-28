# frozen_string_literal: true

class AddColorToSkills < ActiveRecord::Migration[7.0]
  def change
    add_column :skills, :color, :string
  end
end
