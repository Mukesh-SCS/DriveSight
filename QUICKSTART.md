# DriveSight Quick Start Guide

Get your DriveSight development environment up and running in 15 minutes.

## Prerequisites

- Node.js 16+ and npm/yarn
- PostgreSQL installed locally or remote database
- Expo CLI: `npm install -g expo-cli`
- Git

## Step 1: Clone & Install Frontend (5 min)

```bash
cd drivesight-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings
# EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## Step 2: Install Backend Dependencies (3 min)

```bash
cd ../backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

## Step 3: Setup Database (5 min)

```bash
# Create PostgreSQL database
createdb drivesight

# Run migrations
psql -U postgres -d drivesight -f migrations/001_init_schema.sql
psql -U postgres -d drivesight -f migrations/002_seed_data.sql

# Update .env with DB credentials
# DB_HOST=localhost
# DB_NAME=drivesight
# DB_USER=postgres
# DB_PASSWORD=your_password
```

## Step 4: Start Development Servers

### Terminal 1 - Backend

```bash
cd backend
npm run dev

# Server should start on http://localhost:3000
```

### Terminal 2 - Frontend

```bash
cd drivesight-app
npm run start

# Scan QR code with Expo Go app (iOS/Android)
# Or press 'i' for iOS simulator, 'a' for Android emulator
```

## API Endpoints to Test

### Health Check
```bash
curl http://localhost:3000/health
```

### Get Questions by State
```bash
curl http://localhost:3000/api/questions/CA
```

### Get Question Categories
```bash
curl http://localhost:3000/api/questions/CA/categories
```

### Get Signs
```bash
curl http://localhost:3000/api/signs
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Find and kill process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
```
ERROR: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Check PostgreSQL is running: `pg_isrunning`
2. Verify DB credentials in .env
3. Ensure database exists: `psql -l | grep drivesight`

### Expo Connection Issues
```bash
# Clear cache
expo start --clear

# Or use tunnel mode
expo start --tunnel
```

## Project File Structure

```
DriveSight/
├── drivesight-app/          ← React Native app
│   ├── src/
│   │   ├── screens/         ← Main app screens
│   │   ├── components/      ← Reusable UI components
│   │   ├── navigation/      ← Navigation setup
│   │   ├── api/            ← API client
│   │   └── state/          ← Zustand stores
│   ├── package.json
│   └── app.json
│
├── backend/                 ← Express.js API
│   ├── src/
│   │   ├── routes/         ← API endpoints
│   │   ├── controllers/    ← Request handlers
│   │   ├── models/         ← Database models
│   │   └── middleware/     ← Custom middleware
│   ├── migrations/         ← Database migrations
│   └── package.json
│
├── README.md               ← Full documentation
├── ARCHITECTURE.md         ← System design
├── AI_INTEGRATION.md       ← AI setup guide
└── LICENSE
```

## Next Steps

1. **Frontend**: Browse the app screens in `drivesight-app/src/screens/`
2. **Backend**: Check API routes in `backend/src/routes/`
3. **Database**: Review schema in `backend/migrations/001_init_schema.sql`
4. **API Testing**: Use Postman or curl to test endpoints

## Key Screens to Explore

| Screen | Purpose | Location |
|--------|---------|----------|
| Home | App overview | `src/screens/HomeScreen.tsx` |
| Study Mode | Learn by state/category | `src/screens/StudyModeScreen.tsx` |
| Scan Sign | Camera/upload for AI recognition | `src/screens/SignScanScreen.tsx` |
| Mock Test | Practice DMV-style tests | `src/screens/MockTestScreen.tsx` |
| Settings | User preferences | `src/screens/SettingsScreen.tsx` |

## Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/amazing-feature

# 2. Make changes
# - Frontend: edit src/screens/* or src/components/*
# - Backend: edit src/routes/* or src/controllers/*

# 3. Test locally
# - Frontend: changes hot-reload automatically
# - Backend: restart with npm run dev

# 4. Commit and push
git add .
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature

# 5. Create Pull Request
```

## Debugging Tips

### Frontend Debugging
- Use React Native Debugger (download from github)
- Press `j` in Expo to open JavaScript debugger
- Use `console.log()` and check terminal output

### Backend Debugging
- Install VS Code debugger
- Add breakpoints and use npm run dev
- Check logs in terminal

### Database Debugging
```bash
# Connect to database
psql -U postgres -d drivesight

# View tables
\dt

# Run test query
SELECT * FROM states LIMIT 5;

# Exit
\q
```

## Common Commands

```bash
# Frontend
npm run start          # Start Expo server
npm run test          # Run tests
npm run build         # Production build
npm run lint          # Check code style

# Backend
npm run dev           # Start with nodemon
npm run build         # Compile TypeScript
npm run test          # Run tests
npm run migrate       # Run database migrations
```

## Environment Variables Needed

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_ENV=development
```

### Backend (.env)
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=drivesight
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=super_secret_key
```

## Testing the App

### Test Home Screen
1. Launch app
2. Verify 4 feature cards appear
3. Click each card to navigate

### Test Study Mode
1. Click "Study" in home
2. Select a state (e.g., California)
3. Select a category (e.g., Warning Signs)
4. Verify questions and explanations load

### Test Sign Scanner
1. Click "Scan" in home
2. Click "Pick from Gallery"
3. Select any image
4. Verify result displays

### Test Mock Test
1. Click "Tests" in home
2. Select a test
3. Answer questions
4. Verify score calculation

## Next Phase: AI Integration

Ready to add sign recognition? See `AI_INTEGRATION.md` for:
- OpenAI Vision API setup
- Google Cloud Vision alternative
- TensorFlow Lite offline model
- Implementation examples

## Support & Documentation

- **Full Docs**: See `README.md`
- **Architecture**: See `ARCHITECTURE.md`
- **AI Setup**: See `AI_INTEGRATION.md`
- **API Docs**: Test endpoints at `http://localhost:3000/health`

---

**Happy coding! 🚀**

Questions? Check the docs or reach out to the team.
