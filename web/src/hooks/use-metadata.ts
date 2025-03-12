import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export const useMetadata = () => {

  const { isSignedIn, user, isLoaded } = useUser()
  const [state, setState] = useState<'loading' | 'unAuthenticated' | 'authenticated'>('loading');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  console.log("usermeta", user?.id);
  useEffect(() => {
    if (!isLoaded) {
      setState('loading');
      return;
    } else if (!isSignedIn) {
      setState('unAuthenticated');
      return;
    }
    else if (user && (user.unsafeMetadata.role || user.unsafeMetadata.classroom)) {
      setState('authenticated');
      setRole(user.unsafeMetadata.role as 'user' | 'admin');
      return;
    } else {
      return;
    }

  }, [isSignedIn, isLoaded, user]);
  return { state, role, user };
}