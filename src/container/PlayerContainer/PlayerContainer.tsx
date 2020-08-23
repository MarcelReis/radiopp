import React, { useEffect, useState } from "react";

import { Howl } from "howler";
import { RadioType } from "../../api/radios";
import Player from "../../components/Player";

type PropsType = {
  radio: RadioType | null;
};

const PlayerContainer = (props: PropsType) => {
  const [state, setState] = useState<{ player: null | Howl; loading: boolean }>(
    { player: null, loading: false }
  );

  const radioURL = props.radio?.streaming_url;
  useEffect(() => {
    setState((state) => {
      if (state.loading) {
        return { ...state };
      }
      if (state.player) {
        state.player.unload();
      }
      if (!radioURL) {
        return { ...state, player: null };
      }

      const newPlayer = new Howl({
        src: [radioURL],
        html5: true,
        format: ["acc", "mp3"],
      });

      newPlayer.once("load", () => {
        setState((state) => ({ ...state, loading: false }));
      });

      newPlayer.once("loaderror", () => {
        setState((state) => ({ ...state, loading: false }));
        alert("Erro ao carregar a radio");
      });

      newPlayer.play();

      return { ...state, player: newPlayer };
    });
  }, [radioURL]);

  useEffect(() => {
    return () => {
      state.player?.unload();
    };
  }, [state.player]);

  const play = () => {
    console.log("play");
    state.player?.play();
  };
  const pause = () => {
    console.log("pause");
    state.player?.pause();
  };

  return (
    <Player
      playing={state.player !== null}
      loading={state.loading}
      radio={props.radio}
      play={play}
      pause={pause}
    />
  );
};

export default PlayerContainer;
