import { Request, Response } from 'express';
import { CreateSkillUseCase, AssessSkillUseCase, GetUserSkillsUseCase } from '../../../../application/use-cases/skill-management';
import { SkillId } from '../../../../domain/career-analysis/value-objects';

/**
 * Controller for skill-related endpoints
 */
export class SkillController {
  constructor(
    private createSkillUseCase: CreateSkillUseCase,
    private assessSkillUseCase: AssessSkillUseCase,
    private getUserSkillsUseCase: GetUserSkillsUseCase
  ) {}

  /**
   * POST /api/skills
   * Create a new skill
   */
  async createSkill(req: Request, res: Response): Promise<void> {
    try {
      const { name, category, description } = req.body;

      // Validate input
      if (!name || !category || !description) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: name, category, description'
        });
        return;
      }

      const result = await this.createSkillUseCase.execute({
        name,
        category,
        description
      });

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          error: result.error.message,
          code: result.error.code
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.value
      });
    } catch (error) {
      console.error('Error in createSkill:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * POST /api/skills/assess
   * Assess a user's skill level
   */
  async assessSkill(req: Request, res: Response): Promise<void> {
    try {
      const { userId, skillId, level, experience } = req.body;

      // Validate input
      if (!userId || !skillId || !level || !experience) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: userId, skillId, level, experience'
        });
        return;
      }

      // Validate level range
      if (level < 1 || level > 5) {
        res.status(400).json({
          success: false,
          error: 'Level must be between 1 and 5'
        });
        return;
      }

      const result = await this.assessSkillUseCase.execute({
        userId,
        skillId: SkillId.create(skillId),
        level,
        experience
      });

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          error: result.error.message,
          code: result.error.code
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.value
      });
    } catch (error) {
      console.error('Error in assessSkill:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * GET /api/users/:userId/skills
   * Get all skills for a user
   */
  async getUserSkills(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
        return;
      }

      const result = await this.getUserSkillsUseCase.execute(userId);

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          error: result.error.message,
          code: result.error.code
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.value
      });
    } catch (error) {
      console.error('Error in getUserSkills:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * GET /api/skills/health
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Skill service is healthy',
      timestamp: new Date().toISOString()
    });
  }
}
