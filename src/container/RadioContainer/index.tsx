import React, { useEffect, useState } from "react";

import { Howl, Howler } from "howler";
import { RadioAPI, RadioType } from "../../api/radios";

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

  return (
    <div>
      <button onClick={() => sound.play()}>Tocar</button>

      {radios.length > 0 && (
        <ul>
          {radios.map((radio) => (
            <RadioItem radio={radio} />
          ))}
        </ul>
      )}
    </div>
  );
};

type RadioItemPropsType = {
  radio: RadioType;
};

const RadioItem = ({ radio }: RadioItemPropsType) => {
  return (
    <li>
      <a href="#">
        <span>
          <img src={radio.logo_url} alt="" />
          <span>{radio.name}</span>
          <span>
            {radio.city}, {radio.state}
          </span>
          <hr />
          <span>
            {radio.detections?.map((detect) => detect.track_artist).join(", ")}
          </span>
        </span>
      </a>
    </li>
  );
};

export default RadioContainer;
