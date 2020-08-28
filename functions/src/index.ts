import * as fs from "fs";
import * as path from "path";

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { ApolloServer, gql } from "apollo-server-cloud-functions";

admin.initializeApp();
const db = admin.firestore();

const schema = fs
  .readFileSync(path.join(__dirname, "../../schema.graphql"), "utf8")
  .toString();

const typeDefs = gql(schema);

const resolvers = {
  Query: {
    radios: async () => {
      const res = await db.collection("radios").get();

      return res.docs.map((snapshot) => {
        const data = snapshot.data();

        return {
          name: data.name,
          thumb: data.thumb,
          website: data.website,
          streamURL: data.streamURL,
          city: data.city,
          state: data.state,
          country: data.country ?? "Brasil",
        };
      });
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const apolloHandler = apolloServer.createHandler({ cors: { origin: true } });

export const graphql = functions.https.onRequest(apolloHandler);
