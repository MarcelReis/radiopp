import React from "react";

import styles from "./IconButton.module.css";

type PropsType = {
  onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  light?: boolean;
};

const IconButton = (props: PropsType): JSX.Element => {
  return (
    <button className={styles[props.size ?? "md"]} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default IconButton;
