# frozen_string_literal: true

module Mutations
  class CreatePreviousProjectImage < Mutations::BaseMutation
    argument :id, String, required: false
    argument :previous_project, ID, required: true
    argument :attachment, String, required: true
    argument :position, Int, required: false
    argument :cover, Boolean, required: false

    field :image, Types::PreviousProjectImage, null: true

    def authorized?(previous_project:, **_args)
      requires_specialist!
      project = PreviousProject.find_by_uid(previous_project)
      policy = PreviousProjectPolicy.new(current_user, project)
      policy.create_image?
    end

    def resolve(**args)
      project = PreviousProject.find_by_uid!(args[:previous_project])
      ppi = project.images.create(uid: args[:id], position: args[:position], cover: args[:cover])
      ppi.image.attach(args[:attachment])

      {image: ppi}
    end
  end
end
