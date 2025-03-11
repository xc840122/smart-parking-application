import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export const useMetadata = () => {

  const { isSignedIn, user, isLoaded } = useUser()
  const [status, setStatus] = useState<'loading' | 'unAuthenticated' | 'authenticated'>('loading');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  console.log("usermeta", user?.id);
  useEffect(() => {
    if (!isLoaded) {
      setStatus('loading');
      return;
    } else if (!isSignedIn) {
      setStatus('unAuthenticated');
      return;
    }
    else if (user && (user.unsafeMetadata.role || user.unsafeMetadata.classroom)) {
      setStatus('authenticated');
      setRole(user.unsafeMetadata.role as 'user' | 'admin');
      return;
    } else {
      return;
    }

  }, [isSignedIn, isLoaded, user]);
  return { status, role, user };
}