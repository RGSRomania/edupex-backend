-- SQL script to add the missing pdf_url column to the textbook_content table

-- First check if the column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'textbook_content'
        AND column_name = 'pdf_url'
    ) THEN
        -- Add the pdf_url column if it doesn't exist
        ALTER TABLE textbook_content ADD COLUMN pdf_url TEXT;

        -- Add a comment explaining what this column is for
        COMMENT ON COLUMN textbook_content.pdf_url IS 'URL or path to the source PDF file, e.g. Firebase storage URL';
    END IF;
END $$;
