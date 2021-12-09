# frozen_string_literal: true

module Types
  module AccountInterface
    include Types::BaseInterface

    description "Fields that are common for all types that have an account"

    field :account, Types::Account, null: false
    def account
      dataloader.with(::ActiveRecordSource, ::Account).load(object.account_id)
    end

    field :first_name, String, null: true
    field :last_name, String, null: true
    field :name, String, null: true
    field :features, [String], null: true
    delegate :name, :first_name, :last_name, :features, to: :account

    field :avatar, String, null: true
    def avatar
      account.cached_avatar_url
    end

    field :needs_to_set_a_password, Boolean, null: true
    def needs_to_set_a_password
      account.auth_providers.none? && account.password_digest.blank?
    end

    field :confirmed, Boolean, null: false
    def confirmed
      account.confirmed_at.present?
    end

    field :unread_notifications, Boolean, null: false
    def unread_notifications
      account.unread_notifications?
    end

    field :conversation, Types::Conversation, null: true
    def conversation
      Conversation.find_existing_with([current_user.account, object.account])
    end
  end
end
