import React from "react";
import type { IconType } from "react-icons";

interface Props {
  icon: IconType;
  text: string;
}
function NavItem({ icon: Icon, text }: Props) {
  return (
    <div className="flex 2xl:gap-2 p-3 cursor-pointer rounded-full items-center hover:bg-[#eaeaea]">
      <Icon className="text-2xl" />
      <p className="hidden 2xl:block">{text}</p>
    </div>
  );
}

export default NavItem;
