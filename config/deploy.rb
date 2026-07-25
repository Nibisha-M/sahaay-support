# config/deploy.rb
lock "~> 3.18.0"

set :application, "sahaay_recovery"
set :repo_url, "git@github.com:hackathon-team/sahaay.git"
set :branch, "main"

# Deploy Directory on Primary Production Host
set :deploy_to, "/var/www/sahaay"

# Append files/dirs for Rails persistence
append :linked_files, "config/database.yml", "config/master.key"
append :linked_dirs, "log", "tmp/pids", "tmp/sockets", "tmp/cache", "public/uploads"

set :keep_releases, 5
set :rvm_ruby_version, "3.3.0"

namespace :deploy do
  desc "Restart Application Puma Server"
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :touch, release_path.join("tmp/restart.txt")
    end
  end
end

after "deploy:publishing", "deploy:restart"
