class CreateGuildReactions < ActiveRecord::Migration[6.0]
  def change
    def change
      create_table :guild_reactions, id: :uuid do |t|
        t.string :name
        t.references :reactionable, polymorphic: true, type: :uuid
        t.references :user, foreign_key: {on_delete: :cascade}
        t.integer :status, null: false, default: 0
        t.jsonb :data
        t.timestamps
      end

      # add_index :reactions, [:reactionable_type, :reactionable_id]
    end
  end
end
