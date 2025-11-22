'use server';
import { tags, users, coursesTags } from "@/db/schema";
import { type TagFormValues } from "@/lib/validations/course";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { CreateTagResponse } from "@/lib/types";

import { TagWithStats } from "@/lib/types";

export async function createTag(data: TagFormValues): Promise<CreateTagResponse> {
    const user = await auth.api.getSession({
        headers: await headers()
    });
    if (!user) throw new Error("Unauthorized");
    try {
        const existingTag = await db.select().from(tags).where(eq(tags.tagName, data.tagName));
        if (existingTag.length > 0){
            return { success: false, message: "Tag already made"};
        }
        await db.insert(tags).values({
            tagName: data.tagName,
            createdBy: user.user.id,
        });
        return { success: true, message: "Tag created successfully!" };
    } catch (error) {
        return { success: false, message: "Failed to create tag"}
    }
}

export async function getAllTags(): Promise<TagWithStats[]> {
    const result = await db
        .select({
            id: tags.id,
            tagName: tags.tagName,
            createdBy: users.name,
            courseCount: sql<number>`CAST(COUNT(${coursesTags.courseId}) AS INTEGER)`,
        })
        .from(tags)
        .leftJoin(users, eq(users.id, tags.createdBy))
        .leftJoin(coursesTags, eq(coursesTags.tagId, tags.id))
        .groupBy(tags.id);

    return result;
}