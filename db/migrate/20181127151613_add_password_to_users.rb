class AddPasswordToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :password_digest, :string
    add_column :users, :email, :string, index: true
  end
end
