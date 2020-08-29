import React from "react";
import Link from "next/link";

import { MdSearch, MdMenu } from "react-icons/md";

import styles from "./AppBar.module.css";
import IconButton from "../Button/IconButton";

type PropsType = {
  toggleMenu: () => void;
  menuOpen: boolean;
};

const AppBar = (props: PropsType): JSX.Element => {
  return (
    <header className={styles.container}>
      <div className={styles.wrapper}>
        <IconButton onClick={props.toggleMenu}>
          <MdMenu />
        </IconButton>

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
