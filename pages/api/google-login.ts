import type { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_ID);
import sanityClient from "../../sanity";
import jwt from "jsonwebtoken";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { token } = req.body;
  if (!token) res.status(400).json({ message: "access denied" });

  console.log("req.body", req.body);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.NEXT_PUBLIC_GOOGLE_ID,
  });

  const payload = ticket.getPayload();
  const { email_verified, name, email, sub, picture } = payload;

  if (email_verified) {
    const doc = {
      _id: sub,
      _type: "user",
      name,
      email,
      image: picture,
    };

    try {
      const user = await sanityClient.createIfNotExists(doc);
    } catch {
      console.log("Error while creating user.");
    }

    const token = jwt.sign(
      { _id: sub },
      `${process.env.NEXT_PUBLIC_JWT_SECRET}`,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: { _id: sub, email, name },
    });
  } else {
    return res.status(400).json({
      error: "Google login failed. Try again",
    });
  }
}
