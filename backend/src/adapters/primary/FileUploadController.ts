import { Request, Response } from 'express';
import { ResumeDocument } from '../../domain/document-processing/aggregates/ResumeDocument';
import { SupportedMimeType } from '../../domain/document-processing/value-objects/FileMetadata';
import { IFileStorageService } from '../../infrastructure/file-storage/IFileStorageService';
import { FileValidator } from '../../infrastructure/file-storage/FileValidator';
import { IResumeDocumentRepository } from '../../domain/document-processing/repositories/IResumeDocumentRepository';

export interface UploadRequest extends Request {
  file?: Express.Multer.File;
  sessionId?: string;
}

export class FileUploadController {
  constructor(
    private readonly fileStorageService: IFileStorageService,
    private readonly documentRepository: IResumeDocumentRepository
  ) {}

  async uploadFile(req: UploadRequest, res: Response): Promise<void> {
    console.log('🔄 [FileUploadController] Starting upload process');
    try {
      // Check if file was uploaded
      if (!req.file) {
        console.log('❌ [FileUploadController] No file found in request');
        res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
        return;
      }

      const { originalname, buffer, mimetype } = req.file;
      const sessionId = req.sessionId || req.headers['x-session-id'] as string;
      console.log(`📄 [FileUploadController] Processing file: ${originalname}, size: ${buffer.length}, type: ${mimetype}`);

      // Validate file thoroughly
      console.log('🔍 [FileUploadController] Starting file validation');
      const validation = await FileValidator.validateFile(buffer, originalname, mimetype);
      console.log('✅ [FileUploadController] File validation completed:', validation.isValid);

      if (!validation.isValid) {
        console.log('❌ [FileUploadController] File validation failed:', validation.errors);
        res.status(400).json({
          success: false,
          error: 'File validation failed',
          details: validation.errors
        });
        return;
      }

      // Use detected MIME type for more accuracy
      const actualMimeType = validation.detectedMimeType as SupportedMimeType;
      console.log('📋 [FileUploadController] Using detected MIME type:', actualMimeType);

      // Check for duplicate files
      console.log('🏗️ [FileUploadController] Creating document instance');
      const document = ResumeDocument.create(
        originalname,
        actualMimeType,
        buffer.length,
        buffer,
        '', // Will be set after storage
        sessionId
      );

      // Check if this file hash already exists
      console.log('🔍 [FileUploadController] Checking for duplicate files');
      const existingDocument = await this.documentRepository.findByHash(
        document.getMetadata().getHash()
      );
      console.log('✅ [FileUploadController] Duplicate check completed, found existing:', !!existingDocument);

      if (existingDocument) {
        console.log('⚠️ [FileUploadController] Duplicate file detected, returning 409');
        res.status(409).json({
          success: false,
          error: 'This file has already been uploaded',
          documentId: existingDocument.getId()
        });
        return;
      }

      // Store the file
      console.log('💾 [FileUploadController] Starting file storage');
      const storageResult = await this.fileStorageService.store(
        buffer,
        originalname,
        actualMimeType
      );
      console.log('✅ [FileUploadController] File storage completed:', storageResult.success);

      if (!storageResult.success || !storageResult.filePath) {
        console.log('❌ [FileUploadController] File storage failed:', storageResult.error);
        res.status(500).json({
          success: false,
          error: 'Failed to store file',
          details: storageResult.error
        });
        return;
      }

      // Create document with storage path
      console.log('🏗️ [FileUploadController] Creating final document with storage path');
      const storedDocument = ResumeDocument.create(
        originalname,
        actualMimeType,
        buffer.length,
        buffer,
        storageResult.filePath,
        sessionId
      );

      // Validate the document
      console.log('🔍 [FileUploadController] Validating final document');
      const isValid = storedDocument.validate();
      console.log('✅ [FileUploadController] Final document validation:', isValid);

      if (!isValid) {
        console.log('❌ [FileUploadController] Final document validation failed, cleaning up');
        // Clean up stored file
        await this.fileStorageService.delete(storageResult.filePath);

        res.status(400).json({
          success: false,
          error: 'Document validation failed',
          details: storedDocument.getValidationErrors()
        });
        return;
      }

      // Save to repository
      console.log('💾 [FileUploadController] Saving document to repository');
      await this.documentRepository.save(storedDocument);
      console.log('✅ [FileUploadController] Document saved successfully');

      // Return success response
      console.log('🎉 [FileUploadController] Upload completed successfully');
      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        document: {
          id: storedDocument.getId(),
          originalName: storedDocument.getMetadata().getOriginalName(),
          size: storedDocument.getMetadata().getSize().getBytes(),
          mimeType: storedDocument.getMetadata().getMimeType(),
          status: storedDocument.getStatus(),
          uploadedAt: storedDocument.getCreatedAt(),
          hash: storedDocument.getMetadata().getHash().getValue()
        }
      });

    } catch (error) {
      console.error('❌ [FileUploadController] Upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error during upload',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getDocument(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Document ID is required'
        });
        return;
      }

      const document = await this.documentRepository.findById(id);

      if (!document) {
        res.status(404).json({
          success: false,
          error: 'Document not found'
        });
        return;
      }

      res.json({
        success: true,
        document: {
          id: document.getId(),
          originalName: document.getMetadata().getOriginalName(),
          size: document.getMetadata().getSize().getBytes(),
          mimeType: document.getMetadata().getMimeType(),
          status: document.getStatus(),
          uploadedAt: document.getCreatedAt(),
          canBeProcessed: document.canBeProcessed(),
          isProcessed: document.isProcessed(),
          validationErrors: document.getValidationErrors()
        }
      });

    } catch (error) {
      console.error('Get document error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Document ID is required'
        });
        return;
      }

      const document = await this.documentRepository.findById(id);

      if (!document) {
        res.status(404).json({
          success: false,
          error: 'Document not found'
        });
        return;
      }

      // Delete file from storage
      await this.fileStorageService.delete(document.getStoragePath());

      // Delete from repository
      await this.documentRepository.delete(id);

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });

    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
