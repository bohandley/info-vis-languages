class UsCensusController < ApplicationController
  def index
  end

  def show
    data = GeneralLookups.languages(us_census_params)
    render json: data
  end

  private
  	def us_census_params
  		params.require(:us_censu).permit(:for, :in, :get, :LAN39, :LAN7, :LAN)
  	end
end