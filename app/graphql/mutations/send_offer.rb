class Mutations::SendOffer < Mutations::BaseMutation
  argument :id, ID, required: true

  field :booking, Types::Booking, null: true
  field :errors, [String], null: false

  def resolve(**args)
    booking = find_booking(args[:id])

    unless booking.status.blank? || booking.status == "Proposed"
      raise GraphQL::ExecutionError, "Can't send offer, booking record already has a status of #{booking.status}"
    end

    update_airtable_record(booking)
    update_application_status(booking.application)
    booking.update_attributes(status: "Offered")

    Webhook.process(booking)

    return {
      booking: booking,
      errors: booking.errors.full_messages
    }
  end

  private

  def find_booking(id)
    @booking ||= Booking.find_by_airtable_id(id)
  end

  def update_application_status(application)
    airtable_record = Airtable::Application.find(application.airtable_id)
    airtable_record["Application Status"] = 'Offered'
    airtable_record.save
    application.update_attributes(status: 'Offered')
  end

  def update_airtable_record(booking)
    record = Airtable::Booking.find(booking.airtable_id)
    record["Status"] = "Offered"
    record.save
  end
end
