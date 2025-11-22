ALTER TABLE `tags` ADD `created_by` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `tags` DROP COLUMN `createdBy`;