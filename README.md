# DriveSight - AI-Powered Traffic Sign Recognition

A comprehensive React Native mobile application for driver education with AI-powered traffic sign recognition, state-specific permit banks, adaptive learning, and mock DMV tests.

## Overview

**DriveSight** is an intelligent driver education platform that combines:
- 🤖 **AI Sign Recognition** - Upload photos for instant sign identification and explanations
- 📚 **Study Mode** - Learn traffic signs organized by state with detailed information
- 🧪 **Mock Tests** - Practice with timed, realistic DMV-style exams
- 📊 **Performance Tracking** - Monitor progress and identify weak areas
- 🗺️ **State-Specific Rules** - Complete permit banks for each US state
- 📱 **Offline Support** - Access content without internet connection

## Project Structure

```
DriveSight/
├── drivesight-app/          # React Native frontend (Expo)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── screens/         # Navigation screens
│   │   ├── navigation/      # Navigation configuration
│   │   ├── hooks/           # Custom React hooks
│   │   ├── state/           # Global state management (Zustand)
│   │   ├── api/             # API client and service calls
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Images, fonts, etc.
│   ├── app.json             # Expo configuration
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript configuration
│
└── backend/                 # Node.js Express backend
    ├── src/
    │   ├── routes/          # API endpoints
    │   ├── controllers/      # Request handlers
    │   ├── models/          # Database models (Sequelize)
    │   ├── middleware/      # Express middleware
    │   ├── services/        # Business logic
    │   ├── config/          # Configuration files
    │   └── utils/           # Utility functions
    ├── migrations/          # Database migrations
    ├── package.json         # Dependencies
    └── tsconfig.json        # TypeScript configuration
```

## Technology Stack

### Frontend
- **React Native** with Expo for iOS/Android deployment
- **React Navigation** for app navigation
- **React Query** for server state management
- **Zustand** for global state
- **React Native Reanimated** for smooth animations
- **TypeScript** for type safety

### Backend
- **Node.js** with Express.js
- **PostgreSQL** for database
- **Sequelize** ORM for database operations
- **JWT** for authentication
- **Multer** for file uploads
- **OpenAI API** for sign recognition (or Google Vision)

### AI Integration
- **OpenAI Vision API** (recommended for MVP) - No training needed, handles varied image quality
- **Google Cloud Vision** - Alternative option
- **Custom TensorFlow Lite models** - For advanced offline recognition

## Core Features

### 1. Sign Recognition AI
- Upload or capture traffic sign photos
- AI identifies sign with high confidence
- Returns sign name, MUTCD code, meaning, and penalties
- State-specific variations displayed

### 2. State-Specific Learning
- Complete permit banks for all 50 US states
- State-specific laws and rules
- DUI requirements
- Passing laws
- Emergency vehicle procedures
- Sign variations by state

### 3. Adaptive Learning
- Tracks user performance
- Serves harder questions based on progress
- Reviews mistakes automatically
- Spaced repetition algorithm

### 4. Mock DMV Tests
- Timed mode matching real test conditions
- Explanations for incorrect answers
- Progress tracking
- Performance analytics

### 5. Offline Mode
- Cached questions and explanations
- Offline sign recognition (when using TFLite)
- Local storage for user progress

## API Endpoints

### Authentication
```
POST   /api/auth/signup        - Create new account
POST   /api/auth/login         - Login user
POST   /api/auth/refresh       - Refresh JWT token
POST   /api/auth/logout        - Logout user
```

### Questions
```
GET    /api/questions/:state                    - Get all questions for state
GET    /api/questions/:state/categories         - Get question categories
GET    /api/questions/:state/category/:category - Get questions by category
POST   /api/questions                           - Create new question (admin)
```

### Sign Recognition
```
POST   /api/sign/identify      - Upload image for sign identification
GET    /api/signs              - Get all signs
GET    /api/signs/:id          - Get specific sign
GET    /api/signs/category/:category - Get signs by category
POST   /api/signs              - Create new sign (admin)
```

### Analytics
```
POST   /api/analytics/performance - Submit test results
GET    /api/analytics/stats        - Get user statistics
GET    /api/analytics/progress     - Get progress by category/state
```

## Database Schema

### Key Tables
- **users** - User accounts and authentication
- **states** - US states with rules and regulations
- **questions** - Study questions organized by state/category
- **signs** - Traffic sign database with MUTCD codes
- **user_performance** - Test results and scores
- **user_progress** - Learning progress tracking
- **user_sign_scans** - History of scanned signs

## Development Timeline

### Week 1-2
- [ ] Project setup and branding
- [ ] React Native navigation skeleton
- [ ] Database schema setup
- [ ] State list preparation

### Week 3-5
- [ ] Question bank implementation
- [ ] Study mode UI
- [ ] Mock test interface
- [ ] Backend API structure

### Week 6-8
- [ ] AI sign recognition integration
- [ ] Sign database completion
- [ ] Upload/camera interface
- [ ] State-specific rules database

### Week 9-12
- [ ] UI polish and animations
- [ ] Analytics dashboard
- [ ] Offline mode implementation
- [ ] Beta testing
- [ ] App Store deployment

## Setup Instructions

### Frontend Setup

```bash
cd drivesight-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update API URL in .env
# EXPO_PUBLIC_API_URL=http://your-backend-url/api

# Start development server
npm run start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure database connection in .env
# Update: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, API keys

# Run database migrations
npm run migrate

# Start development server
npm run dev

# Build for production
npm run build
```

### Database Setup (PostgreSQL)

```bash
# Create database
createdb drivesight

# Run migrations
psql -U postgres -d drivesight -f backend/migrations/001_init_schema.sql
psql -U postgres -d drivesight -f backend/migrations/002_seed_data.sql
```

## Environment Variables

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_API_KEY=your_api_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key
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
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
GOOGLE_VISION_API_KEY=your_google_vision_key
```

## Key Implementation Details

### AI Sign Recognition Flow
1. User uploads/captures sign photo
2. Image sent to backend as FormData
3. Backend calls OpenAI Vision API (or Google Vision)
4. Returns identified sign with:
   - Sign name
   - MUTCD code
   - Category
   - Explanation
   - State-specific penalties
   - Variations in other states
5. Results displayed with additional info from database

### State-Specific Rules
- Database stores DUI rules, speed limits, passing laws per state
- Questions filtered by selected state
- Sign penalties shown with state variations
- Mock tests use state-specific rules

### Performance Tracking
- Each test submission saved to `user_performance` table
- Tracks: score, duration, state, test type
- Analytics calculate progress trends
- Adaptive algorithm serves harder questions to high performers

## Security Considerations

- JWT authentication for all user-specific endpoints
- Password hashing with bcryptjs
- Environment variables for sensitive data
- Input validation on all endpoints
- CORS configured for frontend domain

## Testing

```bash
# Frontend
npm run test

# Backend
npm run test

# Build
npm run build
```

## Deployment

### Mobile App
- Build with Expo for initial launch
- Use EAS Build for production builds
- Deploy to Apple App Store and Google Play Store

### Backend
- Deploy to AWS, Heroku, DigitalOcean, etc.
- Use PostgreSQL managed service
- Configure environment variables on server
- Enable CORS for production domain

## Future Enhancements

- [ ] Custom ML model training on sign dataset
- [ ] TensorFlow Lite for offline recognition
- [ ] Voice-to-text question reading
- [ ] Leaderboards and social features
- [ ] Advanced analytics dashboard
- [ ] Video tutorials for difficult signs
- [ ] Certification tracking
- [ ] Integration with DMV scheduling

## Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## License

This project is proprietary and confidential.

## Support

For issues and questions, please contact support@drivesight.com

## Roadmap

- **Q1 2025** - MVP launch (iOS/Android)
- **Q2 2025** - Advanced analytics and offline mode
- **Q3 2025** - Custom ML models
- **Q4 2025** - Social features and certification

---

**Made with ❤️ for safer driving**
