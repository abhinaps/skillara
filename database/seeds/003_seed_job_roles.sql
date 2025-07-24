-- 003_seed_job_roles.sql
-- Comprehensive job roles seed data for testing and development

-- Insert Job Roles (50+ popular roles across different categories)
INSERT INTO job_roles (job_title, normalized_title, industry, job_family, experience_level, average_salary, salary_currency, demand_score, growth_rate, is_trending) VALUES

-- Frontend Development
('Frontend Developer', 'frontend-developer', 'Technology', 'Engineering', 'Mid-Level', 85000.00, 'USD', 92, 8.5, true),
('React Developer', 'react-developer', 'Technology', 'Engineering', 'Mid-Level', 90000.00, 'USD', 89, 12.3, true),
('Vue.js Developer', 'vue-developer', 'Technology', 'Engineering', 'Mid-Level', 82000.00, 'USD', 75, 15.2, true),
('Angular Developer', 'angular-developer', 'Technology', 'Engineering', 'Mid-Level', 88000.00, 'USD', 70, 2.1, false),
('UI Developer', 'ui-developer', 'Technology', 'Engineering', 'Mid-Level', 80000.00, 'USD', 85, 6.8, true),
('Junior Frontend Developer', 'junior-frontend-developer', 'Technology', 'Engineering', 'Junior', 65000.00, 'USD', 88, 9.2, true),
('Senior Frontend Developer', 'senior-frontend-developer', 'Technology', 'Engineering', 'Senior', 115000.00, 'USD', 90, 7.5, true),

-- Backend Development
('Backend Developer', 'backend-developer', 'Technology', 'Engineering', 'Mid-Level', 95000.00, 'USD', 94, 9.1, true),
('Node.js Developer', 'nodejs-developer', 'Technology', 'Engineering', 'Mid-Level', 92000.00, 'USD', 86, 11.4, true),
('Python Developer', 'python-developer', 'Technology', 'Engineering', 'Mid-Level', 98000.00, 'USD', 91, 13.7, true),
('Java Developer', 'java-developer', 'Technology', 'Engineering', 'Mid-Level', 100000.00, 'USD', 82, 4.3, false),
('C# Developer', 'csharp-developer', 'Technology', 'Engineering', 'Mid-Level', 95000.00, 'USD', 78, 3.8, false),
('Go Developer', 'go-developer', 'Technology', 'Engineering', 'Mid-Level', 105000.00, 'USD', 76, 18.2, true),
('Rust Developer', 'rust-developer', 'Technology', 'Engineering', 'Mid-Level', 125000.00, 'USD', 72, 22.5, true),
('API Developer', 'api-developer', 'Technology', 'Engineering', 'Mid-Level', 93000.00, 'USD', 87, 10.6, true),
('Junior Backend Developer', 'junior-backend-developer', 'Technology', 'Engineering', 'Junior', 70000.00, 'USD', 85, 8.9, true),
('Senior Backend Developer', 'senior-backend-developer', 'Technology', 'Engineering', 'Senior', 125000.00, 'USD', 88, 8.2, true),

-- Full Stack Development
('Full Stack Developer', 'fullstack-developer', 'Technology', 'Engineering', 'Mid-Level', 105000.00, 'USD', 95, 11.8, true),
('MEAN Stack Developer', 'mean-developer', 'Technology', 'Engineering', 'Mid-Level', 98000.00, 'USD', 78, 8.1, false),
('MERN Stack Developer', 'mern-developer', 'Technology', 'Engineering', 'Mid-Level', 102000.00, 'USD', 85, 14.2, true),
('Senior Full Stack Developer', 'senior-fullstack-developer', 'Technology', 'Engineering', 'Senior', 135000.00, 'USD', 92, 10.3, true),

-- DevOps & Infrastructure
('DevOps Engineer', 'devops-engineer', 'Technology', 'Operations', 'Mid-Level', 110000.00, 'USD', 93, 16.4, true),
('Site Reliability Engineer', 'sre-engineer', 'Technology', 'Operations', 'Senior', 130000.00, 'USD', 89, 18.7, true),
('Cloud Engineer', 'cloud-engineer', 'Technology', 'Operations', 'Mid-Level', 115000.00, 'USD', 91, 20.3, true),
('AWS Engineer', 'aws-engineer', 'Technology', 'Operations', 'Mid-Level', 118000.00, 'USD', 88, 19.1, true),
('Kubernetes Engineer', 'kubernetes-engineer', 'Technology', 'Operations', 'Senior', 125000.00, 'USD', 85, 25.6, true),
('Infrastructure Engineer', 'infrastructure-engineer', 'Technology', 'Operations', 'Mid-Level', 105000.00, 'USD', 83, 12.8, true),
('Platform Engineer', 'platform-engineer', 'Technology', 'Operations', 'Senior', 135000.00, 'USD', 87, 21.4, true),

-- Mobile Development
('Mobile Developer', 'mobile-developer', 'Technology', 'Engineering', 'Mid-Level', 100000.00, 'USD', 85, 9.7, true),
('iOS Developer', 'ios-developer', 'Technology', 'Engineering', 'Mid-Level', 108000.00, 'USD', 80, 7.2, true),
('Android Developer', 'android-developer', 'Technology', 'Engineering', 'Mid-Level', 105000.00, 'USD', 82, 8.5, true),
('React Native Developer', 'react-native-developer', 'Technology', 'Engineering', 'Mid-Level', 98000.00, 'USD', 78, 12.1, true),
('Flutter Developer', 'flutter-developer', 'Technology', 'Engineering', 'Mid-Level', 95000.00, 'USD', 75, 28.3, true),

-- Data & Analytics
('Data Scientist', 'data-scientist', 'Technology', 'Data & Analytics', 'Mid-Level', 125000.00, 'USD', 92, 15.8, true),
('Data Engineer', 'data-engineer', 'Technology', 'Data & Analytics', 'Mid-Level', 115000.00, 'USD', 89, 18.2, true),
('Machine Learning Engineer', 'ml-engineer', 'Technology', 'Data & Analytics', 'Senior', 140000.00, 'USD', 86, 23.7, true),
('Data Analyst', 'data-analyst', 'Technology', 'Data & Analytics', 'Mid-Level', 85000.00, 'USD', 88, 12.4, true),
('Business Intelligence Developer', 'bi-developer', 'Technology', 'Data & Analytics', 'Mid-Level', 95000.00, 'USD', 75, 8.9, false),

-- Database & Systems
('Database Administrator', 'database-administrator', 'Technology', 'Operations', 'Mid-Level', 90000.00, 'USD', 72, 5.2, false),
('Database Developer', 'database-developer', 'Technology', 'Engineering', 'Mid-Level', 88000.00, 'USD', 75, 6.1, false),
('Systems Administrator', 'systems-administrator', 'Technology', 'Operations', 'Mid-Level', 85000.00, 'USD', 68, 2.8, false),

-- QA & Testing
('QA Engineer', 'qa-engineer', 'Technology', 'Quality Assurance', 'Mid-Level', 75000.00, 'USD', 80, 7.3, true),
('Test Automation Engineer', 'test-automation-engineer', 'Technology', 'Quality Assurance', 'Mid-Level', 85000.00, 'USD', 82, 11.6, true),
('Software Tester', 'software-tester', 'Technology', 'Quality Assurance', 'Mid-Level', 70000.00, 'USD', 75, 5.9, false),

-- Design & UX
('UI/UX Designer', 'ui-ux-designer', 'Technology', 'Design', 'Mid-Level', 85000.00, 'USD', 88, 9.4, true),
('Product Designer', 'product-designer', 'Technology', 'Design', 'Mid-Level', 95000.00, 'USD', 85, 12.1, true),
('UX Researcher', 'ux-researcher', 'Technology', 'Design', 'Mid-Level', 90000.00, 'USD', 78, 8.7, true),

-- Management & Leadership
('Engineering Manager', 'engineering-manager', 'Technology', 'Management', 'Senior', 150000.00, 'USD', 85, 8.2, true),
('Technical Lead', 'technical-lead', 'Technology', 'Management', 'Senior', 135000.00, 'USD', 87, 7.9, true),
('Product Manager', 'product-manager', 'Technology', 'Product', 'Mid-Level', 120000.00, 'USD', 90, 10.5, true),
('Scrum Master', 'scrum-master', 'Technology', 'Project Management', 'Mid-Level', 95000.00, 'USD', 78, 6.8, false),
('Team Lead', 'team-lead', 'Technology', 'Management', 'Senior', 125000.00, 'USD', 82, 7.1, true),

-- Security
('Cybersecurity Engineer', 'cybersecurity-engineer', 'Technology', 'Security', 'Mid-Level', 110000.00, 'USD', 88, 14.3, true),
('Security Analyst', 'security-analyst', 'Technology', 'Security', 'Mid-Level', 95000.00, 'USD', 85, 12.7, true),

-- Emerging Roles
('Cloud Architect', 'cloud-architect', 'Technology', 'Architecture', 'Senior', 145000.00, 'USD', 89, 19.8, true),
('Solutions Architect', 'solutions-architect', 'Technology', 'Architecture', 'Senior', 140000.00, 'USD', 86, 11.3, true),
('Blockchain Developer', 'blockchain-developer', 'Technology', 'Engineering', 'Mid-Level', 130000.00, 'USD', 70, 35.2, true);

-- Insert Job Role Skills for Frontend Developer
INSERT INTO job_role_skills (job_role_id, skill_name, skill_category, is_required, proficiency_level, importance_weight, market_frequency) VALUES
-- Frontend Developer Skills
((SELECT id FROM job_roles WHERE normalized_title = 'frontend-developer'), 'JavaScript', 'frontend', true, 3, 1.0, 0.95),
((SELECT id FROM job_roles WHERE normalized_title = 'frontend-developer'), 'HTML', 'frontend', true, 3, 1.0, 0.98),
((SELECT id FROM job_roles WHERE normalized_title = 'frontend-developer'), 'CSS', 'frontend', true, 3, 1.0, 0.95),
((SELECT id FROM job_roles WHERE normalized_title = 'frontend-developer'), 'React', 'frontend', false, 3, 0.8, 0.75),
((SELECT id FROM job_roles WHERE normalized_title = 'frontend-developer'), 'TypeScript', 'frontend', false, 2, 0.7, 0.65),
((SELECT id FROM job_roles WHERE normalized_title = 'frontend-developer'), 'Git', 'devops', true, 2, 0.9, 0.90),
((SELECT id FROM job_roles WHERE normalized_title = 'frontend-developer'), 'Sass', 'frontend', false, 2, 0.5, 0.45),
((SELECT id FROM job_roles WHERE normalized_title = 'frontend-developer'), 'Webpack', 'frontend', false, 2, 0.6, 0.55),

-- React Developer Skills
((SELECT id FROM job_roles WHERE normalized_title = 'react-developer'), 'React', 'frontend', true, 4, 1.0, 0.95),
((SELECT id FROM job_roles WHERE normalized_title = 'react-developer'), 'JavaScript', 'frontend', true, 4, 1.0, 0.98),
((SELECT id FROM job_roles WHERE normalized_title = 'react-developer'), 'TypeScript', 'frontend', true, 3, 0.9, 0.80),
((SELECT id FROM job_roles WHERE normalized_title = 'react-developer'), 'HTML', 'frontend', true, 3, 0.8, 0.90),
((SELECT id FROM job_roles WHERE normalized_title = 'react-developer'), 'CSS', 'frontend', true, 3, 0.8, 0.88),
((SELECT id FROM job_roles WHERE normalized_title = 'react-developer'), 'Redux', 'frontend', false, 3, 0.7, 0.60),
((SELECT id FROM job_roles WHERE normalized_title = 'react-developer'), 'Next.js', 'frontend', false, 3, 0.6, 0.45),
((SELECT id FROM job_roles WHERE normalized_title = 'react-developer'), 'Git', 'devops', true, 2, 0.9, 0.92),

-- Backend Developer Skills
((SELECT id FROM job_roles WHERE normalized_title = 'backend-developer'), 'Node.js', 'backend', true, 3, 0.8, 0.70),
((SELECT id FROM job_roles WHERE normalized_title = 'backend-developer'), 'Python', 'backend', true, 3, 0.9, 0.75),
((SELECT id FROM job_roles WHERE normalized_title = 'backend-developer'), 'Java', 'backend', false, 3, 0.7, 0.65),
((SELECT id FROM job_roles WHERE normalized_title = 'backend-developer'), 'SQL', 'database', true, 3, 0.9, 0.88),
((SELECT id FROM job_roles WHERE normalized_title = 'backend-developer'), 'PostgreSQL', 'database', false, 3, 0.7, 0.60),
((SELECT id FROM job_roles WHERE normalized_title = 'backend-developer'), 'MongoDB', 'database', false, 2, 0.6, 0.55),
((SELECT id FROM job_roles WHERE normalized_title = 'backend-developer'), 'REST APIs', 'backend', true, 3, 0.9, 0.85),
((SELECT id FROM job_roles WHERE normalized_title = 'backend-developer'), 'Docker', 'devops', false, 2, 0.6, 0.50),
((SELECT id FROM job_roles WHERE normalized_title = 'backend-developer'), 'Git', 'devops', true, 2, 0.9, 0.93),

-- Full Stack Developer Skills
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'JavaScript', 'frontend', true, 4, 1.0, 0.96),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'React', 'frontend', true, 3, 0.9, 0.80),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'Node.js', 'backend', true, 3, 0.9, 0.78),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'TypeScript', 'frontend', false, 3, 0.8, 0.70),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'HTML', 'frontend', true, 3, 0.8, 0.92),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'CSS', 'frontend', true, 3, 0.8, 0.90),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'SQL', 'database', true, 3, 0.9, 0.85),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'PostgreSQL', 'database', false, 3, 0.7, 0.65),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'MongoDB', 'database', false, 2, 0.6, 0.58),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'Express.js', 'backend', false, 3, 0.7, 0.60),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'Git', 'devops', true, 3, 0.9, 0.95),
((SELECT id FROM job_roles WHERE normalized_title = 'fullstack-developer'), 'Docker', 'devops', false, 2, 0.6, 0.52),

-- DevOps Engineer Skills
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'Docker', 'devops', true, 4, 1.0, 0.92),
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'Kubernetes', 'devops', true, 3, 0.9, 0.75),
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'AWS', 'devops', true, 3, 0.9, 0.80),
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'Linux', 'devops', true, 4, 0.9, 0.88),
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'Terraform', 'devops', false, 3, 0.8, 0.65),
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'Ansible', 'devops', false, 3, 0.7, 0.55),
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'Jenkins', 'devops', false, 3, 0.7, 0.60),
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'Git', 'devops', true, 3, 0.9, 0.95),
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'Python', 'backend', false, 3, 0.6, 0.70),
((SELECT id FROM job_roles WHERE normalized_title = 'devops-engineer'), 'Bash', 'devops', true, 3, 0.8, 0.85),

-- Python Developer Skills
((SELECT id FROM job_roles WHERE normalized_title = 'python-developer'), 'Python', 'backend', true, 4, 1.0, 0.98),
((SELECT id FROM job_roles WHERE normalized_title = 'python-developer'), 'Django', 'backend', false, 3, 0.7, 0.55),
((SELECT id FROM job_roles WHERE normalized_title = 'python-developer'), 'Flask', 'backend', false, 3, 0.6, 0.45),
((SELECT id FROM job_roles WHERE normalized_title = 'python-developer'), 'FastAPI', 'backend', false, 3, 0.8, 0.40),
((SELECT id FROM job_roles WHERE normalized_title = 'python-developer'), 'SQL', 'database', true, 3, 0.9, 0.85),
((SELECT id FROM job_roles WHERE normalized_title = 'python-developer'), 'PostgreSQL', 'database', false, 3, 0.7, 0.65),
((SELECT id FROM job_roles WHERE normalized_title = 'python-developer'), 'MongoDB', 'database', false, 2, 0.5, 0.40),
((SELECT id FROM job_roles WHERE normalized_title = 'python-developer'), 'REST APIs', 'backend', true, 3, 0.9, 0.80),
((SELECT id FROM job_roles WHERE normalized_title = 'python-developer'), 'Git', 'devops', true, 2, 0.9, 0.93),

-- Data Scientist Skills
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'Python', 'backend', true, 4, 1.0, 0.95),
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'R', 'data_science', false, 3, 0.7, 0.60),
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'SQL', 'database', true, 4, 0.9, 0.90),
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'Machine Learning', 'data_science', true, 4, 1.0, 0.85),
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'pandas', 'data_science', true, 4, 0.9, 0.80),
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'NumPy', 'data_science', true, 3, 0.8, 0.75),
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'scikit-learn', 'data_science', true, 3, 0.8, 0.70),
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'Jupyter', 'data_science', true, 3, 0.7, 0.85),
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'Statistics', 'data_science', true, 4, 0.9, 0.88),
((SELECT id FROM job_roles WHERE normalized_title = 'data-scientist'), 'Data Visualization', 'data_science', true, 3, 0.8, 0.75),

-- Mobile Developer Skills
((SELECT id FROM job_roles WHERE normalized_title = 'mobile-developer'), 'React Native', 'mobile', false, 3, 0.7, 0.45),
((SELECT id FROM job_roles WHERE normalized_title = 'mobile-developer'), 'Flutter', 'mobile', false, 3, 0.6, 0.35),
((SELECT id FROM job_roles WHERE normalized_title = 'mobile-developer'), 'Swift', 'mobile', false, 3, 0.8, 0.40),
((SELECT id FROM job_roles WHERE normalized_title = 'mobile-developer'), 'Kotlin', 'mobile', false, 3, 0.7, 0.38),
((SELECT id FROM job_roles WHERE normalized_title = 'mobile-developer'), 'Java', 'backend', false, 3, 0.6, 0.45),
((SELECT id FROM job_roles WHERE normalized_title = 'mobile-developer'), 'JavaScript', 'frontend', false, 3, 0.7, 0.50),
((SELECT id FROM job_roles WHERE normalized_title = 'mobile-developer'), 'Git', 'devops', true, 2, 0.9, 0.90),

-- UI/UX Designer Skills
((SELECT id FROM job_roles WHERE normalized_title = 'ui-ux-designer'), 'Figma', 'design', true, 4, 1.0, 0.90),
((SELECT id FROM job_roles WHERE normalized_title = 'ui-ux-designer'), 'Adobe Photoshop', 'design', false, 3, 0.6, 0.55),
((SELECT id FROM job_roles WHERE normalized_title = 'ui-ux-designer'), 'Sketch', 'design', false, 3, 0.5, 0.40),
((SELECT id FROM job_roles WHERE normalized_title = 'ui-ux-designer'), 'UI Design', 'design', true, 4, 1.0, 0.95),
((SELECT id FROM job_roles WHERE normalized_title = 'ui-ux-designer'), 'UX Design', 'design', true, 4, 1.0, 0.95),
((SELECT id FROM job_roles WHERE normalized_title = 'ui-ux-designer'), 'User Research', 'design', true, 3, 0.8, 0.70),
((SELECT id FROM job_roles WHERE normalized_title = 'ui-ux-designer'), 'Prototyping', 'design', true, 3, 0.9, 0.80),
((SELECT id FROM job_roles WHERE normalized_title = 'ui-ux-designer'), 'HTML', 'frontend', false, 2, 0.5, 0.45),
((SELECT id FROM job_roles WHERE normalized_title = 'ui-ux-designer'), 'CSS', 'frontend', false, 2, 0.5, 0.45);

-- Insert Salary Benchmarks
INSERT INTO salary_benchmarks (job_title, industry, location, experience_level, salary_min, salary_max, salary_median, salary_currency, data_source, sample_size, as_of_date) VALUES

-- Frontend Developer Salaries
('Frontend Developer', 'Technology', 'United States', 'Junior', 55000.00, 75000.00, 65000.00, 'USD', 'Market Survey', 1500, '2024-12-01'),
('Frontend Developer', 'Technology', 'United States', 'Mid-Level', 70000.00, 100000.00, 85000.00, 'USD', 'Market Survey', 2200, '2024-12-01'),
('Frontend Developer', 'Technology', 'United States', 'Senior', 95000.00, 135000.00, 115000.00, 'USD', 'Market Survey', 1800, '2024-12-01'),
('Frontend Developer', 'Technology', 'San Francisco', 'Mid-Level', 95000.00, 125000.00, 110000.00, 'USD', 'Market Survey', 450, '2024-12-01'),
('Frontend Developer', 'Technology', 'New York', 'Mid-Level', 85000.00, 115000.00, 100000.00, 'USD', 'Market Survey', 380, '2024-12-01'),

-- Backend Developer Salaries
('Backend Developer', 'Technology', 'United States', 'Junior', 60000.00, 80000.00, 70000.00, 'USD', 'Market Survey', 1400, '2024-12-01'),
('Backend Developer', 'Technology', 'United States', 'Mid-Level', 80000.00, 110000.00, 95000.00, 'USD', 'Market Survey', 2500, '2024-12-01'),
('Backend Developer', 'Technology', 'United States', 'Senior', 105000.00, 145000.00, 125000.00, 'USD', 'Market Survey', 1900, '2024-12-01'),

-- Full Stack Developer Salaries
('Full Stack Developer', 'Technology', 'United States', 'Junior', 65000.00, 85000.00, 75000.00, 'USD', 'Market Survey', 1200, '2024-12-01'),
('Full Stack Developer', 'Technology', 'United States', 'Mid-Level', 85000.00, 125000.00, 105000.00, 'USD', 'Market Survey', 2800, '2024-12-01'),
('Full Stack Developer', 'Technology', 'United States', 'Senior', 115000.00, 155000.00, 135000.00, 'USD', 'Market Survey', 2100, '2024-12-01'),

-- DevOps Engineer Salaries
('DevOps Engineer', 'Technology', 'United States', 'Mid-Level', 90000.00, 130000.00, 110000.00, 'USD', 'Market Survey', 1600, '2024-12-01'),
('DevOps Engineer', 'Technology', 'United States', 'Senior', 120000.00, 160000.00, 140000.00, 'USD', 'Market Survey', 1200, '2024-12-01'),

-- Data Scientist Salaries
('Data Scientist', 'Technology', 'United States', 'Mid-Level', 100000.00, 150000.00, 125000.00, 'USD', 'Market Survey', 1800, '2024-12-01'),
('Data Scientist', 'Technology', 'United States', 'Senior', 130000.00, 180000.00, 155000.00, 'USD', 'Market Survey', 1400, '2024-12-01'),

-- Mobile Developer Salaries
('Mobile Developer', 'Technology', 'United States', 'Mid-Level', 85000.00, 115000.00, 100000.00, 'USD', 'Market Survey', 900, '2024-12-01'),
('Mobile Developer', 'Technology', 'United States', 'Senior', 110000.00, 150000.00, 130000.00, 'USD', 'Market Survey', 700, '2024-12-01'),

-- UI/UX Designer Salaries
('UI/UX Designer', 'Technology', 'United States', 'Mid-Level', 70000.00, 100000.00, 85000.00, 'USD', 'Market Survey', 1100, '2024-12-01'),
('UI/UX Designer', 'Technology', 'United States', 'Senior', 95000.00, 125000.00, 110000.00, 'USD', 'Market Survey', 800, '2024-12-01'),

-- Product Manager Salaries
('Product Manager', 'Technology', 'United States', 'Mid-Level', 100000.00, 140000.00, 120000.00, 'USD', 'Market Survey', 1300, '2024-12-01'),
('Product Manager', 'Technology', 'United States', 'Senior', 130000.00, 180000.00, 155000.00, 'USD', 'Market Survey', 1000, '2024-12-01'),

-- Engineering Manager Salaries
('Engineering Manager', 'Technology', 'United States', 'Senior', 130000.00, 170000.00, 150000.00, 'USD', 'Market Survey', 900, '2024-12-01');

-- Update timestamps
UPDATE job_roles SET
    created_at = NOW(),
    last_updated = NOW()
WHERE created_at IS NULL;

UPDATE job_role_skills SET
    created_at = NOW()
WHERE created_at IS NULL;

UPDATE salary_benchmarks SET
    created_at = NOW()
WHERE created_at IS NULL;
