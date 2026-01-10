-- Complete SQL script to create and set up the textbook_content table in Supabase
-- Copy and paste this entire script into the Supabase SQL Editor and run it

-- Create the textbook_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.textbook_content (
  id BIGSERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  grade_level INTEGER NOT NULL,
  chapter TEXT NOT NULL,
  page_number INTEGER,
  page_range TEXT,
  content TEXT NOT NULL,
  content_embedding VECTOR(1536),
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add helpful comments to describe the columns
COMMENT ON TABLE public.textbook_content IS 'Table storing content from textbooks used for AI-powered search and reference';
COMMENT ON COLUMN public.textbook_content.subject IS 'Subject area: mathematics or romanian';
COMMENT ON COLUMN public.textbook_content.grade_level IS 'Grade level: 5, 6, 7, or 8';
COMMENT ON COLUMN public.textbook_content.chapter IS 'Book title/chapter reference';
COMMENT ON COLUMN public.textbook_content.page_number IS 'Start page number in the source PDF';
COMMENT ON COLUMN public.textbook_content.page_range IS 'Range of pages for this content, e.g. "1-5" or "42"';
COMMENT ON COLUMN public.textbook_content.content IS 'Extracted text content from the pages';
COMMENT ON COLUMN public.textbook_content.content_embedding IS 'OpenAI vector embedding for semantic search';
COMMENT ON COLUMN public.textbook_content.pdf_url IS 'URL or path to the source PDF file, e.g. Firebase storage URL';

-- Create indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_textbook_content_subject_grade ON public.textbook_content(subject, grade_level);
CREATE INDEX IF NOT EXISTS idx_textbook_content_chapter ON public.textbook_content(chapter);

-- Enable Row Level Security (RLS)
ALTER TABLE public.textbook_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read textbook content
CREATE POLICY "Allow all users to read textbook content"
  ON public.textbook_content
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create policy to allow only service role to insert/update textbook content
CREATE POLICY "Allow service role to insert/update textbook content"
  ON public.textbook_content
  FOR ALL
  TO service_role
  USING (true);

-- Create or update function for vector similarity search
CREATE OR REPLACE FUNCTION match_textbook_content(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  p_subject TEXT,
  p_grade_level INT
)
RETURNS TABLE (
  id BIGINT,
  subject TEXT,
  grade_level INT,
  chapter TEXT,
  page_number INT,
  page_range TEXT,
  content TEXT,
  pdf_url TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tc.id,
    tc.subject,
    tc.grade_level,
    tc.chapter,
    tc.page_number,
    tc.page_range,
    tc.content,
    tc.pdf_url,
    1 - (tc.content_embedding <=> query_embedding) AS similarity
  FROM
    textbook_content tc
  WHERE
    tc.subject = p_subject
    AND tc.grade_level = p_grade_level
    AND 1 - (tc.content_embedding <=> query_embedding) > match_threshold
  ORDER BY
    tc.content_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
