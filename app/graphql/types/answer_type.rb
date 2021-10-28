# frozen_string_literal: true
class Types::AnswerType < Types::BaseType
  field :id, ID, null: false
  field :content, String, null: false
  field :question, Types::QuestionType, null: false

  def id
    object.uid
  end
end
