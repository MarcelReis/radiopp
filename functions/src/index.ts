import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as fs from "fs";
import * as path from "path";

import { ApolloServer, gql } from "apollo-server-cloud-functions";
import { QueryRadiosArgs } from "./types/graphql";

admin.initializeApp();
const db = admin.firestore();

const schemaString = fs
  .readFileSync(path.join(__dirname, "./schema.graphql"), "utf-8")
  .toString();

const typeDefs = gql(schemaString);

const resolvers = {
  Query: {
    radios: async (_: any, queryArgs: QueryRadiosArgs) => {
      const radiosRef = db
        .collection("radios")
        .limit(+queryArgs.limit)
        .where("city", "==", queryArgs.city);

      const res = await radiosRef.get();

      return res.docs.map((snapshot) => {
        const data = snapshot.data();

        return {
          id: data.id as number,
          name: data.name as string,
          originalURL: data.originalURL as string,
          thumb: data.thumb as string,
          website: data.website as string,
          streamURL: data.streamURL as string,
          city: data.city as string,
          state: data.state as string,
          country: data.country as string,
          schedule: data.schedule as any,
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
