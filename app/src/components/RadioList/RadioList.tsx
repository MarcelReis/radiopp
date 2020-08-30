import React from "react";

import { Radio } from "src/types/graphql";

import styles from "./RadioList.module.css";

type PropsType = {
  radios: Radio[];
  selectRadio: (radio: Radio) => void;
};

const RadioList = (props: PropsType): JSX.Element => {
  return (
    <>
      <h2 className={styles.title}>Radios</h2>
      <ul className={styles.list}>
        {props.radios.map((radio) => (
          <li className={styles.item} key={radio.id}>
            <span
              className={styles.link}
              onClick={() => props.selectRadio(radio)}
            >
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
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RadioList;
