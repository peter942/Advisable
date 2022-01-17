# frozen_string_literal: true

module Types
  module MessageInterface
    include Types::BaseInterface

    description "Fields that are common for all message types"

    field :id, ID, null: false, method: :uid
    field :content, String, null: true
    field :conversation, Types::Conversation, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :attachments, [Types::AttachmentType], null: true

    orphan_types Types::UserMessage, Types::SystemMessage, Types::GuildPostMessage, Types::Messages::InterviewScheduled

    definition_methods do
      def resolve_type(object, _)
        if object.kind == "interviewScheduled"
          Types::Messages::InterviewScheduled
        elsif object.system_message?
          Types::SystemMessage
        elsif object.agreement_id
          Types::AgreementMessage
        elsif object.guild_post_id
          Types::GuildPostMessage
        elsif object.consultation_id
          Types::ConsultationRequestMessage
        else
          Types::UserMessage
        end
      end
    end
  end
end
