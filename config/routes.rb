Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  post "/data" => "us_census#show"
  get "/" => "us_census#index"
end
