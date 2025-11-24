// src/db/schema.ts

import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  check,
  index,
  unique,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations, InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, accounts } from "./auth-schema";

// Helpers

// Store timestamps as epoch seconds (INTEGER); default to current time.
const now = () => sql`(unixepoch())`;

// Enum-ish sets (Drizzle turns these into CHECK constraints for SQLite)
export const difficultyValues = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export const mediaTypeValues = [
  "youtube",
  "markdown",
  "pdf",
  "image",
  "audio",
  "other",
] as const;
export const userRoleValues = ["student", "instructor", "admin"] as const;

// Tags
export const tags = sqliteTable(
  "tags",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    tagName: text("tag_name").notNull().unique(),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
  },
  (t) => [check("tags_tag_name_check", sql`${t.tagName} IS NOT NULL`)]
);

// Courses
export const courses = sqliteTable("courses", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: text("difficulty", { enum: difficultyValues })
    .notNull()
    .default("beginner"),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(now()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(now()),
});

// Many-to-many: Course <-> Tag
export const coursesTags = sqliteTable(
  "courses_tags",
  {
    courseId: integer({ mode: "number" })
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    tagId: integer({ mode: "number" })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    addedAt: integer("added_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
  },
  (t) => [
    primaryKey({ name: "courses_tags_pk", columns: [t.courseId, t.tagId] }),
  ]
);

// Units (belong to a Course; ordered for clean outlines)
export const units = sqliteTable(
  "units",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title"),
    position: integer("position").notNull().default(1),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
  },
  (t) => [
    check("units_position_check", sql`${t.position} >= 1`),
    index("units_position_index").on(sql`${t.position}`),
  ]
);

// S3 Blobs (metadata only; presigned URLs are generated in the API)
export const blobs = sqliteTable(
  "blobs",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    bucket: text("bucket").notNull(), // e.g., "my-app-prod"
    objectKey: text("object_key").notNull(), // e.g., "uploads/u123/lesson-42.md"
    versionId: text("version_id"), // optional, if S3 versioning enabled
    etag: text("etag"),
    sizeBytes: integer("size_bytes"),
    contentType: text("content_type"),
    checksumSha256: text("checksum_sha256"),
    storageClass: text("storage_class"),
    createdBy: integer({ mode: "number" }).references(() => users.id, {
      onDelete: "set null",
    }),

    isDeleted: integer("is_deleted", { mode: "boolean" })
      .notNull()
      .default(false),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
  },
  (t) => [unique("blobs_unique").on(t.bucket, t.objectKey, t.versionId)]
);

// Lessons (belong to a Unit)
// Exactly one of (contentUrl, contentBlobId) must be present.
export const lessons = sqliteTable(
  "lessons",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    unitId: integer({ mode: "number" })
      .notNull()
      .references(() => units.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    mediaType: text("media_type", { enum: mediaTypeValues })
      .notNull()
      .default("markdown"),
    contentUrl: text("content_url"), // e.g., https://youtube.com/...
    contentBlobId: integer({ mode: "number" }).references(() => blobs.id, {
      onDelete: "set null",
    }),
    metadata: text("metadata").notNull().default("{}"), // store JSON string; parse in app
    position: integer("position").notNull().default(1),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
  },
  (t) => [
    check("lessons_position_check", sql`${t.position} >= 1`),
    check(
      "lessons_content_presence_check",
      sql`(${t.contentUrl} IS NOT NULL AND ${t.contentBlobId} IS NULL) OR (${t.contentUrl} IS NULL AND ${t.contentBlobId} IS NOT NULL)`
    ),
    check(
      "lessons_url_shape_check",
      sql`(${t.contentUrl} IS NULL OR ${t.contentUrl} GLOB 'http*://*')`
    ),
  ]
);

// Attachments (belong to a Lesson; may be external URL or S3 blob)
export const attachments = sqliteTable(
  "attachments",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    lessonId: integer({ mode: "number" })
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    title: text("title"),
    mediaType: text("media_type", { enum: mediaTypeValues })
      .notNull()
      .default("other"),

    blobId: integer({ mode: "number" }).references(() => blobs.id, {
      onDelete: "set null",
    }),
    externalUrl: text("external_url"),

    metadata: text("metadata").notNull().default("{}"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(now()),
  },
  (t) => [
    check(
      "attachments_source_presence_check",
      sql`( (${t.blobId} IS NOT NULL AND ${t.externalUrl} IS NULL)
              OR (${t.blobId} IS NULL AND ${t.externalUrl} IS NOT NULL) )`
    ),
    check(
      "attachments_url_shape_check",
      sql`(${t.externalUrl} IS NULL OR ${t.externalUrl} GLOB 'http*://*')`
    ),
  ]
);

export const tagsRelations = relations(tags, ({ many, one }) => ({
  coursesTags: many(coursesTags),
  creator: one(users, {
    fields: [tags.createdBy],
    references: [users.id],
  }),
}));

export const coursesRelations = relations(courses, ({ many, one }) => ({
  units: many(units),
  tags: many(coursesTags),
  author: one(users, {
    fields: [courses.createdBy],
    references: [users.id],
  }),
}));

export const coursesTagsRelations = relations(coursesTags, ({ one }) => ({
  course: one(courses, {
    fields: [coursesTags.courseId],
    references: [courses.id],
  }),
  tag: one(tags, { fields: [coursesTags.tagId], references: [tags.id] }),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const blobsRelations = relations(blobs, ({ one, many }) => ({
  creator: one(users, {
    fields: [blobs.createdBy],
    references: [users.id],
  }),
  lessons: many(lessons),
  attachments: many(attachments),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, { fields: [lessons.id], references: [units.id] }),
  blob: one(blobs, {
    fields: [lessons.contentBlobId],
    references: [blobs.id],
  }),
  attachments: many(attachments),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  lesson: one(lessons, {
    fields: [attachments.lessonId],
    references: [lessons.id],
  }),
  blob: one(blobs, {
    fields: [attachments.blobId],
    references: [blobs.id],
  }),
}));

// Inferred types (handy in services/routes)
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

export type Tag = InferSelectModel<typeof tags>;
export type NewTag = InferInsertModel<typeof tags>;

export type Course = InferSelectModel<typeof courses>;
export type NewCourse = InferInsertModel<typeof courses>;

export type CourseTag = InferSelectModel<typeof coursesTags>;
export type NewCourseTag = InferInsertModel<typeof coursesTags>;

export type Unit = InferSelectModel<typeof units>;
export type NewUnit = InferInsertModel<typeof units>;

export type BlobRow = InferSelectModel<typeof blobs>;
export type NewBlobRow = InferInsertModel<typeof blobs>;

export type Lesson = InferSelectModel<typeof lessons>;
export type NewLesson = InferInsertModel<typeof lessons>;

export type Attachment = InferSelectModel<typeof attachments>;
export type NewAttachment = InferInsertModel<typeof attachments>;

export * from "./auth-schema";
