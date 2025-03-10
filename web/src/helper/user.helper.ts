import { auth, currentUser } from "@clerk/nextjs/server"

export const userHelper = async () => {

  const { userId } = await auth();
  // Check if user is signed in
  if (!userId) {
    return null;
  }
  // Get current login user
  const user = await currentUser();

  // Get user role and classroom
  const role = user?.unsafeMetadata.role as string;


  // Check if role and classroom is not null
  if (!role) {
    return null;
  }

  return { role };
}

export default userHelper