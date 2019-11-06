InfoVisLanguages::Application::US_CENSUS_KEY = ENV['US_CENSUS_KEY']

InfoVisLanguages::Application::VERIFY_SSL = false

if Rails.env.development?
	InfoVisLanguages::Application::US_CENSUS_BASE_URL = "https://api.census.gov/".freeze
elsif Rails.env.test?
	InfoVisLanguages::Application::US_CENSUS_BASE_URL = "https://api.census.gov/".freeze
elsif Rails.env.staging?
	InfoVisLanguages::Application::US_CENSUS_BASE_URL = "https://api.census.gov/".freeze
else
	InfoVisLanguages::Application::US_CENSUS_BASE_URL = "https://api.census.gov/".freeze
end