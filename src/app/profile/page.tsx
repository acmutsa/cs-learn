// src/app/profile/page.tsx
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const userId = session.user.id as any;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    redirect("/");
  }

  const displayName = user.name ?? "";
  const email = user.email ?? "";
  const image = user.image ?? null;

  const initials =
    displayName && displayName.trim().length > 0
      ? displayName
          .split(" ")
          .map((part: string) => part[0])
          .join("")
          .toUpperCase()
      : "U";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <ProfileForm
        name={displayName}
        email={email}
        image={image}
        initials={initials}
      />
    </div>
  );
}
