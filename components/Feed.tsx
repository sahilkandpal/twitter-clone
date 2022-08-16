import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import TweetBox from "./TweetBox";
import TweetComp from "./Tweet";
import { Tweet } from "../typings";
import Modal from "./Modal";
import ActionProfile from "./ActionProfile";
import { groq } from "next-sanity";
import sanityClient from "../sanity";
import { useUserContext } from "../context/userContext";

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

function Feed({ showModal, setShowModal }: Props) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const { user } = useUserContext();
  console.log("tweets", tweets);

  const getFeed = async () => {
    const query = groq`
  *[_type=="tweet"] | order(_createdAt desc){
    _id,
    ...,
    "media": {"url": media.asset->url,"_ref": media.asset._ref },
    "user": {"name": user->name, "image": user->image},
    "commCount": count(*[_type=="comment" && references(^._id)]),
    "likeCount": count(*[_type=="like" && references(^._id)]),
    "myLike": *[_type=="like" && references('${user._id}') && references(^._id)] [0]{
      _id
    },
    
  }
  `;
    const tweets = await sanityClient.fetch(query);
    setTweets(tweets);
  };

  useEffect(() => {
    console.log("getting feed");
    getFeed();
  }, []);
  return (
    <>
      <main className="flex-1 lg:flex-[0.475] border-x-[1px] border-x-[lightgray]">
        <div className="flex items-center">
          <div className="xsm:hidden">
            <ActionProfile />
          </div>
          <h1 className="text-lg xsm:text-xl font-medium p-1 xsm:p-4">Home</h1>
        </div>
        <div className="hidden xsm:block">
          <TweetBox key="1" setTweets={setTweets} />
        </div>
        <div>
          {tweets?.map((tweet) => (
            <TweetComp key={tweet._id} tweet={tweet} />
          ))}
        </div>
      </main>

      <Modal isOpen={showModal} close={() => setShowModal(false)}>
        <TweetBox
          key="2"
          setTweets={setTweets}
          type="modal"
          close={() => setShowModal(false)}
        />
      </Modal>

      {/* <div className="w-[100%] bg-[#fff] rounded-lg overflow-hidden">
          <TweetBox setTweets={setTweets} textHeight="h-32" />
        </div> */}
    </>
  );
}

export default Feed;
