-- Setup for textbook content in Supabase
-- This file contains SQL commands to set up the necessary database schema for storing textbook content

-- Create table for textbook content
CREATE TABLE textbook_content (
  id BIGSERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  grade_level INTEGER NOT NULL,
  chapter TEXT,
  page_number INTEGER,
  content TEXT NOT NULL,
  content_embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  source_type TEXT
);

-- Create indexes for efficient querying
CREATE INDEX idx_textbook_content_subject ON textbook_content(subject);
CREATE INDEX idx_textbook_content_grade ON textbook_content(grade_level);

-- Enable full-text search
CREATE INDEX idx_textbook_content_fts ON textbook_content USING GIN (to_tsvector('romanian', content));

-- Create function for similarity search using embeddings
CREATE OR REPLACE FUNCTION match_textbook_embeddings(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_subject text DEFAULT NULL,
  filter_grade int DEFAULT NULL
) RETURNS TABLE (
  id bigint,
  subject text,
  grade_level int,
  chapter text,
  page_number int,
  content text,
  similarity float
)
LANGUAGE SQL
AS $$
  SELECT
    id,
    subject,
    grade_level,
    chapter,
    page_number,
    content,
    1 - (content_embedding <=> query_embedding) AS similarity
  FROM textbook_content
  WHERE
    (filter_subject IS NULL OR subject = filter_subject) AND
    (filter_grade IS NULL OR grade_level = filter_grade) AND
    content_embedding IS NOT NULL
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_textbook_content_update_timestamp
BEFORE UPDATE ON textbook_content
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();
