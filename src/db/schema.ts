import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  check,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations, InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, accounts } from "./auth-schema";

const now = () => sql`(unixepoch())`;

export const difficultyValues = ["beginner", "intermediate", "advanced",] as const;
export const mediaTypeValues = [
  "youtube",
  "markdown",
] as const;
export const userRoleValues = ["student", "instructor", "admin"] as const;

export const tags = sqliteTable("tags", {
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

export const coursesTags = sqliteTable("courses_tags", {
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

export const units = sqliteTable("units", {
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

export const lessons = sqliteTable("lessons", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  unitId: integer({ mode: "number" })
    .notNull()
    .references(() => units.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  mediaType: text("media_type", { enum: mediaTypeValues })
    .notNull(),
  content: text("content").notNull(),
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

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, { fields: [lessons.id], references: [units.id] }),
}));

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

export type Lesson = InferSelectModel<typeof lessons>;
export type NewLesson = InferInsertModel<typeof lessons>;

export * from "./auth-schema";
