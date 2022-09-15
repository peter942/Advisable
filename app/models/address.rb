# frozen_string_literal: true

class Address
  attr_accessor :line1, :line2, :city, :state, :country, :postcode

  def initialize(address)
    @line1 = address["line1"]
    @line2 = address["line2"]
    @city = address["city"]
    @state = address["state"]
    @country = address["country"]
    @postcode = address["postcode"]
  end

  def to_s
    output = "#{line1},"
    output += "\n#{line2}," if line2.present?
    output += "\n#{city},"
    output += "\n#{state},"
    output += "\n#{country},"
    output += "\n#{postcode.try(:blank?) ? "N/A" : postcode}"
    output
  end

  def to_h
    {
      "line1" => line1,
      "line2" => line2,
      "city" => city,
      "state" => state,
      "country" => country,
      "postcode" => postcode
    }
  end

  def self.parse(address)
    parts = address.split(",").map(&:squish)
    has_line2 = parts.length == 6

    new(
      {
        "line1" => parts[0],
        "line2" => has_line2 ? parts[1] : nil,
        "city" => parts[has_line2 ? 2 : 1],
        "state" => parts[has_line2 ? 3 : 2],
        "country" => parts[has_line2 ? 4 : 3],
        "postcode" => parts[has_line2 ? 5 : 4]
      }
    )
  end
end
