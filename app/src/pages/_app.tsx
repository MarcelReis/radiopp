import React from "react";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../api/apollo";
import { AppPropsType } from "next/dist/next-server/lib/utils";

import "../styles/main.css";
import Footer from "src/components/Footer";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }: AppPropsType) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ApolloProvider client={apolloClient as any}>
      <Component {...pageProps} />
      <Footer />
    </ApolloProvider>
  );
}

export default MyApp;
