const fs = require('fs');
const path = require('path');

// Test with a mock resume text to show skill detection capabilities
async function testSkillDetectionWithMockResume() {
  console.log('🔄 Testing skill detection with mock resume content...');
  
  // Mock resume text to demonstrate skill detection
  const mockResumeText = `
    John Doe
    Senior Full Stack Developer
    Email: john.doe@email.com | Phone: (555) 123-4567
    LinkedIn: linkedin.com/in/johndoe

    EXPERIENCE:
    Senior Full Stack Developer - Tech Corp (2020-2024)
    • Developed web applications using React, Node.js, and TypeScript
    • Built RESTful APIs with Express.js and GraphQL
    • Managed databases using PostgreSQL and MongoDB
    • Implemented CI/CD pipelines with Docker and Kubernetes
    • Used AWS services including EC2, S3, and RDS
    • Collaborated using Git, GitHub, and Jira

    Frontend Developer - StartupXYZ (2018-2020)  
    • Created responsive UIs with HTML5, CSS3, and JavaScript
    • Worked with Angular and Vue.js frameworks
    • Used Webpack and Sass for build processes
    • Applied Bootstrap and Tailwind CSS for styling

    EDUCATION:
    Bachelor of Computer Science - University ABC (2014-2018)

    SKILLS:
    Programming Languages: JavaScript, TypeScript, Python, Java, C#
    Frontend: React, Angular, Vue.js, HTML5, CSS3, Sass, Bootstrap
    Backend: Node.js, Express.js, Django, Spring Boot
    Databases: PostgreSQL, MongoDB, MySQL, Redis
    Cloud: AWS, Azure, Docker, Kubernetes
    Tools: Git, GitHub, VS Code, Postman, Figma
  `;

  // Use the same skill detection logic
  const skillPatterns = {
    'Programming Languages': [
      'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'php', 'ruby', 'go', 'rust',
      'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'bash', 'powershell'
    ],
    'Frontend Technologies': [
      'react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
      'jquery', 'webpack', 'vite', 'next.js', 'nuxt', 'gatsby', 'svelte', 'html5', 'css3'
    ],
    'Backend Technologies': [
      'node.js', 'express', 'django', 'flask', 'spring', 'asp.net', 'laravel', 'rails',
      'fastapi', 'nest.js', 'koa', 'hapi', 'gin', 'echo', 'graphql', 'spring boot'
    ],
    'Databases': [
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server',
      'cassandra', 'elasticsearch', 'dynamodb', 'firestore', 'couchdb'
    ],
    'Cloud & DevOps': [
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions',
      'terraform', 'ansible', 'chef', 'puppet', 'vagrant', 'nginx', 'apache', 'ec2', 's3', 'rds'
    ],
    'Tools & Others': [
      'git', 'github', 'svn', 'jira', 'confluence', 'slack', 'teams', 'figma', 'sketch',
      'photoshop', 'illustrator', 'postman', 'insomnia', 'vs code', 'intellij'
    ]
  };

  const detectedSkills = {};
  const allText = mockResumeText.toLowerCase();
  
  Object.entries(skillPatterns).forEach(([category, skills]) => {
    const foundSkills = skills.filter(skill => {
      const variations = [
        skill,
        skill.replace('.', ''),
        skill.replace('-', ''),
        skill.replace('_', ''),
        skill.replace(' ', '')
      ];
      return variations.some(variation => allText.includes(variation.toLowerCase()));
    });
    
    if (foundSkills.length > 0) {
      detectedSkills[category] = foundSkills;
    }
  });

  // Display results
  console.log('📄 Mock Resume Analysis Results:');
  console.log('📝 Text length:', mockResumeText.length, 'characters');
  
  if (Object.keys(detectedSkills).length > 0) {
    console.log('\n🎯 Detected Skills:');
    Object.entries(detectedSkills).forEach(([category, skills]) => {
      console.log(`\n  📂 ${category} (${skills.length} skills):`);
      skills.forEach(skill => {
        console.log(`    ✅ ${skill}`);
      });
    });
    
    // Count total skills
    const totalSkills = Object.values(detectedSkills).reduce((sum, skills) => sum + skills.length, 0);
    console.log(`\n📊 Total Skills Detected: ${totalSkills}`);
  } else {
    console.log('❌ No technical skills detected');
  }

  // Experience level assessment
  const seniorityKeywords = {
    'Senior Level': ['senior', 'lead', 'principal', 'architect', 'manager'],
    'Mid Level': ['developer', 'engineer', 'analyst'],
    'Entry Level': ['junior', 'intern', 'trainee', 'associate']
  };

  console.log('\n🎯 Experience Level Analysis:');
  Object.entries(seniorityKeywords).forEach(([level, keywords]) => {
    const found = keywords.filter(keyword => allText.includes(keyword));
    if (found.length > 0) {
      console.log(`  📈 ${level}: ${found.join(', ')}`);
    }
  });

  console.log('\n🎉 Mock resume skill detection completed!');
}

// Test both real PDF and mock resume
async function runBothTests() {
  console.log('=' .repeat(60));
  console.log('🧪 COMPREHENSIVE SKILL DETECTION TEST');  
  console.log('=' .repeat(60));
  
  // First test with actual PDF
  await testActualPDF();
  
  console.log('\n' + '=' .repeat(60));
  
  // Then test with mock resume
  await testSkillDetectionWithMockResume();
}

async function testActualPDF() {
  console.log('📄 PART 1: Real PDF Analysis (From16_A.pdf)');
  console.log('-' .repeat(40));
  
  try {
    const storedPdfPath = path.join(__dirname, 'uploads', 'documents', '9449b63f-345c-4a7d-bfb1-5ef41d90d2c9.pdf');
    
    if (!fs.existsSync(storedPdfPath)) {
      console.log('❌ PDF file not found');
      return;
    }
    
    const pdf = require('pdf-parse');
    const pdfBuffer = fs.readFileSync(storedPdfPath);
    const pdfData = await pdf(pdfBuffer);
    
    console.log('✅ Extracted', pdfData.text.length, 'characters from', pdfData.numpages, 'pages');
    console.log('📋 Document Type: Tax Form (Form 16)');
    console.log('🔍 Result: Limited technical skills expected (non-technical document)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runBothTests().catch(console.error);
