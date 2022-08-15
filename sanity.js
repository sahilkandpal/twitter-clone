import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: "qqkpsha7",
  dataset: "production",
  apiVersion: "2022-07-15", // use current UTC date - see "specifying API version"!
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN, // or leave blank for unauthenticated usage
  useCdn: false, // `false` if you want to ensure fresh data
});

export default client;
