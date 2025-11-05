// src/db/schema.ts

import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations, InferSelectModel, InferInsertModel } from "drizzle-orm";

// Helpers

// Store timestamps as epoch seconds (INTEGER); default to current time.
const now = () => sql`(unixepoch())`;

// Enum-ish sets (Drizzle turns these into CHECK constraints for SQLite)
export const difficultyValues = ["beginner", "intermediate", "advanced"] as const;
export const mediaTypeValues = ["youtube", "markdown", "pdf", "image", "audio", "other"] as const;
export const userRoleValues   = ["student", "instructor", "admin"] as const;

export const users = sqliteTable("users", {
  userId:      text("user_id").primaryKey(),                 // supply from app (UUID/ULID/etc.)
  provider:    text("provider").notNull(),                   // e.g. "better-auth"
  subject:     text("subject").notNull(),                    // external stable id
  email:       text("email"),                                // optional; not all providers give one
  displayName: text("display_name"),

  createdAt:   integer("created_at", { mode: "timestamp" }).notNull().default(now()),
  updatedAt:   integer("updated_at", { mode: "timestamp" }).notNull().default(now()),
}, (t) => ({
  // No duplicate identity pairs:
  uniqProviderSubject: {
    name: "users_provider_subject_unique",
    columns: [t.provider, t.subject],
    unique: true,
  },
}));

export const profiles = sqliteTable("profiles", {
  profileId: text("profile_id").primaryKey(),                // supply from app
  userId:    text("user_id").notNull().references(() => users.userId, { onDelete: "cascade" }),
  role:      text("role", { enum: userRoleValues }).notNull().default("student"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(now()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(now()),
}, (t) => ({
  uniqUser: {
    name: "profiles_user_unique",
    columns: [t.userId],
    unique: true,
  },
}));

// Tags
export const tags = sqliteTable("tags", {
  tagId:    text("tag_id").primaryKey(),
  tagName:  text("tag_name").notNull(), // use lower-cased names in app if you want case-insensitive behavior
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(now()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(now()),
}, (t) => ({
  uniqTagName: {
    name: "tags_name_unique",
    columns: [t.tagName],
    unique: true,
  },
}));

// Courses
export const courses = sqliteTable("courses", {
  courseId:   text("course_id").primaryKey(),
  title:      text("title").notNull(),
  description:text("description"),
  difficulty: text("difficulty", { enum: difficultyValues }).notNull().default("beginner"),
  createdBy:  text("created_by").references(() => users.userId, { onDelete: "set null" }),

  createdAt:  integer("created_at", { mode: "timestamp" }).notNull().default(now()),
  updatedAt:  integer("updated_at", { mode: "timestamp" }).notNull().default(now()),

}, (t) => ({
  titleLenCheck: {
    where: sql`length(${t.title}) BETWEEN 3 AND 200`,
  },
}));

// Many-to-many: Course <-> Tag
export const coursesTags = sqliteTable("courses_tags", {
  courseId: text("course_id").notNull().references(() => courses.courseId, { onDelete: "cascade" }),
  tagId:    text("tag_id").notNull().references(() => tags.tagId, { onDelete: "cascade" }),
  addedAt:  integer("added_at", { mode: "timestamp" }).notNull().default(now()),
}, (t) => ({
  pk: primaryKey({ name: "courses_tags_pk", columns: [t.courseId, t.tagId] }),
}));

// Units (belong to a Course; ordered for clean outlines)
export const units = sqliteTable("units", {
  unitId:    text("unit_id").primaryKey(),
  courseId:  text("course_id").notNull().references(() => courses.courseId, { onDelete: "cascade" }),
  title:     text("title"),
  position:  integer("position").notNull().default(1),

  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(now()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(now()),
}, (t) => ({
  posCheck: { where: sql`${t.position} >= 1` },
}));

// S3 Blobs (metadata only; presigned URLs are generated in the API)
export const blobs = sqliteTable("blobs", {
  blobId:       text("blob_id").primaryKey(),
  bucket:       text("bucket").notNull(),             // e.g., "my-app-prod"
  objectKey:    text("object_key").notNull(),         // e.g., "uploads/u123/lesson-42.md"
  versionId:    text("version_id"),                   // optional, if S3 versioning enabled
  etag:         text("etag"),
  sizeBytes:    integer("size_bytes"),
  contentType:  text("content_type"),
  checksumSha256: text("checksum_sha256"),
  storageClass: text("storage_class"),
  createdBy:    text("created_by").references(() => users.userId, { onDelete: "set null" }),

  isDeleted:    integer("is_deleted", { mode: "boolean" }).notNull().default(0),
  deletedAt:    integer("deleted_at", { mode: "timestamp" }),
  createdAt:    integer("created_at", { mode: "timestamp" }).notNull().default(now()),
  updatedAt:    integer("updated_at", { mode: "timestamp" }).notNull().default(now()),
}, (t) => ({

  uniqObject: {
    name: "blobs_object_unique",
    columns: [t.bucket, t.objectKey, t.versionId],
    unique: true,
  },
}));

// Lessons (belong to a Unit)
// Exactly one of (contentUrl, contentBlobId) must be present.
export const lessons = sqliteTable("lessons", {
  lessonId:       text("lesson_id").primaryKey(),
  unitId:         text("unit_id").notNull().references(() => units.unitId, { onDelete: "cascade" }),
  mediaType:      text("media_type", { enum: mediaTypeValues }).notNull().default("markdown"),

  contentUrl:     text("content_url"),                        // e.g., https://youtube.com/...
  contentBlobId:  text("content_blob_id").references(() => blobs.blobId, { onDelete: "set null" }),

  metadata:       text("metadata").notNull().default("{}"),   // store JSON string; parse in app
  position:       integer("position").notNull().default(1),

  createdAt:      integer("created_at", { mode: "timestamp" }).notNull().default(now()),
  updatedAt:      integer("updated_at", { mode: "timestamp" }).notNull().default(now()),
}, (t) => ({

  contentPresenceCheck: {
    where: sql`( (${t.contentUrl} IS NOT NULL AND ${t.contentBlobId} IS NULL)
              OR (${t.contentUrl} IS NULL AND ${t.contentBlobId} IS NOT NULL) )`,
  },

  urlShapeCheck: {
    where: sql`(${t.contentUrl} IS NULL OR ${t.contentUrl} GLOB 'http*://*')`,
  },
  posCheck: { where: sql`${t.position} >= 1` },
}));

// Attachments (belong to a Lesson; may be external URL or S3 blob)
export const attachments = sqliteTable("attachments", {
  attachmentId: text("attachment_id").primaryKey(),
  lessonId:     text("lesson_id").notNull().references(() => lessons.lessonId, { onDelete: "cascade" }),
  title:        text("title"),
  mediaType:    text("media_type", { enum: mediaTypeValues }).notNull().default("other"),

  blobId:       text("blob_id").references(() => blobs.blobId, { onDelete: "set null" }),
  externalUrl:  text("external_url"),

  metadata:     text("metadata").notNull().default("{}"),

  createdAt:    integer("created_at", { mode: "timestamp" }).notNull().default(now()),
  updatedAt:    integer("updated_at", { mode: "timestamp" }).notNull().default(now()),
}, (t) => ({

  sourcePresenceCheck: {
    where: sql`( (${t.blobId} IS NOT NULL AND ${t.externalUrl} IS NULL)
              OR (${t.blobId} IS NULL AND ${t.externalUrl} IS NOT NULL) )`,
  },
  urlShapeCheck: {
    where: sql`(${t.externalUrl} IS NULL OR ${t.externalUrl} GLOB 'http*://*')`,
  },
}));

// Relations (optional but nice for type-safe eager loading)
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.userId], references: [profiles.userId] }),
  blobs:   many(blobs),
  courses: many(courses), // via createdBy
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.userId] }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  coursesTags: many(coursesTags),
}));

export const coursesRelations = relations(courses, ({ many, one }) => ({
  units: many(units),
  tags:  many(coursesTags),
  author: one(users, { fields: [courses.createdBy], references: [users.userId] }),
}));

export const coursesTagsRelations = relations(coursesTags, ({ one }) => ({
  course: one(courses, { fields: [coursesTags.courseId], references: [courses.courseId] }),
  tag:    one(tags,    { fields: [coursesTags.tagId],    references: [tags.tagId] }),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  course:  one(courses, { fields: [units.courseId], references: [courses.courseId] }),
  lessons: many(lessons),
}));

export const blobsRelations = relations(blobs, ({ one, many }) => ({
  creator:    one(users, { fields: [blobs.createdBy], references: [users.userId] }),
  lessonUse:  many(lessons),
  attachUse:  many(attachments),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit:       one(units, { fields: [lessons.unitId], references: [units.unitId] }),
  blob:       one(blobs, { fields: [lessons.contentBlobId], references: [blobs.blobId] }),
  attachments: many(attachments),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  lesson: one(lessons, { fields: [attachments.lessonId], references: [lessons.lessonId] }),
  blob:   one(blobs,   { fields: [attachments.blobId],   references: [blobs.blobId] }),
}));

// Inferred types (handy in services/routes)
export type User            = InferSelectModel<typeof users>;
export type NewUser         = InferInsertModel<typeof users>;

export type Profile         = InferSelectModel<typeof profiles>;
export type NewProfile      = InferInsertModel<typeof profiles>;

export type Tag             = InferSelectModel<typeof tags>;
export type NewTag          = InferInsertModel<typeof tags>;

export type Course          = InferSelectModel<typeof courses>;
export type NewCourse       = InferInsertModel<typeof courses>;

export type CourseTag       = InferSelectModel<typeof coursesTags>;
export type NewCourseTag    = InferInsertModel<typeof coursesTags>;

export type Unit            = InferSelectModel<typeof units>;
export type NewUnit         = InferInsertModel<typeof units>;

export type BlobRow         = InferSelectModel<typeof blobs>;
export type NewBlobRow      = InferInsertModel<typeof blobs>;

export type Lesson          = InferSelectModel<typeof lessons>;
export type NewLesson       = InferInsertModel<typeof lessons>;

export type Attachment      = InferSelectModel<typeof attachments>;
export type NewAttachment   = InferInsertModel<typeof attachments>;

export * from "./auth-schema";