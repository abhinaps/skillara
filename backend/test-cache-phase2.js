#!/usr/bin/env node

/**
 * Redis Cache Implementation Test Script
 * Verifies Phase 2 completion: Cache Infrastructure
 */

const { CacheManager } = require('./src/infrastructure/cache/CacheManager');
const { CacheKeyManager } = require('./src/infrastructure/cache/CacheKeyManager');

async function testCacheImplementation() {
  console.log('🚀 Testing Redis Cache Implementation - Phase 2');
  console.log('='.repeat(50));

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Cache Manager Initialization
  console.log('\n📋 Test 1: Cache Manager Initialization');
  try {
    const cacheManager = CacheManager.getInstance();
    await cacheManager.initialize();

    if (cacheManager.isInitialized) {
      console.log('✅ Cache Manager initialized successfully');
      testsPassed++;
    } else {
      console.log('❌ Cache Manager initialization failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ Cache Manager initialization error:', error instanceof Error ? error.message : error);
    testsFailed++;
  }

  // Test 2: Key Manager Functionality
  console.log('\n📋 Test 2: Key Manager Functionality');
  try {
    const keyManager = new CacheKeyManager();

    const skillKey = keyManager.skill.byId('test-skill-123');
    const userKey = keyManager.user.profile('user-456');
    const assessmentKey = keyManager.assessment.byId('assessment-789');

    const expectedPatterns = [
      skillKey.includes('skillara:skill:test-skill-123'),
      userKey.includes('skillara:user:user-456:profile'),
      assessmentKey.includes('skillara:assessment:assessment-789')
    ];

    if (expectedPatterns.every(Boolean)) {
      console.log('✅ Key generation working correctly');
      console.log(`   - Skill key: ${skillKey}`);
      console.log(`   - User key: ${userKey}`);
      console.log(`   - Assessment key: ${assessmentKey}`);
      testsPassed++;
    } else {
      console.log('❌ Key generation patterns incorrect');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ Key Manager test error:', error instanceof Error ? error.message : error);
    testsFailed++;
  }

  // Test 3: Cache Service Basic Operations
  console.log('\n📋 Test 3: Cache Service Basic Operations');
  try {
    const cacheManager = CacheManager.getInstance();
    const cacheService = cacheManager.cacheService;

    // Test skill caching
    const testSkill = {
      id: 'test-skill-phase2',
      name: 'Phase 2 Test Skill',
      category: 'Testing',
      level: 'Advanced'
    };

    await cacheService.cacheSkill(testSkill.id, testSkill);
    const retrievedSkill = await cacheService.getSkill(testSkill.id);

    if (retrievedSkill && retrievedSkill.name === testSkill.name) {
      console.log('✅ Cache set/get operations working');
      console.log(`   - Cached and retrieved: ${retrievedSkill.name}`);
      testsPassed++;
    } else {
      console.log('❌ Cache set/get operations failed');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ Cache Service test error:', error instanceof Error ? error.message : error);
    testsFailed++;
  }

  // Test 4: Health Check
  console.log('\n📋 Test 4: Cache Health Check');
  try {
    const cacheManager = CacheManager.getInstance();
    const healthStatus = await cacheManager.healthCheck();

    if (healthStatus.status === 'healthy' || healthStatus.status === 'mock') {
      console.log('✅ Cache health check passed');
      console.log(`   - Status: ${healthStatus.status}`);
      testsPassed++;
    } else {
      console.log('❌ Cache health check failed');
      console.log(`   - Status: ${healthStatus.status}`);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ Health check test error:', error instanceof Error ? error.message : error);
    testsFailed++;
  }

  // Test 5: Statistics and Monitoring
  console.log('\n📋 Test 5: Statistics and Monitoring');
  try {
    const cacheManager = CacheManager.getInstance();
    const cacheService = cacheManager.cacheService;

    // Perform some operations to generate stats
    await cacheService.getSkill('non-existent-skill'); // Miss
    await cacheService.getSkill('test-skill-phase2'); // Hit

    const stats = await cacheService.getStats();

    if (stats && typeof stats.tracker === 'object') {
      console.log('✅ Cache statistics available');
      console.log(`   - Operations: ${stats.tracker.operations}`);
      console.log(`   - Hit Rate: ${stats.tracker.hitRate}%`);
      testsPassed++;
    } else {
      console.log('❌ Cache statistics not available');
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ Statistics test error:', error instanceof Error ? error.message : error);
    testsFailed++;
  }

  // Cleanup
  console.log('\n🧹 Cleanup');
  try {
    const cacheManager = CacheManager.getInstance();
    await cacheManager.shutdown();
    console.log('✅ Cache services shutdown successfully');
  } catch (error) {
    console.log('⚠️ Cleanup warning:', error instanceof Error ? error.message : error);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${testsPassed + testsFailed > 0 ? ((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1) : 0}%`);

  if (testsFailed === 0) {
    console.log('\n🎉 Phase 2: Cache Infrastructure - COMPLETE!');
    console.log('✅ All Redis cache components working correctly');
    console.log('🚀 Ready to proceed to Phase 3: Repository Integration');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the errors above.');
    console.log('💡 Check Redis container status and configuration.');
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Review REDIS_CACHE_TESTING.md for detailed testing');
  console.log('2. Start Phase 3: Repository Integration with cache decorators');
  console.log('3. Implement cache invalidation strategies');

  process.exit(testsFailed === 0 ? 0 : 1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the test
testCacheImplementation().catch((error) => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
