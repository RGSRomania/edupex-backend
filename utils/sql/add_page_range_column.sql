-- SQL script to add the missing page_range column to the textbook_content table

-- First check if the column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'textbook_content'
        AND column_name = 'page_range'
    ) THEN
        -- Add the page_range column if it doesn't exist
        ALTER TABLE textbook_content ADD COLUMN page_range TEXT;

        -- Add a comment explaining what this column is for
        COMMENT ON COLUMN textbook_content.page_range IS 'Range of pages for this content, e.g. "1-5" or "42"';
    END IF;
END $$;
