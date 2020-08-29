import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ApolloProvider } from "@apollo/client";
import { AppPropsType } from "next/dist/next-server/lib/utils";

import { useApollo } from "../api/apollo";

import "../styles/main.css";

const MenuContainer = dynamic(() => import("../container/MenuContainer"), {
  ssr: false,
});

import Footer from "src/components/Footer";
import AppBar from "src/components/AppBar";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppPropsType): JSX.Element {
  const [state, setState] = useState({ menuOpen: false });
  const apolloClient = useApollo(pageProps.initialApolloState);

  const toggleMenu = () =>
    setState((state) => ({ ...state, menuOpen: !state.menuOpen }));

  return (
    <>
      <Head>
        <title>Radiopp - As melhores Rádios online</title>
        <meta
          name="description"
          content="As melhores rádios do Brasil, escute as rádios da sua cidade e do mundo online"
        />
      </Head>
      <ApolloProvider client={apolloClient as any}>
        <AppBar toggleMenu={toggleMenu} menuOpen={state.menuOpen} />
        <Component {...pageProps} />
        <Footer />

        {/* Modals */}
        <MenuContainer isOpen={state.menuOpen} toggleMenu={toggleMenu} />
      </ApolloProvider>
    </>
  );
}

export default MyApp;
