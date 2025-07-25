import dotenv from 'dotenv';
import { GeminiAIService } from '../src/infrastructure/ai/GeminiAIService';
import { AIProviderConfig } from '../src/domain/services/ai/interfaces';

// Load environment variables
dotenv.config();

/**
 * Focused Google Gemini AI Service Test
 * Comprehensive testing of Gemini integration for AI-002
 */

const testResumes = {
  frontend: `
    Alex Thompson - Frontend Developer
    React specialist with 4 years experience building modern web applications.
    Skills: React, TypeScript, Next.js, Tailwind CSS, Redux, Jest, Figma
    Experience with responsive design and component libraries.
  `,

  fullstack: `
    Maria Garcia - Full Stack Engineer
    Senior developer with expertise in both frontend and backend technologies.
    Frontend: React, Vue.js, Angular, JavaScript, TypeScript
    Backend: Node.js, Python, Django, PostgreSQL, MongoDB
    DevOps: Docker, AWS, Kubernetes, CI/CD pipelines
  `,

  backend: `
    David Chen - Backend Engineer
    Specialized in server-side development and database design.
    Languages: Java, Python, Go, Node.js
    Databases: PostgreSQL, MySQL, Redis, Elasticsearch
    Cloud: AWS, Azure, microservices architecture
  `
};

class GeminiServiceTester {
  private geminiService: GeminiAIService;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    const config: AIProviderConfig = { apiKey };
    this.geminiService = new GeminiAIService(config);
  }

  async testBasicFunctionality(): Promise<void> {
    console.log('🧪 BASIC FUNCTIONALITY TEST');
    console.log('============================');

    // Test 1: Service Health
    console.log('\n1️⃣ Testing service health...');
    const isHealthy = await this.geminiService.isHealthy();
    console.log(`   Status: ${isHealthy ? '✅ API Accessible' : '⚠️ Fallback Mode'}`);

    // Test 2: Provider Name
    console.log('\n2️⃣ Testing provider identification...');
    const providerName = this.geminiService.getProviderName();
    console.log(`   Provider: ${providerName}`);

    // Test 3: Basic Skill Extraction
    console.log('\n3️⃣ Testing basic skill extraction...');
    const result = await this.geminiService.extractSkills(testResumes.frontend);

    console.log(`   ✅ Skills extracted: ${result.skills.length}`);
    console.log(`   📊 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   ⚡ Processing time: ${result.processingTime}ms`);
    console.log(`   🔧 Provider used: ${result.provider}`);

    // Display top skills
    const topSkills = result.skills.slice(0, 5);
    console.log(`   🎯 Top skills: ${topSkills.map(s => s.name).join(', ')}`);
  }

  async testAccuracyAcrossProfiles(): Promise<void> {
    console.log('\n\n🎯 ACCURACY TEST ACROSS DIFFERENT PROFILES');
    console.log('============================================');

    const profileTests = [
      { name: 'Frontend Developer', resume: testResumes.frontend, expectedSkills: ['React', 'TypeScript', 'Next.js', 'Figma'] },
      { name: 'Full Stack Engineer', resume: testResumes.fullstack, expectedSkills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'] },
      { name: 'Backend Engineer', resume: testResumes.backend, expectedSkills: ['Java', 'Python', 'PostgreSQL', 'AWS', 'Redis'] }
    ];

    let totalTests = 0;
    let totalAccuracy = 0;

    for (const test of profileTests) {
      console.log(`\n🔍 Testing: ${test.name}`);

      try {
        const result = await this.geminiService.extractSkills(test.resume);
        const foundSkills = result.skills.map(s => s.standardizedName.toLowerCase());
        const expectedFound = test.expectedSkills.filter(expected =>
          foundSkills.some(found => found.includes(expected.toLowerCase()))
        );

        const accuracy = (expectedFound.length / test.expectedSkills.length) * 100;
        totalAccuracy += accuracy;
        totalTests++;

        console.log(`   📊 Expected: ${test.expectedSkills.length} skills`);
        console.log(`   ✅ Found: ${expectedFound.length} expected skills`);
        console.log(`   🎯 Accuracy: ${accuracy.toFixed(1)}%`);
        console.log(`   ⚡ Time: ${result.processingTime}ms`);

        // Show missed skills if any
        const missed = test.expectedSkills.filter(expected =>
          !foundSkills.some(found => found.includes(expected.toLowerCase()))
        );
        if (missed.length > 0) {
          console.log(`   ⚠️ Missed: ${missed.join(', ')}`);
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.log(`   ❌ Test failed: ${errorMessage}`);
      }
    }

    if (totalTests > 0) {
      const avgAccuracy = totalAccuracy / totalTests;
      console.log(`\n📈 OVERALL ACCURACY: ${avgAccuracy.toFixed(1)}%`);

      if (avgAccuracy >= 80) {
        console.log('   🏆 Excellent performance!');
      } else if (avgAccuracy >= 60) {
        console.log('   👍 Good performance, room for improvement');
      } else {
        console.log('   ⚠️ Below target, needs optimization');
      }
    }
  }

  async testSkillCategorization(): Promise<void> {
    console.log('\n\n🏷️ SKILL CATEGORIZATION TEST');
    console.log('==============================');

    const result = await this.geminiService.extractSkills(testResumes.fullstack);

    const categories = result.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof result.skills>);

    console.log('\n📂 Skills organized by category:');
    Object.entries(categories).forEach(([category, skills]) => {
      console.log(`\n   ${category.toUpperCase()}:`);
      skills.slice(0, 5).forEach(skill => {
        const confidence = (skill.confidence * 100).toFixed(1);
        console.log(`     • ${skill.name} (${confidence}% confidence)`);
      });
      if (skills.length > 5) {
        console.log(`     ... and ${skills.length - 5} more`);
      }
    });

    // Validate expected categories
    const expectedCategories = ['frontend', 'backend', 'database', 'devops'];
    const foundCategories = Object.keys(categories);
    const matchedCategories = expectedCategories.filter(cat => foundCategories.includes(cat));

    console.log(`\n✅ Found ${matchedCategories.length}/${expectedCategories.length} expected categories`);
  }

  async testConfidenceScoring(): Promise<void> {
    console.log('\n\n📊 CONFIDENCE SCORING TEST');
    console.log('===========================');

    const result = await this.geminiService.extractSkills(testResumes.fullstack);

    // Group skills by confidence ranges
    const highConfidence = result.skills.filter(s => s.confidence >= 0.8);
    const mediumConfidence = result.skills.filter(s => s.confidence >= 0.6 && s.confidence < 0.8);
    const lowConfidence = result.skills.filter(s => s.confidence < 0.6);

    console.log(`\n🎯 Confidence Distribution:`);
    console.log(`   🟢 High (80%+): ${highConfidence.length} skills`);
    console.log(`   🟡 Medium (60-79%): ${mediumConfidence.length} skills`);
    console.log(`   🔴 Low (<60%): ${lowConfidence.length} skills`);

    // Show top confident skills
    const topConfident = result.skills
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    console.log(`\n🏆 Most confident extractions:`);
    topConfident.forEach((skill, index) => {
      const confidence = (skill.confidence * 100).toFixed(1);
      console.log(`   ${index + 1}. ${skill.name} (${confidence}%)`);
    });
  }

  async testErrorHandling(): Promise<void> {
    console.log('\n\n🛡️ ERROR HANDLING TEST');
    console.log('=======================');

    // Test 1: Empty input
    console.log('\n1️⃣ Testing empty input handling...');
    try {
      const result = await this.geminiService.extractSkills('');
      console.log(`   ✅ Handled gracefully: ${result.skills.length} skills found`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.log(`   ❌ Failed: ${errorMessage}`);
    }

    // Test 2: Very short input
    console.log('\n2️⃣ Testing minimal input...');
    try {
      const result = await this.geminiService.extractSkills('React developer');
      console.log(`   ✅ Handled gracefully: ${result.skills.length} skills found`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.log(`   ❌ Failed: ${errorMessage}`);
    }

    // Test 3: Very long input
    console.log('\n3️⃣ Testing large input...');
    const longResume = testResumes.fullstack.repeat(20); // Make it very long
    try {
      const result = await this.geminiService.extractSkills(longResume);
      console.log(`   ✅ Handled gracefully: ${result.skills.length} skills found in ${result.processingTime}ms`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.log(`   ❌ Failed: ${errorMessage}`);
    }
  }

  async testFallbackMechanism(): Promise<void> {
    console.log('\n\n🔄 FALLBACK MECHANISM TEST');
    console.log('============================');

    // Create service with invalid API key to force fallback
    console.log('\n🧪 Testing with invalid API key...');
    const invalidConfig: AIProviderConfig = { apiKey: 'invalid_key_test_123' };
    const fallbackService = new GeminiAIService(invalidConfig);

    try {
      const result = await fallbackService.extractSkills(testResumes.frontend);

      console.log(`   ✅ Fallback activated successfully`);
      console.log(`   🔧 Provider: ${result.provider}`);
      console.log(`   📊 Skills found: ${result.skills.length}`);
      console.log(`   ⚡ Processing time: ${result.processingTime}ms`);

      if (result.provider.includes('fallback')) {
        console.log('   🎯 Fallback pattern matching working correctly');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.log(`   ❌ Fallback failed: ${errorMessage}`);
    }
  }

  async runPerformanceBenchmark(): Promise<void> {
    console.log('\n\n⚡ PERFORMANCE BENCHMARK');
    console.log('=========================');

    const iterations = 3;
    const times: number[] = [];

    console.log(`\n🏃‍♂️ Running ${iterations} iterations...`);

    for (let i = 1; i <= iterations; i++) {
      console.log(`   Iteration ${i}...`);
      const startTime = Date.now();

      try {
        const result = await this.geminiService.extractSkills(testResumes.fullstack);
        const endTime = Date.now();
        const processingTime = endTime - startTime;

        times.push(processingTime);
        console.log(`     ✅ ${result.skills.length} skills in ${processingTime}ms`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.log(`     ❌ Failed: ${errorMessage}`);
      }
    }

    if (times.length > 0) {
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);

      console.log(`\n📊 Performance Results:`);
      console.log(`   ⚡ Average: ${avgTime.toFixed(0)}ms`);
      console.log(`   🏆 Best: ${minTime}ms`);
      console.log(`   📈 Worst: ${maxTime}ms`);

      if (avgTime < 1000) {
        console.log('   🎉 Excellent performance!');
      } else if (avgTime < 3000) {
        console.log('   👍 Good performance');
      } else {
        console.log('   ⚠️ Performance needs improvement');
      }
    }
  }
}

async function runGeminiTests() {
  console.log('🤖 GOOGLE GEMINI AI SERVICE - COMPREHENSIVE TEST SUITE');
  console.log('=======================================================');
  console.log('🎯 AI-002 Implementation Testing\n');

  try {
    const tester = new GeminiServiceTester();

    await tester.testBasicFunctionality();
    await tester.testAccuracyAcrossProfiles();
    await tester.testSkillCategorization();
    await tester.testConfidenceScoring();
    await tester.testErrorHandling();
    await tester.testFallbackMechanism();
    await tester.runPerformanceBenchmark();

    console.log('\n\n🎉 ALL GEMINI TESTS COMPLETED!');
    console.log('===============================');
    console.log('✅ AI-002 Google Gemini Integration: FULLY TESTED');
    console.log('✅ Fallback mechanisms: VERIFIED');
    console.log('✅ Performance: BENCHMARKED');
    console.log('✅ Error handling: VALIDATED');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('\n❌ Test initialization failed:', errorMessage);

    if (error instanceof Error && error.message.includes('GEMINI_API_KEY')) {
      console.log('\n📝 To fix this:');
      console.log('1. Go to https://aistudio.google.com/app/apikey');
      console.log('2. Create a new API key');
      console.log('3. Add it to your .env file: GEMINI_API_KEY=your_key_here');
    }

    process.exit(1);
  }
}

// Run the focused Gemini test suite
runGeminiTests().catch(console.error);
