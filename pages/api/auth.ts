import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import sanityClient from "../../sanity";
import { groq } from "next-sanity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { token } = req.body;
  if (!token) res.status(400).json({ message: "access denied" });
  let decoded: any, user;
  try {
    decoded = jwt.verify(token, `${process.env.NEXT_PUBLIC_JWT_SECRET}`);
    let { _id } = decoded;
    console.log("decoded", decoded);
    console.log("_id log: ", _id);

    const query = groq`
  *[_type=="user" && _id=="${_id}"]{
    _id,
    ...,
  }
  `;
    user = await sanityClient.fetch(query);
  } catch (err) {
    res.status(400).json({ message: err });
  }

  res.status(200).json({ message: "authenticated", data: decoded, user });
}
