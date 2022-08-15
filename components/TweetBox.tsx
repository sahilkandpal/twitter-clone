import React, { useRef, useState, LegacyRef } from "react";
import {
  AiOutlinePicture as PicIcon,
  AiOutlineFileGif as GifIcon,
  AiFillDelete as DeleteIcon,
} from "react-icons/ai";
import {
  BsBarChartLine as BarChartIcon,
  BsEmojiSmile as SmileIcon,
  BsCalendar4 as CalendarIcon,
} from "react-icons/bs";
import { GrLocation as LocationIcon } from "react-icons/gr";
import client from "../sanity";
import MediaPreview from "./MediaPreview";
import SanityClientConstructor, { SanityAssetDocument } from "@sanity/client";
import { useUserContext } from "../context/userContext";
import Router from "next/router";
import { Tweet } from "../typings";
import { groq } from "next-sanity";
import sanityClient from "../sanity";

interface Props {
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>;
  type?: string;
  close?: () => void;
}

function TweetBox({ setTweets, type, close }: Props) {
  const initialState = { file: new File([""], "new.txt"), url: "" };
  const [text, setText] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<{
    file: File;
    url: string;
    asset?: SanityAssetDocument;
  }>(initialState);
  const [isPosted, setIsPosted] = useState("");
  const { user } = useUserContext();

  console.log("type", type);

  const previewFile = (e: any) => {
    if (type == "modal") console.log("preview from floater tweetbox h-32");
    else console.log("preview from real tweetbox h-12");
    const targetFiles: File[] = e.target.files;

    // let filesUrl = Object.values(targetFiles).reduce(
    //   (files: { file: File; url: string }[], file) => {
    //     const url = URL.createObjectURL(file);
    //     files.push({ file, url });
    //     return files;
    //   },
    //   []
    // );
    let filesUrl = {
      file: targetFiles[0],
      url: URL.createObjectURL(targetFiles[0]),
    };

    e.target.value = "";

    filesUrl = { ...filesUrl };

    setFileUrl(filesUrl);
  };

  const discardFile = (url: string) => {
    URL.revokeObjectURL(url);
    // const filesUrl = fileUrl.filter((f) => f.url !== url);
    setFileUrl(initialState);
  };

  const uploadMedia = async () => {
    console.log("enter upload", fileUrl);
    let { file } = fileUrl;
    return await client.assets.upload("file", file, {
      contentType: file.type,
      filename: file.name,
    });
  };

  const postTweet = async () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      setIsPosted("loading");
      const doc = {
        _type: "tweet",
        user: {
          _type: "postedBy",
          _ref: user._id,
        },
        text: trimmedText,
        media: {},
      };
      if (fileUrl.url) {
        const asset: SanityAssetDocument = await uploadMedia();
        setFileUrl({ ...fileUrl, asset });
        console.log("uploaded", fileUrl);
        doc["media"] = {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        };
      }

      await client.create(doc).then(() => console.log("doc created"));
      if (fileUrl.url) discardFile(fileUrl.url);
      setText("");
      setIsPosted("posted");
      RefetchTweets();
      if (type == "modal" && close) close();
    }
  };

  const RefetchTweets = async () => {
    const query = groq`
    *[_type=="tweet"] | order(_createdAt desc){
      _id,
      ...,
      "media": {"url": media.asset->url,"_ref": media.asset._ref },
      "user": {"name": user->name, "image": user->image}
    }`;
    const tweets = await sanityClient.fetch(query);
    setTweets(tweets);
  };

  return (
    <div
      className={`bg-[#fff] px-4 py-0 flex gap-2 ${
        isPosted === "loading" && "opacity-50"
      }`}
    >
      <img
        className="h-12 w-12 rounded-full"
        src={user.image}
        alt=""
        referrerPolicy="no-referrer"
      />

      <div className="flex-1">
        <textarea
          className={`text-xl placeholder:text-[grey] outline-none ${
            type === "modal" ? "h-32" : "h-12"
          } w-full min-w-[5px]`}
          value={text}
          placeholder="What's happening?"
          onChange={(e) => setText(e.target.value)}
        />
        {fileUrl.url && (
          <div className="grid gap-3 grid-flow-row grid-cols-2 py-2">
            <MediaPreview
              discardFile={discardFile}
              url={fileUrl.url}
              fileState={fileUrl}
            />
          </div>
        )}
        {isPosted !== "loading" && (
          <div className="flex items-center flex-1 border-t-[1px] border-[lightgray] justify-between gap-2">
            <div className="flex gap-3 md:gap-4 text-lg py-5">
              <label
                htmlFor={`${
                  type == "modal" ? "upload-modal-file" : "upload-file"
                }`}
                className="cursor-pointer"
              >
                <PicIcon className="text-twitter" />
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
                id={`${type == "modal" ? "upload-modal-file" : "upload-file"}`}
                className="hidden"
                onChange={(e) => previewFile(e)}
              />

              <GifIcon className="text-twitter cursor-pointer" />
              <BarChartIcon className="text-twitter rotate-90 cursor-pointer" />
              <SmileIcon className="text-twitter cursor-pointer" />
              <CalendarIcon className="text-twitter cursor-pointer" />
              <LocationIcon className="text-twitter [&>path]:stroke-twitter cursor-pointer" />
            </div>
            <button
              className={`bg-twitter ${
                !text.trim() && "opacity-50"
              } rounded-full py-1 px-4 font-medium text-[white]`}
              onClick={postTweet}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TweetBox;
