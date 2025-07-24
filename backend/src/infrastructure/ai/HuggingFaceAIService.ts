import { HfInference } from '@huggingface/inference';
import { IAIAnalysisService, SkillExtractionResult, ExtractedSkill, AIProviderConfig } from '../../domain/services/ai/interfaces';

/**
 * Hugging Face AI Service Implementation
 * Uses Named Entity Recognition and Text Classification models for skill extraction
 */
export class HuggingFaceAIService implements IAIAnalysisService {
  private hf: HfInference;
  private config: AIProviderConfig;
  private readonly NER_MODEL = 'dbmdz/bert-large-cased-finetuned-conll03-english';
  private readonly CLASSIFICATION_MODEL = 'microsoft/DialoGPT-medium';

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.hf = new HfInference(config.apiKey);
  }

  /**
   * Extract skills from resume text using Hugging Face models
   */
  async extractSkills(text: string): Promise<SkillExtractionResult> {
    const startTime = Date.now();

    try {
      console.log('🤖 Starting Hugging Face skill extraction...');

      // Check if API is accessible
      const isApiAccessible = await this.checkApiAccess();

      let entities: any[] = [];
      let skillContexts: string[] = [];

      if (isApiAccessible) {
        console.log('✅ Using Hugging Face API for extraction');
        // Step 1: Use NER to identify potential skill entities
        entities = await this.extractEntities(text);

        // Step 2: Use text classification to identify skill-related context
        skillContexts = await this.identifySkillContexts(text);
      } else {
        console.log('⚠️ Hugging Face API not accessible, using pattern matching fallback');
        // Fallback to pattern matching only
        skillContexts = await this.identifySkillContexts(text);
        entities = []; // No API entities available
      }

      // Step 3: Combine and process results
      const extractedSkills = await this.processSkillCandidates(entities, skillContexts, text);

      const processingTime = Date.now() - startTime;

      const result: SkillExtractionResult = {
        skills: extractedSkills,
        confidence: this.calculateOverallConfidence(extractedSkills),
        processingTime,
        provider: isApiAccessible ? 'huggingface' : 'huggingface-fallback',
        metadata: {
          textLength: text.length,
          modelUsed: isApiAccessible ? `${this.NER_MODEL} + Custom Processing` : 'Pattern Matching Only',
          timestamp: new Date()
        }
      };

      console.log(`✅ Hugging Face extraction completed: ${extractedSkills.length} skills found in ${processingTime}ms`);
      return result;

    } catch (error) {
      console.error('❌ Hugging Face skill extraction failed:', error);
      throw new Error(`Hugging Face AI service failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if the Hugging Face API is accessible
   */
  private async checkApiAccess(): Promise<boolean> {
    try {
      await this.hf.textGeneration({
        model: 'gpt2',
        inputs: 'test',
        parameters: {
          max_new_tokens: 1,
          temperature: 0.1
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }  /**
   * Extract named entities that could be skills
   */
  private async extractEntities(text: string): Promise<any[]> {
    try {
      const result = await this.hf.tokenClassification({
        model: this.NER_MODEL,
        inputs: text.slice(0, 5000) // Limit text length for API
      });

      // Filter for entities that might be skills (MISC, ORG for technologies)
      return Array.isArray(result) ? result.filter(entity =>
        entity.entity_group === 'MISC' ||
        entity.entity_group === 'ORG' ||
        entity.score > 0.7
      ) : [];
    } catch (error) {
      console.warn('⚠️ NER extraction failed, continuing with pattern matching:', error);
      return [];
    }
  }

  /**
   * Identify skill contexts using pattern matching and common skill indicators
   */
  private async identifySkillContexts(text: string): Promise<string[]> {
    // Enhanced skill patterns for better coverage
    const skillPatterns = [
      // Programming languages
      /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|PHP|Ruby|Go|Rust|Swift|Kotlin|Scala|Perl|R|MATLAB|Objective-C)\b/gi,

      // Frontend frameworks & libraries
      /\b(React|Angular|Vue\.?js|Svelte|Next\.?js|Nuxt\.?js|Gatsby|Ember|jQuery|Bootstrap|Tailwind|Material-?UI|Ant Design)\b/gi,

      // Backend frameworks
      /\b(Node\.?js|Express|Django|Flask|FastAPI|Spring|Laravel|Ruby on Rails|ASP\.?NET|Symfony|CodeIgniter|Koa|Nest\.?js)\b/gi,

      // Databases
      /\b(PostgreSQL|MySQL|MongoDB|Redis|Elasticsearch|Oracle|SQL Server|SQLite|MariaDB|Cassandra|DynamoDB|Neo4j)\b/gi,

      // Cloud & DevOps tools
      /\b(Docker|Kubernetes|Jenkins|GitHub Actions|GitLab CI|AWS|Azure|GCP|Google Cloud|Terraform|Ansible|Chef|Puppet|Vagrant)\b/gi,

      // AWS Services
      /\b(EC2|S3|Lambda|RDS|DynamoDB|CloudFormation|CloudWatch|API Gateway|ECS|EKS|Route 53)\b/gi,

      // Design tools
      /\b(Figma|Adobe Photoshop|Sketch|Adobe Illustrator|InVision|Canva|Adobe XD|Zeplin|Marvel|Principle)\b/gi,

      // Testing tools
      /\b(Jest|Mocha|Cypress|Selenium|Puppeteer|Playwright|JUnit|TestNG|PyTest|RSpec)\b/gi,

      // Version control
      /\b(Git|GitHub|GitLab|Bitbucket|SVN|Mercurial)\b/gi,

      // Operating systems
      /\b(Linux|Ubuntu|CentOS|macOS|Windows|Docker|Unix)\b/gi,

      // Web technologies
      /\b(HTML5?|CSS3?|Sass|SCSS|Less|Webpack|Vite|Parcel|Rollup|Babel|ESLint|Prettier)\b/gi,

      // Mobile development
      /\b(React Native|Flutter|Ionic|Xamarin|Cordova|PhoneGap|Swift|Kotlin|Android Studio|Xcode)\b/gi,

      // Data & Analytics
      /\b(Pandas|NumPy|Matplotlib|Seaborn|Scikit-learn|TensorFlow|PyTorch|Keras|Jupyter|Tableau|Power BI)\b/gi,

      // Soft skills & methodologies
      /\b(Agile|Scrum|Kanban|DevOps|CI\/CD|TDD|BDD|Leadership|Communication|Problem Solving|Project Management|Team Lead|Mentoring)\b/gi,

      // Databases specific
      /\b(SQL|NoSQL|GraphQL|REST|SOAP|API|Microservices|Serverless)\b/gi
    ];

    const foundSkills: string[] = [];

    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        foundSkills.push(...matches.map(match => match.trim()));
      }
    });

    // Also look for skills in common contexts
    const contextPatterns = [
      /(?:skilled in|proficient in|experience with|worked with|used)\s+([A-Z][a-zA-Z0-9\s,\.]{2,30})/gi,
      /(\d+)\s+years?\s+(?:of\s+)?(?:experience\s+)?(?:with\s+|in\s+)?([A-Z][a-zA-Z0-9\s\.]{2,25})/gi,
      /(?:technologies?|tools?|frameworks?|languages?):\s*([A-Za-z0-9\s,\.\/\-\+#]{10,200})/gi
    ];

    contextPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const contextText = match[match.length - 1];
        if (contextText) {
          // Split on common delimiters and extract potential skills
          const potentialSkills = contextText.split(/[,;\/\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 1 && s.length < 30)
            .filter(s => /^[A-Za-z0-9\s\.\-\+#]+$/.test(s));

          foundSkills.push(...potentialSkills);
        }
      }
    });

    return [...new Set(foundSkills)]; // Remove duplicates
  }  /**
   * Process and standardize skill candidates
   */
  private async processSkillCandidates(
    entities: any[],
    skillContexts: string[],
    originalText: string
  ): Promise<ExtractedSkill[]> {
    const allCandidates = [
      ...entities.map(e => e.word),
      ...skillContexts
    ];

    const uniqueCandidates = [...new Set(allCandidates)];
    const skills: ExtractedSkill[] = [];

    for (const candidate of uniqueCandidates) {
      if (this.isValidSkill(candidate)) {
        const skill = await this.createExtractedSkill(candidate, originalText);
        if (skill) {
          skills.push(skill);
        }
      }
    }

    return skills.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Validate if a candidate is a valid skill
   */
  private isValidSkill(candidate: string): boolean {
    if (!candidate || candidate.length < 2 || candidate.length > 50) {
      return false;
    }

    // Filter out common non-skill words
    const excludeWords = [
      'experience', 'work', 'team', 'project', 'company', 'development',
      'application', 'system', 'software', 'technology', 'solution'
    ];

    return !excludeWords.some(word =>
      candidate.toLowerCase().includes(word.toLowerCase())
    );
  }

  /**
   * Create standardized ExtractedSkill object
   */
  private async createExtractedSkill(skillName: string, text: string): Promise<ExtractedSkill | null> {
    try {
      // Find context where skill appears
      const contexts = this.findSkillContexts(skillName, text);

      // Standardize skill name
      const standardizedName = this.standardizeSkillName(skillName);

      // Determine category
      const category = this.categorizeSkill(standardizedName);

      // Calculate confidence based on context and frequency
      const confidence = this.calculateSkillConfidence(skillName, contexts, text);

      // Find proficiency indicators
      const proficiencyIndicators = this.extractProficiencyIndicators(skillName, text);

      return {
        name: skillName,
        standardizedName,
        category,
        confidence,
        context: contexts,
        proficiencyIndicators
      };
    } catch (error) {
      console.warn(`⚠️ Failed to process skill: ${skillName}`, error);
      return null;
    }
  }

  /**
   * Find contexts where skill appears in text
   */
  private findSkillContexts(skillName: string, text: string): string[] {
    const contexts: string[] = [];
    const regex = new RegExp(`(.{0,50}${skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.{0,50})`, 'gi');
    const matches = text.match(regex);

    if (matches) {
      contexts.push(...matches.slice(0, 3)); // Limit to 3 contexts
    }

    return contexts;
  }

  /**
   * Standardize skill names
   */
  private standardizeSkillName(skillName: string): string {
    const skillMap: Record<string, string> = {
      'js': 'JavaScript',
      'ts': 'TypeScript',
      'reactjs': 'React',
      'nodejs': 'Node.js',
      'vuejs': 'Vue.js',
      'nextjs': 'Next.js'
    };

    const normalized = skillName.toLowerCase().trim();
    return skillMap[normalized] || skillName;
  }

  /**
   * Categorize skills by type
   */
  private categorizeSkill(skillName: string): string {
    const categories: Record<string, string[]> = {
      'frontend': ['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'Sass'],
      'backend': ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Express', 'Django', 'Flask'],
      'database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQL'],
      'devops': ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'Terraform', 'Linux'],
      'design': ['Figma', 'Adobe Photoshop', 'Sketch', 'UI Design', 'UX Design'],
      'soft_skills': ['Leadership', 'Communication', 'Project Management', 'Agile', 'Scrum']
    };

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.some(skill => skillName.toLowerCase().includes(skill.toLowerCase()))) {
        return category;
      }
    }

    return 'other';
  }

  /**
   * Calculate skill confidence based on context
   */
  private calculateSkillConfidence(skillName: string, contexts: string[], text: string): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on context quality
    const experienceWords = ['years', 'experience', 'proficient', 'expert', 'advanced'];
    const projectWords = ['project', 'built', 'developed', 'created', 'implemented'];

    contexts.forEach(context => {
      const lowerContext = context.toLowerCase();

      if (experienceWords.some(word => lowerContext.includes(word))) {
        confidence += 0.2;
      }

      if (projectWords.some(word => lowerContext.includes(word))) {
        confidence += 0.15;
      }
    });

    // Increase confidence based on frequency
    const frequency = (text.toLowerCase().match(new RegExp(skillName.toLowerCase(), 'g')) || []).length;
    confidence += Math.min(frequency * 0.1, 0.3);

    return Math.min(confidence, 1.0);
  }

  /**
   * Extract proficiency indicators
   */
  private extractProficiencyIndicators(skillName: string, text: string): string[] {
    const indicators: string[] = [];
    const proficiencyPatterns = [
      /(\d+)\s*years?\s*(?:of\s*)?(?:experience\s*)?(?:with\s*)?/gi,
      /(?:expert|advanced|proficient|intermediate|beginner)\s*(?:in|with)?/gi,
      /(?:senior|junior|lead)\s*(?:developer|engineer)?/gi
    ];

    proficiencyPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        indicators.push(...matches.slice(0, 2));
      }
    });

    return indicators;
  }

  /**
   * Calculate overall confidence for the extraction
   */
  private calculateOverallConfidence(skills: ExtractedSkill[]): number {
    if (skills.length === 0) return 0;

    const avgConfidence = skills.reduce((sum, skill) => sum + skill.confidence, 0) / skills.length;
    return Math.round(avgConfidence * 100) / 100;
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return 'Hugging Face';
  }

  /**
   * Check if the service is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Try a simple text generation request instead of token classification
      await this.hf.textGeneration({
        model: 'gpt2',
        inputs: 'Hello world',
        parameters: {
          max_new_tokens: 5,
          temperature: 0.1
        }
      });
      return true;
    } catch (error) {
      console.warn('⚠️ Hugging Face API not accessible, falling back to pattern matching');
      return false; // We'll still work with pattern matching
    }
  }

  /**
   * Get provider capabilities
   */
  getCapabilities(): import('../../domain/services/ai/interfaces').AIProviderCapabilities {
    return {
      supportsSkillExtraction: true,
      supportsConfidenceScoring: true,
      supportsContextCapture: true,
      supportsProficiencyEstimation: false,
      maxInputLength: 10000,
      averageProcessingTime: 1200,
      costPerRequest: 0.001
    };
  }

  /**
   * Validate input text
   */
  async validateInput(text: string): Promise<import('../../domain/services/ai/interfaces').ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!text || text.trim().length === 0) {
      errors.push('Input text cannot be empty');
    }

    if (text.length > 10000) {
      errors.push('Input text exceeds maximum length of 10000 characters');
    }

    if (text.length < 50) {
      warnings.push('Input text is very short, results may be limited');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      estimatedProcessingTime: Math.min(text.length * 0.12, 3000)
    };
  }
}
