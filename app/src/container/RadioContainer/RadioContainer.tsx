import React from "react";

import { Radio } from "src/types/graphql";

import RadioList from "../../components/RadioList";

type PropsType = {
  radios: Radio[];
  setRadio: (radio: Radio) => void;
};

const RadioContainer = (props: PropsType): JSX.Element => {
  return <RadioList radios={props.radios} selectRadio={props.setRadio} />;
};

export default RadioContainer;
