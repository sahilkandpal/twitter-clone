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

interface Props {
  tweets: Tweet[];
}

const Home: React.FC<Props> = ({ tweets }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="h-full">
      <Head>
        <title>twitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-full">
        <Sidebar setShowModal={setShowModal} />
        <Feed
          tweets={tweets}
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <div className="py-3 pl-7 lg:flex-[0.285]">
          <WhoToFollow />
        </div>
      </main>

      <TweetCircle float={true} onClick={() => setShowModal(true)} />
    </div>
  );
};

export async function getServerSideProps() {
  const query = groq`
  *[_type=="tweet"] | order(_createdAt desc){
    _id,
    ...,
    "media": {"url": media.asset->url,"_ref": media.asset._ref },
    "user": {"name": user->name, "image": user->image}
  }
  `;
  const tweets = await sanityClient.fetch(query);

  return {
    props: { tweets },
  };
}

export default withProtected(Home);
