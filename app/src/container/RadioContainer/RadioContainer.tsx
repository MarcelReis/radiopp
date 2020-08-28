import React from "react";
import { gql, useQuery } from "@apollo/client";

import { Query, Radio } from "src/types/graphql";

import RadioList from "../../components/RadioList";

const GET_RADIO = gql`
  query GetRadio {
    radios {
      name
      thumb
      city
      state
      streamURL
      website
    }
  }
`;

type PropsType = {
  setRadio: (radio: Radio) => void;
};

const RadioContainer = (props: PropsType): JSX.Element => {
  const { data, loading, error } = useQuery<Query>(GET_RADIO);

  if (loading || error) {
    return null;
  }

  const onlineRadios = data.radios.filter((radio) => radio.streamURL !== "");

  return <RadioList radios={onlineRadios} selectRadio={props.setRadio} />;
};

export default RadioContainer;
