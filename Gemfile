source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "~> 2.7.2"

gem "rails", "~> 6.1"
gem "pg", ">= 0.18", "< 2.0"
gem "strong_migrations"
gem "good_migrations"
gem "pghero"
gem "logidze", ">= 1.0.0"
gem "fx"
gem "puma", ">= 5.2.1"
gem "puma_worker_killer"
gem "barnes"
gem "sass-rails", ">= 6"
gem "administrate"
gem "faraday"
gem "memoist"
gem "sidekiq", "< 7"
gem "rack-attack"
gem "bcrypt"
gem "countries"
gem "geocoder"
gem "money"
gem "sentry-raven"
gem "webpacker", "~> 5.1"
gem "slim"
gem "bootsnap", require: false

gem "omniauth"
gem "omniauth-google-oauth2"
gem "omniauth-rails_csrf_protection"

gem "airrecord", "~> 1.0.5"

gem "graphql"
gem "parser"
gem "stripe", "~> 5.14"
gem "attr_encrypted", "~> 3.1.0"

gem "pundit"
gem "nanoid"

gem "aws-sdk-s3", "~> 1"
gem "image_processing"
gem "faker"
gem "twilio-ruby"
gem "graphql_playground-rails"

# Guild
gem "jsonb_accessor", "~> 1.1.0"
gem "acts-as-taggable-on"
gem "email_reply_parser"
gem "administrate-field-active_storage"

gem "pry"
gem "pry-rails"
gem "pry-doc"
gem "pry-byebug", ">= 3.9.0"

group :development, :test do
  gem "dotenv-rails"
  gem "factory_bot_rails"
  gem "cypress-on-rails", "~> 1.0"
  gem "database_cleaner-active_record"
end

group :development do
  gem "web-console", ">= 3.3.0"
  gem "listen", "~> 3.2"
  gem "graphql-rails_logger"
  gem "rubocop", require: false
  gem "rubocop-rails", require: false
  gem "rubocop-performance", require: false
  gem "rubocop-rspec", require: false
  gem "annotate"
  gem "foreman"
  gem "guard"
  gem "guard-rspec", require: false
  gem "letter_opener"
  gem "brakeman"
end

group :test do
  gem "capybara"
  gem "timecop"
  gem "selenium-webdriver"
  gem "webdrivers"
  gem "shoulda-matchers"
  gem "webmock"
  gem "rspec-rails", "~> 4.0.0"
  gem "rspec-github", require: false
  gem "rspec-retry"
  gem "rspec_junit_formatter"
  gem "simplecov", require: false
end
