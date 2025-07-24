import dotenv from 'dotenv';
import { GeminiAIService } from './src/infrastructure/ai/GeminiAIService';
import { AIProviderConfig } from './src/domain/services/ai/interfaces';

// Load environment variables
dotenv.config();

/**
 * Test Google Gemini AI Service
 * This script validates the Gemini integration with skill extraction
 */

const testResume = `
John Smith - Senior Full Stack Developer
Email: john.smith@email.com | Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Senior Full Stack Developer with 8+ years of experience building scalable web applications using React, Node.js, and PostgreSQL. Expert in TypeScript, JavaScript, and modern frontend frameworks. Proven track record of leading development teams and delivering high-quality software solutions.

TECHNICAL SKILLS
• Frontend: React, Angular, Vue.js, JavaScript, TypeScript, HTML5, CSS3, Sass, Bootstrap, Tailwind CSS
• Backend: Node.js, Express.js, Python, Django, FastAPI, Java, Spring Boot
• Databases: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
• Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, Jenkins, GitHub Actions
• Tools: Git, GitHub, VS Code, Figma, Adobe Photoshop, Postman
• Testing: Jest, Mocha, Cypress, Selenium

PROFESSIONAL EXPERIENCE

Senior Full Stack Developer - Tech Corp (2020 - Present)
• Developed and maintained React-based web applications serving 100K+ users
• Built RESTful APIs using Node.js and Express with PostgreSQL database
• Implemented CI/CD pipelines using Jenkins and Docker for automated deployments
• Led a team of 5 developers using Agile methodology and Scrum practices
• Optimized application performance resulting in 40% faster load times

Full Stack Developer - StartupXYZ (2018 - 2020)
• Created responsive web applications using Vue.js and Django REST framework
• Designed and implemented MongoDB database schemas for user management
• Integrated third-party APIs including payment processing and social authentication
• Participated in code reviews and mentored junior developers
• Used AWS services for cloud hosting and serverless functions

Frontend Developer - WebSolutions Inc (2016 - 2018)
• Built interactive user interfaces using JavaScript, jQuery, and Bootstrap
• Collaborated with UX designers using Figma and Adobe Creative Suite
• Implemented responsive designs with CSS3 and Sass preprocessor
• Worked with backend teams to integrate APIs and ensure data consistency

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2016

CERTIFICATIONS
• AWS Certified Solutions Architect
• Certified Scrum Master (CSM)
• Google Analytics Certified

PROJECTS
E-commerce Platform (2023)
• Full-stack application built with Next.js, TypeScript, and Stripe integration
• Implemented real-time inventory management using WebSocket connections
• Used Docker for containerization and deployed on AWS ECS

Portfolio Website (2022)
• Personal portfolio built with React and deployed on Vercel
• Integrated with headless CMS for dynamic content management
• Optimized for SEO and achieved 95+ Lighthouse scores
`;

async function testGeminiAIService() {
  console.log('🧪 Testing Google Gemini AI Service...\n');

  // Load API key from environment
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('📝 Please set your Gemini API key in the .env file:');
    console.log('   GEMINI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  // Create service instance
  const config: AIProviderConfig = { apiKey };
  const geminiService = new GeminiAIService(config);

  try {
    // Test 1: Check service health
    console.log('🏥 Checking service health...');
    const isHealthy = await geminiService.isHealthy();
    console.log(`   Health status: ${isHealthy ? '✅ Healthy' : '⚠️ Fallback mode'}\n`);

    // Test 2: Extract skills from test resume
    console.log('📄 Extracting skills from test resume...');
    const result = await geminiService.extractSkills(testResume);

    console.log('\n📊 EXTRACTION RESULTS:');
    console.log(`   Provider: ${result.provider}`);
    console.log(`   Skills found: ${result.skills.length}`);
    console.log(`   Overall confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   Processing time: ${result.processingTime}ms`);
    console.log(`   Text length: ${result.metadata.textLength} characters`);
    console.log(`   Model used: ${result.metadata.modelUsed}`);

    // Test 3: Display extracted skills by category
    console.log('\n🏷️ SKILLS BY CATEGORY:');
    const skillsByCategory = result.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof result.skills>);

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      console.log(`\n   ${category.toUpperCase()}:`);
      skills.forEach(skill => {
        const confidencePercent = (skill.confidence * 100).toFixed(1);
        console.log(`     • ${skill.name} (${confidencePercent}%)`);
        if (skill.proficiencyIndicators.length > 0) {
          console.log(`       Proficiency: ${skill.proficiencyIndicators.join(', ')}`);
        }
      });
    });

    // Test 4: Validate against expected skills
    console.log('\n🎯 ACCURACY VALIDATION:');
    const expectedSkills = [
      'React', 'Node.js', 'PostgreSQL', 'TypeScript', 'JavaScript',
      'Angular', 'Vue.js', 'Python', 'Django', 'MongoDB', 'AWS',
      'Docker', 'Kubernetes', 'Jest', 'Git', 'Figma', 'Leadership'
    ];

    const foundSkills = result.skills.map(skill => skill.standardizedName.toLowerCase());
    const expectedFound = expectedSkills.filter(expected =>
      foundSkills.some(found => found.includes(expected.toLowerCase()))
    );

    const accuracy = (expectedFound.length / expectedSkills.length) * 100;
    console.log(`   Expected skills: ${expectedSkills.length}`);
    console.log(`   Found: ${expectedFound.length}`);
    console.log(`   Accuracy: ${accuracy.toFixed(1)}%`);

    if (accuracy >= 80) {
      console.log('   ✅ Great accuracy!');
    } else if (accuracy >= 60) {
      console.log('   ⚠️ Good accuracy, but could be improved');
    } else {
      console.log('   ❌ Low accuracy, needs improvement');
    }

    // Test 5: Performance benchmark
    console.log('\n⚡ PERFORMANCE BENCHMARK:');
    if (result.processingTime < 1000) {
      console.log('   ✅ Excellent performance (< 1s)');
    } else if (result.processingTime < 3000) {
      console.log('   ⚠️ Good performance (< 3s)');
    } else {
      console.log('   ❌ Slow performance (> 3s)');
    }

    console.log('\n✅ Gemini AI Service test completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testGeminiAIService().catch(console.error);
