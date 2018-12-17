# Class for syncing airtable client contacts to our local users table
class Airtable::ClientContact < Airtable::Base
  self.table_name = 'Client Contacts'

  sync_with ::User
  sync_columns :first_name, :last_name

  sync_data do |user|
    # currently the company name is a lookup type in airtable which
    # gets returned as an array.
    company_name = fields['Company Name']
    if company_name.is_a?(Array)
      user.company_name = company_name.try(:first)
    else
      user.company_name = company_name
    end

    # Sync the client contact to client relationship
    client_id = fields['Client'].try(:first)
    if client_id
      client = ::Client.find_by_airtable_id(client_id)
      client = Airtable::Client.find(client_id).sync if client.nil?

      unless user.clients.include?(client)
        user.clients << client
      end
    end
  end
end
