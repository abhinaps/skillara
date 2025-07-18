# 🚀 Skillara Phase 1: Anonymous Skill Gap Analyzer

## Domain-Driven Design with Hexagonal Architecture

## 📋 Project Overview

**Product Name:** Skillara - Skill Gap Analyzer
**Phase:** 1 (Anonymous-First MVP)
**Timeline:** 6-8 weeks
**Goal:** Launch a frictionless, no-login skill gap analysis tool that provides instant career insights
**Architecture:** Domain-Driven Design with Hexagonal (Ports & Adapters) Pattern

---

## 🏛️ Domain-Driven Design Analysis

### **Core Domain Identification**

#### **1. 🎯 Career Analysis Domain (Core Domain)**

_The heart of our business - analyzing career gaps and providing insights_

**Bounded Context:** Career Intelligence
**Domain Experts:** Career coaches, HR professionals, recruitment specialists
**Key Concepts:**

- Skill Gap Analysis
- Career Positioning
- Market Intelligence
- Learning Path Generation

**Core Entities:**

- `SkillProfile` - User's current skill set and experience
- `CareerGap` - Identified gaps between current and target positions
- `MarketPosition` - User's competitiveness in the job market
- `LearningPath` - Recommended skill development journey

#### **2. 📄 Document Processing Domain (Supporting Domain)**

_Extracting and interpreting resume content_

**Bounded Context:** Document Intelligence
**Domain Experts:** NLP engineers, document processing specialists
**Key Concepts:**

- Resume Parsing
- Text Extraction
- Content Validation
- Skill Recognition

**Core Entities:**

- `ResumeDocument` - Uploaded resume file and metadata
- `ExtractedContent` - Processed text and structured data
- `SkillExtraction` - Identified skills with confidence scores
- `ProcessingResult` - Outcome of document analysis

#### **3. 💼 Job Market Domain (Supporting Domain)**

_Understanding market demands and trends_

**Bounded Context:** Market Intelligence
**Domain Experts:** Market researchers, recruitment analysts
**Key Concepts:**

- Role Requirements
- Skill Demand Trends
- Salary Intelligence
- Industry Analysis

**Core Entities:**

- `JobRole` - Standardized job positions and requirements
- `SkillDemand` - Market demand for specific skills
- `SalaryBenchmark` - Compensation data for roles
- `MarketTrend` - Historical and projected market changes

#### **4. 🎓 Learning Recommendation Domain (Supporting Domain)**

_Generating personalized learning recommendations_

**Bounded Context:** Learning Intelligence
**Domain Experts:** Learning specialists, career coaches
**Key Concepts:**

- Learning Path Optimization
- Resource Curation
- Progress Tracking
- Skill Development Planning

**Core Entities:**

- `LearningObjective` - Specific skills to develop
- `LearningResource` - Courses, books, projects, certifications
- `SkillDevelopmentPlan` - Structured learning journey
- `LearningMilestone` - Checkpoints and achievements

#### **5. 📊 Session Management Domain (Generic Subdomain)**

_Managing user sessions and analytics_

**Bounded Context:** Session Management
**Key Concepts:**

- Anonymous Sessions
- User Analytics
- Data Retention
- Privacy Compliance

**Core Entities:**

- `AnalysisSession` - User session and state management
- `UserAnalytics` - Interaction tracking and insights
- `DataRetention` - Privacy-compliant data lifecycle

### **Domain Relationships & Context Map**

````
┌─────────────────────────────────────────────────────────────────┐
│                    CAREER ANALYSIS DOMAIN (Core)                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   SkillProfile  │  │   CareerGap     │  │ MarketPosition  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼─────────┐    ┌───────▼─────────┐    ┌───────▼─────────┐
│  DOCUMENT       │    │  JOB MARKET     │    │  LEARNING       │
│  PROCESSING     │    │  DOMAIN         │    │  RECOMMENDATION │
│                 │    │                 │    │  DOMAIN         │
│ ResumeDocument  │    │ JobRole         │    │ LearningPath    │
│ SkillExtraction │    │ SkillDemand     │    │ LearningResource│
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   SESSION           │
                    │   MANAGEMENT        │
                    │                     │
                    │ AnalysisSession     │
                    │ UserAnalytics       │
                    └─────────────────────┘
```---

## 🎯 Prerequisites & Setup

### **Technical Requirements**

#### **Development Environment**

- Node.js 18+ (LTS recommended)
- TypeScript 5.0+
- Git for version control
- VS Code or preferred IDE
- Docker (optional, for local development)

#### **Required Skills/Knowledge**

- **Frontend:** React/Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL, Redis
- **NLP:** Basic understanding of text processing
- **PDF Processing:** File handling and text extraction
- **APIs:** RESTful API design

#### **External Services Setup**

```bash
# Phase 1: Free-First Approach ($12/year domain only)
1. AI/NLP Services (FREE OPTIONS):
   - Hugging Face Transformers (completely free)
   - Google Gemini API (generous free tier)
   - OpenAI API (upgrade later when needed) - $20/month

2. Database (FREE OPTIONS):
   - PostgreSQL Local (development) - FREE
   - Supabase Free Tier (500MB, 2 projects) - FREE
   - Upgrade to managed PostgreSQL later - $25/month

3. Cache/Redis (FREE OPTIONS):
   - Redis Local (development) - FREE
   - Upstash Free Tier (10K commands/day) - FREE
   - Redis Cloud free tier - FREE

4. Hosting (FREE OPTIONS):
   - Netlify (frontend) + Render (backend) - FREE
   - Alternative: Vercel + Railway - FREE/$5 credit
   - Domain name (required) - $12/year

5. Optional Phase 1:
   - File storage: Local filesystem (Phase 1) → AWS S3 (Phase 2)
   - Email service: Not needed in Phase 1
   - Analytics: Console logs → Upgrade later
   - Stripe: Setup when monetization needed

# Phase 2: Upgrade Path (when revenue justifies cost)
- OpenAI API: $20/month (improved accuracy)
- Managed Database: $25/month (auto-scaling)
- Premium hosting: $20-40/month (performance)
````

### **Environment Variables Setup**

```bash
# Phase 1: Free Development Environment
# .env.development
DATABASE_URL=postgresql://user:password@localhost:5432/skillara_dev
REDIS_URL=redis://localhost:6379
HUGGINGFACE_API_KEY=hf_your_key_here  # Free API key
GEMINI_API_KEY=your_gemini_key_here   # Free Google API key
OPENAI_API_KEY=sk-your-key-here       # Optional, for later upgrade
SESSION_SECRET=your-random-secret-here
CORS_ORIGIN=http://localhost:3000
FILE_UPLOAD_MAX_SIZE=5242880  # 5MB in bytes
SESSION_TTL_HOURS=48
AI_PROVIDER=huggingface  # or 'gemini' or 'openai'

# Phase 1: Free Production Environment
# .env.production
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
REDIS_URL=redis://user:password@upstash.com:6379
HUGGINGFACE_API_KEY=hf_your_production_key_here
GEMINI_API_KEY=your_production_gemini_key_here
SESSION_SECRET=strong-random-secret-here
CORS_ORIGIN=https://skillara.netlify.app
FILE_UPLOAD_MAX_SIZE=5242880
SESSION_TTL_HOURS=48
NODE_ENV=production
AI_PROVIDER=huggingface

# Phase 2: Upgrade Environment (when scaling)
# Add these when upgrading to paid services
OPENAI_API_KEY=sk-prod-key-here
DATABASE_URL=postgresql://user:password@prod-host:5432/skillara_prod
REDIS_URL=redis://prod-redis:6379
AI_PROVIDER=openai
```

### **Development Setup Checklist**

#### **Phase 1: Free Development Environment**

- [ ] Node.js 18+ installed (`node --version`)
- [ ] TypeScript configured globally (`npm install -g typescript`)
- [ ] **Database Setup (Choose one):**
  - [ ] PostgreSQL installed locally (`psql --version`)
  - [ ] OR Supabase account created (free tier)
- [ ] **Redis Setup (Choose one):**
  - [ ] Redis installed locally (`redis-cli ping`)
  - [ ] OR Upstash account created (free tier)
- [ ] **AI/NLP Setup (Choose one or both):**
  - [ ] Hugging Face account created (free)
  - [ ] Google AI Studio account for Gemini API (free)
  - [ ] Optional: OpenAI API key for future upgrade
- [ ] **Hosting Setup:**
  - [ ] Netlify account created (free)
  - [ ] Render account created (free)
  - [ ] Domain purchased ($12/year)
- [ ] Git repository initialized with proper .gitignore
- [ ] Environment variables configured for development
- [ ] Package.json dependencies installed
- [ ] Database migrations ready to run

#### **Phase 2: Upgrade Checklist (When Revenue Justifies Cost)**

- [ ] OpenAI API key obtained and tested
- [ ] Managed database service selected (Supabase Pro/Railway)
- [ ] Premium hosting plan activated
- [ ] SSL certificates configured
- [ ] Automated backups enabled
- [ ] Monitoring and alerting setup

#### **Free Tier Limitations to Monitor:**

- [ ] Supabase: 500MB storage, 2 projects
- [ ] Upstash: 10K Redis commands/day
- [ ] Netlify: 100GB bandwidth/month
- [ ] Render: 750 hours/month (enough for 1 service)
- [ ] Hugging Face: Rate limits (usually sufficient)
- [ ] Google Gemini: 60 requests/minute (free tier)

---

## 🏗️ Hexagonal Architecture Design

### **Hexagonal Architecture Overview**

```
                    ┌─────────────────────────────────────────┐
                    │              ADAPTERS (UI)              │
                    │                                         │
    ┌───────────────┼─────────────┐           ┌───────────────┼─────────────┐
    │               │             │           │               │             │
    │    Web UI     │    REST     │           │   Report      │   Mobile    │
    │   (Next.js)   │     API     │           │ Generator     │     API     │
    │               │             │           │               │             │
    └───────────────┼─────────────┘           └───────────────┼─────────────┘
                    │                                         │
                    │              PRIMARY PORTS              │
    ┌───────────────┼─────────────────────────────────────────┼─────────────┐
    │               │                                         │             │
    │               │        APPLICATION SERVICES             │             │
    │               │                                         │             │
    │   ┌───────────▼─────────┐    ┌─────────────────────────▼───────────┐ │
    │   │ CareerAnalysisApp   │    │   DocumentProcessingApp            │ │
    │   │ JobMarketApp        │    │   LearningRecommendationApp        │ │
    │   └─────────┬───────────┘    └─────────────────────────┬───────────┘ │
    │             │                                          │             │
    │             │               DOMAIN LAYER               │             │
    │             │                                          │             │
    │   ┌─────────▼───────────────────────────────────────────▼─────────┐   │
    │   │                                                               │   │
    │   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│   │
    │   │  │ Career Analysis │  │ Document        │  │ Job Market      ││   │
    │   │  │ Domain          │  │ Processing      │  │ Domain          ││   │
    │   │  │                 │  │ Domain          │  │                 ││   │
    │   │  └─────────────────┘  └─────────────────┘  └─────────────────┘│   │
    │   │                                                               │   │
    │   │  ┌─────────────────┐  ┌─────────────────┐                     │   │
    │   │  │ Learning        │  │ Session         │                     │   │
    │   │  │ Recommendation  │  │ Management      │                     │   │
    │   │  │ Domain          │  │ Domain          │                     │   │
    │   │  └─────────────────┘  └─────────────────┘                     │   │
    │   │                                                               │   │
    │   └───────────────────────┬───────────────────────────────────────┘   │
    │                           │                                           │
    │                           │         SECONDARY PORTS                   │
    │                           │                                           │
    │   ┌───────────────────────▼───────────────────────────────────────┐   │
    │   │                                                               │   │
    │   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│   │
    │   │  │ Database        │  │ File Storage    │  │ External APIs   ││   │
    │   │  │ Adapter         │  │ Adapter         │  │ Adapter         ││   │
    │   │  │                 │  │                 │  │                 ││   │
    │   │  └─────────────────┘  └─────────────────┘  └─────────────────┘│   │
    │   │                                                               │   │
    │   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│   │
    │   │  │ Cache           │  │ Message Queue   │  │ Analytics       ││   │
    │   │  │ Adapter         │  │ Adapter         │  │ Adapter         ││   │
    │   │  │                 │  │                 │  │                 ││   │
    │   │  └─────────────────┘  └─────────────────┘  └─────────────────┘│   │
    │   │                                                               │   │
    │   └─────────────────────────────────────────────────────────────────┘   │
    │                                                                       │
    └───────────────────────────────────────────────────────────────────────┘
```

### **Port & Adapter Definitions**

#### **Primary Ports (Driving/Input)**

```typescript
// Career Analysis Port
export interface ICareerAnalysisPort {
  analyzeSkillGaps(
    profile: SkillProfile,
    targetRole: JobRole
  ): Promise<CareerGapAnalysis>;
  assessMarketPosition(profile: SkillProfile): Promise<MarketPosition>;
  generateLearningPath(gaps: CareerGap[]): Promise<LearningPath>;
}

// Document Processing Port
export interface IDocumentProcessingPort {
  processResume(document: ResumeDocument): Promise<ProcessingResult>;
  extractSkills(content: ExtractedContent): Promise<SkillExtraction>;
  validateDocument(document: ResumeDocument): Promise<ValidationResult>;
}

// Job Market Port
export interface IJobMarketPort {
  getJobRequirements(roleTitle: string): Promise<JobRole>;
  getSkillDemandTrends(skills: string[]): Promise<SkillDemand[]>;
  getSalaryBenchmarks(
    role: string,
    location?: string
  ): Promise<SalaryBenchmark>;
}

// Learning Recommendation Port
export interface ILearningRecommendationPort {
  recommendLearningPath(objectives: LearningObjective[]): Promise<LearningPath>;
  findLearningResources(skill: string): Promise<LearningResource[]>;
  optimizeLearningSequence(skills: string[]): Promise<SkillDevelopmentPlan>;
}
```

#### **Secondary Ports (Driven/Output)**

```typescript
// Repository Ports
export interface ISkillProfileRepository {
  save(profile: SkillProfile): Promise<void>;
  findBySessionId(sessionId: SessionId): Promise<SkillProfile | null>;
}

export interface IJobMarketRepository {
  findJobRole(title: string): Promise<JobRole | null>;
  findSkillDemands(skills: string[]): Promise<SkillDemand[]>;
  findSalaryData(role: string): Promise<SalaryBenchmark[]>;
}

// External Service Ports
export interface IResumeParserService {
  parseDocument(file: Buffer, mimeType: string): Promise<ExtractedContent>;
}

export interface IAIAnalysisService {
  extractSkills(text: string): Promise<SkillExtraction>;
  categorizeSkills(skills: string[]): Promise<CategorizedSkills>;
  provider: "huggingface" | "gemini" | "openai";
  isAvailable(): Promise<boolean>;
  getRateLimit(): RateLimitInfo;
}

export interface IMultiProviderAIService {
  getPrimaryProvider(): IAIAnalysisService;
  getFallbackProvider(): IAIAnalysisService;
  switchProvider(provider: string): void;
  extractSkillsWithFallback(text: string): Promise<SkillExtraction>;
}

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

// Analytics Port
export interface IAnalyticsService {
  trackEvent(event: AnalyticsEvent): Promise<void>;
  recordMetric(metric: string, value: number): Promise<void>;
}
```

---

## 📦 Technology Stack

### **Frontend Stack**

```json
{
  "framework": "Next.js 14+ (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "ui-library": "Radix UI + Lucide Icons",
  "charts": "Recharts or Chart.js",
  "file-upload": "react-dropzone",
  "pdf-generation": "jsPDF or Puppeteer"
}
```

### **Backend Stack**

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js 4.18+",
  "language": "TypeScript 5.0+",
  "validation": "Zod 3.22+",
  "file-processing": "multer 1.4+ + pdf-parse 1.1+",
  "nlp-phase1": "Hugging Face Transformers + Google Gemini API (FREE)",
  "nlp-phase2": "OpenAI API 4.0+ (upgrade path)",
  "nlp-fallback": "natural 6.0+ (basic NLP)",
  "session-management": "express-session 1.17+ + connect-redis 7.0+",
  "security": "helmet 7.0+ + cors 2.8+ + express-rate-limit 6.0+",
  "logging": "winston 3.10+ + morgan 1.10+",
  "testing": "jest 29.0+ + supertest 6.3+",
  "documentation": "swagger-ui-express 5.0+",
  "process-management": "pm2 5.3+ (production)"
}
```

### **Database & Infrastructure**

```json
{
  "primary-db-phase1": "PostgreSQL Local (dev) + Supabase Free (prod)",
  "primary-db-phase2": "Supabase Pro / Railway PostgreSQL (upgrade path)",
  "cache-phase1": "Redis Local (dev) + Upstash Free (prod)",
  "cache-phase2": "Redis Cloud / Upstash Pro (upgrade path)",
  "file-storage": "Local filesystem (Phase 1) → AWS S3 (Phase 2)",
  "hosting-phase1": "Netlify (Frontend) + Render (Backend) - FREE",
  "hosting-phase2": "Vercel Pro + Railway Pro (upgrade path)",
  "monitoring-phase1": "Console logs + basic error tracking",
  "monitoring-phase2": "DataDog/New Relic (upgrade path)",
  "cdn": "Netlify Edge Network (free) → Vercel Edge (upgrade)",
  "ssl": "Let's Encrypt via hosting provider (free)",
  "backup": "Manual exports (Phase 1) → Automated backups (Phase 2)",
  "scaling": "Horizontal scaling ready architecture"
}
```

### **Package Dependencies**

#### **Frontend package.json**

```json
{
  "name": "skillara-frontend",
  "version": "1.0.0",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "^1.0.0",
    "lucide-react": "^0.290.0",
    "recharts": "^2.8.0",
    "react-dropzone": "^14.2.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "framer-motion": "^10.16.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.0"
  },
  "devDependencies": {
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

#### **Backend package.json**

```json
{
  "name": "skillara-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "typescript": "^5.0.0",
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "zod": "^3.22.0",
    "multer": "^1.4.5",
    "@types/multer": "^1.4.7",
    "pdf-parse": "^1.1.1",
    "docx": "^8.0.0",
    "mammoth": "^1.6.0",

    "// AI/NLP - Phase 1 (FREE)": "Multiple providers for flexibility",
    "@huggingface/inference": "^2.6.0",
    "@google/generative-ai": "^0.7.0",
    "openai": "^4.0.0",
    "natural": "^6.0.0",

    "// Database & Cache": "Free tier compatible",
    "@supabase/supabase-js": "^2.38.0",
    "pg": "^8.11.0",
    "@types/pg": "^8.10.0",
    "redis": "^4.6.0",
    "@upstash/redis": "^1.25.0",

    "// Session & Security": "Standard packages",
    "express-session": "^1.17.0",
    "connect-redis": "^7.0.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^6.0.0",

    "// Logging & Utils": "Standard packages",
    "winston": "^3.10.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.3.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.0"
  },
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "db:migrate": "ts-node src/infrastructure/database/migrations/migrate.ts"
  }
}
```

---

## � **Cost-Effective Implementation Strategy**

### **Phase 1: Free-First MVP (Total Cost: $12/year)**

#### **AI/NLP Strategy**

```typescript
// Multi-provider AI strategy for cost optimization
interface AIProvider {
  name: "huggingface" | "gemini" | "openai";
  cost: "free" | "paid";
  accuracy: number; // 1-10 scale
  rateLimit: string;
}

const aiProviders: AIProvider[] = [
  { name: "huggingface", cost: "free", accuracy: 7, rateLimit: "1000/day" },
  { name: "gemini", cost: "free", accuracy: 8, rateLimit: "60/min" },
  { name: "openai", cost: "paid", accuracy: 9, rateLimit: "3500/min" },
];
```

#### **Database Strategy**

- **Development:** PostgreSQL Local (unlimited, free)
- **Production:** Supabase Free (500MB, sufficient for 10K+ users)
- **Backup:** Manual exports to GitHub (automated via scripts)

#### **Hosting Strategy**

- **Frontend:** Netlify (100GB bandwidth/month)
- **Backend:** Render (750 hours/month = 24/7 uptime)
- **Database:** Supabase hosted PostgreSQL
- **Cache:** Upstash Redis (10K commands/day)

#### **Migration Thresholds**

```yaml
upgrade_triggers:
  database:
    condition: "storage > 400MB OR users > 5000"
    action: "Upgrade to Supabase Pro ($25/month)"

  ai_service:
    condition: "accuracy complaints > 10% OR requests > 1000/day"
    action: "Add OpenAI API ($20/month)"

  hosting:
    condition: "bandwidth > 80GB/month OR response_time > 2s"
    action: "Upgrade to Vercel Pro ($20/month)"

  cache:
    condition: "redis_commands > 8000/day"
    action: "Upgrade to Upstash Pro ($15/month)"
```

### **Phase 2: Hybrid Approach ($40-60/month)**

#### **When to Upgrade Each Service**

1. **AI Service** (Priority 1): When user feedback indicates poor skill extraction
2. **Database** (Priority 2): When approaching storage limits
3. **Hosting** (Priority 3): When performance degrades
4. **Cache** (Priority 4): When Redis limits are hit

#### **Cost-Benefit Analysis**

| Service  | Free Option    | Paid Option  | Upgrade Benefit | User Impact |
| -------- | -------------- | ------------ | --------------- | ----------- |
| AI/NLP   | Hugging Face   | OpenAI       | +20% accuracy   | High        |
| Database | Supabase Free  | Supabase Pro | Auto-scaling    | Medium      |
| Hosting  | Netlify/Render | Vercel Pro   | Performance     | Medium      |
| Cache    | Upstash Free   | Upstash Pro  | Higher limits   | Low         |

### **Implementation Priority**

#### **Week 1-2: Core Setup (Free)**

- [ ] Setup local development environment
- [ ] Configure Hugging Face + Gemini APIs
- [ ] Setup Supabase database
- [ ] Deploy to Netlify + Render

#### **Week 3-4: MVP Features (Free)**

- [ ] Resume upload and parsing
- [ ] Basic skill extraction
- [ ] Simple gap analysis
- [ ] Basic UI/UX

#### **Week 5-6: Enhancement (Free)**

- [ ] Improved AI prompts
- [ ] Better skill matching
- [ ] Enhanced UI
- [ ] Error handling

#### **Week 7-8: Optimization (Free)**

- [ ] Performance optimization
- [ ] Cache implementation
- [ ] Analytics setup
- [ ] User testing

#### **Post-Launch: Upgrade Path (Paid)**

- [ ] Monitor usage metrics
- [ ] Gather user feedback
- [ ] Identify bottlenecks
- [ ] Selective upgrades based on ROI

---

## �🗄️ Database Schema

### **PostgreSQL Setup & Extensions**

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For JSONB indexing

-- Create enum types
CREATE TYPE experience_level AS ENUM ('entry', 'junior', 'mid', 'senior', 'lead', 'executive');
CREATE TYPE skill_category AS ENUM ('frontend', 'backend', 'database', 'devops', 'design', 'project_management', 'soft_skills', 'language', 'framework', 'tool');
CREATE TYPE session_status AS ENUM ('uploading', 'processing', 'analyzing', 'completed', 'error', 'expired');
```

### **Core Tables**

```sql
-- Analysis Sessions (main table)
CREATE TABLE analysis_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    is_persistent BOOLEAN DEFAULT FALSE,
    user_id UUID NULL, -- For future account integration
    status session_status DEFAULT 'uploading',

    -- Resume data
    original_filename VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(50),
    extracted_text TEXT,

    -- Analysis results
    analysis_data JSONB NOT NULL DEFAULT '{}',
    refinements JSONB DEFAULT '{}',
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00

    -- Processing metadata
    processing_duration INTEGER, -- milliseconds
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- User tracking (anonymized)
    ip_address_hash VARCHAR(64), -- SHA-256 hash
    user_agent_hash VARCHAR(64),
    session_fingerprint VARCHAR(128),

    -- Analytics
    uploaded_at TIMESTAMP,
    analyzed_at TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT NOW(),
    access_count INTEGER DEFAULT 1
);

-- Skills taxonomy (comprehensive skill database)
CREATE TABLE skills_taxonomy (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    category skill_category NOT NULL,
    subcategory VARCHAR(50),
    aliases TEXT[], -- Alternative names
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    learning_time_weeks INTEGER,
    market_demand_score INTEGER CHECK (market_demand_score BETWEEN 1 AND 100),
    avg_salary_impact DECIMAL(10,2), -- Average salary increase

    -- Metadata
    description TEXT,
    prerequisites INTEGER[], -- References to other skill_ids
    related_skills INTEGER[], -- References to other skill_ids
    external_links JSONB, -- Learning resources, docs, etc.

    -- Tracking
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    popularity_rank INTEGER,
    trend_direction VARCHAR(20) -- 'rising', 'stable', 'declining'
);

-- Job market data (comprehensive job requirements)
CREATE TABLE job_requirements (
    job_id SERIAL PRIMARY KEY,
    job_title VARCHAR(100) NOT NULL,
    normalized_title VARCHAR(100), -- Standardized title
    industry VARCHAR(50),
    company_size VARCHAR(20), -- startup, small, medium, large, enterprise
    experience_level experience_level,
    location VARCHAR(100),
    remote_friendly BOOLEAN DEFAULT FALSE,

    -- Skills requirements
    required_skills INTEGER[] REFERENCES skills_taxonomy(skill_id),
    preferred_skills INTEGER[] REFERENCES skills_taxonomy(skill_id),
    skill_weights JSONB, -- Importance weight for each skill

    -- Compensation
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    equity_offered BOOLEAN DEFAULT FALSE,
    benefits_score INTEGER CHECK (benefits_score BETWEEN 1 AND 10),

    -- Sourcing metadata
    data_source VARCHAR(50), -- indeed, linkedin, glassdoor, etc.
    original_posting_url TEXT,
    scraped_at TIMESTAMP DEFAULT NOW(),
    posting_date DATE,
    is_active BOOLEAN DEFAULT TRUE,

    -- Analysis metadata
    quality_score DECIMAL(3,2), -- Data quality assessment
    last_verified TIMESTAMP DEFAULT NOW()
);

-- Session analytics (detailed user interaction tracking)
CREATE TABLE session_analytics (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES analysis_sessions(session_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    -- Event types: upload_start, upload_complete, analysis_start, analysis_complete,
    -- view_results, edit_skill, download_report, share_results, error_occurred
    event_data JSONB,

    -- Context
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    user_agent TEXT,
    viewport_size VARCHAR(20), -- e.g., "1920x1080"
    device_type VARCHAR(20), -- desktop, mobile, tablet

    -- Performance data
    load_time INTEGER, -- milliseconds
    interaction_time INTEGER, -- milliseconds spent on action

    timestamp TIMESTAMP DEFAULT NOW()
);

-- Skill trends (market trend tracking)
CREATE TABLE skill_trends (
    trend_id SERIAL PRIMARY KEY,
    skill_id INTEGER REFERENCES skills_taxonomy(skill_id),
    date DATE NOT NULL,
    job_posting_count INTEGER DEFAULT 0,
    avg_salary INTEGER,
    demand_score INTEGER CHECK (demand_score BETWEEN 1 AND 100),
    supply_score INTEGER CHECK (supply_score BETWEEN 1 AND 100), -- Based on resume appearances
    growth_rate DECIMAL(5,2), -- Percentage growth

    UNIQUE(skill_id, date)
);

-- Error logs (comprehensive error tracking)
CREATE TABLE error_logs (
    error_id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES analysis_sessions(session_id),
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT,
    stack_trace TEXT,
    request_data JSONB,
    user_agent TEXT,
    ip_address_hash VARCHAR(64),

    -- Categorization
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    component VARCHAR(50), -- parser, analyzer, database, api, etc.
    resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);
```

### **Indexes for Performance**

```sql
-- Session management indexes
CREATE INDEX idx_sessions_expires_at ON analysis_sessions(expires_at);
CREATE INDEX idx_sessions_created_at ON analysis_sessions(created_at);
CREATE INDEX idx_sessions_status ON analysis_sessions(status);
CREATE INDEX idx_sessions_user_id ON analysis_sessions(user_id) WHERE user_id IS NOT NULL;

-- Skills taxonomy indexes
CREATE INDEX idx_skills_category ON skills_taxonomy(category);
CREATE INDEX idx_skills_demand ON skills_taxonomy(market_demand_score DESC);
CREATE INDEX idx_skills_name_trgm ON skills_taxonomy USING gin (skill_name gin_trgm_ops);
CREATE INDEX idx_skills_aliases ON skills_taxonomy USING gin (aliases);
CREATE INDEX idx_skills_active ON skills_taxonomy(is_active) WHERE is_active = TRUE;

-- Job market indexes
CREATE INDEX idx_jobs_title ON job_requirements(job_title);
CREATE INDEX idx_jobs_normalized_title ON job_requirements(normalized_title);
CREATE INDEX idx_jobs_experience ON job_requirements(experience_level);
CREATE INDEX idx_jobs_salary ON job_requirements(salary_min, salary_max);
CREATE INDEX idx_jobs_active ON job_requirements(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_skills ON job_requirements USING gin (required_skills);
CREATE INDEX idx_jobs_location ON job_requirements(location);

-- Analytics indexes
CREATE INDEX idx_analytics_session ON session_analytics(session_id);
CREATE INDEX idx_analytics_event_type ON session_analytics(event_type);
CREATE INDEX idx_analytics_timestamp ON session_analytics(timestamp);

-- Trends indexes
CREATE INDEX idx_trends_skill_date ON skill_trends(skill_id, date);
CREATE INDEX idx_trends_date ON skill_trends(date);

-- Error tracking indexes
CREATE INDEX idx_errors_session ON error_logs(session_id);
CREATE INDEX idx_errors_type ON error_logs(error_type);
CREATE INDEX idx_errors_severity ON error_logs(severity);
CREATE INDEX idx_errors_unresolved ON error_logs(resolved) WHERE resolved = FALSE;
```

### **Database Triggers & Functions**

````sql
-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
---

## 🏗️ DDD-Hexagonal Architecture Implementation

### **Hexagonal Architecture Layers**

```mermaid
graph TB
    subgraph "External Actors"
        UI[Web Interface]
        API[API Clients]
        CLI[CLI Tools]
        JOBS[Job Boards APIs]
        AI[OpenAI API]
        FILE[File Storage]
        DB[(Database)]
        CACHE[(Redis Cache)]
    end

    subgraph "Hexagon (Application Core)"
        subgraph "Primary Ports (Driving)"
            ICareer[ICareerAnalysisPort]
            IDoc[IDocumentProcessingPort]
            IJob[IJobMarketPort]
            ILearn[ILearningRecommendationPort]
        end

        subgraph "Application Services"
            CareerApp[CareerAnalysisAppService]
            DocApp[DocumentProcessingAppService]
            JobApp[JobMarketAppService]
            LearnApp[LearningRecommendationAppService]
        end

        subgraph "Domain Layer"
            subgraph "Career Analysis BC"
                SkillProfile[SkillProfile]
                CareerGap[CareerGap]
                MarketPosition[MarketPosition]
            end

            subgraph "Document Processing BC"
                ResumeDoc[ResumeDocument]
                ExtractedContent[ExtractedContent]
            end

            subgraph "Job Market BC"
                JobRole[JobRole]
                SkillDemand[SkillDemand]
            end

            subgraph "Learning Recommendation BC"
                LearningObjective[LearningObjective]
                LearningResource[LearningResource]
            end
        end

        subgraph "Secondary Ports (Driven)"
            ISkillRepo[ISkillProfileRepository]
            IJobRepo[IJobRoleRepository]
            ILearningRepo[ILearningResourceRepository]
            IOpenAI[IOpenAIService]
            IFileProc[IFileProcessingService]
            IJobBoard[IJobBoardService]
        end
    end

    subgraph "Primary Adapters (Driving)"
        WebController[Web Controllers]
        RestAPI[REST API]
        GraphQL[GraphQL API]
    end

    subgraph "Secondary Adapters (Driven)"
        PostgresRepo[PostgreSQL Repositories]
        RedisCache[Redis Cache Adapter]
        OpenAIAdapter[OpenAI Adapter]
        FileAdapter[File Processing Adapter]
        JobBoardAdapter[Job Board Adapters]
    end

    UI --> WebController
    API --> RestAPI
    CLI --> GraphQL

    WebController --> ICareer
    RestAPI --> IDoc
    GraphQL --> IJob

    ICareer --> CareerApp
    IDoc --> DocApp
    IJob --> JobApp
    ILearn --> LearnApp

    CareerApp --> SkillProfile
    DocApp --> ResumeDoc
    JobApp --> JobRole
    LearnApp --> LearningObjective

    CareerApp --> ISkillRepo
    DocApp --> IFileProc
    JobApp --> IJobBoard
    LearnApp --> IOpenAI

    ISkillRepo --> PostgresRepo
    IFileProc --> FileAdapter
    IJobBoard --> JobBoardAdapter
    IOpenAI --> OpenAIAdapter

    PostgresRepo --> DB
    RedisCache --> CACHE
    OpenAIAdapter --> AI
    FileAdapter --> FILE
    JobBoardAdapter --> JOBS
````

### **Bounded Context Relationships**

```mermaid
graph LR
    subgraph "Core Domain"
        CA[Career Analysis]
    end

    subgraph "Supporting Domains"
        DP[Document Processing]
        JM[Job Market]
        LR[Learning Recommendation]
    end

    subgraph "Generic Subdomain"
        SM[Session Management]
    end

    CA --> DP : "Uses extracted skills"
    CA --> JM : "Compares against market"
    CA --> LR : "Requests learning paths"
    DP --> CA : "Provides skill profile"
    JM --> CA : "Provides market data"
    LR --> CA : "Provides recommendations"

    CA --> SM : "Creates sessions"
    DP --> SM : "Stores documents"
    JM --> SM : "Caches market data"
    LR --> SM : "Tracks progress"
```

---

### **Domain-Driven Database Design**

```sql
-- ================================================
-- CAREER ANALYSIS BOUNDED CONTEXT
-- ================================================

-- Skill Profiles (Aggregate Root)
CREATE TABLE skill_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL, -- Value Object: SessionId
    experience_level VARCHAR(50) NOT NULL, -- Value Object: ExperienceLevel
    years_experience INTEGER,
    average_proficiency DECIMAL(3,2),
    profile_completeness DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1 -- For optimistic locking
);

-- Skills (Value Objects within SkillProfile)
CREATE TABLE profile_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_profile_id UUID REFERENCES skill_profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(200) NOT NULL, -- Value Object: Skill
    skill_category VARCHAR(100) NOT NULL,
    skill_subcategory VARCHAR(100),
    standardized_name VARCHAR(200),
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 4), -- Value Object: ProficiencyLevel
    confidence_score DECIMAL(3,2),
    years_experience INTEGER,
    last_used_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career Gaps (Entity within Career Analysis)
CREATE TABLE career_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_profile_id UUID REFERENCES skill_profiles(id) ON DELETE CASCADE,
    target_role_title VARCHAR(200) NOT NULL,
    target_industry VARCHAR(100),
    gap_score DECIMAL(5,2) NOT NULL,
    time_to_close_weeks INTEGER,
    is_market_ready BOOLEAN DEFAULT FALSE,
    priority_rank INTEGER,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gap Details (Value Objects within CareerGap)
CREATE TABLE gap_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_gap_id UUID REFERENCES career_gaps(id) ON DELETE CASCADE,
    gap_type VARCHAR(50) NOT NULL, -- 'missing_skill' or 'proficiency_gap'
    skill_name VARCHAR(200) NOT NULL,
    current_level INTEGER, -- NULL for missing skills
    required_level INTEGER NOT NULL,
    gap_size INTEGER NOT NULL,
    learning_priority VARCHAR(20) -- 'high', 'medium', 'low'
);

-- Market Positions (Entity within Career Analysis)
CREATE TABLE market_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_profile_id UUID REFERENCES skill_profiles(id) ON DELETE CASCADE,
    overall_readiness_score DECIMAL(3,2),
    salary_percentile INTEGER,
    estimated_current_salary DECIMAL(10,2),
    estimated_potential_salary DECIMAL(10,2),
    competitive_advantage_score DECIMAL(3,2),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- DOCUMENT PROCESSING BOUNDED CONTEXT
-- ================================================

-- Resume Documents (Aggregate Root)
CREATE TABLE resume_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL, -- Links to Session Management
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- Value Object: FileFormat
    file_size_bytes INTEGER NOT NULL,
    file_hash VARCHAR(64) UNIQUE NOT NULL,
    processing_status VARCHAR(50) DEFAULT 'pending', -- Value Object: ProcessingStatus
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    version INTEGER DEFAULT 1
);

-- Extracted Content (Entity within Document Processing)
CREATE TABLE extracted_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES resume_documents(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- 'raw_text', 'structured_data', 'metadata'
    extracted_text TEXT,
    structured_data JSONB,
    extraction_confidence DECIMAL(3,2),
    extraction_method VARCHAR(100), -- 'pdf_parser', 'ocr', 'ai_extraction'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Extractions (Entity within Document Processing)
CREATE TABLE skill_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES resume_documents(id) ON DELETE CASCADE,
    extracted_skill_name VARCHAR(200) NOT NULL,
    standardized_skill_name VARCHAR(200),
    skill_category VARCHAR(100),
    confidence_score DECIMAL(3,2) NOT NULL, -- Value Object: ConfidenceScore
    extraction_context TEXT, -- Where in document this was found
    proficiency_indicators TEXT[], -- Text that suggests proficiency level
    suggested_proficiency_level INTEGER,
    validation_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- JOB MARKET BOUNDED CONTEXT
-- ================================================

-- Job Roles (Aggregate Root)
CREATE TABLE job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title VARCHAR(200) NOT NULL, -- Value Object: JobTitle
    normalized_title VARCHAR(200) NOT NULL,
    industry VARCHAR(100) NOT NULL, -- Value Object: Industry
    job_family VARCHAR(100),
    experience_level VARCHAR(50),
    average_salary DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    demand_score INTEGER CHECK (demand_score BETWEEN 1 AND 100),
    growth_rate DECIMAL(5,2), -- Year-over-year growth percentage
    is_trending BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Role Skills (Value Objects within JobRole)
CREATE TABLE job_role_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_role_id UUID REFERENCES job_roles(id) ON DELETE CASCADE,
    skill_name VARCHAR(200) NOT NULL,
    skill_category VARCHAR(100),
    is_required BOOLEAN DEFAULT TRUE, -- vs preferred
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 4),
    importance_weight DECIMAL(3,2) DEFAULT 1.0, -- How important this skill is
    market_frequency DECIMAL(3,2), -- How often this appears in job postings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Demand (Entity within Job Market)
CREATE TABLE skill_demand (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(200) NOT NULL,
    skill_category VARCHAR(100),
    demand_score INTEGER CHECK (demand_score BETWEEN 1 AND 100),
    growth_trend VARCHAR(20), -- 'rising', 'stable', 'declining'
    job_postings_count INTEGER,
    average_salary_impact DECIMAL(10,2),
    time_period DATE NOT NULL, -- Month/year this data represents
    geographic_scope VARCHAR(100) DEFAULT 'global',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Salary Benchmarks (Entity within Job Market)
CREATE TABLE salary_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    location VARCHAR(200), -- Value Object: Location
    experience_level VARCHAR(50),
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_median DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    data_source VARCHAR(100),
    sample_size INTEGER,
    as_of_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- LEARNING RECOMMENDATION BOUNDED CONTEXT
-- ================================================

-- Learning Objectives (Aggregate Root)
CREATE TABLE learning_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_profile_id UUID NOT NULL, -- Links to Career Analysis
    target_skill_name VARCHAR(200) NOT NULL,
    current_proficiency_level INTEGER,
    target_proficiency_level INTEGER NOT NULL,
    learning_priority VARCHAR(20), -- Value Object: LearningPriority
    estimated_time_weeks INTEGER, -- Value Object: TimeToMaster
    learning_difficulty INTEGER CHECK (learning_difficulty BETWEEN 1 AND 5),
    motivation_score DECIMAL(3,2),
    completion_status VARCHAR(50) DEFAULT 'not_started',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    target_completion_date DATE
);

-- Learning Resources (Entity within Learning Recommendation)
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_title VARCHAR(300) NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- Value Object: ResourceType
    provider VARCHAR(200),
    resource_url VARCHAR(500),
    cost_usd DECIMAL(8,2),
    is_free BOOLEAN DEFAULT FALSE,
    duration_hours INTEGER,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    rating DECIMAL(3,2),
    reviews_count INTEGER DEFAULT 0,
    language VARCHAR(10) DEFAULT 'en',
    certification_provided BOOLEAN DEFAULT FALSE,
    last_verified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource Skills (What skills this resource teaches)
CREATE TABLE resource_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_resource_id UUID REFERENCES learning_resources(id) ON DELETE CASCADE,
    skill_name VARCHAR(200) NOT NULL,
    skill_category VARCHAR(100),
    teaches_from_level INTEGER DEFAULT 1,
    teaches_to_level INTEGER NOT NULL,
    primary_focus BOOLEAN DEFAULT FALSE, -- Is this the main skill taught?
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Development Plans (Entity within Learning Recommendation)
CREATE TABLE skill_development_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_objective_id UUID REFERENCES learning_objectives(id) ON DELETE CASCADE,
    recommended_resources UUID[] NOT NULL, -- Array of learning_resource IDs
    learning_sequence INTEGER[] NOT NULL, -- Order to take resources
    total_estimated_time_weeks INTEGER,
    total_estimated_cost DECIMAL(10,2),
    plan_effectiveness_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_optimized TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- SESSION MANAGEMENT (GENERIC SUBDOMAIN)
-- ================================================

-- Analysis Sessions (Aggregate Root)
CREATE TABLE analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(255) UNIQUE NOT NULL, -- Value Object: SessionId
    session_status VARCHAR(50) DEFAULT 'active', -- Value Object: SessionStatus
    privacy_consent BOOLEAN DEFAULT FALSE,
    retention_policy VARCHAR(50) DEFAULT '30_days', -- Value Object: RetentionPolicy
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_count INTEGER DEFAULT 1,
    is_persistent BOOLEAN DEFAULT FALSE
);

-- User Analytics (Entity within Session Management)
CREATE TABLE user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent_hash VARCHAR(64), -- Privacy-friendly hashed version
    ip_address_hash VARCHAR(64),  -- Privacy-friendly hashed version
    geolocation_country VARCHAR(3),
    page_url VARCHAR(500),
    referrer_url VARCHAR(500)
);

-- ================================================
-- CROSS-CONTEXT REFERENCE DATA
-- ================================================

-- Skills Taxonomy (Shared Kernel)
CREATE TABLE skills_taxonomy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(200) NOT NULL,
    standardized_name VARCHAR(200) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    aliases TEXT[],
    skill_description TEXT,
    market_demand_score INTEGER CHECK (market_demand_score BETWEEN 1 AND 100),
    learning_difficulty INTEGER CHECK (learning_difficulty BETWEEN 1 AND 5),
    avg_time_to_learn_weeks INTEGER,
    avg_salary_impact DECIMAL(10,2),
    related_skills TEXT[],
    prerequisites TEXT[],
    is_trending BOOLEAN DEFAULT FALSE,
    trend_direction VARCHAR(20), -- 'rising', 'stable', 'declining'
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Career Analysis Indexes
CREATE INDEX idx_skill_profiles_session ON skill_profiles(session_id);
CREATE INDEX idx_profile_skills_profile ON profile_skills(skill_profile_id);
CREATE INDEX idx_profile_skills_name ON profile_skills(skill_name);
CREATE INDEX idx_career_gaps_profile ON career_gaps(skill_profile_id);
CREATE INDEX idx_career_gaps_priority ON career_gaps(priority_rank);
CREATE INDEX idx_market_positions_profile ON market_positions(skill_profile_id);

-- Document Processing Indexes
CREATE INDEX idx_resume_documents_session ON resume_documents(session_id);
CREATE INDEX idx_resume_documents_hash ON resume_documents(file_hash);
CREATE INDEX idx_extracted_content_document ON extracted_content(document_id);
CREATE INDEX idx_skill_extractions_document ON skill_extractions(document_id);
CREATE INDEX idx_skill_extractions_skill ON skill_extractions(extracted_skill_name);

-- Job Market Indexes
CREATE INDEX idx_job_roles_title ON job_roles(job_title);
CREATE INDEX idx_job_roles_industry ON job_roles(industry);
CREATE INDEX idx_job_roles_trending ON job_roles(is_trending, demand_score DESC);
CREATE INDEX idx_job_role_skills_role ON job_role_skills(job_role_id);
CREATE INDEX idx_job_role_skills_name ON job_role_skills(skill_name);
CREATE INDEX idx_skill_demand_name ON skill_demand(skill_name, time_period DESC);
CREATE INDEX idx_salary_benchmarks_role ON salary_benchmarks(job_title, location);

-- Learning Recommendation Indexes
CREATE INDEX idx_learning_objectives_profile ON learning_objectives(skill_profile_id);
CREATE INDEX idx_learning_objectives_skill ON learning_objectives(target_skill_name);
CREATE INDEX idx_learning_resources_type ON learning_resources(resource_type, difficulty_level);
CREATE INDEX idx_learning_resources_free ON learning_resources(is_free, rating DESC);
CREATE INDEX idx_resource_skills_resource ON resource_skills(learning_resource_id);
CREATE INDEX idx_resource_skills_skill ON resource_skills(skill_name);
CREATE INDEX idx_development_plans_objective ON skill_development_plans(learning_objective_id);

-- Session Management Indexes
CREATE INDEX idx_analysis_sessions_token ON analysis_sessions(session_token);
CREATE INDEX idx_analysis_sessions_expires ON analysis_sessions(expires_at);
CREATE INDEX idx_user_analytics_session ON user_analytics(session_id, event_timestamp);
CREATE INDEX idx_user_analytics_event ON user_analytics(event_type, event_timestamp);

-- Skills Taxonomy Indexes
CREATE INDEX idx_skills_taxonomy_standard ON skills_taxonomy(standardized_name);
CREATE INDEX idx_skills_taxonomy_category ON skills_taxonomy(category, subcategory);
CREATE INDEX idx_skills_taxonomy_trending ON skills_taxonomy(is_trending, market_demand_score DESC);

-- Full-text search indexes
CREATE INDEX idx_skills_taxonomy_search ON skills_taxonomy USING GIN(
    to_tsvector('english', skill_name || ' ' || COALESCE(array_to_string(aliases, ' '), ''))
);

CREATE INDEX idx_job_roles_search ON job_roles USING GIN(
    to_tsvector('english', job_title || ' ' || industry)
);

-- ================================================
-- DOMAIN CONSTRAINTS & BUSINESS RULES
-- ================================================

-- Ensure proficiency levels are consistent within a skill profile
CREATE OR REPLACE FUNCTION validate_skill_proficiency_consistency()
RETURNS TRIGGER AS $$
BEGIN
    -- Business rule: A person cannot have expert level (4) in a skill
    -- without having reasonable experience
    IF NEW.proficiency_level = 4 AND (NEW.years_experience IS NULL OR NEW.years_experience < 2) THEN
        RAISE EXCEPTION 'Expert proficiency level requires at least 2 years of experience';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_skill_proficiency
    BEFORE INSERT OR UPDATE ON profile_skills
    FOR EACH ROW
    EXECUTE FUNCTION validate_skill_proficiency_consistency();

-- Ensure gap analysis is realistic
CREATE OR REPLACE FUNCTION validate_career_gap_analysis()
RETURNS TRIGGER AS $$
BEGIN
    -- Business rule: Time to close gaps cannot be negative or unreasonably high
    IF NEW.time_to_close_weeks < 0 OR NEW.time_to_close_weeks > 520 THEN -- Max 10 years
        RAISE EXCEPTION 'Time to close gaps must be between 0 and 520 weeks';
    END IF;

    -- Business rule: Gap score should correlate with time to close
    IF NEW.gap_score > 50 AND NEW.time_to_close_weeks < 12 THEN
        RAISE WARNING 'Large skill gaps typically require more than 12 weeks to close';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_career_gap
    BEFORE INSERT OR UPDATE ON career_gaps
    FOR EACH ROW
    EXECUTE FUNCTION validate_career_gap_analysis();

-- ================================================
-- AGGREGATE CONSISTENCY TRIGGERS
-- ================================================

-- Update skill profile completeness when skills change
CREATE OR REPLACE FUNCTION update_skill_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
    skill_count INTEGER;
    profile_completeness DECIMAL(3,2);
BEGIN
    -- Count skills in the profile
    SELECT COUNT(*) INTO skill_count
    FROM profile_skills
    WHERE skill_profile_id = COALESCE(NEW.skill_profile_id, OLD.skill_profile_id);

    -- Calculate completeness based on skill count and other factors
    -- (This is a simplified calculation - in reality, this would be more complex)
    profile_completeness := LEAST(1.0, skill_count::DECIMAL / 15.0); -- Assume 15 skills = 100% complete

    -- Update the skill profile
    UPDATE skill_profiles
    SET profile_completeness = profile_completeness,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.skill_profile_id, OLD.skill_profile_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_completeness_insert
    AFTER INSERT ON profile_skills
    FOR EACH ROW
    EXECUTE FUNCTION update_skill_profile_completeness();

CREATE TRIGGER trigger_update_profile_completeness_delete
    AFTER DELETE ON profile_skills
    FOR EACH ROW
    EXECUTE FUNCTION update_skill_profile_completeness();

-- ================================================
-- DATA CLEANUP AND MAINTENANCE
-- ================================================

-- Function to clean up expired sessions and related data
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete expired sessions (CASCADE will handle related data)
    DELETE FROM analysis_sessions
    WHERE expires_at < NOW() AND is_persistent = FALSE;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    -- Log cleanup activity
    INSERT INTO user_analytics (session_id, event_type, event_data)
    VALUES (gen_random_uuid(), 'system_cleanup',
            jsonb_build_object('deleted_sessions', deleted_count));

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh materialized views and update computed fields
CREATE OR REPLACE FUNCTION refresh_computed_data()
RETURNS void AS $$
BEGIN
    -- Update skill demand scores based on recent job market data
    UPDATE skills_taxonomy st
    SET market_demand_score = (
        SELECT COALESCE(AVG(jrs.importance_weight * jr.demand_score), 0)::INTEGER
        FROM job_role_skills jrs
        JOIN job_roles jr ON jrs.job_role_id = jr.id
        WHERE jrs.skill_name = st.standardized_name
        AND jr.last_updated >= NOW() - INTERVAL '30 days'
    ),
    last_updated = NOW()
    WHERE EXISTS (
        SELECT 1 FROM job_role_skills jrs
        WHERE jrs.skill_name = st.standardized_name
    );

    -- Update trending status for skills
    UPDATE skills_taxonomy
    SET is_trending = (
        market_demand_score > 75 AND
        trend_direction = 'rising'
    );

END;
$$ LANGUAGE plpgsql;
```

## 📁 DDD-Hexagonal Project Structure

```
skillara-analyzer/
├── README.md                           # Project overview and DDD concepts
├── docker-compose.yml                  # Local development environment
├── .env.example                        # Environment variables template
├── package.json                        # Root package.json for scripts
├── tsconfig.json                       # Shared TypeScript configuration
├── .github/workflows/                  # CI/CD pipelines
├── docs/                               # Documentation
│   ├── domain-model/                   # Domain modeling docs
│   ├── architecture/                   # Architecture decisions
│   └── ubiquitous-language.md          # Domain terminology
├── scripts/                            # Utility scripts
├── shared/                             # Shared kernel
│   ├── types/                          # Common types
│   ├── value-objects/                  # Shared value objects
│   └── utils/                          # Shared utilities
├── frontend/                           # UI Adapter (Next.js)
│   ├── adapters/                       # Frontend adapters
│   │   ├── api/                        # API adapters
│   │   ├── components/                 # UI components
│   │   └── hooks/                      # React hooks adapters
│   ├── app/                            # Next.js app router
│   └── lib/                            # Frontend utilities
├── backend/                            # Application & Infrastructure Layer
│   ├── src/
│   │   ├── application/                # Application Services Layer
│   │   │   ├── services/               # Application services
│   │   │   │   ├── CareerAnalysisApplicationService.ts
│   │   │   │   ├── DocumentProcessingApplicationService.ts
│   │   │   │   ├── JobMarketApplicationService.ts
│   │   │   │   └── LearningRecommendationApplicationService.ts
│   │   │   ├── ports/                  # Primary ports (interfaces)
│   │   │   │   ├── primary/            # Driving ports
│   │   │   │   │   ├── ICareerAnalysisPort.ts
│   │   │   │   │   ├── IDocumentProcessingPort.ts
│   │   │   │   │   ├── IJobMarketPort.ts
│   │   │   │   │   └── ILearningRecommendationPort.ts
│   │   │   │   └── secondary/          # Driven ports
│   │   │   │       ├── repositories/   # Repository interfaces
│   │   │   │       ├── services/       # External service interfaces
│   │   │   │       └── infrastructure/ # Infrastructure interfaces
│   │   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── commands/               # Command objects (CQRS)
│   │   │   ├── queries/                # Query objects (CQRS)
│   │   │   └── handlers/               # Command/Query handlers
│   │   │       ├── commands/
│   │   │       └── queries/
│   │   ├── domain/                     # Domain Layer
│   │   │   ├── career-analysis/        # Career Analysis Bounded Context
│   │   │   │   ├── entities/           # Domain entities
│   │   │   │   │   ├── SkillProfile.ts
│   │   │   │   │   ├── CareerGap.ts
│   │   │   │   │   ├── MarketPosition.ts
│   │   │   │   │   └── LearningPath.ts
│   │   │   │   ├── value-objects/      # Value objects
│   │   │   │   │   ├── Skill.ts
│   │   │   │   │   ├── ProficiencyLevel.ts
│   │   │   │   │   ├── ExperienceLevel.ts
│   │   │   │   │   └── SessionId.ts
│   │   │   │   ├── aggregates/         # Aggregate roots
│   │   │   │   │   └── CareerAnalysisAggregate.ts
│   │   │   │   ├── domain-services/    # Domain services
│   │   │   │   │   ├── SkillGapAnalyzer.ts
│   │   │   │   │   ├── MarketPositionCalculator.ts
│   │   │   │   │   └── LearningPathGenerator.ts
│   │   │   │   ├── specifications/     # Business rules
│   │   │   │   │   ├── SkillGapSpecification.ts
│   │   │   │   │   └── MarketReadinessSpecification.ts
│   │   │   │   ├── events/             # Domain events
│   │   │   │   │   ├── SkillProfileCreated.ts
│   │   │   │   │   ├── CareerGapAnalyzed.ts
│   │   │   │   │   └── LearningPathGenerated.ts
│   │   │   │   └── repositories/       # Repository interfaces
│   │   │   │       └── ISkillProfileRepository.ts
│   │   │   ├── document-processing/    # Document Processing Bounded Context
│   │   │   │   ├── entities/
│   │   │   │   │   ├── ResumeDocument.ts
│   │   │   │   │   ├── ExtractedContent.ts
│   │   │   │   │   └── SkillExtraction.ts
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── DocumentMetadata.ts
│   │   │   │   │   ├── FileFormat.ts
│   │   │   │   │   └── ConfidenceScore.ts
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── DocumentProcessingAggregate.ts
│   │   │   │   ├── domain-services/
│   │   │   │   │   ├── DocumentValidator.ts
│   │   │   │   │   ├── TextExtractor.ts
│   │   │   │   │   └── SkillExtractor.ts
│   │   │   │   ├── events/
│   │   │   │   │   ├── DocumentUploaded.ts
│   │   │   │   │   ├── ContentExtracted.ts
│   │   │   │   │   └── SkillsIdentified.ts
│   │   │   │   └── repositories/
│   │   │   │       └── IResumeDocumentRepository.ts
│   │   │   ├── job-market/             # Job Market Bounded Context
│   │   │   │   ├── entities/
│   │   │   │   │   ├── JobRole.ts
│   │   │   │   │   ├── SkillDemand.ts
│   │   │   │   │   └── SalaryBenchmark.ts
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── JobTitle.ts
│   │   │   │   │   ├── Industry.ts
│   │   │   │   │   ├── Location.ts
│   │   │   │   │   └── SalaryRange.ts
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── JobMarketAggregate.ts
│   │   │   │   ├── domain-services/
│   │   │   │   │   ├── SalaryCalculator.ts
│   │   │   │   │   ├── DemandAnalyzer.ts
│   │   │   │   │   └── TrendPredictor.ts
│   │   │   │   ├── events/
│   │   │   │   │   ├── JobRoleUpdated.ts
│   │   │   │   │   └── SkillDemandChanged.ts
│   │   │   │   └── repositories/
│   │   │   │       ├── IJobRoleRepository.ts
│   │   │   │       └── ISkillDemandRepository.ts
│   │   │   ├── learning-recommendation/ # Learning Recommendation Bounded Context
│   │   │   │   ├── entities/
│   │   │   │   │   ├── LearningObjective.ts
│   │   │   │   │   ├── LearningResource.ts
│   │   │   │   │   └── SkillDevelopmentPlan.ts
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── LearningDifficulty.ts
│   │   │   │   │   ├── TimeToMaster.ts
│   │   │   │   │   └── ResourceType.ts
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── LearningRecommendationAggregate.ts
│   │   │   │   ├── domain-services/
│   │   │   │   │   ├── PathOptimizer.ts
│   │   │   │   │   ├── ResourceMatcher.ts
│   │   │   │   │   └── ProgressEstimator.ts
│   │   │   │   ├── events/
│   │   │   │   │   ├── LearningPathCreated.ts
│   │   │   │   │   └── ResourceRecommended.ts
│   │   │   │   └── repositories/
│   │   │   │       └── ILearningResourceRepository.ts
│   │   │   └── session-management/     # Session Management Bounded Context
│   │   │       ├── entities/
│   │   │       │   ├── AnalysisSession.ts
│   │   │       │   └── UserAnalytics.ts
│   │   │       ├── value-objects/
│   │   │       │   ├── SessionStatus.ts
│   │   │       │   └── RetentionPolicy.ts
│   │   │       ├── aggregates/
│   │   │       │   └── SessionAggregate.ts
│   │   │       ├── domain-services/
│   │   │       │   ├── SessionManager.ts
│   │   │       │   └── PrivacyEnforcer.ts
│   │   │       ├── events/
│   │   │       │   ├── SessionCreated.ts
│   │   │       │   └── SessionExpired.ts
│   │   │       └── repositories/
│   │   │           └── IAnalysisSessionRepository.ts
│   │   ├── infrastructure/             # Infrastructure Layer (Secondary Adapters)
│   │   │   ├── adapters/               # Infrastructure adapters
│   │   │   │   ├── repositories/       # Repository implementations
│   │   │   │   │   ├── postgresql/     # PostgreSQL implementations
│   │   │   │   │   │   ├── SkillProfileRepository.ts
│   │   │   │   │   │   ├── JobRoleRepository.ts
│   │   │   │   │   │   ├── LearningResourceRepository.ts
│   │   │   │   │   │   └── AnalysisSessionRepository.ts
│   │   │   │   │   └── redis/          # Redis implementations
│   │   │   │   │       └── CacheRepository.ts
│   │   │   │   ├── external-services/  # External service adapters
│   │   │   │   │   ├── openai/         # OpenAI adapter
│   │   │   │   │   │   ├── OpenAISkillExtractor.ts
│   │   │   │   │   │   └── OpenAIAnalysisService.ts
│   │   │   │   │   ├── file-processing/ # File processing adapters
│   │   │   │   │   │   ├── PDFParser.ts
│   │   │   │   │   │   └── WordDocumentParser.ts
│   │   │   │   │   └── job-boards/     # Job board integrations
│   │   │   │   │       ├── IndeedAdapter.ts
│   │   │   │   │       └── LinkedInAdapter.ts
│   │   │   │   ├── messaging/          # Event handling
│   │   │   │   │   ├── EventBus.ts
│   │   │   │   │   └── DomainEventHandler.ts
│   │   │   │   └── analytics/          # Analytics adapters
│   │   │   │       ├── AnalyticsAdapter.ts
│   │   │   │       └── MetricsCollector.ts
│   │   │   ├── config/                 # Infrastructure configuration
│   │   │   │   ├── database.ts
│   │   │   │   ├── redis.ts
│   │   │   │   └── external-services.ts
│   │   │   └── migrations/             # Database migrations
│   │   │       └── postgresql/
│   │   └── web/                        # Web Layer (Primary Adapters)
│   │       ├── controllers/            # REST controllers
│   │       │   ├── CareerAnalysisController.ts
│   │       │   ├── DocumentProcessingController.ts
│   │       │   ├── JobMarketController.ts
│   │       │   └── LearningRecommendationController.ts
│   │       ├── middleware/              # Express middleware
│   │       ├── routes/                  # Route definitions
│   │       ├── dto/                     # API Data Transfer Objects
│   │       └── mappers/                 # DTO to Domain mappers
│   └── tests/                          # Tests organized by layer
│       ├── unit/                       # Unit tests
│       │   ├── domain/                 # Domain layer tests
│       │   ├── application/            # Application service tests
│       │   └── infrastructure/         # Infrastructure tests
│       ├── integration/                # Integration tests
│       │   ├── repositories/
│       │   └── external-services/
│       └── acceptance/                 # Acceptance tests
│           └── features/               # Feature-based tests
└── database/                           # Database scripts and seeds
    ├── migrations/
    ├── seeds/
    └── scripts/
```

### **Configuration Files Details**

#### **Root package.json (Monorepo Scripts)**

```json
{
  "name": "skillara-analyzer-ddd",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "test": "npm run test:frontend && npm run test:backend",
    "test:unit": "cd backend && npm run test:unit",
    "test:integration": "cd backend && npm run test:integration",
    "test:acceptance": "cd backend && npm run test:acceptance",
    "test:domain": "cd backend && npm run test:domain",
    "lint": "npm run lint:frontend && npm run lint:backend",
    "db:migrate": "cd backend && npm run db:migrate",
    "db:seed": "cd backend && npm run db:seed",
    "docker:dev": "docker-compose up -d",
    "deploy:staging": "./scripts/deploy.sh staging",
    "deploy:production": "./scripts/deploy.sh production"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "husky": "^8.0.3",
    "lint-staged": "^14.0.1"
  }
}
```

---

## 🔧 Implementation Plan

### **Week 1: Foundation & Setup**

#### **Day 1-2: Project Setup & Environment**

```bash
# Step 1: Initialize project structure
mkdir skillara-analyzer
cd skillara-analyzer

# Step 2: Setup monorepo structure
mkdir -p frontend backend shared database/{migrations,seeds,scripts} docs/{api,deployment} scripts monitoring

# Step 3: Initialize package.json files
npm init -y
cd frontend && npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
cd ../backend && npm init -y

# Step 4: Install root dependencies
npm install --save-dev concurrently husky lint-staged

# Step 5: Setup TypeScript configs
# Root tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/shared/*": ["./shared/*"],
      "@/frontend/*": ["./frontend/*"],
      "@/backend/*": ["./backend/*"]
    }
  },
  "include": ["./shared/**/*"],
  "exclude": ["node_modules"]
}
EOF

# Step 6: Setup Git and initial commit
git init
echo "node_modules/
.env
.env.local
dist/
build/
logs/
uploads/*.pdf
uploads/*.doc
uploads/*.docx
.DS_Store
*.log" > .gitignore

git add .
git commit -m "Initial project setup"
```

#### **Day 3-4: Database Setup & Configuration**

```sql
-- database/migrations/001_initial_schema.sql
-- Execute the complete schema from the Database Schema section above

-- database/seeds/001_initial_skills.sql
-- Seed basic skills taxonomy
INSERT INTO skills_taxonomy (skill_name, category, difficulty_level, learning_time_weeks, market_demand_score) VALUES
-- Frontend Skills
('React', 'frontend', 3, 8, 95),
('TypeScript', 'frontend', 4, 6, 90),
('JavaScript', 'frontend', 2, 4, 98),
('HTML/CSS', 'frontend', 1, 2, 85),
('Next.js', 'frontend', 4, 6, 85),
('Vue.js', 'frontend', 3, 6, 80),
('Angular', 'frontend', 4, 8, 75),

-- Backend Skills
('Node.js', 'backend', 3, 6, 92),
('Express.js', 'backend', 2, 4, 88),
('Python', 'backend', 3, 8, 95),
('Java', 'backend', 4, 12, 85),
('C#', 'backend', 4, 10, 80),
('Go', 'backend', 4, 8, 78),
('Rust', 'backend', 5, 12, 70),

-- Database Skills
('PostgreSQL', 'database', 3, 6, 88),
('MongoDB', 'database', 3, 4, 82),
('Redis', 'database', 2, 3, 75),
('MySQL', 'database', 3, 6, 85),

-- DevOps Skills
('Docker', 'devops', 3, 4, 90),
('Kubernetes', 'devops', 5, 12, 85),
('AWS', 'devops', 4, 8, 92),
('CI/CD', 'devops', 3, 6, 88);
```

```bash
# database/scripts/setup.sh
#!/bin/bash
set -e

echo "Setting up CareerCraft database..."

# Create database
createdb careercraft_dev 2>/dev/null || echo "Database already exists"

# Run migrations
psql careercraft_dev < migrations/001_initial_schema.sql
echo "✅ Schema created"

# Run seeds
psql careercraft_dev < seeds/001_initial_skills.sql
echo "✅ Initial data seeded"

# Setup Redis
redis-cli ping > /dev/null 2>&1 && echo "✅ Redis connection verified" || echo "❌ Redis not running"

echo "🎉 Database setup complete!"
```

#### **Day 5-7: Basic Backend Structure**

```typescript
// backend/src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import RedisStore from "connect-redis";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { errorHandler } from "./middleware/error-handler";
import { logger } from "./config/logger";
import { redis } from "./config/redis";
import routes from "./routes";

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter rate limiting for uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 uploads per minute
  message: "Upload rate limit exceeded. Please wait before uploading again.",
});
app.use("/api/upload", uploadLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());

// Session management
app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 48 * 60 * 60 * 1000, // 48 hours
    },
    name: "careercraft_session",
  })
);

// Logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Error handling
app.use(errorHandler);

export default app;
```

```typescript
// backend/src/server.ts
import app from "./app";
import { logger } from "./config/logger";
import { connectDatabase } from "./config/database";
import { connectRedis } from "./config/redis";

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Connect to databases
    await connectDatabase();
    await connectRedis();

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

startServer();
```

```typescript
// backend/src/config/database.ts
import { Pool } from "pg";
import { logger } from "./logger";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function connectDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();

    logger.info(`✅ Database connected at ${result.rows[0].now}`);
  } catch (error) {
    logger.error("❌ Database connection failed:", error);
    throw error;
  }
}

// Cleanup function
export async function closeDatabaseConnection(): Promise<void> {
  await pool.end();
  logger.info("📦 Database connection closed");
}
```

```typescript
// backend/src/config/redis.ts
import { createClient } from "redis";
import { logger } from "./logger";

export const redis = createClient({
  url: process.env.REDIS_URL,
  retry_delay_on_failure: 5000,
  max_attempts: 3,
});

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
    logger.info("✅ Redis connected");
  } catch (error) {
    logger.error("❌ Redis connection failed:", error);
    throw error;
  }
}

redis.on("error", (error) => {
  logger.error("Redis error:", error);
});

redis.on("connect", () => {
  logger.info("Redis client connected");
});

redis.on("ready", () => {
  logger.info("Redis client ready");
});
```

```typescript
// backend/src/config/logger.ts
import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: { service: "careercraft-api" },
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Console logging for development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
```

---

## 🔧 Application Services & Port Implementations

### **Primary Ports (Driving Adapters)**

```typescript
// backend/src/application/ports/primary/ICareerAnalysisPort.ts
import { AnalyzeSkillGapCommand } from "../../commands/AnalyzeSkillGapCommand";
import { SkillGapAnalysisDto } from "../../dto/SkillGapAnalysisDto";
import { UpdateSkillProfileCommand } from "../../commands/UpdateSkillProfileCommand";
import { SkillProfileDto } from "../../dto/SkillProfileDto";

export interface ICareerAnalysisPort {
  analyzeSkillGap(
    command: AnalyzeSkillGapCommand
  ): Promise<SkillGapAnalysisDto>;
  getAnalysisById(analysisId: string): Promise<SkillGapAnalysisDto | null>;
  updateSkillProfile(
    command: UpdateSkillProfileCommand
  ): Promise<SkillProfileDto>;
  getSkillProfile(sessionId: string): Promise<SkillProfileDto | null>;
  deleteAnalysis(sessionId: string): Promise<void>;
}

// backend/src/application/ports/primary/IDocumentProcessingPort.ts
import { ProcessDocumentCommand } from "../../commands/ProcessDocumentCommand";
import { ExtractedSkillsDto } from "../../dto/ExtractedSkillsDto";
import { ValidateDocumentCommand } from "../../commands/ValidateDocumentCommand";
import { DocumentValidationDto } from "../../dto/DocumentValidationDto";

export interface IDocumentProcessingPort {
  processDocument(command: ProcessDocumentCommand): Promise<ExtractedSkillsDto>;
  validateDocument(
    command: ValidateDocumentCommand
  ): Promise<DocumentValidationDto>;
  getDocumentById(documentId: string): Promise<ExtractedSkillsDto | null>;
  getProcessingStatus(documentId: string): Promise<string>;
  retryProcessing(documentId: string): Promise<ExtractedSkillsDto>;
}

// backend/src/application/ports/primary/IJobMarketPort.ts
import { GetMarketDataQuery } from "../../queries/GetMarketDataQuery";
import { JobMarketDataDto } from "../../dto/JobMarketDataDto";
import { GetSalaryBenchmarkQuery } from "../../queries/GetSalaryBenchmarkQuery";
import { SalaryBenchmarkDto } from "../../dto/SalaryBenchmarkDto";

export interface IJobMarketPort {
  getMarketDataForRoles(query: GetMarketDataQuery): Promise<JobMarketDataDto>;
  getSalaryBenchmarks(
    query: GetSalaryBenchmarkQuery
  ): Promise<SalaryBenchmarkDto>;
  getTrendingSkills(): Promise<string[]>;
  getJobGrowthTrends(): Promise<JobTrendDto[]>;
  searchJobRoles(searchTerm: string): Promise<JobRoleDto[]>;
}

// backend/src/application/ports/primary/ILearningRecommendationPort.ts
import { GenerateLearningPathCommand } from "../../commands/GenerateLearningPathCommand";
import { LearningPathDto } from "../../dto/LearningPathDto";
import { SearchResourcesQuery } from "../../queries/SearchResourcesQuery";
import { LearningResourceDto } from "../../dto/LearningResourceDto";

export interface ILearningRecommendationPort {
  generateLearningPath(
    command: GenerateLearningPathCommand
  ): Promise<LearningPathDto>;
  searchLearningResources(
    query: SearchResourcesQuery
  ): Promise<LearningResourceDto[]>;
  optimizeLearningPath(
    pathId: string,
    preferences: LearningPreferences
  ): Promise<LearningPathDto>;
  trackLearningProgress(progressUpdate: LearningProgressUpdate): Promise<void>;
}
```

### **Secondary Ports (Driven Adapters)**

```typescript
// backend/src/application/ports/secondary/repositories/ISkillProfileRepository.ts
import { SkillProfile } from "../../../domain/career-analysis/entities/SkillProfile";
import { SessionId } from "../../../domain/career-analysis/value-objects/SessionId";
import { Skill } from "../../../domain/career-analysis/value-objects/Skill";

export interface ISkillProfileRepository {
  findById(id: string): Promise<SkillProfile | null>;
  findBySessionId(sessionId: SessionId): Promise<SkillProfile | null>;
  save(skillProfile: SkillProfile): Promise<void>;
  delete(id: string): Promise<void>;
  findBySkill(skill: Skill): Promise<SkillProfile[]>;
  findWithSimilarSkills(
    skillProfile: SkillProfile,
    similarity: number
  ): Promise<SkillProfile[]>;
}

// backend/src/application/ports/secondary/services/IOpenAIService.ts
import { SkillExtractionRequest } from "../../../domain/document-processing/value-objects/SkillExtractionRequest";
import { ExtractedSkill } from "../../../domain/document-processing/entities/ExtractedSkill";
import { CareerGap } from "../../../domain/career-analysis/entities/CareerGap";
import { LearningRecommendation } from "../../../domain/learning-recommendation/entities/LearningRecommendation";

export interface IOpenAIService {
  extractSkillsFromText(
    request: SkillExtractionRequest
  ): Promise<ExtractedSkill[]>;
  analyzeCareerTransition(
    currentProfile: SkillProfile,
    targetRole: JobRole
  ): Promise<TransitionAnalysis>;
  generateLearningRecommendations(
    gaps: CareerGap[]
  ): Promise<LearningRecommendation[]>;
  validateSkillRelevance(skill: string, industry: string): Promise<number>; // Relevance score 0-1
  enhanceSkillDescription(skill: string, context: string): Promise<string>;
}

// backend/src/application/ports/secondary/services/IFileProcessingService.ts
import { FileMetadata } from "../../../domain/document-processing/value-objects/FileMetadata";
import { ProcessedContent } from "../../../domain/document-processing/entities/ProcessedContent";

export interface IFileProcessingService {
  validateFile(fileBuffer: Buffer, expectedType: string): Promise<boolean>;
  extractTextContent(fileBuffer: Buffer, fileType: string): Promise<string>;
  extractMetadata(fileBuffer: Buffer): Promise<FileMetadata>;
  sanitizeContent(content: string): Promise<string>;
  detectLanguage(content: string): Promise<string>;
  analyzeDocumentStructure(content: string): Promise<DocumentStructure>;
}

// backend/src/application/ports/secondary/services/IJobBoardService.ts
import { JobSearchCriteria } from "../../../domain/job-market/value-objects/JobSearchCriteria";
import { JobListing } from "../../../domain/job-market/entities/JobListing";
import { SkillTrend } from "../../../domain/job-market/entities/SkillTrend";

export interface IJobBoardService {
  searchJobs(criteria: JobSearchCriteria): Promise<JobListing[]>;
  getJobRequirements(jobId: string): Promise<JobRequirements>;
  getSkillDemandTrends(
    skills: string[],
    timeframe: number
  ): Promise<SkillTrend[]>;
  getSalaryData(role: string, location: string): Promise<SalaryData>;
  getIndustryTrends(industry: string): Promise<IndustryTrend>;
}
```

### **Application Services Implementation**

```typescript
// backend/src/application/services/CareerAnalysisApplicationService.ts
import { Injectable } from "@nestjs/common";
import { ICareerAnalysisPort } from "../ports/primary/ICareerAnalysisPort";
import { ISkillProfileRepository } from "../ports/secondary/repositories/ISkillProfileRepository";
import { IJobMarketPort } from "../ports/primary/IJobMarketPort";
import { ILearningRecommendationPort } from "../ports/primary/ILearningRecommendationPort";
import { SkillGapAnalyzer } from "../../domain/career-analysis/domain-services/SkillGapAnalyzer";
import { MarketPositionCalculator } from "../../domain/career-analysis/domain-services/MarketPositionCalculator";
import { AnalyzeSkillGapCommand } from "../commands/AnalyzeSkillGapCommand";
import { SkillGapAnalysisDto } from "../dto/SkillGapAnalysisDto";
import { DomainEventPublisher } from "../../shared/domain/DomainEventPublisher";

@Injectable()
export class CareerAnalysisApplicationService implements ICareerAnalysisPort {
  constructor(
    private readonly skillProfileRepository: ISkillProfileRepository,
    private readonly jobMarketService: IJobMarketPort,
    private readonly learningRecommendationService: ILearningRecommendationPort,
    private readonly skillGapAnalyzer: SkillGapAnalyzer,
    private readonly marketPositionCalculator: MarketPositionCalculator,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async analyzeSkillGap(
    command: AnalyzeSkillGapCommand
  ): Promise<SkillGapAnalysisDto> {
    // 1. Retrieve or create skill profile
    const sessionId = SessionId.fromString(command.sessionId);
    let skillProfile = await this.skillProfileRepository.findBySessionId(
      sessionId
    );

    if (!skillProfile) {
      throw new SkillProfileNotFoundError(
        `No skill profile found for session ${command.sessionId}`
      );
    }

    // 2. Get job market data for target roles
    const marketDataQuery = new GetMarketDataQuery(
      command.targetRoles,
      command.preferredLocation,
      command.experienceLevel
    );
    const marketData = await this.jobMarketService.getMarketDataForRoles(
      marketDataQuery
    );

    // 3. Perform gap analysis using domain service
    const careerGaps = this.skillGapAnalyzer.analyzeGaps(
      skillProfile,
      marketData.jobRoles,
      command.analysisPreferences
    );

    // 4. Calculate market position
    const marketPosition = this.marketPositionCalculator.calculate(
      skillProfile,
      marketData,
      careerGaps
    );

    // 5. Generate learning recommendations
    const learningPathCommand = new GenerateLearningPathCommand(
      careerGaps,
      command.learningPreferences,
      command.timeConstraints
    );
    const learningPath =
      await this.learningRecommendationService.generateLearningPath(
        learningPathCommand
      );

    // 6. Create and save career analysis aggregate
    const careerAnalysis = CareerAnalysisAggregate.create(
      skillProfile,
      careerGaps,
      marketPosition,
      learningPath,
      command.analysisPreferences
    );

    // 7. Publish domain events
    const domainEvents = careerAnalysis.getUncommittedEvents();
    for (const event of domainEvents) {
      await this.eventPublisher.publish(event);
    }
    careerAnalysis.markEventsAsCommitted();

    // 8. Persist the analysis
    await this.skillProfileRepository.save(skillProfile);

    // 9. Return DTO for presentation
    return this.mapToSkillGapAnalysisDto(
      careerAnalysis,
      careerGaps,
      learningPath
    );
  }

  async getAnalysisById(
    analysisId: string
  ): Promise<SkillGapAnalysisDto | null> {
    const skillProfile = await this.skillProfileRepository.findById(analysisId);
    if (!skillProfile) {
      return null;
    }

    // Reconstruct the latest analysis
    // In a real implementation, you might store analysis snapshots
    return this.reconstructAnalysisDto(skillProfile);
  }

  async updateSkillProfile(
    command: UpdateSkillProfileCommand
  ): Promise<SkillProfileDto> {
    const sessionId = SessionId.fromString(command.sessionId);
    const skillProfile = await this.skillProfileRepository.findBySessionId(
      sessionId
    );

    if (!skillProfile) {
      throw new SkillProfileNotFoundError(
        `Skill profile not found for session ${command.sessionId}`
      );
    }

    // Apply updates to the skill profile
    for (const skillUpdate of command.skillUpdates) {
      const skill = Skill.create(skillUpdate.skillName, skillUpdate.category);
      const proficiency = ProficiencyLevel.fromLevel(
        skillUpdate.proficiencyLevel
      );

      if (skillUpdate.action === "add") {
        skillProfile.addSkill(skill, proficiency);
      } else if (skillUpdate.action === "update") {
        skillProfile.updateSkillProficiency(skill, proficiency);
      } else if (skillUpdate.action === "remove") {
        skillProfile.removeSkill(skill);
      }
    }

    // Save the updated profile
    await this.skillProfileRepository.save(skillProfile);

    // Publish skill profile updated event
    const event = new SkillProfileUpdatedEvent(
      skillProfile.getId(),
      command.sessionId
    );
    await this.eventPublisher.publish(event);

    return skillProfile.toDto();
  }

  async deleteAnalysis(sessionId: string): Promise<void> {
    const sessionIdVO = SessionId.fromString(sessionId);
    const skillProfile = await this.skillProfileRepository.findBySessionId(
      sessionIdVO
    );

    if (skillProfile) {
      await this.skillProfileRepository.delete(skillProfile.getId());

      // Publish deletion event for cleanup in other bounded contexts
      const event = new SkillProfileDeletedEvent(
        skillProfile.getId(),
        sessionId
      );
      await this.eventPublisher.publish(event);
    }
  }

  private mapToSkillGapAnalysisDto(
    analysis: CareerAnalysisAggregate,
    gaps: CareerGap[],
    learningPath: LearningPath
  ): SkillGapAnalysisDto {
    return {
      sessionId: analysis.getSessionId().getValue(),
      analysisId: analysis.getId(),
      skillProfile: analysis.getSkillProfile().toDto(),
      careerGaps: gaps.map((gap) => gap.toDto()),
      marketPosition: analysis.getMarketPosition().toDto(),
      learningPath: learningPath.toDto(),
      overallReadinessScore: analysis.calculateOverallReadiness(),
      analysisDate: analysis.getAnalysisDate(),
      confidenceScore: analysis.getConfidenceScore(),
      recommendations: analysis.generateRecommendations(),
    };
  }

  private async reconstructAnalysisDto(
    skillProfile: SkillProfile
  ): Promise<SkillGapAnalysisDto> {
    // Implementation would reconstruct the analysis from stored data
    // This is simplified for brevity
    throw new Error("Method not implemented");
  }
}

// backend/src/application/services/DocumentProcessingApplicationService.ts
@Injectable()
export class DocumentProcessingApplicationService
  implements IDocumentProcessingPort
{
  constructor(
    private readonly documentRepository: IResumeDocumentRepository,
    private readonly fileProcessingService: IFileProcessingService,
    private readonly skillExtractionService: IOpenAIService,
    private readonly documentValidator: DocumentValidator,
    private readonly skillExtractor: SkillExtractor,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async processDocument(
    command: ProcessDocumentCommand
  ): Promise<ExtractedSkillsDto> {
    // 1. Validate the document
    const isValid = await this.documentValidator.validate(
      command.fileBuffer,
      command.fileName,
      command.fileType
    );

    if (!isValid) {
      throw new InvalidDocumentError(
        `Document ${command.fileName} is not valid or supported`
      );
    }

    // 2. Extract metadata and text content
    const metadata = await this.fileProcessingService.extractMetadata(
      command.fileBuffer
    );
    const textContent = await this.fileProcessingService.extractTextContent(
      command.fileBuffer,
      command.fileType
    );

    // 3. Create document aggregate
    const sessionId = SessionId.fromString(command.sessionId);
    const resumeDocument = ResumeDocument.create(
      sessionId,
      command.fileName,
      FileFormat.fromString(command.fileType),
      command.fileBuffer.length,
      this.generateFileHash(command.fileBuffer)
    );

    // 4. Process content and extract skills
    const extractedContent = ExtractedContent.create(
      textContent,
      metadata,
      "ai_extraction"
    );
    resumeDocument.addExtractedContent(extractedContent);

    // 5. Extract skills using domain service and AI
    const skillExtractionRequest = SkillExtractionRequest.create(
      textContent,
      command.extractionPreferences
    );

    const aiExtractedSkills =
      await this.skillExtractionService.extractSkillsFromText(
        skillExtractionRequest
      );

    const domainProcessedSkills = this.skillExtractor.processAndValidateSkills(
      aiExtractedSkills,
      textContent
    );

    // 6. Add skill extractions to document
    for (const skill of domainProcessedSkills) {
      resumeDocument.addSkillExtraction(skill);
    }

    // 7. Mark document as processed
    resumeDocument.markAsProcessed();

    // 8. Publish domain events
    const events = resumeDocument.getUncommittedEvents();
    for (const event of events) {
      await this.eventPublisher.publish(event);
    }
    resumeDocument.markEventsAsCommitted();

    // 9. Save document
    await this.documentRepository.save(resumeDocument);

    // 10. Return DTO
    return this.mapToExtractedSkillsDto(resumeDocument);
  }

  async validateDocument(
    command: ValidateDocumentCommand
  ): Promise<DocumentValidationDto> {
    const validationResult = await this.documentValidator.validate(
      command.fileBuffer,
      command.fileName,
      command.fileType
    );

    const fileMetadata = await this.fileProcessingService.extractMetadata(
      command.fileBuffer
    );

    return {
      isValid: validationResult,
      fileName: command.fileName,
      fileType: command.fileType,
      fileSize: command.fileBuffer.length,
      detectedLanguage: await this.fileProcessingService.detectLanguage(
        await this.fileProcessingService.extractTextContent(
          command.fileBuffer,
          command.fileType
        )
      ),
      estimatedProcessingTime: this.estimateProcessingTime(
        command.fileBuffer.length
      ),
      supportedFeatures: this.getSupportedFeatures(command.fileType),
      validationErrors: validationResult ? [] : ["Unsupported file format"],
    };
  }

  async getDocumentById(
    documentId: string
  ): Promise<ExtractedSkillsDto | null> {
    const document = await this.documentRepository.findById(documentId);
    return document ? this.mapToExtractedSkillsDto(document) : null;
  }

  async getProcessingStatus(documentId: string): Promise<string> {
    const document = await this.documentRepository.findById(documentId);
    return document ? document.getProcessingStatus().getValue() : "not_found";
  }

  async retryProcessing(documentId: string): Promise<ExtractedSkillsDto> {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new DocumentNotFoundError(`Document ${documentId} not found`);
    }

    // Reset processing status and retry
    document.resetForReprocessing();

    // Re-extract skills with potentially improved algorithms
    const content = document.getExtractedContent();
    if (content) {
      const skillExtractionRequest = SkillExtractionRequest.create(
        content.getText(),
        { useLatestModel: true, enhancedMode: true }
      );

      const reExtractedSkills =
        await this.skillExtractionService.extractSkillsFromText(
          skillExtractionRequest
        );

      // Clear old extractions and add new ones
      document.clearSkillExtractions();
      for (const skill of reExtractedSkills) {
        document.addSkillExtraction(skill);
      }

      document.markAsProcessed();
    }

    await this.documentRepository.save(document);
    return this.mapToExtractedSkillsDto(document);
  }

  private generateFileHash(fileBuffer: Buffer): string {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
  }

  private estimateProcessingTime(fileSize: number): number {
    // Estimate processing time based on file size (in seconds)
    const baseTime = 5; // 5 seconds base
    const sizeMultiplier = Math.ceil(fileSize / (1024 * 1024)); // Per MB
    return baseTime + sizeMultiplier * 2;
  }

  private getSupportedFeatures(fileType: string): string[] {
    const features = ["text_extraction", "skill_extraction"];

    if (["pdf", "docx"].includes(fileType.toLowerCase())) {
      features.push("metadata_extraction", "structure_analysis");
    }

    return features;
  }

  private mapToExtractedSkillsDto(
    document: ResumeDocument
  ): ExtractedSkillsDto {
    return {
      documentId: document.getId(),
      sessionId: document.getSessionId().getValue(),
      fileName: document.getFileName(),
      fileType: document.getFileFormat().getValue(),
      processingStatus: document.getProcessingStatus().getValue(),
      extractedSkills: document
        .getSkillExtractions()
        .map((skill) => skill.toDto()),
      extractionConfidence: document.calculateOverallConfidence(),
      processedAt: document.getProcessedAt(),
      metadata: document.getMetadata(),
    };
  }
}
```

### **Command and Query Objects (CQRS Pattern)**

```typescript
// backend/src/application/commands/AnalyzeSkillGapCommand.ts
export class AnalyzeSkillGapCommand {
  constructor(
    public readonly sessionId: string,
    public readonly targetRoles: string[],
    public readonly preferredLocation?: string,
    public readonly experienceLevel?: string,
    public readonly analysisPreferences?: AnalysisPreferences,
    public readonly learningPreferences?: LearningPreferences,
    public readonly timeConstraints?: TimeConstraints
  ) {}

  validate(): void {
    if (!this.sessionId || this.sessionId.trim().length === 0) {
      throw new ValidationError("Session ID is required");
    }

    if (!this.targetRoles || this.targetRoles.length === 0) {
      throw new ValidationError("At least one target role must be specified");
    }

    for (const role of this.targetRoles) {
      if (!role || role.trim().length === 0) {
        throw new ValidationError("Target role cannot be empty");
      }
    }
  }
}

// backend/src/application/commands/ProcessDocumentCommand.ts
export class ProcessDocumentCommand {
  constructor(
    public readonly sessionId: string,
    public readonly fileName: string,
    public readonly fileType: string,
    public readonly fileBuffer: Buffer,
    public readonly extractionPreferences?: SkillExtractionPreferences
  ) {}

  validate(): void {
    if (!this.sessionId) {
      throw new ValidationError("Session ID is required");
    }

    if (!this.fileName) {
      throw new ValidationError("File name is required");
    }

    if (!this.fileBuffer || this.fileBuffer.length === 0) {
      throw new ValidationError("File content is required");
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (this.fileBuffer.length > maxFileSize) {
      throw new ValidationError("File size exceeds maximum limit of 5MB");
    }

    const supportedTypes = ["pdf", "doc", "docx", "txt"];
    if (!supportedTypes.includes(this.fileType.toLowerCase())) {
      throw new ValidationError(`Unsupported file type: ${this.fileType}`);
    }
  }
}

// backend/src/application/queries/GetMarketDataQuery.ts
export class GetMarketDataQuery {
  constructor(
    public readonly targetRoles: string[],
    public readonly location?: string,
    public readonly experienceLevel?: string,
    public readonly includesSalaryData: boolean = true,
    public readonly includeTrends: boolean = true
  ) {}

  validate(): void {
    if (!this.targetRoles || this.targetRoles.length === 0) {
      throw new ValidationError("Target roles are required");
    }
  }
}
```

#### **Day 4-7: UI/UX Polish**

```typescript
// Responsive design improvements
// Loading state optimizations
// Error message improvements
// Accessibility enhancements
```

---

## 🔌 API Endpoints

### **Core Endpoints**

```typescript
// File upload and processing
POST   /api/upload          # Upload resume file
GET    /api/session/:id     # Get session status

// Analysis and results
POST   /api/analyze/:id     # Start analysis
GET    /api/results/:id     # Get analysis results
PUT    /api/refine/:id      # Update skills manually

// Supporting data
GET    /api/skills          # Available skills taxonomy
GET    /api/roles           # Popular job roles
GET    /api/trends          # Skill demand trends

// Report generation
POST   /api/report/:id      # Generate PDF report
GET    /api/report/:id/pdf  # Download PDF
```

### **Request/Response Examples**

```typescript
// shared/types/api.ts - Comprehensive API Types

export interface UploadRequest {
  file: File;
  targetRole?: string;
  experienceLevel?: ExperienceLevel;
}

export interface UploadResponse {
  sessionId: string;
  filename: string;
  status: SessionStatus;
  extractedText?: string;
  confidence?: number;
  processingTime?: number;
  fileInfo: {
    size: number;
    type: string;
    pages?: number;
  };
}

export interface AnalysisRequest {
  sessionId: string;
  targetRole?: string;
  customSkills?: UserSkill[];
  preferences?: AnalysisPreferences;
}

export interface AnalysisResponse {
  sessionId: string;
  status: SessionStatus;
  progress?: number;
  estimatedTimeRemaining?: number;
  error?: string;
}

export interface AnalysisResults {
  sessionId: string;
  userProfile: UserProfile;
  skillsAnalysis: SkillsAnalysis;
  gapAnalysis: GapAnalysis;
  marketPosition: MarketPosition;
  recommendations: Recommendation[];
  learningPath: LearningPath;
  reportUrl?: string;
  lastUpdated: string;
  confidenceScore: number;
}

export interface UserProfile {
  detectedName?: string;
  experienceLevel: ExperienceLevel;
  currentRole?: string;
  yearsExperience?: number;
  industries: string[];
  education?: EducationInfo[];
  certifications?: string[];
  languages?: string[];
}

export interface SkillsAnalysis {
  totalSkills: number;
  categorizedSkills: CategorizedSkills;
  strengthAreas: SkillCategory[];
  experienceLevels: SkillExperienceMap;
  rareCombinations: string[];
  marketValue: {
    current: number;
    potential: number;
    percentile: number;
  };
}

export interface GapAnalysis {
  targetRole: string;
  overallReadiness: number; // 0-100
  criticalGaps: SkillGap[];
  niceToHaveGaps: SkillGap[];
  strengths: string[];
  readinessTimeline: {
    immediate: string[];
    shortTerm: string[]; // 1-3 months
    mediumTerm: string[]; // 3-6 months
    longTerm: string[]; // 6+ months
  };
}

export interface SkillGap {
  skill: string;
  importance: number; // 1-10
  currentLevel: ProficiencyLevel;
  requiredLevel: ProficiencyLevel;
  gapSize: number;
  learningPath: LearningResource[];
  timeToLearn: string;
  difficulty: LearningDifficulty;
  marketDemand: number;
  salaryImpact: number;
  substitutes?: string[]; // Alternative skills
}

export interface MarketPosition {
  overallScore: number; // 0-100
  salaryRange: {
    min: number;
    max: number;
    median: number;
    currency: string;
  };
  competitiveness: {
    score: number;
    percentile: number;
    comparison: string; // vs market average
  };
  demandLevel: "low" | "medium" | "high" | "very-high";
  jobAvailability: number;
  growthProjection: {
    nextYear: number;
    fiveYear: number;
  };
}

export interface Recommendation {
  id: string;
  type: "skill_development" | "career_move" | "certification" | "networking";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  timeframe: string;
  effort: "low" | "medium" | "high";
  impact: number; // 1-10
  actionItems: string[];
  resources: LearningResource[];
  successMetrics: string[];
}

export interface LearningPath {
  totalTimeWeeks: number;
  phases: LearningPhase[];
  milestones: Milestone[];
  alternatives: AlternativePath[];
}

export interface LearningPhase {
  name: string;
  duration: string;
  skills: string[];
  objectives: string[];
  resources: LearningResource[];
  prerequisites: string[];
  assessment: string;
}

export interface LearningResource {
  title: string;
  type: "course" | "book" | "video" | "tutorial" | "project" | "certification";
  provider: string;
  url?: string;
  duration: string;
  difficulty: LearningDifficulty;
  cost: number;
  rating?: number;
  description: string;
  skills: string[];
}

// Enums and Supporting Types
export type SessionStatus =
  | "uploading"
  | "processing"
  | "analyzing"
  | "completed"
  | "error"
  | "expired";
export type ExperienceLevel =
  | "entry"
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "executive";
export type ProficiencyLevel =
  | "none"
  | "basic"
  | "intermediate"
  | "advanced"
  | "expert";
export type LearningDifficulty = "easy" | "medium" | "hard" | "expert";
export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "design"
  | "project_management"
  | "soft_skills"
  | "language"
  | "framework"
  | "tool";

export interface UserSkill {
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsExperience?: number;
  lastUsed?: string;
  context?: string[];
  isVerified?: boolean;
  endorsements?: number;
}

export interface CategorizedSkills {
  [key in SkillCategory]: UserSkill[];
}

export interface SkillExperienceMap {
  [skillName: string]: {
    level: ProficiencyLevel;
    years: number;
    confidence: number;
  };
}

export interface EducationInfo {
  degree: string;
  field: string;
  institution: string;
  year?: number;
  gpa?: number;
}

export interface AnalysisPreferences {
  targetRole?: string;
  preferredIndustries?: string[];
  careerGoals?: string[];
  timeCommitment?: number; // hours per week for learning
  budgetForLearning?: number;
  learningStyle?: "visual" | "auditory" | "kinesthetic" | "mixed";
}

export interface Milestone {
  name: string;
  description: string;
  timeframe: string;
  skills: string[];
  criteria: string[];
}

export interface AlternativePath {
  name: string;
  description: string;
  duration: string;
  pros: string[];
  cons: string[];
  suitableFor: string[];
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Refinement Types
export interface SkillRefinementRequest {
  sessionId: string;
  action: "add" | "remove" | "update";
  skill: UserSkill;
}

export interface BulkSkillRefinementRequest {
  sessionId: string;
  changes: SkillRefinementRequest[];
  reanalyze?: boolean;
}

// Report Generation Types
export interface ReportGenerationRequest {
  sessionId: string;
  format: "pdf" | "html" | "json";
  sections?: ReportSection[];
  branding?: boolean;
  includeCharts?: boolean;
}

export interface ReportGenerationResponse {
  reportId: string;
  downloadUrl: string;
  expiresAt: string;
  format: string;
  size: number;
  generatedAt: string;
}

export type ReportSection =
  | "summary"
  | "skills_analysis"
  | "gap_analysis"
  | "market_position"
  | "recommendations"
  | "learning_path"
  | "appendix";

// Analytics Types
export interface AnalyticsEvent {
  sessionId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: string;
  userAgent?: string;
  pageUrl?: string;
}

// Job Market Types
export interface JobMarketTrend {
  skill: string;
  demandChange: number; // percentage change
  salaryTrend: number;
  postingCount: number;
  timeframe: string;
  industry?: string;
}

export interface RoleRequirements {
  title: string;
  normalizedTitle: string;
  requiredSkills: SkillRequirement[];
  preferredSkills: SkillRequirement[];
  experienceLevel: ExperienceLevel;
  salaryRange: SalaryRange;
  growthOutlook: string;
}

export interface SkillRequirement {
  skill: string;
  importance: number; // 1-10
  frequency: number; // How often it appears in job postings (%)
  alternatives?: string[];
}

export interface SalaryRange {
  min: number;
  max: number;
  median: number;
  currency: string;
  location?: string;
}
```

---

## 🧪 Testing Strategy

### **Unit Tests (60% coverage target)**

```typescript
// Core business logic
- SkillExtractor.extractSkills()
- GapAnalyzer.analyzeSkillGaps()
- ResumeParser.extractText()
- Skill normalization functions

// Utilities and helpers
- File validation
- Text processing
- Data transformation
```

### **Integration Tests**

```typescript
// API endpoints
- File upload flow
- Analysis pipeline
- Results retrieval
- Error handling

// Database operations
- Session CRUD operations
- Skills taxonomy queries
- Analytics tracking
```

### **End-to-End Tests**

```typescript
// Critical user journeys
- Upload resume → view results
- Refine skills → updated analysis
- Generate and download report
- Error scenarios and recovery
```

---

## 📊 Success Metrics & KPIs

### **Technical Metrics**

- **Upload Success Rate:** >95%
- **Analysis Completion Time:** <30 seconds
- **API Response Time:** <2 seconds (P95)
- **Error Rate:** <1%

### **User Experience Metrics**

- **Upload-to-Results Completion:** >85%
- **Time on Results Page:** >3 minutes
- **Manual Refinement Usage:** >40%
- **Report Download Rate:** >60%

### **Business Metrics**

- **Daily Active Users:** Track growth
- **Session Duration:** Engagement indicator
- **Return Usage:** Within 30 days
- **Conversion Readiness:** For future premium features

---

## 🚀 Deployment Strategy

### **Development Environment**

```bash
# Local development with Docker
docker-compose up -d  # PostgreSQL + Redis
npm run dev           # Frontend and backend
```

### **Staging Environment**

```bash
# Staging deployment
- Frontend: Vercel preview deployment
- Backend: Railway/Render staging environment
- Database: Staging PostgreSQL instance
```

### **Production Deployment**

```bash
# Production infrastructure
- Frontend: Vercel production deployment
- Backend: Railway/Render production environment
- Database: Managed PostgreSQL (AWS RDS/Railway)
- Cache: Redis Cloud
- Monitoring: Built-in platform monitoring
```

---

## 🔒 Security & Privacy Considerations

### **Data Protection Framework**

#### **Data Classification & Handling**

```typescript
// backend/src/utils/data-classification.ts
export enum DataSensitivity {
  PUBLIC = "public",
  INTERNAL = "internal",
  CONFIDENTIAL = "confidential",
  RESTRICTED = "restricted",
}

export interface DataClassification {
  type: DataSensitivity;
  retentionPeriod: number; // days
  encryptionRequired: boolean;
  auditRequired: boolean;
  anonymizationRequired: boolean;
}

export const DATA_CLASSIFICATIONS: Record<string, DataClassification> = {
  resumeText: {
    type: DataSensitivity.CONFIDENTIAL,
    retentionPeriod: 2, // 48 hours
    encryptionRequired: true,
    auditRequired: true,
    anonymizationRequired: true,
  },
  extractedSkills: {
    type: DataSensitivity.INTERNAL,
    retentionPeriod: 30,
    encryptionRequired: false,
    auditRequired: true,
    anonymizationRequired: false,
  },
  sessionAnalytics: {
    type: DataSensitivity.INTERNAL,
    retentionPeriod: 90,
    encryptionRequired: false,
    auditRequired: false,
    anonymizationRequired: true,
  },
};
```

#### **Encryption Implementation**

```typescript
// backend/src/utils/crypto.ts
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 bytes key
const ALGORITHM = "aes-256-gcm";

export class DataEncryption {
  static encrypt(data: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    cipher.setAAD(Buffer.from("careercraft-data"));

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
    };
  }

  static decrypt(encryptedData: EncryptedData): string {
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    decipher.setAAD(Buffer.from("careercraft-data"));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  static hashSensitiveData(data: string): string {
    return crypto
      .createHash("sha256")
      .update(data + process.env.HASH_SALT)
      .digest("hex");
  }
}

interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}
```

#### **Privacy-First Session Management**

```typescript
// backend/src/middleware/privacy.ts
export const privacyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Hash IP address for analytics
  const clientIP = req.ip || req.connection.remoteAddress || "unknown";
  req.hashedIP = DataEncryption.hashSensitiveData(clientIP);

  // Hash User-Agent
  req.hashedUserAgent = DataEncryption.hashSensitiveData(
    req.get("User-Agent") || "unknown"
  );

  // Remove sensitive headers from logging
  const sanitizedHeaders = { ...req.headers };
  delete sanitizedHeaders.authorization;
  delete sanitizedHeaders.cookie;
  req.sanitizedHeaders = sanitizedHeaders;

  next();
};
```

### **Input Validation & Sanitization**

```typescript
// backend/src/middleware/validation.ts
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

export const fileUploadSchema = z.object({
  file: z.object({
    originalname: z.string().regex(/^[a-zA-Z0-9\-_\.\s]+$/, "Invalid filename"),
    mimetype: z.enum([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]),
    size: z.number().max(5 * 1024 * 1024, "File too large"), // 5MB
    buffer: z.instanceof(Buffer),
  }),
});

export const skillRefinementSchema = z.object({
  sessionId: z.string().uuid(),
  action: z.enum(["add", "remove", "update"]),
  skill: z.object({
    name: z
      .string()
      .min(1)
      .max(100)
      .transform((name) => DOMPurify.sanitize(name)),
    category: z.enum([
      "frontend",
      "backend",
      "database",
      "devops",
      "design",
      "project_management",
      "soft_skills",
    ]),
    proficiency: z.enum([
      "none",
      "basic",
      "intermediate",
      "advanced",
      "expert",
    ]),
    yearsExperience: z.number().min(0).max(50).optional(),
  }),
});

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors,
        });
      }
      next(error);
    }
  };
}
```

### **Security Headers & CORS**

```typescript
// backend/src/middleware/security.ts
export const securityConfig = {
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: [
          "'self'",
          process.env.NODE_ENV === "development" ? "'unsafe-eval'" : "'self'",
        ],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          process.env.API_BASE_URL || "http://localhost:3001",
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    frameguard: { action: "deny" },
    xssFilter: true,
  },

  cors: {
    origin: (origin: string | undefined, callback: Function) => {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
        "http://localhost:3000",
      ];

      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-Session-ID",
    ],
    exposedHeaders: ["X-Session-ID", "X-Request-ID"],
  },
};
```

### **Rate Limiting Strategy**

```typescript
// backend/src/middleware/rate-limit.ts
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis";

export const rateLimiters = {
  // General API rate limiting
  general: rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
      error: "Too many requests",
      retryAfter: 15 * 60, // seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.hashedIP || req.ip,
  }),

  // Upload rate limiting
  upload: rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.sendCommand(args),
    }),
    windowMs: 60 * 1000, // 1 minute
    max: 3, // 3 uploads per minute
    message: {
      error: "Upload rate limit exceeded",
      retryAfter: 60,
    },
    keyGenerator: (req) => req.hashedIP || req.ip,
  }),

  // Analysis rate limiting
  analysis: rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.sendCommand(args),
    }),
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // 10 analyses per 5 minutes
    message: {
      error: "Analysis rate limit exceeded",
      retryAfter: 5 * 60,
    },
    keyGenerator: (req) => req.hashedIP || req.ip,
  }),
};
```

### **File Security & Scanning**

```typescript
// backend/src/utils/file-security.ts
import crypto from "crypto";
import { createReadStream } from "fs";

export class FileSecurityScanner {
  // Virus signature patterns (basic implementation)
  private static readonly VIRUS_SIGNATURES = [
    "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*", // EICAR test
    // Add more virus signatures as needed
  ];

  // Malicious file patterns
  private static readonly SUSPICIOUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
  ];

  static async scanFile(buffer: Buffer): Promise<SecurityScanResult> {
    const results: SecurityScanResult = {
      safe: true,
      threats: [],
      fileHash: crypto.createHash("sha256").update(buffer).digest("hex"),
    };

    // Check file signature
    const signature = buffer.subarray(0, 100).toString();

    for (const virusSignature of this.VIRUS_SIGNATURES) {
      if (signature.includes(virusSignature)) {
        results.safe = false;
        results.threats.push({
          type: "virus",
          description: "Known virus signature detected",
          severity: "high",
        });
      }
    }

    // Check for suspicious patterns in text content
    const content = buffer.toString("utf8", 0, Math.min(buffer.length, 10000)); // First 10KB

    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(content)) {
        results.safe = false;
        results.threats.push({
          type: "suspicious_content",
          description: "Potentially malicious content detected",
          severity: "medium",
        });
      }
    }

    // File size validation
    if (buffer.length > 10 * 1024 * 1024) {
      // 10MB
      results.safe = false;
      results.threats.push({
        type: "oversized",
        description: "File exceeds maximum allowed size",
        severity: "low",
      });
    }

    return results;
  }
}

interface SecurityScanResult {
  safe: boolean;
  threats: SecurityThreat[];
  fileHash: string;
}

interface SecurityThreat {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
}
```

### **Audit Logging**

```typescript
// backend/src/utils/audit-logger.ts
export class AuditLogger {
  static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: event.type,
      severity: event.severity,
      sessionId: event.sessionId,
      userFingerprint: event.userFingerprint,
      ipHash: event.ipHash,
      userAgent: event.userAgent,
      details: event.details,
      action: event.action,
      resource: event.resource,
      outcome: event.outcome,
    };

    // Log to security audit table
    await pool.query(
      `
      INSERT INTO security_audit_logs
      (event_type, severity, session_id, user_fingerprint, ip_hash, user_agent, details, action, resource, outcome)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
      [
        auditEntry.eventType,
        auditEntry.severity,
        auditEntry.sessionId,
        auditEntry.userFingerprint,
        auditEntry.ipHash,
        auditEntry.userAgent,
        JSON.stringify(auditEntry.details),
        auditEntry.action,
        auditEntry.resource,
        auditEntry.outcome,
      ]
    );

    // Alert on high severity events
    if (event.severity === "high" || event.severity === "critical") {
      await this.sendSecurityAlert(auditEntry);
    }
  }

  private static async sendSecurityAlert(entry: any): Promise<void> {
    logger.error("SECURITY ALERT", entry);
    // In production, integrate with alerting system (PagerDuty, Slack, etc.)
  }
}

interface SecurityEvent {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  sessionId?: string;
  userFingerprint?: string;
  ipHash: string;
  userAgent: string;
  action: string;
  resource: string;
  outcome: "success" | "failure";
  details: Record<string, any>;
}
```

### **GDPR Compliance Implementation**

```typescript
// backend/src/services/gdpr-compliance.ts
export class GDPRService {
  // Right to be forgotten
  static async deleteUserData(sessionId: string): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Delete from all tables containing user data
      await client.query(
        "DELETE FROM session_analytics WHERE session_id = $1",
        [sessionId]
      );
      await client.query("DELETE FROM error_logs WHERE session_id = $1", [
        sessionId,
      ]);
      await client.query(
        "DELETE FROM analysis_sessions WHERE session_id = $1",
        [sessionId]
      );

      // Clear Redis cache
      await redis.del(`session:${sessionId}`);

      await client.query("COMMIT");

      AuditLogger.logSecurityEvent({
        type: "data_deletion",
        severity: "medium",
        sessionId,
        ipHash: "system",
        userAgent: "system",
        action: "delete_user_data",
        resource: "user_data",
        outcome: "success",
        details: { reason: "gdpr_compliance" },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Data export for transparency
  static async exportUserData(sessionId: string): Promise<UserDataExport> {
    const sessionData = await pool.query(
      "SELECT * FROM analysis_sessions WHERE session_id = $1",
      [sessionId]
    );

    const analyticsData = await pool.query(
      "SELECT event_type, event_data, timestamp FROM session_analytics WHERE session_id = $1",
      [sessionId]
    );

    return {
      sessionId,
      exportDate: new Date().toISOString(),
      data: {
        session: sessionData.rows[0],
        analytics: analyticsData.rows,
      },
      retentionPolicy: "Data will be automatically deleted after 48 hours",
      rights: [
        "Right to access your data",
        "Right to rectify incorrect data",
        "Right to erase your data",
        "Right to data portability",
      ],
    };
  }
}

interface UserDataExport {
  sessionId: string;
  exportDate: string;
  data: any;
  retentionPolicy: string;
  rights: string[];
}
```

---

## 🚨 Error Handling & Monitoring

### **Comprehensive Error Handling Framework**

```typescript
// backend/src/middleware/error-handler.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { AuditLogger } from "../utils/audit-logger";

export enum ErrorCode {
  // Client Errors (4xx)
  VALIDATION_ERROR = "VALIDATION_ERROR",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  UNSUPPORTED_FILE_TYPE = "UNSUPPORTED_FILE_TYPE",
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  MALICIOUS_FILE_DETECTED = "MALICIOUS_FILE_DETECTED",

  // Server Errors (5xx)
  DATABASE_CONNECTION_ERROR = "DATABASE_CONNECTION_ERROR",
  REDIS_CONNECTION_ERROR = "REDIS_CONNECTION_ERROR",
  OPENAI_API_ERROR = "OPENAI_API_ERROR",
  FILE_PROCESSING_ERROR = "FILE_PROCESSING_ERROR",
  ANALYSIS_ENGINE_ERROR = "ANALYSIS_ENGINE_ERROR",
  REPORT_GENERATION_ERROR = "REPORT_GENERATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode,
    isOperational = true,
    details?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let code = ErrorCode.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";
  let details: Record<string, any> = {};

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    details = error.details || {};
  }

  // Generate request ID for tracking
  const requestId = req.headers["x-request-id"] || generateRequestId();

  // Log error with context
  const errorContext = {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get("User-Agent"),
    sessionId: req.session?.id,
    ipHash: req.hashedIP,
    error: {
      message: error.message,
      stack: error.stack,
      code,
      statusCode,
    },
  };

  if (statusCode >= 500) {
    logger.error("Server Error", errorContext);

    // Log security events for potential attacks
    if (statusCode === 500 && !error instanceof AppError) {
      AuditLogger.logSecurityEvent({
        type: "unexpected_error",
        severity: "high",
        sessionId: req.session?.id,
        ipHash: req.hashedIP || "unknown",
        userAgent: req.get("User-Agent") || "unknown",
        action: `${req.method} ${req.url}`,
        resource: "api_endpoint",
        outcome: "failure",
        details: { error: error.message },
      });
    }
  } else {
    logger.warn("Client Error", errorContext);
  }

  // Don't expose internal error details in production
  const exposedDetails = process.env.NODE_ENV === "production" ? {} : details;

  res.status(statusCode).json({
    error: {
      code,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      ...exposedDetails,
    },
  });
};

// Async error wrapper
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

### **Service-Level Error Handling**

```typescript
// backend/src/services/resume-parser.ts
import { AppError, ErrorCode } from "../middleware/error-handler";

export class ResumeParserService {
  async extractText(file: Buffer, mimeType: string): Promise<string> {
    try {
      // Security scan first
      const scanResult = await FileSecurityScanner.scanFile(file);
      if (!scanResult.safe) {
        throw new AppError(
          "Malicious file detected",
          400,
          ErrorCode.MALICIOUS_FILE_DETECTED,
          true,
          { threats: scanResult.threats }
        );
      }

      let extractedText = "";

      switch (mimeType) {
        case "application/pdf":
          extractedText = await this.extractFromPDF(file);
          break;
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          extractedText = await this.extractFromWord(file);
          break;
        default:
          throw new AppError(
            "Unsupported file type",
            400,
            ErrorCode.UNSUPPORTED_FILE_TYPE,
            true,
            { supportedTypes: ["pdf", "doc", "docx"] }
          );
      }

      if (!extractedText || extractedText.trim().length < 100) {
        throw new AppError(
          "Unable to extract meaningful text from file",
          400,
          ErrorCode.FILE_PROCESSING_ERROR,
          true,
          { extractedLength: extractedText.length }
        );
      }

      return extractedText;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error("Resume parsing failed", {
        error: error.message,
        stack: error.stack,
        fileSize: file.length,
        mimeType,
      });

      throw new AppError(
        "Failed to process resume file",
        500,
        ErrorCode.FILE_PROCESSING_ERROR,
        true,
        { originalError: error.message }
      );
    }
  }

  private async extractFromPDF(file: Buffer): Promise<string> {
    try {
      const pdfParse = await import("pdf-parse");
      const data = await pdfParse.default(file);
      return data.text;
    } catch (error) {
      throw new AppError(
        "Failed to parse PDF file",
        400,
        ErrorCode.FILE_PROCESSING_ERROR,
        true,
        { reason: "pdf_parsing_failed" }
      );
    }
  }

  private async extractFromWord(file: Buffer): Promise<string> {
    try {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer: file });
      return result.value;
    } catch (error) {
      throw new AppError(
        "Failed to parse Word document",
        400,
        ErrorCode.FILE_PROCESSING_ERROR,
        true,
        { reason: "word_parsing_failed" }
      );
    }
  }
}
```

### **Circuit Breaker Pattern for External APIs**

```typescript
// backend/src/utils/circuit-breaker.ts
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

  constructor(
    private readonly threshold: number = 5,
    private readonly timeout: number = 60000, // 60 seconds
    private readonly monitoringPeriod: number = 10000 // 10 seconds
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (this.shouldAttemptReset()) {
        this.state = "HALF_OPEN";
      } else {
        throw new AppError(
          "Service temporarily unavailable",
          503,
          ErrorCode.INTERNAL_SERVER_ERROR,
          true,
          { circuitBreakerState: "OPEN" }
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = "CLOSED";
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = "OPEN";
    }
  }

  private shouldAttemptReset(): boolean {
    return (
      this.lastFailureTime !== undefined &&
      Date.now() - this.lastFailureTime >= this.timeout
    );
  }
}

// OpenAI API with circuit breaker
export class OpenAIService {
  private circuitBreaker = new CircuitBreaker(3, 30000); // 3 failures, 30s timeout

  async analyzeSkills(text: string): Promise<any> {
    return this.circuitBreaker.execute(async () => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a skill extraction expert...",
            },
            {
              role: "user",
              content: text,
            },
          ],
          timeout: 30000, // 30 second timeout
        });

        return response.choices[0]?.message?.content;
      } catch (error) {
        if (error.code === "rate_limit_exceeded") {
          throw new AppError(
            "API rate limit exceeded",
            429,
            ErrorCode.OPENAI_API_ERROR,
            true,
            { retryAfter: error.headers?.["retry-after"] }
          );
        }

        throw new AppError(
          "AI analysis service unavailable",
          503,
          ErrorCode.OPENAI_API_ERROR,
          true,
          { originalError: error.message }
        );
      }
    });
  }
}
```

### **Health Check & Monitoring**

```typescript
// backend/src/routes/health.ts
export class HealthCheckService {
  static async getSystemHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkOpenAI(),
      this.checkDiskSpace(),
      this.checkMemoryUsage(),
    ]);

    const results: HealthCheckResult[] = checks.map((check, index) => {
      const names = ["database", "redis", "openai", "disk", "memory"];
      return {
        name: names[index],
        status:
          check.status === "fulfilled" && check.value.healthy
            ? "healthy"
            : "unhealthy",
        details:
          check.status === "fulfilled"
            ? check.value
            : { error: check.reason?.message },
        timestamp: new Date().toISOString(),
      };
    });

    const overallStatus = results.every((r) => r.status === "healthy")
      ? "healthy"
      : "unhealthy";

    return {
      status: overallStatus,
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: results,
    };
  }

  private static async checkDatabase(): Promise<{
    healthy: boolean;
    responseTime?: number;
  }> {
    const start = Date.now();
    try {
      await pool.query("SELECT 1");
      return { healthy: true, responseTime: Date.now() - start };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  private static async checkRedis(): Promise<{
    healthy: boolean;
    responseTime?: number;
  }> {
    const start = Date.now();
    try {
      await redis.ping();
      return { healthy: true, responseTime: Date.now() - start };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  private static async checkOpenAI(): Promise<{
    healthy: boolean;
    responseTime?: number;
  }> {
    const start = Date.now();
    try {
      // Simple API test
      await openai.models.list();
      return { healthy: true, responseTime: Date.now() - start };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  private static async checkDiskSpace(): Promise<{
    healthy: boolean;
    freeSpace?: number;
  }> {
    try {
      const stats = await import("fs").then((fs) => fs.promises.stat("."));
      const freeSpace = stats.size; // Simplified - use statvfs in production
      return { healthy: freeSpace > 1024 * 1024 * 100, freeSpace }; // 100MB minimum
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  private static async checkMemoryUsage(): Promise<{
    healthy: boolean;
    memoryUsage?: any;
  }> {
    const memUsage = process.memoryUsage();
    const maxHeap = 1024 * 1024 * 1024; // 1GB max heap

    return {
      healthy: memUsage.heapUsed < maxHeap * 0.9, // Alert at 90%
      memoryUsage: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + "MB",
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + "MB",
        external: Math.round(memUsage.external / 1024 / 1024) + "MB",
      },
    };
  }
}

interface HealthStatus {
  status: "healthy" | "unhealthy";
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
  checks: HealthCheckResult[];
}

interface HealthCheckResult {
  name: string;
  status: "healthy" | "unhealthy";
  details: any;
  timestamp: string;
}
```

### **Performance Monitoring**

```typescript
// backend/src/middleware/performance-monitor.ts
export const performanceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Monitor response time
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const route = req.route?.path || req.path;

    // Log slow requests
    if (duration > 5000) {
      // 5 seconds
      logger.warn("Slow request detected", {
        method: req.method,
        route,
        duration,
        statusCode: res.statusCode,
        userAgent: req.get("User-Agent"),
        sessionId: req.session?.id,
      });
    }

    // Store metrics
    recordMetric("api.request.duration", duration, {
      method: req.method,
      route,
      status: res.statusCode.toString(),
    });

    recordMetric("api.request.count", 1, {
      method: req.method,
      route,
      status: res.statusCode.toString(),
    });
  });

  next();
};

// Simple metrics collection
const metrics = new Map<string, any>();

function recordMetric(
  name: string,
  value: number,
  tags: Record<string, string> = {}
) {
  const key = `${name}:${JSON.stringify(tags)}`;
  const existing = metrics.get(key) || {
    count: 0,
    sum: 0,
    min: Infinity,
    max: -Infinity,
  };

  existing.count++;
  existing.sum += value;
  existing.min = Math.min(existing.min, value);
  existing.max = Math.max(existing.max, value);
  existing.avg = existing.sum / existing.count;
  existing.lastUpdated = new Date().toISOString();

  metrics.set(key, existing);
}

export function getMetrics(): Record<string, any> {
  const result: Record<string, any> = {};
  metrics.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
```

### **Alerting System**

```typescript
// backend/src/utils/alerting.ts
export class AlertingService {
  static async sendAlert(alert: Alert): Promise<void> {
    try {
      // Log alert
      logger.error("ALERT", alert);

      // In production, integrate with:
      // - PagerDuty for critical alerts
      // - Slack for team notifications
      // - Email for summary reports

      if (alert.severity === "critical") {
        await this.sendCriticalAlert(alert);
      }

      // Store alert in database for tracking
      await pool.query(
        `
        INSERT INTO alerts (type, severity, message, details, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `,
        [
          alert.type,
          alert.severity,
          alert.message,
          JSON.stringify(alert.details),
        ]
      );
    } catch (error) {
      logger.error("Failed to send alert", { error: error.message, alert });
    }
  }

  private static async sendCriticalAlert(alert: Alert): Promise<void> {
    // Implement critical alert logic
    // This could integrate with PagerDuty, send SMS, etc.
    console.error("🚨 CRITICAL ALERT:", alert);
  }
}

interface Alert {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  details: Record<string, any>;
  timestamp: string;
}

// Usage in error handler
export const sendErrorAlert = (error: AppError, context: any) => {
  if (error.statusCode >= 500) {
    AlertingService.sendAlert({
      type: "server_error",
      severity: error.statusCode >= 500 ? "high" : "medium",
      message: error.message,
      details: {
        ...context,
        stack: error.stack,
        code: error.code,
      },
      timestamp: new Date().toISOString(),
    });
  }
};
```

---

## 🎯 Phase 1 Success Criteria

### **MVP Launch Ready When:**

- [ ] Users can upload resumes successfully
- [ ] Skill extraction accuracy >85%
- [ ] Gap analysis provides actionable insights
- [ ] Results display is intuitive and engaging
- [ ] Manual refinement works smoothly
- [ ] PDF reports generate correctly
- [ ] Performance meets target metrics
- [ ] Basic error handling covers edge cases

### **Business Validation Targets:**

- [ ] 100+ successful analyses in first week
- [ ] > 80% completion rate (upload to results)
- [ ] Positive user feedback on accuracy
- [ ] Interest in premium features
- [ ] Technical infrastructure stable under load

---

## 🔄 Next Steps (Phase 2 Preview)

### **Immediate Enhancements (Month 2)**

- LinkedIn integration option
- Multiple resume comparison
- Enhanced reporting features
- Performance optimizations

### **Account Integration Planning**

- User registration system design
- Data migration strategy
- Premium feature development
- Subscription billing setup

---

## 📚 Additional Resources

### **Learning Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### **Development Tools**

- [Postman Collection](link-to-api-collection)
- [Database Schema Visualizer](link-to-schema)
- [Component Library](link-to-storybook)
- [Testing Guidelines](link-to-testing-docs)

---

