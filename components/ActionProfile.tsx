import React from "react";
import { useAuthContext } from "../context/authContext";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { googleLogout } from "@react-oauth/google";
import { useUserContext } from "../context/userContext";

const ActionProfile = () => {
  const { logout } = useAuthContext();
  const { user } = useUserContext();

  const handleGoogleLogout = () => {
    console.log("logging out...");
    googleLogout();
    logout();
  };
  return (
    <div
      className="Logout-menu cursor-pointer flex p-3 rounded-full mt-auto hover:bg-[#eaeaea]"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <Menu
        menuButton={
          <img
            className="h-8 w-8 xsm:h-10 xsm:w-10 rounded-full"
            src={user.image}
            alt=""
            referrerPolicy="no-referrer"
          />
        }
        transition
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem onClick={handleGoogleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default ActionProfile;
