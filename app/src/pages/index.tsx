import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import RadioContainer from "../container/RadioContainer";
import PlayerContainer from "../container/PlayerContainer";

import { initializeApollo } from "src/api/apollo";
import { Radio, Query } from "src/types/graphql";
import Layout from "src/components/Layout";
import { GetStaticPropsResult } from "next";

const pageQuery = gql`
  query GetRadio {
    radioListing {
      id
      name
      thumb
      streamURL
      website
      location {
        city
        state
      }
    }
  }
`;

function HomePage(): JSX.Element {
  const [radio, setRadio] = useState<null | Radio>(null);

  const {
    data: { radioListing },
  } = useQuery<Query>(pageQuery);

  return (
    <Layout>
      <RadioContainer radios={radioListing} setRadio={setRadio} />
      <PlayerContainer radio={radio} />
    </Layout>
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<any>> {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: pageQuery,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default HomePage;
