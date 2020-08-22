import React from "react";
import { RadioType } from "../../api/radios";

import styles from "./RadioItem.module.css";

type PropsType = {
  radio: RadioType;
};

const RadioItem = ({ radio }: PropsType) => {
  return (
    <li className={styles.item}>
      <a className={styles.link} href="/">
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
      </a>
    </li>
  );
};

export default RadioItem;
