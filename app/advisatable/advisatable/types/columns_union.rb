class Advisatable::Types::ColumnsUnion < GraphQL::Schema::Union
  possible_types(*Advisatable::Columns.column_classes.map(&:column_type))

  def self.resolve_type(object, context)
    object.class.column_type
  end
end
