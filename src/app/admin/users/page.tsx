import Usertable from "@/components/admin/user/Usertable";
import { getAllUsers, getAllRegularUsers } from "@/actions/admin/user";
import { auth } from "@/lib/auth"
import { headers } from "next/headers";


export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const isSuperAdmin = session?.user.role === "super admin";


  const users = isSuperAdmin ? await getAllUsers() : await getAllRegularUsers();

  return (
    <div>
      <h1>Regular Users</h1>
      <Usertable user= {users} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
