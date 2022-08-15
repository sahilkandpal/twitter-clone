import { groq } from "next-sanity";
import React, { useEffect, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import sanityClient from "../sanity";
import { Comment } from "../typings";

interface Props {
  tweetId: string;
  userId: string;
  comments: Comment[];
  fetchComments: () => Promise<void>;
  fetchMoreComments: () => Promise<void>;
  commCount: number | null;
}

const CommentBox = ({
  tweetId,
  userId,
  comments,
  fetchComments,
  fetchMoreComments,
  commCount,
}: Props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!comments.length) fetchComments();
  }, []);

  const ShowMore = () => {
    let index;
    if (commCount !== null) {
      index = commCount - comments.length > 3 ? comments.length + 3 : commCount;
    }
    let nextCount;
    if (index !== undefined) {
      nextCount = index - comments.length;
    }
    if (comments.length && commCount && comments.length < commCount)
      return (
        <div
          className="text-twitter text-center cursor-pointer"
          onClick={fetchMoreComments}
        >
          show more ({nextCount})
        </div>
      );
    return null;
  };

  const postComment = async () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      const doc = {
        _type: "comment",
        tweet: {
          _type: "reference",
          _ref: tweetId,
        },
        comment: trimmedText,
        user: {
          _type: "postedBy",
          _ref: userId,
        },
      };
      const Cdoc = await sanityClient.create(doc);
      console.log("Cdoc", Cdoc);
      setText("");
      fetchComments();
    }
  };
  return (
    <div>
      <div className="flex py-2 gap-2">
        <input
          type="text"
          value={text}
          placeholder="Tweet your reply"
          onChange={(e) => setText(e.target.value)}
          className="flex-1 placeholder:text-[grey] outline-none p-1"
        />
        <button
          className={`bg-twitter ${
            !text.trim() && "opacity-50"
          } rounded-full py-1 px-4 font-medium text-[white]`}
          onClick={postComment}
        >
          Reply
        </button>
      </div>
      <div className="comments">
        {comments &&
          comments.map((comment) => (
            <div className="comment">
              <div className="flex space-x-2 py-3 border-t-[1px] border-[#ebebeb]">
                <img
                  className="h-10 w-10 rounded-full"
                  src={comment.user.image}
                  alt=""
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2">
                    <h1 className="font-bold text-sm min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      {comment.user.name}
                    </h1>
                    <div className="text-sm min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      @{comment.user.name?.split(" ").join("").toLowerCase()}
                    </div>

                    <ReactTimeAgo
                      className="text-sm min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                      date={new Date(comment._createdAt)}
                      locale="en-US"
                      timeStyle="twitter"
                    />
                  </div>
                  <p className="text-sm">{comment.comment}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <ShowMore />
    </div>
  );
};
export default CommentBox;
