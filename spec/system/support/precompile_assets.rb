# frozen_string_literal: true

# Precompile assets before running tests to avoid timeouts.
# Do not precompile if webpack-dev-server is running (NOTE: MUST be launched with RAILS_ENV=test)
RSpec.configure do |config|
  config.before(:suite) do
    examples = RSpec.world.filtered_examples.values.flatten
    has_no_system_tests = examples.none? { |example| example.metadata[:type] == :system }

    if has_no_system_tests
      $stdout.puts "\n🚀️️  No system test selected. Skip assets compilation.\n"
      next
    end
  end
end
