class GeneralLookups
  def self.languages(params={})
    query = params != {} ? params : {
    	"get": "EST,LANLABEL,NAME",
    	"for": "us:*",
    	"LAN": "625"
    }

    # cache_key = "languages_" + query.to_s
    # Services::Caching.smart_fetch(cache_key, :expires_in => 60.minutes) do
        getstring = "data/2013/language"
        languages = Services::UsCensusService.get(getstring, query)
    # end

  end

end