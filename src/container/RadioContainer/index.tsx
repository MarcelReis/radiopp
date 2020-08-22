import React, { useEffect, useState } from "react";

import { Howl, Howler } from "howler";
import { RadioAPI, RadioType } from "../../api/radios";
import RadioList from "../../components/RadioList";

var sound = new Howl({
  src: ["http://stm16.srvstm.com:7664/stream"],
  html5: true,
  format: ["acc", "mp3"],
});

(window as any).sound = sound;

const RadioContainer = () => {
  const [radios, setRadios] = useState<RadioType[]>([]);

  useEffect(() => {
    RadioAPI.getRadios().then(setRadios);
  }, []);

  if (radios.length === 0) {
    return null;
  }

  return <RadioList radios={radios} />;
};

type RadioItemPropsType = {
  radio: RadioType;
};

export default RadioContainer;
