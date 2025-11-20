# TotalFit: Health Advisor

> Connect your Google Fit app, get AI-powered health insights and injury risk warnings based on your daily activity data.

## 🎯 Overview

TotalFit is a web dashboard that syncs with your existing Google Fit app and uses AI to:
- **Analyze your patterns** - Are you overtraining? Under-recovering?
- **Predict injury risks** - "Your training intensity jumped 40% this week - high injury risk"
- **Give personalized advice** - "Take a rest day tomorrow" or "Increase protein intake"

No new devices needed. If you have a phone with Google Fit installed, you're ready.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Cloud account for OAuth credentials
- Supabase account (free tier works)
- Google Fit app installed on your phone

### Installation

1. **Clone the repository**
```bash
cd totalfit-gym
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install backend dependencies**
```bash
cd ../backend
npm install
```

### Environment Setup

#### Frontend (.env.local)

Create `frontend/.env.local`:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google Fit API
GOOGLE_FIT_API_SCOPE=https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.sleep.read
```

#### Backend (.env)

Create `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Google Fit API Scopes
GOOGLE_FIT_SCOPES=https://www.googleapis.com/auth/fitness.activity.read,https://www.googleapis.com/auth/fitness.heart_rate.read,https://www.googleapis.com/auth/fitness.sleep.read,https://www.googleapis.com/auth/fitness.body.read

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Google Fit API
   - Google+ API (for OAuth)
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback`
5. Copy Client ID and Client Secret to your `.env` files

### Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Run the following SQL in the Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  google_id TEXT UNIQUE NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_scores table
CREATE TABLE health_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  overall_score INTEGER NOT NULL,
  activity_level INTEGER NOT NULL,
  sleep_quality INTEGER NOT NULL,
  recovery_score INTEGER NOT NULL,
  consistency INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create health_metrics table
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  steps INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  heart_rate INTEGER DEFAULT 0,
  sleep_hours DECIMAL(4,2) DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create ai_recommendations table
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_health_scores_user_date ON health_scores(user_id, date DESC);
CREATE INDEX idx_health_metrics_user_date ON health_metrics(user_id, date DESC);
CREATE INDEX idx_recommendations_user_date ON ai_recommendations(user_id, date DESC);
```

3. Copy your Project URL and API keys to `.env` files

### Running the Application

1. **Start the frontend**
```bash
cd frontend
npm run dev
```

The frontend will run on [http://localhost:3000](http://localhost:3000)

2. **Start the backend** (in a separate terminal)
```bash
cd backend
npm run dev
```

The backend will run on [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
totalfit-gym/
├── frontend/
│   ├── app/
│   │   ├── api/           # Next.js API routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── layout.tsx
│   │   ├── page.tsx       # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   └── dashboard/     # Dashboard-specific components
│   ├── lib/
│   │   ├── utils.ts       # Utility functions
│   │   └── api/           # API client functions
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/        # Express routes
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Data models
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🎨 Features

### Core Features (MVP)
- ✅ Google Fit OAuth Integration
- ✅ Health Score Dashboard (0-100)
- ✅ Injury Risk Meter (LOW/MEDIUM/HIGH)
- ✅ Weekly Activity Charts
- ✅ AI-Powered Recommendations
- ✅ Smart Alerts

### Metrics Tracked
- Steps
- Active Minutes
- Heart Rate
- Sleep Duration
- Workout Sessions
- Calories Burned

### AI Insights
- Overtraining detection
- Recovery score calculation
- Injury risk prediction
- Personalized recommendations

## 🔧 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui components
- Recharts (data visualization)
- Lucide Icons

### Backend
- Next.js API Routes (serverless)
- Google Fit API
- Google OAuth 2.0

### Database
- Supabase (PostgreSQL)

### AI/ML
- Rule-based algorithms (Phase 1)
- TensorFlow.js (Phase 2 - planned)

## 📊 Key Components

### Health Score Calculation
```typescript
Health Score = 
  (Activity Level × 0.30) +
  (Sleep Quality × 0.25) +
  (Recovery Score × 0.30) +
  (Consistency × 0.15)
```

### Injury Risk Factors
- Sudden training spikes (>30% increase)
- Lack of rest days
- Poor recovery scores
- Insufficient sleep

## 🔒 Privacy & Security

- You control your data access
- Can revoke Google Fit permissions anytime
- No data sharing with third parties
- Encrypted data storage
- Privacy-first design

## 🚀 Deployment

### Vercel (Recommended)

1. **Frontend Deployment**
```bash
cd frontend
vercel
```

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` with your production URL

### Backend
- Backend runs as Next.js API routes, deployed with frontend on Vercel

## 📈 Roadmap

### Phase 1 (Current - MVP)
- [x] Landing page
- [ ] Google Fit integration
- [ ] Basic dashboard
- [ ] Simple AI algorithms
- [ ] Health score calculation

### Phase 2 (Week 2-3)
- [ ] Advanced AI models with TensorFlow.js
- [ ] Historical data visualization
- [ ] Export data functionality
- [ ] Mobile responsive improvements

### Phase 3 (Month 2)
- [ ] Custom goal setting
- [ ] Nutrition tracking integration
- [ ] Social features (compare with friends)
- [ ] Premium subscription tier

## 🤝 Contributing

This is currently a solo project, but contributions are welcome!

## 📝 License

MIT License - feel free to use this project for learning or building your own health app.

## 🎯 Success Metrics

### Day 1 Goals
- ✅ Landing page complete
- [ ] Google Fit connection works
- [ ] Dashboard displays data
- [ ] AI generates recommendations

### Week 1 Goals
- [ ] 50 users connected
- [ ] 500 data syncs
- [ ] 90% user satisfaction
- [ ] 5 testimonials

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for athletes who want to train smarter, not harder.**

