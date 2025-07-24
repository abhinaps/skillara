import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIAnalysisService, SkillExtractionResult, ExtractedSkill, AIProviderConfig } from '../../domain/services/ai/interfaces';

/**
 * Google Gemini AI Service Implementation
 * Uses Gemini Pro model for advanced skill extraction with natural language understanding
 */
export class GeminiAIService implements IAIAnalysisService {
  private genAI: GoogleGenerativeAI;
  private config: AIProviderConfig;
  private readonly MODEL_NAME = 'gemini-1.5-flash';

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
  }

  /**
   * Extract skills from resume text using Google Gemini
   */
  async extractSkills(text: string): Promise<SkillExtractionResult> {
    const startTime = Date.now();

    try {
      console.log('🤖 Starting Google Gemini skill extraction...');

      // Check if API is accessible
      const isApiAccessible = await this.checkApiAccess();

      if (!isApiAccessible) {
        console.log('⚠️ Gemini API not accessible, using pattern matching fallback');
        return this.fallbackExtraction(text, startTime);
      }

      // Use Gemini for intelligent skill extraction
      const extractedSkills = await this.performGeminiExtraction(text);

      const processingTime = Date.now() - startTime;

      const result: SkillExtractionResult = {
        skills: extractedSkills,
        confidence: this.calculateOverallConfidence(extractedSkills),
        processingTime,
        provider: 'gemini',
        metadata: {
          textLength: text.length,
          modelUsed: this.MODEL_NAME,
          timestamp: new Date()
        }
      };

      console.log(`✅ Gemini extraction completed: ${extractedSkills.length} skills found in ${processingTime}ms`);
      return result;

    } catch (error) {
      console.error('❌ Gemini skill extraction failed:', error);

      // Fallback to pattern matching
      console.log('🔄 Falling back to pattern matching...');
      return this.fallbackExtraction(text, startTime);
    }
  }

  /**
   * Perform skill extraction using Gemini AI
   */
  private async performGeminiExtraction(text: string): Promise<ExtractedSkill[]> {
    const model = this.genAI.getGenerativeModel({ model: this.MODEL_NAME });

    const prompt = `
Analyze the following resume text and extract technical skills, tools, technologies, and relevant soft skills.
For each skill found, provide:
1. The skill name (standardized)
2. Category (frontend, backend, database, devops, design, soft_skills, or other)
3. Confidence score (0.0-1.0) based on how clearly it's mentioned
4. Context where it appears (brief excerpt)
5. Proficiency indicators if mentioned (years of experience, skill level, etc.)

Return the results in this exact JSON format:
{
  "skills": [
    {
      "name": "React",
      "standardizedName": "React",
      "category": "frontend",
      "confidence": 0.95,
      "context": ["Developed web applications using React"],
      "proficiencyIndicators": ["3 years experience"]
    }
  ]
}

Resume text:
${text}

Important: Return ONLY valid JSON, no additional text or explanations.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsedResult = JSON.parse(jsonMatch[0]);

      if (!parsedResult.skills || !Array.isArray(parsedResult.skills)) {
        throw new Error('Invalid response format');
      }

      // Convert to ExtractedSkill format and validate
      const extractedSkills: ExtractedSkill[] = parsedResult.skills
        .filter((skill: any) => skill.name && skill.category && typeof skill.confidence === 'number')
        .map((skill: any) => ({
          name: skill.name,
          standardizedName: skill.standardizedName || skill.name,
          category: skill.category,
          confidence: Math.min(Math.max(skill.confidence, 0), 1), // Clamp between 0-1
          context: Array.isArray(skill.context) ? skill.context : [skill.context || ''],
          proficiencyIndicators: Array.isArray(skill.proficiencyIndicators) ? skill.proficiencyIndicators : []
        }));

      return extractedSkills.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.error('❌ Gemini API call failed:', error);
      throw error;
    }
  }

  /**
   * Fallback extraction using pattern matching
   */
  private async fallbackExtraction(text: string, startTime: number): Promise<SkillExtractionResult> {
    const skillContexts = await this.identifySkillContexts(text);
    const extractedSkills = await this.processSkillCandidates(skillContexts, text);

    const processingTime = Date.now() - startTime;

    return {
      skills: extractedSkills,
      confidence: this.calculateOverallConfidence(extractedSkills),
      processingTime,
      provider: 'gemini-fallback',
      metadata: {
        textLength: text.length,
        modelUsed: 'Pattern Matching Fallback',
        timestamp: new Date()
      }
    };
  }

  /**
   * Check if the Gemini API is accessible
   */
  private async checkApiAccess(): Promise<boolean> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.MODEL_NAME });
      const result = await model.generateContent('Test');
      await result.response;
      return true;
    } catch (error) {
      console.warn('⚠️ Gemini API check failed:', error);
      return false;
    }
  }

  /**
   * Identify skill contexts using enhanced pattern matching
   */
  private async identifySkillContexts(text: string): Promise<string[]> {
    const skillPatterns = [
      // Programming languages
      /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|PHP|Ruby|Go|Rust|Swift|Kotlin|Scala|Perl|R|MATLAB)\b/gi,

      // Frontend frameworks & libraries
      /\b(React|Angular|Vue\.?js|Svelte|Next\.?js|Nuxt\.?js|Gatsby|Ember|jQuery|Bootstrap|Tailwind)\b/gi,

      // Backend frameworks
      /\b(Node\.?js|Express|Django|Flask|FastAPI|Spring|Laravel|Ruby on Rails|ASP\.?NET|Nest\.?js)\b/gi,

      // Databases
      /\b(PostgreSQL|MySQL|MongoDB|Redis|Elasticsearch|Oracle|SQL Server|SQLite|DynamoDB)\b/gi,

      // Cloud & DevOps
      /\b(Docker|Kubernetes|Jenkins|GitHub Actions|AWS|Azure|GCP|Terraform|Ansible)\b/gi,

      // Design tools
      /\b(Figma|Adobe Photoshop|Sketch|Adobe Illustrator|InVision|Canva|Adobe XD)\b/gi,

      // Testing & Tools
      /\b(Jest|Mocha|Cypress|Selenium|Git|GitHub|GitLab|Webpack|Vite)\b/gi,

      // Soft skills
      /\b(Leadership|Communication|Problem Solving|Project Management|Agile|Scrum|Team Lead)\b/gi
    ];

    const foundSkills: string[] = [];

    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        foundSkills.push(...matches.map(match => match.trim()));
      }
    });

    return [...new Set(foundSkills)];
  }

  /**
   * Process skill candidates from pattern matching
   */
  private async processSkillCandidates(skillContexts: string[], originalText: string): Promise<ExtractedSkill[]> {
    const skills: ExtractedSkill[] = [];

    for (const skillName of skillContexts) {
      if (this.isValidSkill(skillName)) {
        const skill = await this.createExtractedSkill(skillName, originalText);
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
      const contexts = this.findSkillContexts(skillName, text);
      const standardizedName = this.standardizeSkillName(skillName);
      const category = this.categorizeSkill(standardizedName);
      const confidence = this.calculateSkillConfidence(skillName, contexts, text);
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
      contexts.push(...matches.slice(0, 3));
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
      'frontend': ['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'Sass', 'jQuery'],
      'backend': ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Express', 'Django', 'Flask'],
      'database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQL', 'Elasticsearch'],
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
    let confidence = 0.6; // Base confidence for pattern matching

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

    const frequency = (text.toLowerCase().match(new RegExp(skillName.toLowerCase(), 'g')) || []).length;
    confidence += Math.min(frequency * 0.1, 0.25);

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
    return 'Google Gemini';
  }

  /**
   * Check if the service is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.MODEL_NAME });
      const result = await model.generateContent('Hello');
      await result.response;
      return true;
    } catch (error) {
      console.warn('⚠️ Gemini API not accessible');
      return false;
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
      supportsProficiencyEstimation: true,
      maxInputLength: 8000,
      averageProcessingTime: 800,
      costPerRequest: 0.002
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

    if (text.length > 8000) {
      errors.push('Input text exceeds maximum length of 8000 characters');
    }

    if (text.length < 50) {
      warnings.push('Input text is very short, results may be limited');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      estimatedProcessingTime: Math.min(text.length * 0.1, 2000)
    };
  }
}
