CREATE TABLE IF NOT EXISTS `attachments` (
	`attachment_id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`title` text,
	`media_type` text DEFAULT 'other' NOT NULL,
	`blob_id` text,
	`external_url` text,
	`metadata` text DEFAULT '{}' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`lesson_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`blob_id`) REFERENCES `blobs`(`blob_id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `blobs` (
	`blob_id` text PRIMARY KEY NOT NULL,
	`bucket` text NOT NULL,
	`object_key` text NOT NULL,
	`version_id` text,
	`etag` text,
	`size_bytes` integer,
	`content_type` text,
	`checksum_sha256` text,
	`storage_class` text,
	`created_by` text,
	`is_deleted` integer DEFAULT 0 NOT NULL,
	`deleted_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `courses` (
	`course_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`difficulty` text DEFAULT 'beginner' NOT NULL,
	`created_by` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `courses_tags` (
	`course_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`added_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`course_id`, `tag_id`),
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`tag_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `lessons` (
	`lesson_id` text PRIMARY KEY NOT NULL,
	`unit_id` text NOT NULL,
	`media_type` text DEFAULT 'markdown' NOT NULL,
	`content_url` text,
	`content_blob_id` text,
	`metadata` text DEFAULT '{}' NOT NULL,
	`position` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`unit_id`) REFERENCES `units`(`unit_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`content_blob_id`) REFERENCES `blobs`(`blob_id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `profiles` (
	`profile_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'student' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `tags` (
	`tag_id` text PRIMARY KEY NOT NULL,
	`tag_name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `units` (
	`unit_id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`title` text,
	`position` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`subject` text NOT NULL,
	`email` text,
	`display_name` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
