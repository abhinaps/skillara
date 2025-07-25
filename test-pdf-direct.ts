#!/usr/bin/env ts-node

/**
 * Simple PDF upload test directly using the backend code
 */

import { db } from './backend/src/infrastructure/database/connection';
import { DIContainer } from './backend/src/infrastructure/DIContainer';
import * as fs from 'fs';

async function testPdfUpload() {
  console.log('🔄 Testing PDF upload directly...');

  try {
    // Initialize container
    const container = DIContainer.getInstance();

    // Read the PDF file
    const pdfBuffer = fs.readFileSync('./From16_A.pdf');
    console.log(`📄 PDF file size: ${pdfBuffer.length} bytes`);

    // Create a mock request-like object
    const mockFile = {
      originalname: 'From16_A.pdf',
      buffer: pdfBuffer,
      mimetype: 'application/pdf',
      size: pdfBuffer.length
    };

    // Test file validation
    const { FileValidator } = await import('./backend/src/infrastructure/file-storage/FileValidator');
    const validation = await FileValidator.validateFile(pdfBuffer, 'From16_A.pdf', 'application/pdf');

    console.log('📋 File validation result:', validation);

    if (!validation.isValid) {
      console.log('❌ File validation failed:', validation.errors);
      return;
    }

    console.log('✅ File validation passed!');
    console.log('🔄 Testing file storage service...');

    // Test file storage
    const fileStorageService = container.fileStorageService;
    const storageResult = await fileStorageService.store(pdfBuffer, 'From16_A.pdf', 'application/pdf');

    console.log('📁 Storage result:', storageResult);

    if (storageResult.success) {
      console.log('✅ File storage successful!');
      console.log('📍 File path:', storageResult.filePath);
    } else {
      console.log('❌ File storage failed:', storageResult.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await db.end();
  }
}

testPdfUpload();
