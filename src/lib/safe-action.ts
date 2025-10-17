import {
  createSafeActionClient,
  returnValidationErrors,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { headers } from "next/headers";
import { roles } from "./types";
import { user_data } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
//import { getServerSession } from "next-auth/next";
// when the user sign in

async function getUser() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });
  if (!user) throw new Error("You must be signed in.");
  return user;
}

// Base clients
export const actionClient = createSafeActionClient({
  handleServerError: (e, utils) => {
    console.error("Action error:", e.message);

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const protectedClient = actionClient.use(async ({ next }) => {
  const { user } = await getUser();
  if (!user) {
    return returnValidationErrors(z.null(), {
      _errors: ["Unauthenticated"],
    });
  }
  const userData = await db.query.user_data.findFirst({
    where: eq(user_data.userId, user.id),
  });
  if (!userData) {
    return returnValidationErrors(z.null(), {
      _errors: ["User data not found."],
    });
  }
  return next({
    ctx: {
      userRole: userData.role as (typeof roles)[number],
      userId: user.id,
    },
  });
});

export const adminClient = protectedClient.use(async ({ next, ctx }) => {
  if (ctx.userRole !== "admin") {
    return returnValidationErrors(z.null(), {
      _errors: ["Not authorized."],
    });
  }
  return next({ ctx });
});
