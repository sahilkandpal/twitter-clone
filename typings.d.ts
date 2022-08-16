export interface Tweet extends TweetBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "tweet";
  blockTweet: boolean;
}

export type TweetBody = {
  text: string;
  user: {
    image: "string";
    name: "string";
  };
  // username: string;
  // profileImg: string;
  media?: {
    url: string;
    _ref: string;
  };
  commCount: number;
  likeCount: number;
  myLike: null | { _id: string };
};

export interface User {
  _id: string;
  image: string;
  name: string;
}

export interface Comment {
  _id: string;
  user: { name: string; image: string };
  comment: string;
  _createdAt: string;
}
