// import { useSession } from "next-auth/react";
import jwtDecode from "jwt-decode";
import Router from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import Signin from "../components/Signin";
import SigninLoader from "../components/SigninLoader";
import { useAuthContext } from "../context/authContext";

function withProtected(Component: React.FC<any>) {
  return function WithProtected(props: any) {
    const { auth } = useAuthContext();

    if (auth == "loading") return <SigninLoader />;

    if (auth == "authenticated") return <Component {...props} />;
    else {
      Router.replace("/");
      return <></>;
    }
  };
}

export default withProtected;
