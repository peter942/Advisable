# frozen_string_literal: true

class AuthProvidersController < ApplicationController
  PROVIDERS = %i[linkedin google_oauth2 google_oauth2_calendar].freeze

  def create
    provider = params[:provider].to_sym
    raise ActionController::RoutingError, "Unknown provider" if PROVIDERS.exclude?(provider)

    public_send(provider)
  end

  def failure
    if params[:origin].present? && params["message"] == "user_cancelled_login"
      uri = URI.parse(params[:origin])
      params = URI.decode_www_form(uri.query || "") << ["authorization_failed", "Authorization failed. Please try again."]
      uri.query = URI.encode_www_form(params.to_h)
    else
      Sentry.capture_message("Something went wrong when authorizing with oauth.", level: "debug")
      uri = "/"
    end

    redirect_to uri.to_s
  end

  def linkedin
    omniauth = {
      uid: auth_hash.uid,
      provider: "linkedin",
      name: auth_hash.info.name,
      first_name: auth_hash.info.first_name,
      last_name: auth_hash.info.last_name,
      image: auth_hash.info.picture_url
    }

    session[:omniauth] = omniauth
    redirect_to request.env["omniauth.origin"]
  end

  def google_oauth2
    account = Account.find_or_create_by(email: oauth.email) do |acc|
      acc.password = SecureRandom.hex
    end
    # I need to know whether to create User or Specialist here

    auth_provider = account.auth_providers.find_or_initialize_by(provider: "google_oauth2")
    auth_provider.update!(oauth.identifiers_with_blob_and_token)
    session_manager.start_session(account)

    redirect_to "/"
  end

  def google_oauth2_calendar
    account = Account.find_by!(email: oauth.email)
    auth_provider = account.auth_providers.find_or_initialize_by(provider: "google_oauth2_calendar")
    auth_provider.update!(oauth.identifiers_with_blob_and_token)
    session_manager.start_session(account)

    redirect_to "/"
  rescue ActiveRecord::RecordNotFound
    flash[:notice] = "No account with that email found, please sign up."
    redirect_to "/login/signup"
  end

  private

  def oauth
    @oauth ||= Oauth.new(request.env["omniauth.auth"])
  end

  def auth_hash
    request.env["omniauth.auth"]
  end
end
