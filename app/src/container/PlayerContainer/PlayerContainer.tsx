/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from "react";

import { Radio } from "src/types/graphql";

import Player from "../../components/Player";

const PROXY_URL =
  process.env.NODE_ENV === "production"
    ? "http://howler.marcelreis.dev"
    : "http://localhost:1234";

type PropsType = {
  radio: Radio | null;
};
type StateType = {
  iframeSrc: string | null;

  initialized: boolean;
  loading: boolean;
  buffering: boolean;
  playing: boolean;
  time: null | number;
};
const PlayerContainer = (props: PropsType): JSX.Element => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<StateType>({
    iframeSrc: null,

    initialized: false,
    loading: false,
    buffering: false,
    playing: false,
    time: null,
  });

  const radioURL = props.radio?.streamURL;
  useEffect(() => {
    const iframeURL = new URL(PROXY_URL);
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

      switch (event.data.name) {
        case "init":
          setState((state) => ({ ...state, loading: true, playing: null }));
          break;

        case "interaction":
          setState((state) => ({ ...state, initialized: true }));
          break;

        case "info":
          setState((state) => {
            const time = event.data.time;
            const buffering =
              state.playing && state.time === event.data.time ? true : false;

            return { ...state, time, buffering };
          });
          break;

        case "load":
          setState((state) => ({ ...state, loading: false }));
          break;

        case "play":
          setState((state) => ({ ...state, playing: true, loading: false }));
          break;

        case "pause":
          setState((state) => ({ ...state, playing: false }));
          break;

        default:
          console.error("UNHANDLED MESSAGE", event);
          break;
      }
    };

    window.addEventListener("message", messageHandler);

    return () => window.removeEventListener("message", messageHandler);
  }, []);

  const play = () =>
    iframeRef.current.contentWindow.postMessage({ name: "play" }, "*");

  const pause = () =>
    iframeRef.current.contentWindow.postMessage({ name: "pause" }, "*");

  const stop = () =>
    iframeRef.current.contentWindow.postMessage({ name: "stop" }, "*");

  return (
    <Player
      hide={!radioURL}
      initialized={state.initialized}
      playing={state.playing}
      buffering={state.buffering}
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
  );
};

export default PlayerContainer;
