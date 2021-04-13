# frozen_string_literal: true

module Applications
  class FlexibleInvoice < ApplicationService
    attr_reader :application

    def initialize(application:)
      super()
      @application = application
    end

    def call
      Users::AddInvoiceItem.call(
        user: application.project.user,
        unit_amount: application.invoice_rate,
        quantity: (application.monthly_limit / 2.0).ceil,
        description: "50% of monthly limit + #{application.specialist.account.name}"
      )
    end
  end
end
