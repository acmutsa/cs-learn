import { createSafeActionClient } from "next-safe-action";
//import { getServerSession } from "next-auth/next";
// when the user sign in
async function getUserInfo() {
  
  const mockSession = {
    user: {
      id: "123",
      name: "Test User",
      email: "test@example.com",
      role: "admin", //change to "user" or "admin" to test permissions
    },
  };
  var session = mockSession;

  /*
  const session = await getServerSession();

  if (!session?.user){
    return null
  }
    */
  return session.user; // i'm assuming the user object would look like this {id: "[0-9], role: "admin or null for regular user, ..."}
}

//admin authentication
async function getAdmin() {
  const userInfo = await getUserInfo();
  if (userInfo.role !== "admin"){
    throw new Error("Not authorized");
  } 
  return userInfo;
}

//Public Access (when not signed in)
export const publicAction = createSafeActionClient();


// Protected — must be logged in
export const protectedAction = createSafeActionClient({
  async middleware() {
    const user = await getUserInfo();
    if (!user) throw new Error("You must be signed in.");
    return { user };
  },
});

// Admin — must be admin
export const adminAction = createSafeActionClient({
  async middleware() {
    const user = await getAdmin();
    return { user };
  },
});
