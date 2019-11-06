class UsCensusController < ApplicationController
  def index
  end

  def show
    params = params ? params : {}
    data = GeneralLookups.languages(params)
    render json: data
  end
end