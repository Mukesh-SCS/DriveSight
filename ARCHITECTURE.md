# DriveSight System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DriveSight Ecosystem                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────────┐
│   Mobile App             │         │   Web Dashboard          │
│  (React Native)          │         │  (Future)                │
│                          │         │                          │
│ - Study Mode             │         │ - Analytics              │
│ - Sign Scanner           │         │ - Content Management    │
│ - Mock Tests             │         │ - User Management       │
│ - Progress Tracking      │         │ - Report Generation     │
└──────────────┬───────────┘         └──────────────┬───────────┘
               │                                     │
               │          HTTP/REST                 │
               │                                     │
               ├─────────────────────────────────────┤
                              │
                              ▼
                    ┌──────────────────────┐
                    │   API Gateway        │
                    │  (Express.js)        │
                    │  - Rate Limiting     │
                    │  - Authentication    │
                    │  - CORS              │
                    └──────────┬───────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
    ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
    │ Auth Routes │    │Question Routes│   │Sign Routes   │
    ├─────────────┤    ├──────────────┤    ├──────────────┤
    │ - Login     │    │ - Get by     │    │ - Identify   │
    │ - Signup    │    │   State      │    │ - Get All    │
    │ - Refresh   │    │ - Get by     │    │ - Get by     │
    │ - Logout    │    │   Category   │    │   Category   │
    └──────┬──────┘    └──────┬───────┘    └──────┬───────┘
           │                  │                    │
           │                  │                    │
        Controllers/Services  │                 ┌──────────────┐
                              │                 │ AI Services  │
                              │                 ├──────────────┤
                              │                 │ - OpenAI     │
                              │                 │ - Google     │
                              │                 │   Vision     │
                              │                 │ - TFLite     │
                              │                 │   (Future)   │
                              │                 └──────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │   PostgreSQL DB      │
                    ├──────────────────────┤
                    │ - users              │
                    │ - states             │
                    │ - questions          │
                    │ - signs              │
                    │ - user_performance   │
                    │ - user_progress      │
                    └──────────────────────┘
```

## Data Flow Diagrams

### Sign Recognition Flow

```
┌─────────┐
│ User    │
└────┬────┘
     │ Captures/Uploads Photo
     ▼
┌──────────────────────┐
│ SignScanScreen       │
│ (React Native)       │
└────┬─────────────────┘
     │ FormData with image
     ▼
┌────────────────────────────┐
│ POST /api/sign/identify    │
│ (Express Router)           │
└────┬───────────────────────┘
     │
     ▼
┌────────────────────────────┐
│ signController.identifySign│
└────┬───────────────────────┘
     │
     ▼
┌────────────────────────────┐
│ AI Service                 │
│ - OpenAI Vision API        │
│ - Google Cloud Vision      │
└────┬───────────────────────┘
     │ Identified sign data
     ▼
┌────────────────────────────┐
│ Database Lookup            │
│ - Get detailed sign info   │
│ - State-specific penalties │
│ - Sign variations          │
└────┬───────────────────────┘
     │ Comprehensive response
     ▼
┌────────────────────────────┐
│ SignExplanationScreen      │
│ Display:                   │
│ - Sign Name                │
│ - MUTCD Code               │
│ - Meaning                  │
│ - Penalties                │
│ - State Variations         │
└────────────────────────────┘
```

### Study Mode Flow

```
┌─────────┐
│ User    │
└────┬────┘
     │ Selects State
     ▼
┌──────────────────────┐
│ GET /api/questions/:state
│ categories           │
└────┬─────────────────┘
     │ List of categories
     ▼
┌──────────────────────┐
│ User Selects         │
│ Category             │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ GET /api/questions/:state/   │
│ category/:category           │
└────┬───────────────────────────┘
     │ Questions array
     ▼
┌─────────────────────┐
│ StudyModeScreen     │
│ Display Question    │
│ - Question text     │
│ - Answer options    │
│ - Explanation       │
└────┬────────────────┘
     │ User answers
     ▼
┌─────────────────────┐
│ Store Progress      │
│ - Update Zustand    │
│ - Submit to backend │
└─────────────────────┘
```

### Mock Test Flow

```
┌─────────┐
│ User    │
└────┬────┘
     │ Selects Test
     ▼
┌──────────────────────┐
│ MockTestScreen       │
│ - Start Timer        │
│ - Load Questions     │
└────┬─────────────────┘
     │
     ├─── Per Question ───┐
     │                    ▼
     │            ┌──────────────┐
     │            │ Display Q    │
     │            │ User selects │
     │            │ answer       │
     │            └──────┬───────┘
     │                   │
     │                   ▼
     │            ┌──────────────┐
     │            │ Score answer │
     │            │ Store in     │
     │            │ local state  │
     │            └──────┬───────┘
     │                   │
     │                   └─ Next Q
     │
     ▼
┌──────────────────────────────┐
│ Test Complete                │
│ POST /api/analytics/         │
│ performance                  │
│ - Score                      │
│ - Duration                   │
│ - State/Category             │
└──────┬───────────────────────┘
       │ Save to analytics
       ▼
┌──────────────────────┐
│ Results Screen       │
│ - Score percentage   │
│ - Review mistakes    │
│ - Performance trend  │
└──────────────────────┘
```

## Component Architecture

### React Native Component Tree

```
App
├── Navigation (React Navigation)
│   ├── HomeStack
│   │   └── HomeScreen
│   ├── StudyStack
│   │   ├── StudyModeScreen
│   │   └── SignExplanationScreen
│   ├── ScanStack
│   │   ├── SignScanScreen
│   │   └── SignExplanationScreen
│   ├── TestStack
│   │   └── MockTestScreen
│   └── SettingsStack
│       └── SettingsScreen
├── Providers
│   ├── QueryClientProvider (React Query)
│   ├── SafeAreaProvider
│   └── (Future: Redux/Zustand for global state)
└── Services
    ├── API Client (Axios)
    ├── Store (Zustand)
    ├── Hooks (Custom React hooks)
    └── Utils (Helper functions)
```

## Database Schema Relationships

```
users (1) ──────────────── (N) user_performance
   │                              │
   │                              └─ (N) states
   │
   ├──────────────────────── (N) user_progress
   │                              │
   │                              ├─ (1) states
   │                              └─ (1) questions
   │
   └──────────────────────── (N) user_sign_scans
                                 │
                                 └─ (1) signs


states (1) ──────────────── (N) questions
   │
   ├──────────────────────── (N) user_performance
   │
   └──────────────────────── (N) user_progress


signs (1) ──────────────── (N) user_sign_scans
```

## Authentication Flow

```
┌────────────┐
│ User Login │
└─────┬──────┘
      │
      ▼
┌──────────────────────────┐
│ POST /api/auth/login     │
│ Validate credentials     │
└─────┬────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Generate JWT Token       │
│ - User ID in payload     │
│ - Expiration: 7 days     │
└─────┬────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Return token + user info │
└─────┬────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Store token in client    │
│ (AsyncStorage)           │
└──────────────────────────┘

For subsequent requests:
┌──────────────────────────┐
│ Include token in         │
│ Authorization header     │
│ "Bearer <token>"         │
└─────┬────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Backend middleware       │
│ authenticates token      │
└──────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers (can run multiple instances)
- Load balancer in front of backend
- Database connection pooling
- Redis cache layer for frequent queries

### Database Optimization
- Indexes on frequently queried columns
- Pagination for large result sets
- Query optimization
- Regular backups and monitoring

### CDN for Assets
- Images hosted on AWS S3 or CloudFront
- App data cached at edge
- Reduced latency for users globally

### AI Service Scaling
- Rate limiting for API calls
- Batch processing for off-peak usage
- Model caching for common signs
- Cost optimization through caching

## Security Architecture

```
┌─────────────────────────────────────────┐
│          Client (Mobile App)            │
│  - Encrypted storage for tokens         │
│  - SSL/TLS for all network requests     │
│  - Input validation before sending      │
└──────────────────┬──────────────────────┘
                   │
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────┐
│      API Gateway / Load Balancer        │
│  - Rate limiting                        │
│  - CORS validation                      │
│  - Request logging                      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│        Express Middleware               │
│  - JWT verification                     │
│  - RBAC (Role-based access control)     │
│  - Input validation/sanitization        │
│  - Error handling                       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Controllers/Services               │
│  - Business logic validation            │
│  - Database access control              │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         PostgreSQL Database             │
│  - Encrypted connections                │
│  - Row-level security (future)          │
│  - Regular backups                      │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────┐
│           Production Environment            │
└──────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐
│  Mobile App         │         │  Web Dashboard      │
│  - iOS (App Store)  │         │  - Hosting          │
│  - Android (Play)   │         │  - CDN              │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           └───────────────────┬───────────┘
                               │
                    HTTPS / Load Balancing
                               │
              ┌────────────────┴────────────────┐
              │                                  │
              ▼                                  ▼
┌──────────────────────────┐      ┌──────────────────────────┐
│   API Server 1           │      │   API Server 2 (Backup)  │
│ (Auto-scaling group)     │      │                          │
└──────────────┬───────────┘      └──────────────┬───────────┘
               │                                 │
               └─────────────┬───────────────────┘
                             │
                   ┌─────────┴────────┐
                   │                  │
                   ▼                  ▼
        ┌──────────────────┐  ┌──────────────────┐
        │ PostgreSQL DB    │  │ Redis Cache      │
        │ (Primary)        │  │ (Session/Query)  │
        └──────────────────┘  └──────────────────┘

        ┌──────────────────────────────────────┐
        │ AWS S3 / CloudFront (Assets/Images)  │
        └──────────────────────────────────────┘
```

---

This architecture ensures scalability, security, and maintainability as the DriveSight platform grows.
