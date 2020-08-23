import React from "react";

import styles from "./AppBar.module.css";

const AppBar = () => {
  return (
    <header className={styles.container}>
      <h1 className={styles.title}>Radiopp</h1>
    </header>
  );
};

export default AppBar;
