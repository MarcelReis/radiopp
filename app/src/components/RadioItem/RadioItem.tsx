import React from "react";
import { Radio } from "src/types/graphql";

import styles from "./RadioItem.module.css";

type PropsType = {
  radio: Radio;
  onClick: (radio: Radio) => void;
};

const RadioItem = ({ radio, onClick }: PropsType): JSX.Element => {
  return (
    <li className={styles.item}>
      <span className={styles.link} onClick={() => onClick(radio)}>
        <img
          className={styles.logo}
          width={50}
          height={50}
          src={radio.thumb}
          alt=""
        />
        <span className={styles.title}>{radio.name}</span>
        <span className={styles.location}>
          {radio.city}, {radio.state}
        </span>

        {/* <span className={styles.detections}>
          {radio.detections?.map((detect) => detect.track_artist).join(", ")}
        </span> */}
      </span>
    </li>
  );
};

export default RadioItem;
