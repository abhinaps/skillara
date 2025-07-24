import { AIServiceAdapterFactory, getAIServiceFactory, AdapterRegistry } from '../infrastructure/ai/AIServiceAdapterFactory';
import { AIProviderConfig } from '../domain/services/ai/interfaces';

/**
 * Comprehensive test for AI Service Adapter System (AI-004 to AI-006)
 * Tests the complete adapter pattern implementation
 */

// Sample test data
const sampleText = `
John Smith is a senior software engineer with 8 years of experience in full-stack development.
He specializes in React.js for frontend development and Node.js for backend services.
John has extensive experience with TypeScript, implementing type-safe applications across various projects.
He's proficient in database management using PostgreSQL and MongoDB for data persistence.
His DevOps skills include Docker containerization and CI/CD pipeline automation using GitHub Actions.
John has worked with cloud platforms like AWS, implementing serverless architectures with Lambda functions.
He's experienced in agile methodologies and has led cross-functional teams in developing scalable web applications.
`;

// Test configurations
const testConfigs: Record<string, AIProviderConfig> = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || 'test-key',
    model: 'gemini-1.5-flash',
    temperature: 0.3,
    maxTokens: 1000
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || 'test-key',
    model: 'microsoft/DialoGPT-medium',
    temperature: 0.3,
    maxTokens: 1000
  }
};

async function testAdapterFactory() {
  console.log('🧪 Testing AI Service Adapter Factory System...\n');

  try {
    // Test 1: Factory Singleton Pattern
    console.log('1️⃣ Testing Factory Singleton Pattern');
    const factory1 = getAIServiceFactory();
    const factory2 = AIServiceAdapterFactory.getInstance();

    if (factory1 === factory2) {
      console.log('✅ Singleton pattern working correctly');
    } else {
      console.log('❌ Singleton pattern failed');
    }

    // Test 2: Adapter Registration
    console.log('\n2️⃣ Testing Adapter Registration');
    const registeredAdapters = factory1.getRegisteredAdapters();
    console.log(`📋 Registered adapters: ${registeredAdapters.join(', ')}`);

    const expectedAdapters = ['gemini', 'huggingface', 'multi-provider'];
    const allRegistered = expectedAdapters.every(adapter =>
      factory1.isAdapterRegistered(adapter)
    );

    if (allRegistered) {
      console.log('✅ All expected adapters are registered');
    } else {
      console.log('❌ Some adapters are missing');
    }

    // Test 3: Individual Adapter Creation
    console.log('\n3️⃣ Testing Individual Adapter Creation');

    try {
      const geminiAdapter = factory1.createAdapter('gemini', testConfigs.gemini);
      console.log(`✅ Gemini adapter created: ${geminiAdapter.getProviderName()}`);

      const hfAdapter = factory1.createAdapter('huggingface', testConfigs.huggingface);
      console.log(`✅ Hugging Face adapter created: ${hfAdapter.getProviderName()}`);
    } catch (error) {
      console.log(`❌ Adapter creation failed: ${error instanceof Error ? error.message : error}`);
    }

    // Test 4: Multi-Provider Adapter
    console.log('\n4️⃣ Testing Multi-Provider Adapter');

    try {
      const multiAdapter = factory1.createMultiProviderAdapter(testConfigs);
      console.log(`✅ Multi-provider adapter created: ${multiAdapter.getProviderName()}`);

      const capabilities = multiAdapter.getCapabilities();
      console.log(`📊 Multi-provider capabilities:`);
      console.log(`   - Supports failover: ${capabilities.supportsFailover}`);
      console.log(`   - Max input length: ${capabilities.maxInputLength}`);
      console.log(`   - Reliability: ${capabilities.reliability}`);
    } catch (error) {
      console.log(`❌ Multi-provider creation failed: ${error instanceof Error ? error.message : error}`);
    }

    // Test 5: Default Adapter Selection
    console.log('\n5️⃣ Testing Default Adapter Selection');

    try {
      const defaultAdapter = factory1.getDefaultAdapter(testConfigs);
      console.log(`✅ Default adapter selected: ${defaultAdapter.getProviderName()}`);
    } catch (error) {
      console.log(`❌ Default adapter selection failed: ${error instanceof Error ? error.message : error}`);
    }

    // Test 6: Health Status Checking
    console.log('\n6️⃣ Testing Health Status Checking');

    try {
      const geminiHealth = await factory1.getAdapterHealthStatus('gemini', testConfigs.gemini);
      console.log(`🏥 Gemini health: ${geminiHealth.healthy ? '✅ Healthy' : '❌ Unhealthy'}`);
      if (geminiHealth.error) {
        console.log(`   Error: ${geminiHealth.error}`);
      }

      const hfHealth = await factory1.getAdapterHealthStatus('huggingface', testConfigs.huggingface);
      console.log(`🏥 Hugging Face health: ${hfHealth.healthy ? '✅ Healthy' : '❌ Unhealthy'}`);
      if (hfHealth.error) {
        console.log(`   Error: ${hfHealth.error}`);
      }
    } catch (error) {
      console.log(`❌ Health check failed: ${error instanceof Error ? error.message : error}`);
    }

    // Test 7: Comprehensive Health Report
    console.log('\n7️⃣ Testing Comprehensive Health Report');

    try {
      const healthReport = await factory1.getComprehensiveHealthReport(testConfigs);
      console.log(`🏥 Overall system health: ${healthReport.overall.toUpperCase()}`);
      console.log(`📊 Provider status:`);

      healthReport.providers.forEach(provider => {
        console.log(`   - ${provider.provider}: ${provider.healthy ? '✅' : '❌'}`);
        if (provider.error) {
          console.log(`     Error: ${provider.error}`);
        }
      });

      if (healthReport.recommendations.length > 0) {
        console.log(`💡 Recommendations:`);
        healthReport.recommendations.forEach(rec => {
          console.log(`   - ${rec}`);
        });
      }
    } catch (error) {
      console.log(`❌ Health report failed: ${error instanceof Error ? error.message : error}`);
    }

    // Test 8: Skill Extraction with Adapters
    console.log('\n8️⃣ Testing Skill Extraction with Adapters');

    try {
      const adapter = factory1.getDefaultAdapter(testConfigs);
      console.log(`🔍 Testing skill extraction with: ${adapter.getProviderName()}`);

      const startTime = Date.now();
      const result = await adapter.extractSkills(sampleText);
      const processingTime = Date.now() - startTime;

      console.log(`✅ Extraction completed in ${processingTime}ms`);
      console.log(`📋 Found ${result.skills.length} skills with ${(result.confidence * 100).toFixed(1)}% confidence`);
      console.log(`🔧 Provider: ${result.provider}`);
      console.log(`📊 Metadata:`);
      console.log(`   - Text length: ${result.metadata.textLength} chars`);
      console.log(`   - Model used: ${result.metadata.modelUsed}`);
      console.log(`   - Multi-provider: ${result.metadata.multiProviderUsed ? 'Yes' : 'No'}`);
      if (result.metadata.costEstimate) {
        console.log(`   - Cost estimate: $${result.metadata.costEstimate.toFixed(4)}`);
      }

      console.log(`🎯 Top skills extracted:`);
      result.skills.slice(0, 5).forEach((skill, index) => {
        console.log(`   ${index + 1}. ${skill.name} (${(skill.confidence * 100).toFixed(1)}%)`);
      });

    } catch (error) {
      console.log(`❌ Skill extraction failed: ${error instanceof Error ? error.message : error}`);
    }

    // Test 9: AdapterRegistry Helper
    console.log('\n9️⃣ Testing AdapterRegistry Helper');

    try {
      const registryAdapter = AdapterRegistry.getDefaultAdapter(testConfigs);
      console.log(`✅ Registry helper working: ${registryAdapter.getProviderName()}`);
    } catch (error) {
      console.log(`❌ Registry helper failed: ${error instanceof Error ? error.message : error}`);
    }

    // Test 10: Cache Management
    console.log('\n🔟 Testing Cache Management');

    try {
      // Create same adapter twice to test caching
      const adapter1 = factory1.createAdapter('gemini', testConfigs.gemini);
      const adapter2 = factory1.createAdapter('gemini', testConfigs.gemini);

      if (adapter1 === adapter2) {
        console.log('✅ Adapter caching working correctly');
      } else {
        console.log('⚠️ New adapter instances created (caching may not be working)');
      }

      // Test cache clearing
      factory1.clearCache();
      const adapter3 = factory1.createAdapter('gemini', testConfigs.gemini);

      if (adapter1 !== adapter3) {
        console.log('✅ Cache clearing working correctly');
      } else {
        console.log('❌ Cache clearing failed');
      }

    } catch (error) {
      console.log(`❌ Cache management test failed: ${error instanceof Error ? error.message : error}`);
    }

    console.log('\n🎉 AI Service Adapter Factory testing completed!');

  } catch (error) {
    console.error('💥 Fatal error during testing:', error);
  }
}

// Performance benchmarking
async function benchmarkAdapters() {
  console.log('\n⚡ Performance Benchmarking...\n');

  const factory = getAIServiceFactory();
  const iterations = 3;

  try {
    // Benchmark individual adapters
    for (const [providerName, config] of Object.entries(testConfigs)) {
      console.log(`🏃‍♂️ Benchmarking ${providerName} adapter:`);

      const adapter = factory.createAdapter(providerName, config);
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        try {
          const startTime = Date.now();
          const result = await adapter.extractSkills(sampleText);
          const endTime = Date.now();

          times.push(endTime - startTime);
          console.log(`   Run ${i + 1}: ${endTime - startTime}ms (${result.skills.length} skills, ${(result.confidence * 100).toFixed(1)}% confidence)`);
        } catch (error) {
          console.log(`   Run ${i + 1}: Failed - ${error instanceof Error ? error.message : error}`);
        }
      }

      if (times.length > 0) {
        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        console.log(`   📊 Average: ${avgTime.toFixed(1)}ms | Min: ${minTime}ms | Max: ${maxTime}ms\n`);
      }
    }

    // Benchmark multi-provider
    console.log(`🏃‍♂️ Benchmarking multi-provider adapter:`);
    const multiAdapter = factory.createMultiProviderAdapter(testConfigs);
    const multiTimes: number[] = [];

    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = Date.now();
        const result = await multiAdapter.extractSkills(sampleText);
        const endTime = Date.now();

        multiTimes.push(endTime - startTime);
        console.log(`   Run ${i + 1}: ${endTime - startTime}ms (${result.skills.length} skills, ${(result.confidence * 100).toFixed(1)}% confidence)`);
      } catch (error) {
        console.log(`   Run ${i + 1}: Failed - ${error instanceof Error ? error.message : error}`);
      }
    }

    if (multiTimes.length > 0) {
      const avgTime = multiTimes.reduce((sum, time) => sum + time, 0) / multiTimes.length;
      const minTime = Math.min(...multiTimes);
      const maxTime = Math.max(...multiTimes);

      console.log(`   📊 Average: ${avgTime.toFixed(1)}ms | Min: ${minTime}ms | Max: ${maxTime}ms\n`);
    }

  } catch (error) {
    console.error('💥 Benchmarking error:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting AI Service Adapter System Tests\n');
  console.log('=' .repeat(80));

  await testAdapterFactory();
  await benchmarkAdapters();

  console.log('=' .repeat(80));
  console.log('✅ All tests completed!\n');
}

export { runAllTests, testAdapterFactory, benchmarkAdapters };

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
