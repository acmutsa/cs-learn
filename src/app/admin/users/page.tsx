import UserTable from "@/components/admin/user/userTable";
import { getAllUsers, getAllRegularUsers } from "@/actions/admin/user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isSuperAdmin = session?.user.role === "admin";

  const users = isSuperAdmin ? await getAllUsers() : await getAllRegularUsers();

  return (
    <div>
      <h1>Regular Users</h1>
      <UserTable user={users} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
