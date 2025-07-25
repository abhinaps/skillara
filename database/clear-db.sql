-- First, drop all tables (with cascade to handle dependencies)
DROP TABLE IF EXISTS
  analysis_sessions,
  career_gaps,
  extracted_content,
  gap_details,
  job_role_skills,
  job_roles,
  learning_objectives,
  learning_resources,
  market_positions,
  profile_skills,
  resource_skills,
  resume_documents,
  salary_benchmarks,
  skill_demand,
  skill_development_plans,
  skill_extractions,
  skill_profiles,
  skills_taxonomy,
  user_analytics
CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS experience_level CASCADE;
DROP TYPE IF EXISTS skill_category CASCADE;
DROP TYPE IF EXISTS session_status CASCADE;

-- Optionally, drop extensions (commented out as you might want to keep them)
-- DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
-- DROP EXTENSION IF EXISTS "pg_trgm" CASCADE;
-- DROP EXTENSION IF EXISTS "btree_gin" CASCADE;
