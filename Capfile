# Capfile
# Load Capistrano framework tasks
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

# Load plugins for Rails & RVM
require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git

require "capistrano/rvm"
require "capistrano/bundler"
require "capistrano/rails/assets"
require "capistrano/rails/migrations"

# Load custom tasks from `lib/capistrano/tasks` if any exist
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| load r }
