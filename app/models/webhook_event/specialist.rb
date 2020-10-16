class WebhookEvent::Specialist
  def self.data(specialist)
    {
      uid: specialist.uid,
      airtable_id: specialist.airtable_id,
      first_name: specialist.account.first_name,
      last_name: specialist.account.last_name,
      has_account: specialist.account.has_password?, # TODO: AccountMigration - Rename for consistency
      application_stage: specialist.application_stage,
    }
  end
end
