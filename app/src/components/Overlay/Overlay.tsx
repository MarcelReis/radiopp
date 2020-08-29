import React, { useState, useEffect } from "react";

import styles from "./Overlay.module.css";

type PropsType = {
  show: boolean;
  onClick: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Overlay = (props: PropsType): JSX.Element => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (props.show === true) {
      document.body.style.overflow = "hidden";
      setMounted(true);
      return;
    }

    setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "";
    }, 200);
  }, [props.show]);

  if (mounted) {
    return (
      <div
        className={props.show ? styles.overlay : styles.overlayHidding}
        onClick={props.onClick}
      />
    );
  }

  return null;
};

export default Overlay;
