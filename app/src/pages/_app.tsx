import React from "react";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../api/apollo";

import "../styles/main.css";
import { AppPropsType } from "next/dist/next-server/lib/utils";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }: AppPropsType) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ApolloProvider client={apolloClient as any}>
      <Component {...pageProps} />;
    </ApolloProvider>
  );
}

export default MyApp;
