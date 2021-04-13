# frozen_string_literal: true

class SalesPerson < ApplicationRecord
  include Uid
  include Airtable::Syncable
  include Resizable

  has_many :companies, dependent: :nullify

  has_one_attached :image
  resize image: {resize_to_limit: [400, 400]}

  def name
    "#{first_name} #{last_name}"
  end

  def email_with_name
    %("#{name}" <#{email}>)
  end
end

# == Schema Information
#
# Table name: sales_people
#
#  id            :bigint           not null, primary key
#  active        :boolean
#  calendly_url  :string
#  email         :string
#  first_name    :string
#  last_name     :string
#  out_of_office :boolean
#  slack         :string
#  uid           :string
#  username      :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  airtable_id   :string
#  asana_id      :string
#
