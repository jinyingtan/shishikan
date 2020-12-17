import React, { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import { firebaseAuth, firebase } from '@utils/firebase';

const AuthContext = createContext({
  user: null,
});

export function AuthProvider({ children, ...props }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      window.nookies = nookies;
    }
    return firebaseAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        console.log('NO USER');
        setUser(null);
        nookies.destroy(null, 'token');
        nookies.set(null, 'token', '', {});
        return;
      }

      const token = await user.getIdToken();
      setUser(user);
      nookies.destroy(null, 'token');
      nookies.set(null, 'token', token, {});
    });
  }, []);

  useEffect(() => {
    if (props.user) {
      setUser(props.user);
    }
  }, []);

  // force refresh the token every 45 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      console.log(`refreshing token...`);
      const user = firebase.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 45 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
