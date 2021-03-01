# frozen_string_literal: true

module Toby
  class Schema < GraphQL::Schema
    query Toby::Types::QueryType
    mutation Toby::Types::MutationType
    lazy_resolve(Toby::Lazy::Base, :resolve)
    lazy_resolve(Toby::Lazy::Single, :resolve)
    lazy_resolve(Toby::Lazy::Through, :resolve)
  end
end
