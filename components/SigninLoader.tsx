import React from "react";
import { BsTwitter as TwitterIcon } from "react-icons/bs";

const SigninLoader = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <TwitterIcon className="text-[4rem] text-twitter animate-bounce" />
      <div className="font-medium">Logging in</div>
    </div>
  );
};

export default SigninLoader;
