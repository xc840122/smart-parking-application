import { auth, currentUser } from "@clerk/nextjs/server"

export const userHelper = async () => {

  const { userId } = await auth();

  // Get current login user
  const user = await currentUser();

  // Get user role and classroom
  const role = user?.unsafeMetadata.role as string;

  return { role, userId };
};