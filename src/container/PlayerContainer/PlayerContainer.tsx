import React, { useEffect, useState } from "react";

import { Howl } from "howler";
import { RadioType } from "../../api/radios";
import Player from "../../components/Player";

type PropsType = {
  radio: RadioType | null;
};
type StateType = {
  player: null | Howl;
  loading: boolean;
  playing: boolean;
};
const PlayerContainer = (props: PropsType) => {
  const [state, setState] = useState<StateType>({
    player: null,
    loading: false,
    playing: false,
  });

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

      newPlayer.on("play", () =>
        setState((state) => ({ ...state, playing: true }))
      );
      newPlayer.on("pause", () =>
        setState((state) => ({ ...state, playing: false }))
      );

      newPlayer.play();

      return { ...state, loading: true, player: newPlayer };
    });
  }, [radioURL]);

  useEffect(() => {
    return () => {
      state.player?.unload();
    };
  }, [state.player]);

  const play = () => state.player?.play();

  const pause = () => state.player?.pause();

  return (
    <Player
      hide={state.player === null}
      playing={state.playing}
      loading={state.loading}
      radio={props.radio}
      play={play}
      pause={pause}
    />
  );
};

export default PlayerContainer;
