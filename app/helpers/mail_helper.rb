module MailHelper
  include MagicLinkHelper

  def specialist_unsubscribe_url(specialist)
    "#{root_host}/unsubscribe?Specialist%20ID=#{specialist.uid}&field66878840=#{specialist.account.email}"
  end

  def specialist_update_skills_url(specialist)
    "#{root_host}/update-skills?sid=#{specialist.uid}&skill=#{ERB::Util.url_encode(specialist.skills.pluck(:name).join(', '))}"
  end

  def specialist_project_application_url(specialist, project)
    "#{app_host}/opportunities/#{project.uid}?utm_campaign=#{project.uid}"
  end

  def time_in_zone(timestamp, zone, format = "%d %B, %I:%M%P %Z")
    timestamp.in_time_zone(zone).strftime(format)
  end

  def set_password_url
    "#{app_host}/set_password"
  end

  private

  def root_host
    'https://advisable.com'
  end

  def app_host
    if ENV.key?("HEROKU_APP_NAME")
      "https://#{ENV["HEROKU_APP_NAME"]}.herokuapp.com"
    elsif Rails.env.production?
      'https://app.advisable.com'
    else
      ActionMailer::Base.default_url_options[:host]
    end
  end
end
