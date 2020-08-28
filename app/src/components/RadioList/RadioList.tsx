import React from "react";

import { Radio } from "src/types/graphql";

import styles from "./RadioList.module.css";
import RadioItem from "../RadioItem";

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
          <RadioItem
            key={radio.name + radio.website}
            radio={radio}
            onClick={props.selectRadio}
          />
        ))}
      </ul>
    </>
  );
};

export default RadioList;
