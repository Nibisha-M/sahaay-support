# config/deploy/production.rb
server "app.sahaay-kerala.org", user: "deploy", roles: %w{app db web}, primary: true

set :rails_env, "production"
set :ssh_options, {
  keys: %w(~/.ssh/sahaay_production.pem),
  forward_agent: true,
  auth_methods: %w(publickey)
}
