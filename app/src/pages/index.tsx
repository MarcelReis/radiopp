import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import RadioContainer from "../container/RadioContainer";
import PlayerContainer from "../container/PlayerContainer";

import { initializeApollo } from "src/api/apollo";
import { Radio, Query } from "src/types/graphql";
import { GetStaticPropsResult } from "next";

const pageQuery = gql`
  query GetRadio {
    radios(limit: 50, city: "Belo Horizonte") {
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
    data: { radios },
  } = useQuery<Query>(pageQuery);

  return (
    <>
      <RadioContainer radios={radios} setRadio={setRadio} />
      <PlayerContainer radio={radio} />
    </>
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
