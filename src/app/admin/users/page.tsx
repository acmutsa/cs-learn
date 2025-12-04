import Usertable from "@/components/admin/user/userTable";
import { getAllRegularUsers } from "@/actions/admin/user"; 

export default async function Page() {
  const users = await getAllRegularUsers();

  return (
    <div>
      <h1>Regular Users</h1>
      <Usertable />
    </div>
  );
}
