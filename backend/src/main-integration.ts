import { getAIServiceFactory } from './infrastructure/ai/AIServiceAdapterFactory';
import { AIProviderConfig } from './domain/services/ai/interfaces';
import { runAllTests } from './tests/test-adapter-system';

/**
 * Main Integration Script
 * Demonstrates the complete AI Service Adapter System (AI-004 to AI-006)
 */

// Production-ready configuration
const productionConfigs: Record<string, AIProviderConfig> = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-1.5-flash',
    temperature: 0.3,
    maxTokens: 2000,
    timeout: 30000,
    retryAttempts: 3
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || '',
    model: 'microsoft/DialoGPT-medium',
    temperature: 0.3,
    maxTokens: 2000,
    timeout: 30000,
    retryAttempts: 3
  }
};

// Sample professional profile for testing
const professionalProfile = `
Sarah Johnson is a Senior DevOps Engineer with 10+ years of experience in cloud infrastructure and automation.

Technical Skills:
- Kubernetes orchestration and container management
- Infrastructure as Code using Terraform and CloudFormation
- CI/CD pipeline development with Jenkins, GitLab CI, and GitHub Actions
- Cloud platforms: AWS (Expert), Azure (Advanced), Google Cloud (Intermediate)
- Monitoring and observability: Prometheus, Grafana, ELK Stack, Datadog
- Programming: Python, Go, Bash scripting, PowerShell
- Database administration: PostgreSQL, MySQL, MongoDB, Redis
- Security: HashiCorp Vault, SSL/TLS management, security scanning tools

Professional Experience:
- Led migration of legacy applications to microservices architecture
- Implemented zero-downtime deployment strategies reducing deployment time by 70%
- Designed disaster recovery solutions achieving 99.99% uptime SLA
- Automated infrastructure provisioning reducing manual tasks by 85%
- Established monitoring frameworks improving incident response time by 60%

Certifications:
- AWS Solutions Architect Professional
- Certified Kubernetes Administrator (CKA)
- HashiCorp Terraform Associate
- Google Cloud Professional DevOps Engineer

Soft Skills:
- Cross-functional team leadership
- Agile/Scrum methodologies
- Technical documentation and knowledge sharing
- Incident management and post-mortem analysis
- Mentoring junior engineers
`;

async function demonstrateSystem() {
  console.log('🎯 AI Service Adapter System Demonstration');
  console.log('=' .repeat(80));

  const factory = getAIServiceFactory();

  try {
    // 1. System Health Check
    console.log('\n1️⃣ System Health Assessment');
    const healthReport = await factory.getComprehensiveHealthReport(productionConfigs);

    console.log(`🏥 Overall System Health: ${healthReport.overall.toUpperCase()}`);
    console.log('\n📊 Provider Status:');
    healthReport.providers.forEach(provider => {
      const status = provider.healthy ? '✅ Healthy' : '❌ Unhealthy';
      console.log(`   ${provider.provider}: ${status}`);
      if (provider.error) {
        console.log(`      Error: ${provider.error}`);
      }
    });

    if (healthReport.recommendations.length > 0) {
      console.log('\n💡 System Recommendations:');
      healthReport.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }

    // 2. Adapter Selection Strategy
    console.log('\n2️⃣ Intelligent Adapter Selection');
    const selectedAdapter = factory.getDefaultAdapter(productionConfigs);
    console.log(`🎯 Selected Adapter: ${selectedAdapter.getProviderName()}`);

    const capabilities = selectedAdapter.getCapabilities();
    console.log('\n🔧 Adapter Capabilities:');
    console.log(`   • Skill Extraction: ${capabilities.supportsSkillExtraction ? '✅' : '❌'}`);
    console.log(`   • Confidence Scoring: ${capabilities.supportsConfidenceScoring ? '✅' : '❌'}`);
    console.log(`   • Context Capture: ${capabilities.supportsContextCapture ? '✅' : '❌'}`);
    console.log(`   • Proficiency Estimation: ${capabilities.supportsProficiencyEstimation ? '✅' : '❌'}`);
    if (capabilities.supportsFailover) {
      console.log(`   • Failover Support: ✅`);
    }
    console.log(`   • Max Input Length: ${capabilities.maxInputLength.toLocaleString()} chars`);
    console.log(`   • Average Processing Time: ${capabilities.averageProcessingTime}ms`);
    if (capabilities.costPerRequest) {
      console.log(`   • Cost per Request: $${capabilities.costPerRequest.toFixed(4)}`);
    }
    if (capabilities.reliability) {
      console.log(`   • Reliability Score: ${(capabilities.reliability * 100).toFixed(1)}%`);
    }

    // 3. Skill Extraction Demonstration
    console.log('\n3️⃣ Professional Skill Extraction');
    console.log(`📄 Analyzing ${professionalProfile.length} character professional profile...`);

    const startTime = Date.now();
    const result = await selectedAdapter.extractSkills(professionalProfile);
    const processingTime = Date.now() - startTime;

    console.log(`\n✅ Analysis Complete!`);
    console.log(`⏱️  Processing Time: ${processingTime}ms`);
    console.log(`🎯 Overall Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`🔧 Provider Used: ${result.provider}`);
    console.log(`📊 Skills Found: ${result.skills.length}`);

    // 4. Detailed Results Analysis
    console.log('\n4️⃣ Extracted Skills Analysis');

    // Group skills by category
    const skillsByCategory = result.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof result.skills>);

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      console.log(`\n📂 ${category} (${skills.length} skills):`);
      skills
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10) // Top 10 per category
        .forEach((skill, index) => {
          const confidenceBar = '█'.repeat(Math.round(skill.confidence * 10));
          const confidencePercent = (skill.confidence * 100).toFixed(1);
          console.log(`   ${index + 1}. ${skill.name} ${confidenceBar} ${confidencePercent}%`);
          if (skill.experienceLevel) {
            console.log(`      Level: ${skill.experienceLevel}`);
          }
        });
    });

    // 5. Metadata Analysis
    console.log('\n5️⃣ Processing Metadata');
    console.log(`📏 Input Text Length: ${result.metadata.textLength.toLocaleString()} characters`);
    console.log(`🤖 Model Used: ${result.metadata.modelUsed}`);
    console.log(`📅 Analysis Timestamp: ${result.metadata.timestamp.toISOString()}`);

    if (result.metadata.multiProviderUsed) {
      console.log(`🔄 Multi-Provider Mode: Active`);
      if (result.metadata.attemptedProviders) {
        console.log(`   Attempted Providers: ${result.metadata.attemptedProviders.join(', ')}`);
      }
      if (result.metadata.successfulProvider) {
        console.log(`   Successful Provider: ${result.metadata.successfulProvider}`);
      }
      if (result.metadata.failoverCount) {
        console.log(`   Failover Count: ${result.metadata.failoverCount}`);
      }
    }

    if (result.metadata.fallbackMode) {
      console.log(`🛡️ Fallback Mode: Active`);
    }

    if (result.metadata.costEstimate) {
      console.log(`💰 Estimated Cost: $${result.metadata.costEstimate.toFixed(4)}`);
    }

    console.log(`✅ Validation Passed: ${result.metadata.validationPassed ? 'Yes' : 'No'}`);

    // 6. Performance and Quality Metrics
    console.log('\n6️⃣ Performance & Quality Metrics');

    const avgConfidence = result.skills.reduce((sum, skill) => sum + skill.confidence, 0) / result.skills.length;
    const highConfidenceSkills = result.skills.filter(skill => skill.confidence > 0.8).length;
    const categoriesFound = new Set(result.skills.map(skill => skill.category)).size;

    console.log(`📊 Quality Metrics:`);
    console.log(`   • Average Skill Confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`   • High Confidence Skills (>80%): ${highConfidenceSkills}/${result.skills.length}`);
    console.log(`   • Skill Categories Identified: ${categoriesFound}`);
    console.log(`   • Skills per Second: ${(result.skills.length / (processingTime / 1000)).toFixed(1)}`);
    console.log(`   • Characters per Second: ${(result.metadata.textLength / (processingTime / 1000)).toFixed(0)}`);

    // 7. Success Summary
    console.log('\n7️⃣ System Integration Summary');
    console.log('🎉 AI Service Adapter System Successfully Demonstrated!');
    console.log(`✅ AI-004: Enhanced domain interfaces with comprehensive contracts`);
    console.log(`✅ AI-005: Adapter pattern implementation with base and concrete adapters`);
    console.log(`✅ AI-006: Factory pattern with service registration and management`);
    console.log(`✅ Multi-provider support with intelligent failover`);
    console.log(`✅ Comprehensive health monitoring and reporting`);
    console.log(`✅ Production-ready configuration and error handling`);

  } catch (error) {
    console.error('\n💥 System demonstration failed:', error);
    console.error('🔍 Error details:', error instanceof Error ? error.stack : error);
  }
}

async function runDevelopmentMode() {
  console.log('🔧 Development Mode - Running Comprehensive Tests');
  console.log('=' .repeat(80));

  await runAllTests();

  console.log('\n' + '=' .repeat(80));
  console.log('🚀 Starting Production Demonstration');

  await demonstrateSystem();
}

// Export for use in other modules
export { demonstrateSystem, runDevelopmentMode };

// Run in development mode if executed directly
if (require.main === module) {
  const mode = process.argv[2] || 'dev';

  if (mode === 'prod') {
    demonstrateSystem().catch(console.error);
  } else {
    runDevelopmentMode().catch(console.error);
  }
}
