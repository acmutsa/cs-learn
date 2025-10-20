import {
  createSafeActionClient,
  returnValidationErrors,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { headers } from "next/headers";
import { Role, roles } from "./types";
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
  if (!roles.includes(user.role as Role)) {
    return returnValidationErrors(z.null(), {
      _errors: ["Invalid user role."],
    });
  }
  return next({
    ctx: {
      userRole: user.role,
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
