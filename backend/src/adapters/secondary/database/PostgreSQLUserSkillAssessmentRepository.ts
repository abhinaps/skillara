import { Pool } from 'pg';
import { UserSkillAssessment } from '../../../domain/career-analysis/entities';
import { UserSkillAssessmentRepository } from '../../../domain/career-analysis/repositories';
import { SkillId, SkillLevel, ExperienceLevel } from '../../../domain/career-analysis/value-objects';
import { UniqueId } from '../../../domain/shared/value-objects';

/**
 * PostgreSQL implementation of UserSkillAssessmentRepository
 */
export class PostgreSQLUserSkillAssessmentRepository implements UserSkillAssessmentRepository {
  constructor(private pool: Pool) {}

  async save(assessment: UserSkillAssessment): Promise<void> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO user_skill_assessments (
          id, user_id, skill_id, level, experience, self_assessed,
          verified_by, assessed_at, expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id)
        DO UPDATE SET
          level = EXCLUDED.level,
          experience = EXCLUDED.experience,
          self_assessed = EXCLUDED.self_assessed,
          verified_by = EXCLUDED.verified_by,
          assessed_at = EXCLUDED.assessed_at,
          expires_at = EXCLUDED.expires_at
      `;

      const values = [
        assessment.id.value,
        assessment.userId.value,
        assessment.skillId.value,
        assessment.level.value,
        assessment.experience.value,
        assessment.selfAssessed,
        assessment.verifiedBy?.value || null,
        assessment.assessedAt,
        assessment.expiresAt
      ];

      await client.query(query, values);
      console.log(`✅ User skill assessment saved: ${assessment.id.value}`);
    } catch (error) {
      console.error('❌ Error saving user skill assessment:', error);
      throw new Error(`Failed to save assessment: ${error}`);
    } finally {
      client.release();
    }
  }

  async findById(id: UniqueId): Promise<UserSkillAssessment | null> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM user_skill_assessments WHERE id = $1';
      const result = await client.query(query, [id.value]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return UserSkillAssessment.reconstitute(
        UniqueId.create(row.id),
        UniqueId.create(row.user_id),
        SkillId.create(row.skill_id),
        SkillLevel.create(row.level),
        ExperienceLevel.create(row.experience),
        row.self_assessed,
        row.verified_by ? UniqueId.create(row.verified_by) : null,
        row.assessed_at,
        row.expires_at
      );
    } catch (error) {
      console.error('❌ Error finding assessment by ID:', error);
      throw new Error(`Failed to find assessment: ${error}`);
    } finally {
      client.release();
    }
  }

  async findByUserId(userId: UniqueId): Promise<UserSkillAssessment[]> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM user_skill_assessments WHERE user_id = $1 ORDER BY assessed_at DESC';
      const result = await client.query(query, [userId.value]);

      return result.rows.map(row =>
        UserSkillAssessment.reconstitute(
          UniqueId.create(row.id),
          UniqueId.create(row.user_id),
          SkillId.create(row.skill_id),
          SkillLevel.create(row.level),
          ExperienceLevel.create(row.experience),
          row.self_assessed,
          row.verified_by ? UniqueId.create(row.verified_by) : null,
          row.assessed_at,
          row.expires_at
        )
      );
    } catch (error) {
      console.error('❌ Error finding assessments by user ID:', error);
      throw new Error(`Failed to find assessments: ${error}`);
    } finally {
      client.release();
    }
  }

  async findByUserIdAndSkillId(userId: UniqueId, skillId: SkillId): Promise<UserSkillAssessment | null> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM user_skill_assessments WHERE user_id = $1 AND skill_id = $2';
      const result = await client.query(query, [userId.value, skillId.value]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return UserSkillAssessment.reconstitute(
        UniqueId.create(row.id),
        UniqueId.create(row.user_id),
        SkillId.create(row.skill_id),
        SkillLevel.create(row.level),
        ExperienceLevel.create(row.experience),
        row.self_assessed,
        row.verified_by ? UniqueId.create(row.verified_by) : null,
        row.assessed_at,
        row.expires_at
      );
    } catch (error) {
      console.error('❌ Error finding assessment by user and skill:', error);
      throw new Error(`Failed to find assessment: ${error}`);
    } finally {
      client.release();
    }
  }

  async findVerifiedByUserId(userId: UniqueId): Promise<UserSkillAssessment[]> {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM user_skill_assessments
        WHERE user_id = $1 AND self_assessed = false AND verified_by IS NOT NULL
        ORDER BY assessed_at DESC
      `;
      const result = await client.query(query, [userId.value]);

      return result.rows.map(row =>
        UserSkillAssessment.reconstitute(
          UniqueId.create(row.id),
          UniqueId.create(row.user_id),
          SkillId.create(row.skill_id),
          SkillLevel.create(row.level),
          ExperienceLevel.create(row.experience),
          row.self_assessed,
          row.verified_by ? UniqueId.create(row.verified_by) : null,
          row.assessed_at,
          row.expires_at
        )
      );
    } catch (error) {
      console.error('❌ Error finding verified assessments:', error);
      throw new Error(`Failed to find verified assessments: ${error}`);
    } finally {
      client.release();
    }
  }

  async findSelfAssessedByUserId(userId: UniqueId): Promise<UserSkillAssessment[]> {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM user_skill_assessments
        WHERE user_id = $1 AND self_assessed = true
        ORDER BY assessed_at DESC
      `;
      const result = await client.query(query, [userId.value]);

      return result.rows.map(row =>
        UserSkillAssessment.reconstitute(
          UniqueId.create(row.id),
          UniqueId.create(row.user_id),
          SkillId.create(row.skill_id),
          SkillLevel.create(row.level),
          ExperienceLevel.create(row.experience),
          row.self_assessed,
          row.verified_by ? UniqueId.create(row.verified_by) : null,
          row.assessed_at,
          row.expires_at
        )
      );
    } catch (error) {
      console.error('❌ Error finding self-assessed assessments:', error);
      throw new Error(`Failed to find self-assessed assessments: ${error}`);
    } finally {
      client.release();
    }
  }

  async findExpired(): Promise<UserSkillAssessment[]> {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM user_skill_assessments
        WHERE expires_at IS NOT NULL AND expires_at < NOW()
        ORDER BY expires_at DESC
      `;
      const result = await client.query(query);

      return result.rows.map(row =>
        UserSkillAssessment.reconstitute(
          UniqueId.create(row.id),
          UniqueId.create(row.user_id),
          SkillId.create(row.skill_id),
          SkillLevel.create(row.level),
          ExperienceLevel.create(row.experience),
          row.self_assessed,
          row.verified_by ? UniqueId.create(row.verified_by) : null,
          row.assessed_at,
          row.expires_at
        )
      );
    } catch (error) {
      console.error('❌ Error finding expired assessments:', error);
      throw new Error(`Failed to find expired assessments: ${error}`);
    } finally {
      client.release();
    }
  }

  async getUserSkillLevels(userId: UniqueId): Promise<Map<SkillId, SkillLevel>> {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT skill_id, level FROM user_skill_assessments
        WHERE user_id = $1
        ORDER BY assessed_at DESC
      `;
      const result = await client.query(query, [userId.value]);

      const skillLevels = new Map<SkillId, SkillLevel>();
      result.rows.forEach(row => {
        skillLevels.set(SkillId.create(row.skill_id), SkillLevel.create(row.level));
      });

      return skillLevels;
    } catch (error) {
      console.error('❌ Error getting user skill levels:', error);
      throw new Error(`Failed to get user skill levels: ${error}`);
    } finally {
      client.release();
    }
  }

  async delete(id: UniqueId): Promise<void> {
    const client = await this.pool.connect();
    try {
      const query = 'DELETE FROM user_skill_assessments WHERE id = $1';
      await client.query(query, [id.value]);
      console.log(`✅ Assessment deleted: ${id.value}`);
    } catch (error) {
      console.error('❌ Error deleting assessment:', error);
      throw new Error(`Failed to delete assessment: ${error}`);
    } finally {
      client.release();
    }
  }
}
