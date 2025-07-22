-- 002_seed_skills_taxonomy.sql
-- Basic skills taxonomy data for development

INSERT INTO skills_taxonomy (skill_name, standardized_name, category, subcategory, skill_description, market_demand_score, learning_difficulty, avg_time_to_learn_weeks, avg_salary_impact, aliases, is_trending, trend_direction) VALUES

-- Frontend Technologies
('JavaScript', 'javascript', 'frontend', 'programming-language', 'Dynamic programming language for web development', 95, 3, 8, 5000.00, ARRAY['JS', 'ECMAScript'], true, 'stable'),
('TypeScript', 'typescript', 'frontend', 'programming-language', 'Typed superset of JavaScript', 90, 3, 6, 8000.00, ARRAY['TS'], true, 'rising'),
('React', 'react', 'frontend', 'framework', 'JavaScript library for building user interfaces', 92, 4, 12, 12000.00, ARRAY['React.js', 'ReactJS'], true, 'stable'),
('Vue.js', 'vue', 'frontend', 'framework', 'Progressive JavaScript framework', 85, 3, 10, 8000.00, ARRAY['Vue', 'VueJS'], true, 'rising'),
('Angular', 'angular', 'frontend', 'framework', 'Platform for building mobile and desktop web applications', 80, 4, 16, 10000.00, ARRAY['AngularJS', 'Angular 2+'], false, 'declining'),
('HTML', 'html', 'frontend', 'markup', 'Standard markup language for web pages', 100, 1, 2, 2000.00, ARRAY['HTML5'], false, 'stable'),
('CSS', 'css', 'frontend', 'styling', 'Style sheet language for web pages', 100, 2, 4, 3000.00, ARRAY['CSS3'], false, 'stable'),
('Sass', 'sass', 'frontend', 'styling', 'CSS preprocessor with variables and functions', 70, 2, 3, 2000.00, ARRAY['SCSS'], false, 'stable'),
('Tailwind CSS', 'tailwind-css', 'frontend', 'framework', 'Utility-first CSS framework', 85, 2, 4, 4000.00, ARRAY['Tailwind'], true, 'rising'),

-- Backend Technologies
('Node.js', 'nodejs', 'backend', 'runtime', 'JavaScript runtime built on Chrome V8 engine', 88, 3, 8, 8000.00, ARRAY['Node'], true, 'stable'),
('Python', 'python', 'backend', 'programming-language', 'High-level programming language', 92, 3, 10, 10000.00, ARRAY['Python 3'], true, 'rising'),
('Java', 'java', 'backend', 'programming-language', 'Object-oriented programming language', 85, 4, 16, 12000.00, ARRAY['Java 8', 'Java 11'], false, 'stable'),
('C#', 'csharp', 'backend', 'programming-language', 'Object-oriented programming language by Microsoft', 80, 4, 14, 11000.00, ARRAY['C-Sharp', 'CSharp'], false, 'stable'),
('Go', 'go', 'backend', 'programming-language', 'Programming language developed by Google', 75, 3, 8, 9000.00, ARRAY['Golang'], true, 'rising'),
('Rust', 'rust', 'backend', 'programming-language', 'Systems programming language focused on safety', 70, 5, 20, 15000.00, ARRAY[]::text[], true, 'rising'),
('Express.js', 'express', 'backend', 'framework', 'Web application framework for Node.js', 85, 2, 4, 5000.00, ARRAY['Express'], false, 'stable'),
('Django', 'django', 'backend', 'framework', 'High-level Python web framework', 80, 4, 12, 8000.00, ARRAY[]::text[], false, 'stable'),
('Flask', 'flask', 'backend', 'framework', 'Micro web framework for Python', 75, 3, 6, 6000.00, ARRAY[]::text[], false, 'stable'),
('Spring Boot', 'spring-boot', 'backend', 'framework', 'Java framework for building applications', 78, 4, 16, 10000.00, ARRAY['Spring'], false, 'stable'),

-- Database Technologies
('PostgreSQL', 'postgresql', 'database', 'relational', 'Open source relational database', 88, 3, 8, 7000.00, ARRAY['Postgres', 'psql'], true, 'rising'),
('MySQL', 'mysql', 'database', 'relational', 'Open source relational database management system', 85, 3, 6, 5000.00, ARRAY[]::text[], false, 'stable'),
('MongoDB', 'mongodb', 'database', 'nosql', 'NoSQL document database', 82, 3, 6, 6000.00, ARRAY['Mongo'], true, 'stable'),
('Redis', 'redis', 'database', 'cache', 'In-memory data structure store', 80, 2, 4, 5000.00, ARRAY[]::text[], true, 'stable'),
('SQL', 'sql', 'database', 'query-language', 'Standard language for managing relational databases', 95, 3, 8, 6000.00, ARRAY[]::text[], false, 'stable'),

-- DevOps & Tools
('Docker', 'docker', 'devops', 'containerization', 'Platform for developing and running applications in containers', 90, 3, 6, 8000.00, ARRAY[]::text[], true, 'stable'),
('Kubernetes', 'kubernetes', 'devops', 'orchestration', 'Container orchestration platform', 85, 5, 20, 15000.00, ARRAY['K8s'], true, 'rising'),
('AWS', 'aws', 'devops', 'cloud', 'Amazon Web Services cloud platform', 92, 4, 16, 12000.00, ARRAY['Amazon Web Services'], true, 'stable'),
('Git', 'git', 'devops', 'version-control', 'Distributed version control system', 98, 2, 3, 3000.00, ARRAY[]::text[], false, 'stable'),
('GitHub', 'github', 'devops', 'platform', 'Web-based Git repository hosting service', 95, 1, 2, 2000.00, ARRAY[]::text[], false, 'stable'),
('CI/CD', 'cicd', 'devops', 'automation', 'Continuous Integration and Continuous Deployment', 88, 4, 12, 10000.00, ARRAY['Continuous Integration'], true, 'rising'),

-- Design & UI/UX
('Figma', 'figma', 'design', 'tool', 'Collaborative interface design tool', 90, 2, 4, 4000.00, ARRAY[]::text[], true, 'rising'),
('Adobe Photoshop', 'photoshop', 'design', 'tool', 'Image editing and graphic design software', 75, 3, 8, 3000.00, ARRAY['Photoshop'], false, 'stable'),
('UI Design', 'ui-design', 'design', 'discipline', 'User Interface design principles and practices', 85, 3, 12, 6000.00, ARRAY['User Interface Design'], true, 'stable'),
('UX Design', 'ux-design', 'design', 'discipline', 'User Experience design principles and practices', 88, 4, 16, 8000.00, ARRAY['User Experience Design'], true, 'rising'),

-- Soft Skills
('Communication', 'communication', 'soft_skills', 'interpersonal', 'Ability to convey information effectively', 95, 2, 12, 5000.00, ARRAY[]::text[], false, 'stable'),
('Leadership', 'leadership', 'soft_skills', 'management', 'Ability to guide and motivate teams', 90, 4, 24, 15000.00, ARRAY[]::text[], true, 'stable'),
('Problem Solving', 'problem-solving', 'soft_skills', 'analytical', 'Ability to identify and solve complex problems', 98, 3, 16, 8000.00, ARRAY[]::text[], false, 'stable'),
('Project Management', 'project-management', 'project_management', 'methodology', 'Planning and executing projects effectively', 88, 3, 12, 10000.00, ARRAY['PM'], true, 'stable'),
('Agile', 'agile', 'project_management', 'methodology', 'Iterative approach to software development', 90, 2, 6, 6000.00, ARRAY['Agile Methodology'], true, 'stable'),
('Scrum', 'scrum', 'project_management', 'framework', 'Framework for implementing Agile development', 85, 2, 4, 5000.00, ARRAY[]::text[], true, 'stable');

-- Update the created_at and updated_at timestamps
UPDATE skills_taxonomy SET
    created_at = NOW(),
    last_updated = NOW()
WHERE created_at IS NULL;
