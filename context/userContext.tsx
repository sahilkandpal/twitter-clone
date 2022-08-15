import React, { createContext, useContext, useState } from "react";
import { User } from "../typings";

interface UserContextType {
  user: User;
  setUserData: (value: any) => void;
}
const UserContext = createContext<UserContextType>({
  user: { _id: "", image: "", name: "" },
  setUserData: (value: any) => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState({ _id: "", image: "", name: "" });

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
