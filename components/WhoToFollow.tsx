import { groq } from "next-sanity";
import React, { useEffect, useState } from "react";
import sanityClient from "../sanity";
import { User } from "../typings";

const WhoToFollow = () => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    const query = groq`
    *[_type=="user"] | order(_createdAt desc) [0...5] {
        name, 
        image
    }
    `;
    const users = await sanityClient.fetch(query);
    console.log("users", users);
    setUsers(users);
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="bg-[#f7f7f7] rounded-2xl py-3 min-h-[200px]">
      <h1 className="font-bold text-xl px-4">Who To Follow</h1>
      <div className="users mt-5 text-sm">
        {users.map((user) => (
          <div className="user px-4 py-2 flex gap-2 pb-2 items-center hover:bg-[#eeeeee] cursor-pointer">
            <img
              className="h-8 w-8 xsm:h-10 xsm:w-10 rounded-full"
              src={user.image}
              alt=""
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <div className="font-medium">{user.name}</div>
              <div>@{user.name?.split(" ").join("").toLowerCase()}</div>
            </div>
            <div>
              <button className="bg-[#000] text-[#fff] font-medium py-1 px-4 rounded-full">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhoToFollow;
