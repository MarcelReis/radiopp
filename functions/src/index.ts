import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as fs from "fs";
import * as path from "path";

import { ApolloServer, gql } from "apollo-server-cloud-functions";

import radioListingResolver from "./resolvers/radioListing";
import radioResolver from "./resolvers/radioListing";
import locationsResolver from "./resolvers/cities";

admin.initializeApp();

const schemaString = fs
  .readFileSync(path.join(__dirname, "./schema.graphql"), "utf-8")
  .toString();

const typeDefs = gql(schemaString);

const resolvers = {
  Query: {
    radioListing: radioListingResolver,
    locations: locationsResolver,
    radio: radioResolver,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  context: async () => ({ firestore: admin.firestore() }),
});

const apolloHandler = apolloServer.createHandler({ cors: { origin: true } });

export const graphql = functions.https.onRequest(apolloHandler);
