import React, { useEffect, useState } from "react";

import { Howl } from "howler";
import { RadioType } from "../../api/radios";
import Player from "../../components/Player";

type PropsType = {
  radio: RadioType | null;
};

const PlayerContainer = (props: PropsType) => {
  const [player, setPlayer] = useState<null | Howl>(null);

  const radioURL = props.radio?.streaming_url;
  useEffect(() => {
    setPlayer((player) => {
      if (player) {
        player.unload();
      }

      if (!radioURL) {
        return null;
      }

      const newPlayer = new Howl({
        src: [radioURL],
        html5: true,
        format: ["acc", "mp3"],
      });

      newPlayer.play();

      return newPlayer;
    });
  }, [radioURL]);

  useEffect(() => {
    return () => {
      player?.unload();
    };
  }, [player]);

  const play = () => {
    player?.play();
  };
  const pause = () => {
    player?.pause();
  };

  return (
    <Player
      playing={player !== null}
      radio={props.radio}
      play={play}
      pause={pause}
    />
  );
};

export default PlayerContainer;
