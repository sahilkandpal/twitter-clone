import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import TweetBox from "./TweetBox";
import TweetComp from "./Tweet";
import { Tweet } from "../typings";
import Modal from "./Modal";
import ActionProfile from "./ActionProfile";

interface Props {
  tweets: Tweet[];
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

function Feed({ tweets: tweetsProp, showModal, setShowModal }: Props) {
  const [tweets, setTweets] = useState(tweetsProp);
  console.log("tweets", tweets);
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
