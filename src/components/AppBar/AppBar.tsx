import React from "react";

import styles from "./AppBar.module.css";

const AppBar = () => {
  return (
    <header className={styles.container}>
      <div className={styles.wrapper}>
        <div>Menu</div>
        <h1 className={styles.title}>Radiopp</h1>
        <div>Pesquisa</div>
      </div>
    </header>
  );
};

export default AppBar;
