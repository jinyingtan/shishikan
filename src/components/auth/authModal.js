import React, { useContext, createContext } from 'react';
import { useDisclosure } from '@chakra-ui/react';

const AuthModalContext = createContext({
  login: null,
  register: null,
});

export function AuthModalProvider({ children }) {
  const login = useDisclosure();
  const register = useDisclosure();

  return (
    <AuthModalContext.Provider
      value={{
        login,
        register,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  return useContext(AuthModalContext);
};
