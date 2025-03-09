import { ClassroomEnum } from "@/constants/class-enum";
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
  const classroom = user?.unsafeMetadata.classroom as ClassroomEnum;

  // Check if role and classroom is not null
  if (!role || !classroom) {
    return null;
  }

  return { role, classroom };
}

export default userHelper