import React from "react";
import { RadioType } from "../../api/radios";

import { MdPlayArrow, MdPause, MdPlaylistPlay } from "react-icons/md";
import { GiRadarSweep } from "react-icons/gi";

import styles from "./Player.module.css";

type PropsType = {
  hide: boolean;
  playing: boolean;
  loading: boolean;
  radio: RadioType | null;

  play: () => void;
  pause: () => void;
};

const Player = (props: PropsType) => {
  const location: string = [props.radio?.city, props.radio?.state]
    .filter((l) => !!l)
    .join(" - ");

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
            src={props.radio?.logo_url}
            width={40}
            height={40}
            alt=""
          />
          <div className={styles.radioInfo}>
            <span className={styles.radioName}>{props.radio?.name}</span>
            <span>{location}</span>
          </div>
        </div>

        <div className={styles.detection}>
          <span>Identificando...</span>
        </div>

        <button className={styles.button}>
          <MdPlaylistPlay />
        </button>
      </div>
    </div>
  );
};

export default Player;
