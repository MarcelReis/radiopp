import React, { useState } from "react";
import { grommet, Grommet } from "grommet";
import dynamic from "next/dynamic";
import { ApolloProvider } from "@apollo/client";
import { AppPropsType } from "next/dist/next-server/lib/utils";

import { useApollo } from "../api/apollo";

import "../styles/main.css";

const MenuContainer = dynamic(() => import("../container/MenuContainer"), {
  ssr: false,
});

import AppBar from "src/components/AppBar";
import Footer from "src/components/Footer";
import Head from "next/head";
import Layout from "src/components/Layout";

function MyApp({ Component, pageProps }: AppPropsType): JSX.Element {
  const [state, setState] = useState({ menuOpen: false });
  const apolloClient = useApollo(pageProps.initialApolloState);

  const toggleMenu = () =>
    setState((state) => ({ ...state, menuOpen: !state.menuOpen }));

  return (
    <ApolloProvider client={apolloClient}>
      <Grommet theme={grommet}>
        <Head>
          <title>Radiopp - As melhores Rádios online</title>
          <meta
            name="description"
            content="As melhores rádios do Brasil, escute as rádios da sua cidade e do mundo online"
          />
        </Head>
        <AppBar />

        <Layout>
          <Component {...pageProps} />
        </Layout>

        <Footer />
        <MenuContainer isOpen={state.menuOpen} toggleMenu={toggleMenu} />
      </Grommet>
    </ApolloProvider>
  );
}

export default MyApp;
