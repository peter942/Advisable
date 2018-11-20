class Types::MutationType < GraphQL::Schema::Object
  field :create_offer, mutation: Mutations::CreateOffer
  field :create_proposal, mutation: Mutations::CreateProposal
  field :update_proposal, mutation: Mutations::UpdateProposal

  field :accept_booking, mutation: Mutations::AcceptBooking
  field :decline_booking, mutation: Mutations::DeclineBooking
  field :update_application_status, mutation: Mutations::UpdateApplicationStatus
  field :request_introduction, mutation: Mutations::RequestIntroduction
  field :accept_interview_request, mutation: Mutations::AcceptInterviewRequest

  field :reject_proposal, mutation: Mutations::RejectProposal
  field :reject_application, mutation: Mutations::RejectApplication

  field :update_availability, mutation: Mutations::UpdateAvailability

  field :create_payment, mutation: Mutations::CreatePayment

  field :update_project, mutation: Mutations::UpdateProject
end
