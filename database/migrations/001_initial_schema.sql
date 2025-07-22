-- 001_initial_schema.sql
-- Skillara Database Schema - Initial Migration
-- Domain-Driven Design with Hexagonal Architecture

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For JSONB indexing

-- Create enum types
CREATE TYPE experience_level AS ENUM ('entry', 'junior', 'mid', 'senior', 'lead', 'executive');
CREATE TYPE skill_category AS ENUM ('frontend', 'backend', 'database', 'devops', 'design', 'project_management', 'soft_skills', 'language', 'framework', 'tool');
CREATE TYPE session_status AS ENUM ('uploading', 'processing', 'analyzing', 'completed', 'error', 'expired');

-- ================================================
-- SESSION MANAGEMENT (GENERIC SUBDOMAIN)
-- ================================================

-- Analysis Sessions (Aggregate Root)
CREATE TABLE analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    session_status VARCHAR(50) DEFAULT 'active',
    privacy_consent BOOLEAN DEFAULT FALSE,
    retention_policy VARCHAR(50) DEFAULT '30_days',
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
    user_agent_hash VARCHAR(64),
    ip_address_hash VARCHAR(64),
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
    trend_direction VARCHAR(20),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- DOCUMENT PROCESSING BOUNDED CONTEXT
-- ================================================

-- Resume Documents (Aggregate Root)
CREATE TABLE resume_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    file_hash VARCHAR(64) UNIQUE NOT NULL,
    processing_status VARCHAR(50) DEFAULT 'pending',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    version INTEGER DEFAULT 1
);

-- Extracted Content (Entity within Document Processing)
CREATE TABLE extracted_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES resume_documents(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    extracted_text TEXT,
    structured_data JSONB,
    extraction_confidence DECIMAL(3,2),
    extraction_method VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Extractions (Entity within Document Processing)
CREATE TABLE skill_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES resume_documents(id) ON DELETE CASCADE,
    extracted_skill_name VARCHAR(200) NOT NULL,
    standardized_skill_name VARCHAR(200),
    skill_category VARCHAR(100),
    confidence_score DECIMAL(3,2) NOT NULL,
    extraction_context TEXT,
    proficiency_indicators TEXT[],
    suggested_proficiency_level INTEGER,
    validation_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- CAREER ANALYSIS BOUNDED CONTEXT
-- ================================================

-- Skill Profiles (Aggregate Root)
CREATE TABLE skill_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    experience_level VARCHAR(50) NOT NULL,
    years_experience INTEGER,
    average_proficiency DECIMAL(3,2),
    profile_completeness DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- Skills (Value Objects within SkillProfile)
CREATE TABLE profile_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_profile_id UUID REFERENCES skill_profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(200) NOT NULL,
    skill_category VARCHAR(100) NOT NULL,
    skill_subcategory VARCHAR(100),
    standardized_name VARCHAR(200),
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 4),
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
    gap_type VARCHAR(50) NOT NULL,
    skill_name VARCHAR(200) NOT NULL,
    current_level INTEGER,
    required_level INTEGER NOT NULL,
    gap_size INTEGER NOT NULL,
    learning_priority VARCHAR(20)
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
-- JOB MARKET BOUNDED CONTEXT
-- ================================================

-- Job Roles (Aggregate Root)
CREATE TABLE job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title VARCHAR(200) NOT NULL,
    normalized_title VARCHAR(200) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    job_family VARCHAR(100),
    experience_level VARCHAR(50),
    average_salary DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    demand_score INTEGER CHECK (demand_score BETWEEN 1 AND 100),
    growth_rate DECIMAL(5,2),
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
    is_required BOOLEAN DEFAULT TRUE,
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 4),
    importance_weight DECIMAL(3,2) DEFAULT 1.0,
    market_frequency DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Demand (Entity within Job Market)
CREATE TABLE skill_demand (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(200) NOT NULL,
    skill_category VARCHAR(100),
    demand_score INTEGER CHECK (demand_score BETWEEN 1 AND 100),
    growth_trend VARCHAR(20),
    job_postings_count INTEGER,
    average_salary_impact DECIMAL(10,2),
    time_period DATE NOT NULL,
    geographic_scope VARCHAR(100) DEFAULT 'global',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Salary Benchmarks (Entity within Job Market)
CREATE TABLE salary_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    location VARCHAR(200),
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
    skill_profile_id UUID REFERENCES skill_profiles(id) ON DELETE CASCADE,
    target_skill_name VARCHAR(200) NOT NULL,
    current_proficiency_level INTEGER,
    target_proficiency_level INTEGER NOT NULL,
    learning_priority VARCHAR(20),
    estimated_time_weeks INTEGER,
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
    resource_type VARCHAR(50) NOT NULL,
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
    primary_focus BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Development Plans (Entity within Learning Recommendation)
CREATE TABLE skill_development_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_objective_id UUID REFERENCES learning_objectives(id) ON DELETE CASCADE,
    recommended_resources UUID[] NOT NULL,
    learning_sequence INTEGER[] NOT NULL,
    total_estimated_time_weeks INTEGER,
    total_estimated_cost DECIMAL(10,2),
    plan_effectiveness_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_optimized TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Session management indexes
CREATE INDEX idx_sessions_expires_at ON analysis_sessions(expires_at);
CREATE INDEX idx_sessions_created_at ON analysis_sessions(created_at);
CREATE INDEX idx_sessions_session_status ON analysis_sessions(session_status);
CREATE INDEX idx_sessions_token ON analysis_sessions(session_token);

-- Skills taxonomy indexes
CREATE INDEX idx_skills_taxonomy_category ON skills_taxonomy(category);
CREATE INDEX idx_skills_taxonomy_standardized_name ON skills_taxonomy(standardized_name);
CREATE INDEX idx_skills_taxonomy_name ON skills_taxonomy(skill_name);
CREATE INDEX idx_skills_taxonomy_demand ON skills_taxonomy(market_demand_score);

-- Document processing indexes
CREATE INDEX idx_resume_documents_session ON resume_documents(session_id);
CREATE INDEX idx_resume_documents_hash ON resume_documents(file_hash);
CREATE INDEX idx_extracted_content_document ON extracted_content(document_id);
CREATE INDEX idx_skill_extractions_document ON skill_extractions(document_id);

-- Career analysis indexes
CREATE INDEX idx_skill_profiles_session ON skill_profiles(session_id);
CREATE INDEX idx_profile_skills_profile ON profile_skills(skill_profile_id);
CREATE INDEX idx_career_gaps_profile ON career_gaps(skill_profile_id);
CREATE INDEX idx_gap_details_gap ON gap_details(career_gap_id);
CREATE INDEX idx_market_positions_profile ON market_positions(skill_profile_id);

-- Job market indexes
CREATE INDEX idx_job_roles_title ON job_roles(normalized_title);
CREATE INDEX idx_job_roles_industry ON job_roles(industry);
CREATE INDEX idx_job_role_skills_role ON job_role_skills(job_role_id);
CREATE INDEX idx_skill_demand_skill ON skill_demand(skill_name);
CREATE INDEX idx_skill_demand_period ON skill_demand(time_period);
CREATE INDEX idx_salary_benchmarks_title ON salary_benchmarks(job_title);

-- Learning recommendation indexes
CREATE INDEX idx_learning_objectives_profile ON learning_objectives(skill_profile_id);
CREATE INDEX idx_learning_resources_type ON learning_resources(resource_type);
CREATE INDEX idx_resource_skills_resource ON resource_skills(learning_resource_id);
CREATE INDEX idx_skill_development_plans_objective ON skill_development_plans(learning_objective_id);

-- Analytics indexes
CREATE INDEX idx_user_analytics_session ON user_analytics(session_id);
CREATE INDEX idx_user_analytics_timestamp ON user_analytics(event_timestamp);
CREATE INDEX idx_user_analytics_event_type ON user_analytics(event_type);
