import { Pool, PoolClient } from 'pg';
import { Skill } from '../../../domain/career-analysis/entities';
import { SkillRepository } from '../../../domain/career-analysis/repositories';
import { SkillId, SkillName } from '../../../domain/career-analysis/value-objects';

/**
 * PostgreSQL implementation of SkillRepository
 */
export class PostgreSQLSkillRepository implements SkillRepository {
  constructor(private pool: Pool) {}

  async save(skill: Skill): Promise<void> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO skills_taxonomy (id, skill_name, standardized_name, category, skill_description, created_at, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id)
        DO UPDATE SET
          skill_name = EXCLUDED.skill_name,
          standardized_name = EXCLUDED.standardized_name,
          category = EXCLUDED.category,
          skill_description = EXCLUDED.skill_description,
          last_updated = EXCLUDED.last_updated
      `;

      const values = [
        skill.id.value,
        skill.name.value,
        skill.name.value.toLowerCase().replace(/[^a-z0-9]/g, '-'), // Standardized name
        skill.category,
        skill.description,
        skill.createdAt,
        skill.updatedAt
      ];

      await client.query(query, values);
      console.log(`✅ Skill saved: ${skill.name.value}`);
    } catch (error) {
      console.error('❌ Error saving skill:', error);
      throw new Error(`Failed to save skill: ${error}`);
    } finally {
      client.release();
    }
  }

  async findById(id: SkillId): Promise<Skill | null> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM skills_taxonomy WHERE id = $1';
      const result = await client.query(query, [id.value]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return Skill.reconstitute(
        SkillId.create(row.id),
        SkillName.create(row.skill_name),
        row.category,
        row.skill_description,
        true, // Assuming active since there's no is_active column
        row.created_at,
        row.last_updated
      );
    } catch (error) {
      console.error('❌ Error finding skill by ID:', error);
      throw new Error(`Failed to find skill: ${error}`);
    } finally {
      client.release();
    }
  }

  async findByName(name: SkillName): Promise<Skill | null> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM skills_taxonomy WHERE skill_name = $1';
      const result = await client.query(query, [name.value]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return Skill.reconstitute(
        SkillId.create(row.id),
        SkillName.create(row.skill_name),
        row.category,
        row.skill_description,
        true, // Assuming active since there's no is_active column
        row.created_at,
        row.last_updated
      );
    } catch (error) {
      console.error('❌ Error finding skill by name:', error);
      throw new Error(`Failed to find skill: ${error}`);
    } finally {
      client.release();
    }
  }

  async findByCategory(category: string): Promise<Skill[]> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM skills_taxonomy WHERE category = $1 ORDER BY skill_name';
      const result = await client.query(query, [category]);

      return result.rows.map(row =>
        Skill.reconstitute(
          SkillId.create(row.id),
          SkillName.create(row.skill_name),
          row.category,
          row.skill_description,
          true, // Assuming active since there's no is_active column
          row.created_at,
          row.last_updated
        )
      );
    } catch (error) {
      console.error('❌ Error finding skills by category:', error);
      throw new Error(`Failed to find skills: ${error}`);
    } finally {
      client.release();
    }
  }

  async findAllActive(): Promise<Skill[]> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM skills_taxonomy ORDER BY skill_name';
      const result = await client.query(query);

      return result.rows.map(row =>
        Skill.reconstitute(
          SkillId.create(row.id),
          SkillName.create(row.skill_name),
          row.category,
          row.skill_description,
          true, // Assuming active since there's no is_active column
          row.created_at,
          row.last_updated
        )
      );
    } catch (error) {
      console.error('❌ Error finding active skills:', error);
      throw new Error(`Failed to find skills: ${error}`);
    } finally {
      client.release();
    }
  }

  async searchByName(pattern: string): Promise<Skill[]> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM skills_taxonomy WHERE skill_name ILIKE $1 ORDER BY skill_name';
      const result = await client.query(query, [`%${pattern}%`]);

      return result.rows.map(row =>
        Skill.reconstitute(
          SkillId.create(row.id),
          SkillName.create(row.skill_name),
          row.category,
          row.skill_description,
          true, // Assuming active since there's no is_active column
          row.created_at,
          row.last_updated
        )
      );
    } catch (error) {
      console.error('❌ Error searching skills:', error);
      throw new Error(`Failed to search skills: ${error}`);
    } finally {
      client.release();
    }
  }

  async existsByName(name: SkillName): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT 1 FROM skills_taxonomy WHERE skill_name = $1 LIMIT 1';
      const result = await client.query(query, [name.value]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('❌ Error checking skill existence:', error);
      throw new Error(`Failed to check skill existence: ${error}`);
    } finally {
      client.release();
    }
  }

  async getAllCategories(): Promise<string[]> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT DISTINCT category FROM skills_taxonomy ORDER BY category';
      const result = await client.query(query);
      return result.rows.map(row => row.category);
    } catch (error) {
      console.error('❌ Error getting categories:', error);
      throw new Error(`Failed to get categories: ${error}`);
    } finally {
      client.release();
    }
  }

  async delete(id: SkillId): Promise<void> {
    const client = await this.pool.connect();
    try {
      const query = 'DELETE FROM skills_taxonomy WHERE id = $1';
      await client.query(query, [id.value]);
      console.log(`✅ Skill deleted: ${id.value}`);
    } catch (error) {
      console.error('❌ Error deleting skill:', error);
      throw new Error(`Failed to delete skill: ${error}`);
    } finally {
      client.release();
    }
  }
}
