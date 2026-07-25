# Sahaay Support (സഹായം) - Step-by-Step Deployment Guide

This guide provides clear, step-by-step deployment instructions to deploy **Sahaay Support** to production.

---

## 🚀 Option 1: Quick One-Click Deployment on Render / Railway (Recommended for Demos & Hackathons)

Render and Railway provide zero-configuration Node.js deployment with free SSL certificates and continuous deployment from GitHub.

### Step-by-Step Instructions for Render:

1. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Sahaay Support Platform"
   git remote add origin https://github.com/your-username/sahaay-recovery.git
   git push -u origin main
   ```

2. **Create New Web Service on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** -> **Web Service**.
   - Connect your GitHub repository `sahaay-recovery`.

3. **Configure Settings**:
   - **Name**: `sahaay-support`
   - **Environment**: `Node`
   - **Build Command**: `npm install` (or leave empty as `server.js` uses standard Node modules)
   - **Start Command**: `node server.js`
   - **Port**: Set `PORT` environment variable to `10000` (Render detects this automatically).

4. **Environment Variables** (Optional):
   - Add key `GEMINI_API_KEY` with your Google Gemini API key if you want live multi-modal AI speech transcription.

5. **Deploy**:
   - Click **Create Web Service**. Your live production app will be accessible at `https://sahaay-support.onrender.com`.

---

## ⚡ Option 2: Deploying to Vercel or Netlify

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Command Line**:
   ```bash
   vercel --prod
   ```

3. Configure static static output directory to `public/`.

---

## 🐘 Option 3: Production Deployment on Ruby on Rails host (Puma + PostgreSQL + Capistrano)

If deploying the full Ruby on Rails application (`db/schema.rb`, `app/models`, `app/services`):

### 1. Enable PostgreSQL with `pgvector` Extension:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo apt-get install postgresql-16-pgvector
```

### 2. Configure Environment Credentials (`config/master.key` & `ENV`):
```bash
export DATABASE_URL="postgres://deploy_user:secure_password@localhost:5432/sahaay_production"
export GEMINI_API_KEY="your_gemini_api_key"
export RAILS_MASTER_KEY="your_rails_master_key"
```

### 3. Run Pre-Flight Deployment Check:
```bash
bundle exec cap production deploy:check
```

### 4. Execute Zero-Downtime Production Deployment:
```bash
bundle exec cap production deploy
```

---

## 📞 Critical Production Helplines Configured in Sahaay
- **DISHA Tele-Helpline**: `1056` (Kerala 24x7 Toll-Free Health Helpline)
- **Vimukthi Excise Control Room**: `155300` (State Excise Anti-Narcotics Mission)
- **National NMBA Helpline**: `14446`
