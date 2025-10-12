import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const roles = ['user', 'admin'] as const;
type Role = typeof roles[number]

export const usersTable = sqliteTable("users_table", {
    id: int().primaryKey({autoIncrement: true}),
    email: text().notNull().unique(),
    password_hash: text().notNull(),
    name: text().notNull(),
    role: text({ enum: roles }).notNull().default('user'),
    phone_number: text().unique()
})