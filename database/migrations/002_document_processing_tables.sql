-- Document Processing Tables
-- Migration: 002_document_processing_tables.sql

-- Resume documents table
CREATE TABLE IF NOT EXISTS resume_documents (
    id UUID PRIMARY KEY,
    session_id UUID,
    original_name VARCHAR(255) NOT NULL,
    size_bytes INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) UNIQUE NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'uploaded',
    validation_errors JSONB DEFAULT '[]',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes separately to avoid syntax issues with CREATE TABLE
CREATE INDEX IF NOT EXISTS idx_resume_documents_session_id ON resume_documents(session_id);
CREATE INDEX IF NOT EXISTS idx_resume_documents_file_hash ON resume_documents(file_hash);
CREATE INDEX IF NOT EXISTS idx_resume_documents_status ON resume_documents(status);
CREATE INDEX IF NOT EXISTS idx_resume_documents_uploaded_at ON resume_documents(uploaded_at);

-- Extracted content table
CREATE TABLE IF NOT EXISTS extracted_content (
    id UUID PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES resume_documents(id) ON DELETE CASCADE,
    raw_text TEXT,
    structured_sections JSONB,
    extraction_quality INTEGER CHECK (extraction_quality >= 0 AND extraction_quality <= 100),
    extraction_metadata JSONB,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes separately
CREATE INDEX IF NOT EXISTS idx_extracted_content_document_id ON extracted_content(document_id);
CREATE INDEX IF NOT EXISTS idx_extracted_content_processed_at ON extracted_content(processed_at);

-- Skill extractions table
CREATE TABLE IF NOT EXISTS skill_extractions (
    id UUID PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES resume_documents(id) ON DELETE CASCADE,
    extracted_skills JSONB NOT NULL DEFAULT '[]',
    aggregate_confidence INTEGER CHECK (aggregate_confidence >= 0 AND aggregate_confidence <= 100),
    ai_provider VARCHAR(50),
    extraction_metadata JSONB,
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes separately
CREATE INDEX IF NOT EXISTS idx_skill_extractions_document_id ON skill_extractions(document_id);
CREATE INDEX IF NOT EXISTS idx_skill_extractions_ai_provider ON skill_extractions(ai_provider);
CREATE INDEX IF NOT EXISTS idx_skill_extractions_extracted_at ON skill_extractions(extracted_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resume_documents_updated_at
    BEFORE UPDATE ON resume_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some constraints and comments
COMMENT ON TABLE resume_documents IS 'Stores metadata about uploaded resume documents';
COMMENT ON TABLE extracted_content IS 'Stores extracted text content from documents';
COMMENT ON TABLE skill_extractions IS 'Stores AI-extracted skills from documents';

COMMENT ON COLUMN resume_documents.file_hash IS 'SHA-256 hash of file content for deduplication';
COMMENT ON COLUMN resume_documents.status IS 'Document processing status: uploaded, validated, processing, processed, failed';
COMMENT ON COLUMN extracted_content.extraction_quality IS 'Quality score (0-100) of text extraction';
COMMENT ON COLUMN skill_extractions.aggregate_confidence IS 'Overall confidence score (0-100) for extracted skills';
