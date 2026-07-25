# Gemfile
source "https://rubygems.org"
git_source(:github) { |repo_name| "https://github.com/#{repo_name}.git" }

ruby "3.3.0"

gem "rails", "~> 7.1.3"
gem "pg", "~> 1.5"
gem "pgvector", "~> 0.2.1"
gem "puma", "~> 6.4"

# Hotwire ecosystem for zero-bloat reactive UI
gem "turbo-rails", "~> 2.0"
gem "stimulus-rails", "~> 1.3"

# Utilities & JSON
gem "bootsnap", require: false
gem "jbuilder", "~> 2.11"

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
  gem "rspec-rails", "~> 6.1"
  gem "capistrano", "~> 3.18", require: false
  gem "capistrano-rails", "~> 1.6", require: false
  gem "capistrano-rvm", require: false
end
