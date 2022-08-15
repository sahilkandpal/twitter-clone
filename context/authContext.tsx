import Router from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./userContext";

const AuthContext = createContext({
  auth: "loading",
  login: (token: string) => {},
  logout: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [auth, setAuth] = useState("loading");
  const { setUserData } = useUserContext();

  const verifyToken = async () => {
    const token = localStorage.getItem("twitter-token");
    console.log("verifying...");
    if (token) {
      const res = await fetch("http://localhost:3000/api/auth", {
        method: "POST",
        body: JSON.stringify({
          token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        setAuth("authenticated");
        setUserData(data.user[0]);
      } else setAuth("unauthenticated");
    } else setAuth("unauthenticated");
  };

  const login = async (token: string) => {
    setAuth("loading");
    const res = await fetch("/api/google-login", {
      method: "POST",
      body: JSON.stringify({
        token,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("twitter-token", data.token);
      setAuth("authenticated");
      Router.replace("/home");
    }
    console.log("data->", data);
  };

  const logout = () => {
    console.log("real logout");
    localStorage.removeItem("twitter-token");
    setAuth("unauthenticated");
    Router.replace("/");
  };

  console.log("auth", auth);

  useEffect(() => {
    verifyToken();
  }, []);
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};
