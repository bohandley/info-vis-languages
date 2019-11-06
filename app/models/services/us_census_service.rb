class Services::UsCensusService
  def self.get(resource, query = {})
    url = InfoVisLanguages::Application::US_CENSUS_BASE_URL + resource
    r = HTTParty.get(
    	url,
			query: query.merge(auth_hash),
			verify: InfoVisLanguages::Application::VERIFY_SSL
		)
    r.parsed_response
  rescue URI::InvalidURIError
    ''
  end

  private_class_method

  def self.auth_hash
    { 'key' => InfoVisLanguages::Application::US_CENSUS_KEY }
  end
end
