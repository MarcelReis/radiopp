import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as fs from "fs";
import * as path from "path";

import { ApolloServer, gql } from "apollo-server-cloud-functions";

admin.initializeApp();
const db = admin.firestore();

const schemaString = fs
  .readFileSync(path.join(__dirname, "./schema.graphql"), "utf-8")
  .toString();

const typeDefs = gql(schemaString);

const resolvers = {
  Query: {
    radios: async (_, variable) => {
      const radiosRef = db
        .collection("radios")
        .limit(+variable.limit)
        .where("city", "==", variable.city);

      const res = await radiosRef.get();

      return res.docs.map((snapshot) => {
        const data = snapshot.data();

        return {
          id: data.id,
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
  playground: true,
  introspection: true,
});

const apolloHandler = apolloServer.createHandler({ cors: { origin: true } });

export const graphql = functions.https.onRequest(apolloHandler);
