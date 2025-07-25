#!/usr/bin/env ts-node

/**
 * Hugging Face AI Service Integration Test Suite
 * Tests the direct integration with Hugging Face's API for skill extraction
 */

import * as dotenv from 'dotenv';
import { HuggingFaceAIService } from '../src/infrastructure/ai/HuggingFaceAIService';

// Load environment variables
dotenv.config();

const sampleResume = `
John Doe
Senior Full Stack Developer

EXPERIENCE:
Software Engineer at Tech Corp (2020-2024)
- Developed web applications using React, TypeScript, and Node.js
- Built REST APIs with Express.js and PostgreSQL database
- Implemented Docker containerization and deployed to AWS
- Led team of 5 developers using Agile methodology
- 4 years experience with JavaScript and 3 years with Python

SKILLS:
Frontend: React, Angular, Vue.js, HTML5, CSS3, Sass, Figma
Backend: Node.js, Express, Python, Django, Java, Spring Boot
Database: PostgreSQL, MongoDB, Redis, MySQL
DevOps: Docker, Kubernetes, Jenkins, AWS, Terraform, Linux
Other: Git, Jira, Scrum, Project Management, Leadership

EDUCATION:
BS Computer Science, University of Technology (2016-2020)
`;

async function testHuggingFaceIntegration() {
  console.log('🤖 HUGGING FACE AI SERVICE TEST SUITE');
  console.log('===================================\n');

  const apiKey = process.env.HUGGINGFACE_API_KEY;

  // Detailed API key validation
  if (!apiKey) {
    console.error('\n❌ ERROR: HUGGINGFACE_API_KEY not found in .env file');
    console.log('\n📝 How to get your Hugging Face API key:');
    console.log('1. Create an account at https://huggingface.co/join');
    console.log('2. Go to https://huggingface.co/settings/tokens');
    console.log('3. Click "New token" and give it a name (e.g., "Skillara API")');
    console.log('4. Select "read" access level');
    console.log('5. Copy the generated token');
    console.log('\n📦 Then set up your environment:');
    console.log('1. Create or edit .env file in the project root');
    console.log('2. Add: HUGGINGFACE_API_KEY=your_token_here');
    console.log('\n💡 Need more help?');
    console.log('- Full API docs: https://huggingface.co/docs/api-inference/index');
    console.log('- Troubleshooting: https://huggingface.co/docs/api-inference/quicktour#troubleshooting');
    process.exit(1);
  }

  if (apiKey === 'your-huggingface-key-here' || apiKey.length < 30) {
    console.error('\n❌ ERROR: Invalid HUGGINGFACE_API_KEY format');
    console.log('- API keys are typically 40+ characters long');
    console.log('- Make sure you copied the entire key');
    console.log('- Check for any whitespace or extra characters');
    process.exit(1);
  }

  try {
    console.log('\n🤖 HUGGING FACE API TEST');
    console.log('=====================');
    
    // Initialize service with debug info
    console.log('\n⚙️ API Configuration:');
    console.log('- API Endpoint: api-inference.huggingface.co');
    console.log('- Model: shashu2325/resume-job-matcher-lora');
    console.log('- Model Type: LoRA fine-tuned LLM');
    console.log('- Task: Resume Job Matching');
    console.log('- Authentication: Bearer token');
    console.log('- Token Length:', apiKey.length, 'characters');
    console.log('- Request Timeout:', '30 seconds');
    console.log('- Max Retries:', 3);
    
    const aiService = new HuggingFaceAIService({
      apiKey,
      timeout: 30000,
      retryAttempts: 3,
      model: 'shashu2325/resume-job-matcher-lora' // Use the resume-job-matcher model
    });

    // Test health check
    console.log('🏥 Testing Hugging Face API connection...');
    const isHealthy = await aiService.isHealthy();

    if (!isHealthy) {
      throw new Error('Hugging Face API is not accessible. Please check your connection and API key.');
    }

    console.log('\n✅ HUGGING FACE API STATUS:');
    console.log('- API Endpoint: api-inference.huggingface.co');
    console.log('- Authentication: Valid');
    console.log('- Model Status: Available');
    console.log('- Connection: Verified\n');

    // Test skill extraction
    console.log('🧠 Testing skill extraction...');
    console.log('📄 Sample resume text length:', sampleResume.length, 'characters\n');

    const startTime = Date.now();
    const result = await aiService.extractSkills(sampleResume);
    const totalTime = Date.now() - startTime;

    // Display results
    console.log('📊 HUGGING FACE MODEL RESULTS:');
    console.log('============================');
    console.log(`Model: ${result.metadata.modelUsed}`);
    console.log(`Model Provider: Hugging Face`);
    console.log(`Inference Time: ${result.processingTime}ms`);
    console.log(`Total Time: ${totalTime}ms`);
    console.log(`Skills Identified: ${result.skills.length}`);
    console.log(`Model Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Input Length: ${result.metadata.textLength} characters`);
    console.log(`Response Format: JSON\n`);

    // Display extracted skills
    console.log('🎯 EXTRACTED SKILLS:');
    console.log('================================');

    // Group skills by category
    const skillsByCategory: Record<string, typeof result.skills> = {};
    result.skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    // Display each category
    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      console.log(`\n📂 ${category.toUpperCase()}:`);
      skills.forEach(skill => {
        const confidenceBar = '█'.repeat(Math.round(skill.confidence * 10));
        console.log(`   ${skill.standardizedName} (${(skill.confidence * 100).toFixed(1)}%) ${confidenceBar}`);

        if (skill.proficiencyIndicators.length > 0) {
          console.log(`      Proficiency: ${skill.proficiencyIndicators.join(', ')}`);
        }

        if (skill.context.length > 0) {
          console.log(`      Context: "${skill.context[0].slice(0, 80)}..."`);
        }
      });
    });

    // Test accuracy assessment
    console.log('\n📈 ACCURACY ASSESSMENT:');
    console.log('================================');

    const expectedSkills = [
      'React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL',
      'Docker', 'AWS', 'Python', 'JavaScript', 'HTML', 'CSS'
    ];

    const foundSkillNames = result.skills.map(s => s.standardizedName.toLowerCase());
    const correctlyFound = expectedSkills.filter(expected =>
      foundSkillNames.some(found => found.includes(expected.toLowerCase()))
    );

    const accuracy = (correctlyFound.length / expectedSkills.length) * 100;

    console.log(`Expected Skills: ${expectedSkills.length}`);
    console.log(`Correctly Found: ${correctlyFound.length}`);
    console.log(`Accuracy: ${accuracy.toFixed(1)}%`);
    console.log(`Missing: ${expectedSkills.filter(s => !correctlyFound.includes(s)).join(', ')}`);

    // Acceptance criteria check
    console.log('\n✅ ACCEPTANCE CRITERIA CHECK:');
    console.log('================================');
    console.log(`✅ API Connection: ${isHealthy ? 'Success ✓' : 'Failed ✗'}`);
    console.log(`✅ Model Response: ${result.metadata.modelUsed ? 'Success ✓' : 'Failed ✗'}`);
    console.log(`✅ Skills extracted: ${result.skills.length > 0 ? 'Success ✓' : 'Failed ✗'} (${result.skills.length} skills)`);
    console.log(`✅ Accuracy > 70%: ${accuracy >= 70 ? 'Success ✓' : 'Failed ✗'} (${accuracy.toFixed(1)}%)`);
    console.log(`✅ Processing time < 30s: ${result.processingTime < 30000 ? 'Success ✓' : 'Failed ✗'} (${result.processingTime}ms)`);

    if (accuracy >= 70 && result.skills.length > 0) {
      console.log('\n🎉 RESUME-JOB-MATCHER TEST SUCCESSFUL!');
      console.log('✅ Model: shashu2325/resume-job-matcher-lora');
      console.log('✅ Skill extraction accuracy: High');
      console.log('✅ Response quality: Good');
      console.log('✅ Performance: Within limits');
    } else {
      console.log('\n⚠️ MODEL PERFORMANCE NEEDS IMPROVEMENT');
      console.log('Consider:');
      console.log('1. Verifying input format matches model expectations');
      console.log('2. Checking if skills are in the model\'s training domain');
      console.log('3. Adjusting skill extraction confidence thresholds');
      console.log('4. Using longer context if resume is truncated');
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.log('\n🔍 DIAGNOSTIC INFORMATION:');
    console.log('========================');

    if (error instanceof Error) {
      console.log('Error Type:', error.constructor.name);
      console.log('Message:', error.message);
      
      // API Authentication Issues
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        console.log('\n🔑 API KEY VALIDATION FAILED:');
        console.log('1. Verify your API key at: https://huggingface.co/settings/tokens');
        console.log('2. Check if token has expired');
        console.log('3. Ensure "read" permission is enabled');
        console.log('\n💡 Quick Fix:');
        console.log('1. Go to https://huggingface.co/settings/tokens');
        console.log('2. Delete your existing token');
        console.log('3. Create a new token with "read" access');
        console.log('4. Update your .env file with the new token');
      } 
      // Rate Limiting
      else if (error.message.includes('rate limit') || error.message.includes('429')) {
        console.log('\n⏰ RATE LIMIT EXCEEDED:');
        console.log('Current Limits:');
        console.log('- Free Tier: 30,000 requests per month');
        console.log('- Max 300 requests per minute');
        console.log('\n💡 Solutions:');
        console.log('1. Wait 60 seconds and try again');
        console.log('2. Upgrade to Pro: https://huggingface.co/pricing');
        console.log('3. Implement request throttling in your code');
      }
      // Network Issues
      else if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
        console.log('\n🌐 NETWORK CONNECTIVITY ISSUE:');
        console.log('1. Check your internet connection');
        console.log('2. Verify proxy settings if using corporate network');
        console.log('3. Try accessing https://huggingface.co in browser');
        console.log('\n📡 Network Diagnosis:');
        console.log('- Run: ping api-inference.huggingface.co');
        console.log('- Check corporate firewall settings');
      }
      // Model Issues
      else if (error.message.includes('model') || error.message.includes('pipeline')) {
        console.log('\n🤖 MODEL ACCESS ISSUE:');
        console.log('1. Verify model availability: https://huggingface.co/models');
        console.log('2. Check if model requires special access');
        console.log('3. Try alternative model from the same category');
      }
      // General Error
      else {
        console.log('\n🔧 GENERAL TROUBLESHOOTING:');
        console.log('1. Check Hugging Face status: https://status.huggingface.co');
        console.log('2. Review API docs: https://huggingface.co/docs/api-inference/index');
        console.log('3. Search issues: https://github.com/huggingface/huggingface.js/issues');
        console.log('\n📧 Need Support?');
        console.log('- Community Forums: https://discuss.huggingface.co');
        console.log('- Discord: https://huggingface.co/discord');
      }
    }

    process.exit(1);
  }
}

// Run the test
testHuggingFaceIntegration();
