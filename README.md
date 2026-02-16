# ROOTED - Agricultural Platform

A comprehensive platform connecting small-scale farmers with buyers and facilitating food donations to communities in need.

## Features

- **Farmer Dashboard**: Crop management, scheduling, weather integration, and donation flagging
- **Buyer Marketplace**: Browse available crops with advanced search and filtering
- **Community Donations**: Platform for distributing surplus crops to communities
- **Smart Notifications**: Real-time alerts for crop updates, donations, and inquiries
- **Platform Analytics**: Comprehensive statistics for farmers, buyers, and regional data

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Authentication
- **Weather**: OpenWeather API integration

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables (Firebase, OpenWeather API keys)
4. Run the development server: `npm run dev`

## Deployment Guide

This application is deployed across multiple platforms:

### 1. Database (PostgreSQL)
Create a PostgreSQL database at [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
Get your connection string (e.g., `postgres://user:pass@host/dbname`).

### 2. Backend Server (Render/Railway)
1. Push your code to GitHub
2. Go to [Render.com](https://render.com) or [Railway.app](https://railway.app)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install && npm run build:server`
   - **Start Command**: `npm run start:server`
   - **Environment Variables**:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `NODE_ENV`: `production`
     - `PORT`: `5000`
     - Firebase config variables

### 3. Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com)
2. Add New Project and select your GitHub repo
3. Framework Preset: Auto-detects "Vite"
4. Root Directory: Select `client`
5. Environment Variables:
   - `VITE_API_URL`: Your server URL (e.g., `https://your-app.onrender.com`)
6. Click Deploy

### Build Commands (for reference)
```bash
npm run build:client   # Build React frontend
npm run build:server   # Build Express server with tsup
npm run start:server   # Run production server
```

## License

MIT License
