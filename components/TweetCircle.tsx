import React from "react";
import { BsTwitter as TwitterIcon } from "react-icons/bs";

interface Props {
  float: boolean;
  onClick: () => void;
}
const TweetCircle = ({ float, onClick }: Props) => {
  return (
    <div
      className={`${
        float ? "fixed bottom-4 right-4 xsm:hidden " : "relative "
      } p-4 rounded-full bg-twitter text-[#fff] w-14 h-14 cursor-pointer`}
      style={{ WebkitTapHighlightColor: "transparent" }}
      onClick={onClick}
    >
      <span className="font-bold text-lg absolute top-[2px] left-2">+</span>
      <TwitterIcon className="h-6 w-6 inline" />
    </div>
  );
};

export default TweetCircle;
