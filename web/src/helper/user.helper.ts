import { auth, currentUser } from "@clerk/nextjs/server"

export const userHelper = async () => {

  const { userId } = await auth();
  const clerkUserId = userId; //avoid confusion with the user ID in the database
  // Get current login user
  const user = await currentUser();

  // Get user role and classroom
  const role = user?.unsafeMetadata.role as string;

  return { role, clerkUserId };
};