PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_lessons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`unitId` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`media_type` text DEFAULT 'markdown' NOT NULL,
	`content` blob,
	`metadata` text DEFAULT '{}' NOT NULL,
	`position` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`unitId`) REFERENCES `units`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "lessons_position_check" CHECK("__new_lessons"."position" >= 1)
);
--> statement-breakpoint
INSERT INTO `__new_lessons`("id", "unitId", "title", "description", "media_type", "content", "metadata", "position", "created_at", "updated_at") SELECT "id", "unitId", "title", "description", "media_type", "content", "metadata", "position", "created_at", "updated_at" FROM `lessons`;--> statement-breakpoint
DROP TABLE `lessons`;--> statement-breakpoint
ALTER TABLE `__new_lessons` RENAME TO `lessons`;--> statement-breakpoint
PRAGMA foreign_keys=ON;