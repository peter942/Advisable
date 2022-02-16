# frozen_string_literal: true

class AddReferencesToPaymentRequests < ActiveRecord::Migration[7.0]
  def change
    add_reference :payments, :payment_request, foreign_key: true
    add_reference :payouts, :payment_request, foreign_key: true
  end
end
