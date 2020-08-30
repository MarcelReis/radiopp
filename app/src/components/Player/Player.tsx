import React from "react";

import { MdPlayArrow, MdPause, MdPlaylistPlay } from "react-icons/md";
import { GiRadarSweep } from "react-icons/gi";

import styles from "./Player.module.css";
import { Radio } from "src/types/graphql";

type PropsType = {
  hide: boolean;
  playing: boolean;
  loading: boolean;
  radio: Radio | null;

  play: () => void;
  pause: () => void;
};

const Player = (props: PropsType): JSX.Element => {
  return (
    <div className={props.hide ? styles.containerHidden : styles.container}>
      <div className={styles.wrapper}>
        {props.loading ? (
          <button className={styles.spinnerButton}>
            <GiRadarSweep />
          </button>
        ) : !props.playing ? (
          <button className={styles.playButton} onClick={props.play}>
            <MdPlayArrow />
          </button>
        ) : (
          <button className={styles.playButton} onClick={props.pause}>
            <MdPause />
          </button>
        )}

        <div className={styles.radioData}>
          <img
            className={styles.radioThumb}
            src={props.radio?.thumb}
            width={36}
            height={36}
            alt=""
          />
          <div className={styles.radioInfo}>
            <span className={styles.radioName}>{props.radio?.name}</span>
            <span className={styles.radioLocation}>
              {props.radio?.location.city} - {props.radio?.location.state}
            </span>
          </div>
        </div>

        <div className={styles.detection}>
          <span onClick={() => alert("Em desenvolvimento")}>
            Identificando...
          </span>
        </div>

        <button
          className={styles.playlistButton}
          onClick={() => alert("Em desenvolvimento")}
        >
          <MdPlaylistPlay />
        </button>
      </div>
    </div>
  );
};

export default Player;
