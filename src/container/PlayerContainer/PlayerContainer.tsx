import React, { useEffect, useState } from "react";

import { Howl } from "howler";
import { RadioType } from "../../api/radios";
import Player from "../../components/Player";

type PropsType = {
  radio: RadioType | null;
};

const PlayerContainer = (props: PropsType) => {
  const [player, setPlayer] = useState<null | Howl>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const radioURL = props.radio?.streaming_url;
  useEffect(() => {
    setLoading(true);

    setPlayer((player) => {
      if (player) {
        player.stop();
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

      newPlayer.once("load", () => {
        setLoading(false);
      });

      newPlayer.once("loaderror", () => {
        setLoading(false);
        alert("Erro ao carregar a radio");
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
      loading={loading}
      radio={props.radio}
      play={play}
      pause={pause}
    />
  );
};

export default PlayerContainer;
