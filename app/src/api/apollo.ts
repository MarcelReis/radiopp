/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMemo } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";

let apolloClient;

function createIsomorphLink() {
  if (typeof window === "undefined") {
    const { SchemaLink } = require("@apollo/client/link/schema");
    const schema = require("../../../schema.graphql");
    return new SchemaLink({ schema });
  }

  const { HttpLink } = require("@apollo/client/link/http");
  return new HttpLink({
    uri:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5001/radiopp-acbbe/us-central1/graphql"
        : "https://us-central1-radiopp-acbbe.cloudfunctions.net/graphql",
    credentials: "same-origin",
  });
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If the page has Next.js data fetching methods that use Apollo Client, the initial state gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") {
    return _apolloClient;
  }

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => {
    return initializeApollo(initialState);
  }, [initialState]);

  return store;
}
