/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from "react";

import { Radio } from "src/types/graphql";

import Player from "../../components/Player";

const PROXY_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:1234";

type PropsType = {
  radio: Radio | null;
};
type StateType = {
  iframeSrc: string | null;
  initialized: boolean;
  loading: boolean;
  playing: boolean;
};
const PlayerContainer = (props: PropsType): JSX.Element => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<StateType>({
    iframeSrc: null,
    initialized: false,
    loading: false,
    playing: false,
  });

  const radioURL = props.radio?.streamURL;
  useEffect(() => {
    const iframeURL = new URL("http://localhost:1234");
    if (radioURL) {
      iframeURL.searchParams.append("streamURL", radioURL);
    }
    setState((state) => ({ ...state, iframeSrc: iframeURL.href }));
  }, [radioURL]);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== PROXY_URL) {
        return;
      }
      console.log("player", event);

      switch (event.data) {
        case "init":
          setState((state) => ({ ...state, loading: true, playing: null }));
          break;

        case "interaction":
          setState((state) => ({ ...state, initialized: true }));
          break;

        case "load":
          setState((state) => ({ ...state, loading: false }));
          break;

        case "play":
          setState((state) => ({ ...state, playing: true }));
          break;

        case "pause":
          setState((state) => ({ ...state, playing: false }));
          break;

        default:
          break;
      }
    };

    window.addEventListener("message", messageHandler);

    return () => window.removeEventListener("message", messageHandler);
  }, []);

  const play = () => {
    iframeRef.current.contentWindow.postMessage("play", "*");
  };

  const pause = () => {
    iframeRef.current.contentWindow.postMessage("pause", "*");
  };

  const stop = () => {
    iframeRef.current.contentWindow.postMessage("stop", "*");
  };

  return (
    <>
      <Player
        hide={!radioURL}
        initialized={state.initialized}
        playing={state.playing}
        loading={state.loading}
        radio={props.radio}
        play={play}
        pause={pause}
        stop={stop}
      >
        {radioURL && (
          <iframe
            ref={iframeRef}
            src={state.iframeSrc}
            name="player"
            width="48px"
            height="48px"
            frameBorder="none"
            style={state.initialized ? { display: "none" } : {}}
          />
        )}
      </Player>
    </>
  );
};

export default PlayerContainer;
