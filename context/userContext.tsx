import React, { createContext, useContext, useState } from "react";

const UserContext = createContext({
  user: {},
  setUserData: (value: any) => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState({});

  const setUserData = (value: any) => {
    setUser(value);
  };

  console.log(user);

  return (
    <UserContext.Provider value={{ user, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const userData = useContext(UserContext);
  return userData;
};
