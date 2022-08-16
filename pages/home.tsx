import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import { groq } from "next-sanity";
import sanityClient from "../sanity";
import { Tweet } from "../typings";
import withProtected from "../hooks/withProtected";
import TweetCircle from "../components/TweetCircle";
import { useState } from "react";
import { useModal } from "react-hooks-use-modal";
import TweetBox from "../components/TweetBox";
import WhoToFollow from "../components/WhoToFollow";

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="h-full">
      <Head>
        <title>twitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-full">
        <Sidebar setShowModal={setShowModal} />
        <Feed showModal={showModal} setShowModal={setShowModal} />
        <div className="hidden lg:block py-3 pl-7 lg:flex-[0.285]">
          <WhoToFollow />
        </div>
      </main>

      <TweetCircle float={true} onClick={() => setShowModal(true)} />
    </div>
  );
};

export default withProtected(Home);
