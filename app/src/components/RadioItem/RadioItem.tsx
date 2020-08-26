import React from "react";
import { RadioType } from "../../api/radios";

import styles from "./RadioItem.module.css";

type PropsType = {
  radio: RadioType;
  onClick: (radio: RadioType) => void;
};

const RadioItem = ({ radio, onClick }: PropsType) => {
  return (
    <li className={styles.item}>
      <span className={styles.link} onClick={() => onClick(radio)}>
        <img
          className={styles.logo}
          width={50}
          height={50}
          src={radio.logo_url}
          alt=""
        />
        <span className={styles.title}>{radio.name}</span>
        <span className={styles.location}>
          {radio.city}, {radio.state}
        </span>

        <span className={styles.detections}>
          {radio.detections?.map((detect) => detect.track_artist).join(", ")}
        </span>
      </span>
    </li>
  );
};

export default RadioItem;
