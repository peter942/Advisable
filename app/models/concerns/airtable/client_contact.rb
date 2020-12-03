# Class for syncing airtable client contacts to our local users table
class Airtable::ClientContact < Airtable::Base
  self.table_name = 'Client Contacts'

  sync_with ::User

  sync_column_to_association 'Email Address', association: :account, to: :email, strip: true
  sync_column_to_association 'First Name', association: :account, to: :first_name, strip: true
  sync_column_to_association 'Last Name', association: :account, to: :last_name, strip: true
  sync_column_to_association 'VAT Number', association: :account, to: :vat_number, strip: true
  sync_column_to_association 'Type of Company', association: :company, to: :kind, strip: true
  sync_column_to_association 'Project Payment Method', association: :company, to: :project_payment_method, strip: true
  sync_column_to_association 'Invoice Name', association: :company, to: :invoice_name, strip: true
  sync_column_to_association 'Invoice Company Name', association: :company, to: :invoice_company_name, strip: true

  sync_column 'Title', to: :title
  sync_column 'Exceptional Project Payment Terms', to: :exceptional_project_payment_terms
  sync_column 'Type of Company', to: :company_type
  sync_column 'Campaign Name', to: :campaign_name
  sync_column 'Campaign Source', to: :campaign_source
  sync_column 'Contact Status', to: :contact_status
  sync_column 'Campaign Medium', to: :campaign_medium
  sync_column 'PID', to: :pid
  sync_column 'RID', to: :rid
  sync_column 'fid', to: :fid
  sync_column 'gclid', to: :gclid
  sync_column 'Same City Importance', to: :locality_importance
  sync_association 'Industry', to: :industry
  sync_association 'Owner', to: :sales_person

  sync_data do |user|
    if self['Address']
      # sync the address
      user.company.address = Address.parse(self['Address']).to_h
    end

    user.company_name = self['Company Name'].try(:first)

    # if there is a client_id and it is not already synced then sync it.
    client_id = fields['Client'].try(:first)

    if client_id && user.client.try(:airtable_id) != client_id
      client = ::Client.find_by_airtable_id(client_id)
      client = Airtable::Client.find(client_id).sync if client.nil?
      user.client = client
    end

    if fields['Test Account'].try(:include?, 'Yes')
      user.account.test_account = true
    end

    sync_budget(user)
  end

  def sync_budget(user)
    amount = self['Estimated Annual Freelancer Spend (USD)']
    return if amount.nil?

    user.budget = amount * 100
  end

  # After the syncing process has been complete
  after_sync do |user|
    if user.account.blank?
      user.destroy
      break
    end
  end

  push_data do |user|
    self['UID'] = user.uid
    self['Email Address'] = user.account.email
    self['First Name'] = user.account.first_name
    self['Last Name'] = user.account.last_name
    self['Country'] = [user.country.airtable_id] if user.country.present?
    self['Project Payment Method'] = user.company.project_payment_method
    self['Exceptional Project Payment Terms'] =
      user.exceptional_project_payment_terms
    self['Invoice Name'] = user.company.invoice_name
    self['Invoice Company Name'] = user.company.invoice_company_name
    self['VAT Number'] = user.account.vat_number
    self['Industry'] = [user.industry.try(:airtable_id)].compact
    self['Type of Company'] = user.company_type

    self['PID'] = user.pid
    self['Campaign Name'] = user.campaign_name
    self['Campaign Source'] = user.campaign_source
    self['Campaign Medium'] = user.campaign_medium
    self['RID'] = user.rid
    self['gclid'] = user.gclid
    self['fid'] = user.fid
    self['City'] = user.company.address.try(:[], 'city')
    self['Application Reminder At'] = user.application_reminder_at
    self['Contact Status'] = user.contact_status
    self['Same City Importance'] = user.locality_importance
    self['Address'] = Address.new(user.company.address).to_s if user.company.address.present?
    self['Skills Interested In'] = user.skills.map(&:airtable_id).compact.uniq
    self['Application Accepted Timestamp'] = user.application_accepted_at
    self['Application Rejected Timestamp'] = user.application_rejected_at
    self['How many freelancers do you plan on hiring over the next 6 months?'] =
      user.number_of_freelancers

    if user.budget
      self['Estimated Annual Freelancer Spend (USD)'] = user.budget / 100.0
    end
  end
end
