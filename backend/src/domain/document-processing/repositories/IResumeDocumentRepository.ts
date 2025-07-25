import { ResumeDocument } from '../aggregates/ResumeDocument';
import { FileHash } from '../value-objects/FileHash';

export interface IResumeDocumentRepository {
  save(document: ResumeDocument): Promise<void>;
  findById(id: string): Promise<ResumeDocument | null>;
  findByHash(hash: FileHash): Promise<ResumeDocument | null>;
  findBySessionId(sessionId: string): Promise<ResumeDocument[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  existsByHash(hash: FileHash): Promise<boolean>;
}
