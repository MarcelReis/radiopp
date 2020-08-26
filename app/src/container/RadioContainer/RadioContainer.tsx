import React, { useEffect, useState } from "react";

import { RadioAPI, RadioType } from "../../api/radios";
import RadioList from "../../components/RadioList";

type PropsType = {
  setRadio: (radio: RadioType) => void;
};

const RadioContainer = (props: PropsType) => {
  const [radios, setRadios] = useState<RadioType[]>([]);

  useEffect(() => {
    RadioAPI.getRadios().then(setRadios);
  }, []);

  if (radios.length === 0) {
    return null;
  }

  return <RadioList radios={radios} selectRadio={props.setRadio} />;
};

type RadioItemPropsType = {
  radio: RadioType;
};

export default RadioContainer;
