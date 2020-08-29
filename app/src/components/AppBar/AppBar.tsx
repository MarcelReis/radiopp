import React from "react";
import Link from "next/link";

import { MdMenu, MdSearch } from "react-icons/md";

import styles from "./AppBar.module.css";

const AppBar = (): JSX.Element => {
  return (
    <header className={styles.container}>
      <div className={styles.wrapper}>
        <button
          className={styles.menuButton}
          onClick={() => alert("Em desenvolvimento")}
        >
          <MdMenu />
        </button>
        <h1 className={styles.title}>
          <Link href="/">
            <a>Radiopp</a>
          </Link>
        </h1>
        <button
          className={styles.searchButton}
          onClick={() => alert("Em desenvolvimento")}
        >
          <MdSearch />
        </button>
      </div>
    </header>
  );
};

export default AppBar;
