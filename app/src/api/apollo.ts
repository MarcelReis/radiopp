/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

import { HttpLink } from "@apollo/client/link/http";

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createIsomorphLink() {
  // TODO CREATE A BUILD TIME GRAPHQL SCHEMA (WITH NEXT LAMBDAS?)
  const uri =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5001/radiopp-acbbe/us-central1/graphql"
      : "https://us-central1-radiopp-acbbe.cloudfunctions.net/graphql";

  return new HttpLink({
    uri,
    credentials: "same-origin",
  });
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: !process.browser,
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
