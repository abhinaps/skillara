import { Router } from 'express';
import { SkillController } from '../controllers/SkillController';

/**
 * Skill routes configuration
 */
export function createSkillRoutes(skillController: SkillController): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => skillController.healthCheck(req, res));

  // Skill management
  router.post('/skills', (req, res) => skillController.createSkill(req, res));
  router.post('/skills/assess', (req, res) => skillController.assessSkill(req, res));

  // User skills
  router.get('/users/:userId/skills', (req, res) => skillController.getUserSkills(req, res));

  return router;
}
