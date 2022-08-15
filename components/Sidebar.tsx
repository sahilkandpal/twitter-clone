import React, { Dispatch, SetStateAction } from "react";
import NavItem from "./NavItem";
import { FaTwitter as TwitterIcon } from "react-icons/fa";
import { RiHome7Fill as HomeIcon } from "react-icons/ri";
import { FiHash as HashIcon } from "react-icons/fi";
import { GrNotification as NotificationIcon } from "react-icons/gr";
import { FaRegEnvelope as EnvelopeIcon } from "react-icons/fa";
import { IoPersonOutline as PersonIcon } from "react-icons/io5";
import { TbDotsCircleHorizontal as MenuIcon } from "react-icons/tb";
import { useAuthContext } from "../context/authContext";
import { useUserContext } from "../context/userContext";

import TweetCircle from "./TweetCircle";
import ActionProfile from "./ActionProfile";

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

function Sidebar({ setShowModal }: Props) {
  const { user } = useUserContext();

  return (
    <aside className="hidden sidebar lg:flex-[0.155] xsm:flex flex-col justify-between py-2 h-screen sticky top-0">
      <div className="sidebar-nav px-1 flex justify-center md:justify-end h-full">
        <div className="flex flex-col items-center 2xl:items-start h-full w-[max-content]">
          <div className="p-3 rounded-full flex hover:bg-[#d5eefe] cursor-pointer">
            <TwitterIcon className="text-twitter text-3xl" />
          </div>
          <NavItem icon={HomeIcon} text="Home" />
          <NavItem icon={HashIcon} text="Explore" />
          <NavItem icon={NotificationIcon} text="Notifications" />
          <NavItem icon={EnvelopeIcon} text="Messages" />
          <NavItem icon={PersonIcon} text="Profile" />
          <NavItem icon={MenuIcon} text="Menu" />
          <TweetCircle float={false} onClick={() => setShowModal(true)} />
          <ActionProfile />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
