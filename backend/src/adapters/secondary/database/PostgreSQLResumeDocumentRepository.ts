import { Pool } from 'pg';
import { ResumeDocument, DocumentStatus } from '../../../domain/document-processing/aggregates/ResumeDocument';
import { IResumeDocumentRepository } from '../../../domain/document-processing/repositories/IResumeDocumentRepository';
import { FileMetadata, SupportedMimeType } from '../../../domain/document-processing/value-objects/FileMetadata';
import { FileSize } from '../../../domain/document-processing/value-objects/FileSize';
import { FileHash } from '../../../domain/document-processing/value-objects/FileHash';

export class PostgreSQLResumeDocumentRepository implements IResumeDocumentRepository {
  constructor(private readonly db: Pool) {}

  async save(document: ResumeDocument): Promise<void> {
    const metadata = document.getMetadata();

    const query = `
      INSERT INTO resume_documents (
        id, original_filename, file_type, file_size_bytes, file_hash, storage_path,
        session_id, status, uploaded_at, processed_at, validation_errors
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        processed_at = EXCLUDED.processed_at,
        validation_errors = EXCLUDED.validation_errors
    `;

    const values = [
      document.getId(),
      metadata.getOriginalName(),
      metadata.getMimeType(),
      metadata.getSize().getBytes(),
      metadata.getHash().getValue(),
      document.getStoragePath() || '', // Add default empty string
      document.getSessionId(),
      document.getStatus(),
      document.getCreatedAt(),
      null, // processed_at - not tracked in current implementation
      JSON.stringify(document.getValidationErrors())
    ];

    try {
      await this.db.query(query, values);
    } catch (error) {
      console.error('Error saving resume document:', error);
      throw new Error(`Failed to save document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(id: string): Promise<ResumeDocument | null> {
    const query = `
      SELECT id, original_filename, file_type, file_size_bytes, file_hash,
             session_id, status, uploaded_at, processed_at, validation_errors
      FROM resume_documents
      WHERE id = $1
    `;

    try {
      const result = await this.db.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToDocument(result.rows[0]);
    } catch (error) {
      console.error('Error finding resume document by ID:', error);
      throw new Error(`Failed to find document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByHash(hash: FileHash): Promise<ResumeDocument | null> {
    const query = `
      SELECT id, original_filename, file_type, file_size_bytes, file_hash,
             session_id, status, uploaded_at, processed_at, validation_errors
      FROM resume_documents
      WHERE file_hash = $1
    `;

    try {
      const result = await this.db.query(query, [hash.getValue()]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToDocument(result.rows[0]);
    } catch (error) {
      console.error('Error finding resume document by hash:', error);
      throw new Error(`Failed to find document by hash: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findBySessionId(sessionId: string): Promise<ResumeDocument[]> {
    const query = `
      SELECT id, original_filename, file_type, file_size_bytes, file_hash,
             session_id, status, uploaded_at, processed_at, validation_errors
      FROM resume_documents
      WHERE session_id = $1
      ORDER BY uploaded_at DESC
    `;

    try {
      const result = await this.db.query(query, [sessionId]);

      return result.rows.map(row => this.mapRowToDocument(row));
    } catch (error) {
      console.error('Error finding resume documents by session ID:', error);
      throw new Error(`Failed to find documents by session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM resume_documents WHERE id = $1';

    try {
      const result = await this.db.query(query, [id]);

      if (result.rowCount === 0) {
        throw new Error(`Document with ID ${id} not found`);
      }
    } catch (error) {
      console.error('Error deleting resume document:', error);
      throw new Error(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async exists(id: string): Promise<boolean> {
    const query = 'SELECT 1 FROM resume_documents WHERE id = $1';

    try {
      const result = await this.db.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking if resume document exists:', error);
      throw new Error(`Failed to check document existence: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async existsByHash(hash: FileHash): Promise<boolean> {
    const query = 'SELECT 1 FROM resume_documents WHERE file_hash = $1';

    try {
      const result = await this.db.query(query, [hash.getValue()]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking if resume document exists by hash:', error);
      throw new Error(`Failed to check document existence by hash: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findAll(): Promise<ResumeDocument[]> {
    const query = `
      SELECT id, original_filename, file_type, file_size_bytes, file_hash,
             session_id, status, uploaded_at, processed_at, validation_errors
      FROM resume_documents
      ORDER BY uploaded_at DESC
    `;

    try {
      const result = await this.db.query(query);

      return result.rows.map(row => this.mapRowToDocument(row));
    } catch (error) {
      console.error('Error finding all resume documents:', error);
      throw new Error(`Failed to find all documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private mapRowToDocument(row: any): ResumeDocument {
    // Create metadata using the database column names
    const metadata = new FileMetadata(
      row.original_filename,
      row.file_type as SupportedMimeType,
      new FileSize(row.file_size_bytes),
      new FileHash(row.file_hash)
    );

    // Create document using constructor directly
    // Note: We'll use empty string for storage path since it's not in the current table
    const document = new ResumeDocument(
      row.id,
      metadata,
      '', // storage_path - not available in existing table structure
      row.status as DocumentStatus,
      row.session_id,
      row.validation_errors ? JSON.parse(row.validation_errors) : [],
      new Date(row.uploaded_at)
    );

    // Clear any domain events that might have been raised during construction
    document.clearDomainEvents();

    return document;
  }
}
