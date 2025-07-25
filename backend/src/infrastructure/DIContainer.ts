import { Pool } from 'pg';
import { db } from '../infrastructure/database/connection';

// Repository implementations
import { PostgreSQLSkillRepository } from '../adapters/secondary/database/PostgreSQLSkillRepository';
import { PostgreSQLUserSkillAssessmentRepository } from '../adapters/secondary/database/PostgreSQLUserSkillAssessmentRepository';
import { PostgreSQLResumeDocumentRepository } from '../adapters/secondary/database/PostgreSQLResumeDocumentRepository';

// Use cases
import { CreateSkillUseCase, AssessSkillUseCase, GetUserSkillsUseCase } from '../application/use-cases/skill-management';

// Controllers
import { SkillController } from '../adapters/primary/web/controllers/SkillController';
import { FileUploadController } from '../adapters/primary/FileUploadController';

// Infrastructure services
import { LocalFileStorageService } from '../infrastructure/file-storage/LocalFileStorageService';

/**
 * Dependency Injection Container
 * Following DDD principles with proper dependency injection
 */
export class DIContainer {
  private static instance: DIContainer;

  // Infrastructure
  private _database!: Pool;

  // Repositories (Secondary Adapters)
  private _skillRepository!: PostgreSQLSkillRepository;
  private _userSkillAssessmentRepository!: PostgreSQLUserSkillAssessmentRepository;
  private _resumeDocumentRepository!: PostgreSQLResumeDocumentRepository;

  // Infrastructure services
  private _fileStorageService!: LocalFileStorageService;

  // Use Cases (Application Layer)
  private _createSkillUseCase!: CreateSkillUseCase;
  private _assessSkillUseCase!: AssessSkillUseCase;
  private _getUserSkillsUseCase!: GetUserSkillsUseCase;

  // Controllers (Primary Adapters)
  private _skillController!: SkillController;
  private _fileUploadController!: FileUploadController;

  private constructor() {
    this.initializeInfrastructure();
    this.initializeServices();
    this.initializeRepositories();
    this.initializeUseCases();
    this.initializeControllers();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeInfrastructure(): void {
    this._database = db;
  }

  private initializeServices(): void {
    this._fileStorageService = new LocalFileStorageService();
  }

  private initializeRepositories(): void {
    this._skillRepository = new PostgreSQLSkillRepository(this._database);
    this._userSkillAssessmentRepository = new PostgreSQLUserSkillAssessmentRepository(this._database);
    this._resumeDocumentRepository = new PostgreSQLResumeDocumentRepository(this._database);
  }

  private initializeUseCases(): void {
    this._createSkillUseCase = new CreateSkillUseCase(this._skillRepository);
    this._assessSkillUseCase = new AssessSkillUseCase(
      this._userSkillAssessmentRepository,
      this._skillRepository
    );
    this._getUserSkillsUseCase = new GetUserSkillsUseCase(
      this._userSkillAssessmentRepository,
      this._skillRepository
    );
  }

  private initializeControllers(): void {
    this._skillController = new SkillController(
      this._createSkillUseCase,
      this._assessSkillUseCase,
      this._getUserSkillsUseCase
    );

    this._fileUploadController = new FileUploadController(
      this._fileStorageService,
      this._resumeDocumentRepository
    );
  }

  // Getters for accessing instances
  get database(): Pool {
    return this._database;
  }

  get skillRepository(): PostgreSQLSkillRepository {
    return this._skillRepository;
  }

  get userSkillAssessmentRepository(): PostgreSQLUserSkillAssessmentRepository {
    return this._userSkillAssessmentRepository;
  }

  get createSkillUseCase(): CreateSkillUseCase {
    return this._createSkillUseCase;
  }

  get assessSkillUseCase(): AssessSkillUseCase {
    return this._assessSkillUseCase;
  }

  get getUserSkillsUseCase(): GetUserSkillsUseCase {
    return this._getUserSkillsUseCase;
  }

  get skillController(): SkillController {
    return this._skillController;
  }

  get fileUploadController(): FileUploadController {
    return this._fileUploadController;
  }

  get resumeDocumentRepository(): PostgreSQLResumeDocumentRepository {
    return this._resumeDocumentRepository;
  }

  get fileStorageService(): LocalFileStorageService {
    return this._fileStorageService;
  }
}
