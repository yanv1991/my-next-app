-- Migration number: 0002 	 2025-11-19T12:06:06.085Z
-- Change Navigation.id from TEXT to INTEGER

-- Create new table with INTEGER id
CREATE TABLE "Navigation_new" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- Copy data from old table (if any exists)
-- Note: TEXT ids cannot be converted to INTEGER, so we'll start fresh
-- If you have data you want to preserve, you'll need to handle the conversion manually

-- Drop old table
DROP TABLE "Navigation";

-- Rename new table to original name
ALTER TABLE "Navigation_new" RENAME TO "Navigation";
