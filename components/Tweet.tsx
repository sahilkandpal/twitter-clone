import React, { useEffect, useState } from "react";
import { TbMessageCircle2 as CommentIcon } from "react-icons/tb";
import { AiOutlineRetweet as RetweetIcon } from "react-icons/ai";
import {
  AiOutlineHeart as OutlineHeartIcon,
  AiFillHeart as FillHeartIcon,
} from "react-icons/ai";
import { BsUpload as UploadIcon } from "react-icons/bs";
import { Tweet } from "../typings";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useUserContext } from "../context/userContext";
import sanityClient from "../sanity";
import { groq } from "next-sanity";
import CommentBox from "./CommentBox";

TimeAgo.addDefaultLocale(en);

interface Props {
  tweet: Tweet;
}

function Tweet({ tweet }: Props) {
  const imgTypes = ["png", "jpg", "gif", "jpeg"];
  const vidTypes = ["mp4", "mov"];
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [like, setLike] = useState({ _id: null, val: false });
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commCount, setCommCount] = useState<number | null>(null);

  const { user } = useUserContext();
  const getMediaType = () => {
    const ext = tweet.media?._ref.split("-")[2];
    if (!ext) return false;
    if (imgTypes.includes(ext)) setMediaType("img");
    if (vidTypes.includes(ext)) setMediaType("vid");
  };

  useEffect(() => {
    if (tweet.media?._ref) getMediaType();
  }, [tweet]);

  const fetchLike = async () => {
    const query = groq`
  *[_type=="like" && references('${user._id}') && references('${tweet._id}')]{
    _id
  }`;
    const fLike = await sanityClient.fetch(query);

    console.log("fetched like: ", fLike);

    fLike.length > 0
      ? setLike({ _id: fLike[0]._id, val: true })
      : setLike({ _id: null, val: false });
  };

  const getLikes = async () => {
    const query = groq`count(*[_type=="like" && references('${tweet._id}')])`;
    const tLikes = await sanityClient.fetch(query);
    console.log("total likes: ", tLikes);
    setLikeCount(tLikes);
  };

  useEffect(() => {
    fetchLike();
    getLikes();
    getCommCount();
  }, []);

  console.log("mediaType", mediaType, tweet);

  const likeTweet = async () => {
    setLike({ _id: null, val: true });
    if (likeCount !== null) setLikeCount(likeCount + 1);
    const doc = {
      _type: "like",
      user: {
        _type: "postedBy",
        _ref: user._id,
      },
      tweet: {
        _type: "reference",
        _ref: tweet._id,
      },
    };
    try {
      const CLike = await sanityClient.create(doc);
      console.log("like created", CLike);
      setLike({ _id: CLike._id, val: true });
    } catch (err) {
      setLike({ _id: null, val: false });
      console.log("error: ", err);
    }
  };

  const unlikeTweet = async () => {
    setLike({ _id: null, val: false });
    if (likeCount && likeCount > 0) setLikeCount(likeCount - 1);
    await sanityClient.delete(`${like._id}`);
    console.log("deleted like");
  };

  const toggleComment = () => {
    setShowComment(!showComment);
  };

  const fetchComments = async () => {
    const query = groq`
    *[_type=="comment" && references('${tweet._id}')]  | order(_createdAt desc) [0...3] {
        _id,
        "user": {"name": user->name, "image": user->image},
        comment,
        _createdAt
    }
    `;

    const fComm = await sanityClient.fetch(query);
    console.log("fComm", fComm);
    setComments(fComm);
  };

  const fetchMoreComments = async () => {
    const lastId = comments[comments.length - 1]._id;
    const index =
      commCount - comments.length > 3 ? comments.length + 3 : commCount;
    const query = groq`
    *[_type=="comment" && references('${tweet._id}')]  | order(_createdAt desc) [${comments.length}...${index}] {
        _id,
        "user": {"name": user->name, "image": user->image},
        comment,
        _createdAt
    }
    `;

    const fMoreComm = await sanityClient.fetch(query);
    console.log("fMoreComm", fMoreComm);
    setComments([...comments, ...fMoreComm]);
  };

  const getCommCount = async () => {
    const query = groq`count(*[_type=="comment" && references('${tweet._id}')])`;
    const commCount = await sanityClient.fetch(query);
    setCommCount(commCount);
  };

  return (
    <div className="flex space-x-2 px-4 py-2 border-y-[1px] border-[lightgray]">
      <img
        className="h-12 w-12 rounded-full"
        src={tweet.user.image}
        alt=""
        referrerPolicy="no-referrer"
      />
      <div className="flex-1 min-w-0">
        <div className="flex gap-2">
          <h1 className="font-bold min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {tweet.user.name}
          </h1>
          <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            @{tweet.user.name?.split(" ").join("").toLowerCase()}
          </div>
          <div className="">
            <ReactTimeAgo
              className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
              date={new Date(tweet._updatedAt)}
              locale="en-US"
              timeStyle="twitter"
            />
          </div>
        </div>
        <p>{tweet.text}</p>
        <div className="py-2">
          {tweet.media && mediaType == "img" ? (
            <img
              src={tweet.media.url}
              alt=""
              className="rounded-2xl w-full border border-[lightgrey] min-w-0"
            />
          ) : null}
          {tweet.media && mediaType == "vid" ? (
            <video
              className="rounded-2xl h-[200px] min-w-0"
              autoPlay={true}
              src={tweet.media.url}
              controls
              muted
            />
          ) : null}
        </div>
        <div className="flex justify-between py-1 mr-[100px] gap-4">
          <div
            className="flex space-x-2 items-center cursor-pointer"
            onClick={toggleComment}
          >
            <CommentIcon className="text-lg" />{" "}
            <span>{commCount && commCount}</span>
          </div>
          <div className="flex space-x-2 items-center cursor-pointer">
            <RetweetIcon className="text-lg" /> <span>0</span>
          </div>
          <div className="flex space-x-2 items-center cursor-pointer">
            {like.val ? (
              <FillHeartIcon
                className="text-lg text-[red]"
                onClick={unlikeTweet}
              />
            ) : (
              <OutlineHeartIcon className="text-lg" onClick={likeTweet} />
            )}
            <span>{likeCount !== null && likeCount}</span>
          </div>
          <div className="flex space-x-2 items-center cursor-pointer">
            <UploadIcon className="text-lg" /> <span>0</span>
          </div>
        </div>
        {showComment && (
          <CommentBox
            tweetId={tweet._id}
            userId={user._id}
            comments={comments}
            commCount={commCount}
            fetchComments={fetchComments}
            fetchMoreComments={fetchMoreComments}
          />
        )}
      </div>
    </div>
  );
}

export default Tweet;
