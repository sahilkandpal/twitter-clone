import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BsTwitter as TwitterIcon } from "react-icons/bs";
import Loader from "../components/Loader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthContextProvider } from "../context/authContext";
import { UserContextProvider } from "../context/userContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const [loader, setLoader] = useState<boolean>(false);
  const handleLoader = (value: boolean) => {
    setLoader(value);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      handleLoader(true);
    });
    router.events.on("routeChangeComplete", () => {
      handleLoader(false);
    });
  });

  return (
    // <SessionProvider session={session}>
    <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_ID}`}>
      <UserContextProvider>
        <AuthContextProvider>
          {loader && (
            <div className="w-full h-screen flex flex-col justify-center items-center">
              <Loader />
            </div>
          )}
          <Component {...pageProps} />
        </AuthContextProvider>
      </UserContextProvider>
    </GoogleOAuthProvider>
    // </SessionProvider>
  );
}

export default MyApp;
