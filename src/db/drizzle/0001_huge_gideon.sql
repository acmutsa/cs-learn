PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_units` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`title` text,
	`position` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "units_position_check" CHECK("__new_units"."position" >= 1)
);
--> statement-breakpoint
INSERT INTO `__new_units`("id", "course_id", "title", "position", "created_at", "updated_at") SELECT "id", "course_id", "title", "position", "created_at", "updated_at" FROM `units`;--> statement-breakpoint
DROP TABLE `units`;--> statement-breakpoint
ALTER TABLE `__new_units` RENAME TO `units`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `units_position_index` ON `units` (`"position"`);--> statement-breakpoint
ALTER TABLE `lessons` ADD `title` text NOT NULL;--> statement-breakpoint
ALTER TABLE `lessons` ADD `description` text;