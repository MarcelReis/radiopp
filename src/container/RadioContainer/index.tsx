import React from "react";

import { Howl, Howler } from "howler";

var sound = new Howl({
  src: ["http://stm16.srvstm.com:7664/stream"],
  html5: true,
  format: ["acc", "mp3"],
});

(window as any).sound = sound;

const RadioContainer = () => {
  return (
    <div>
      <button onClick={() => sound.play()}>Tocar</button>
    </div>
  );
};

export default RadioContainer;
