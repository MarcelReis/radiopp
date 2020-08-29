import React from "react";

import styles from "./Footer.module.css";

const Footer = (): JSX.Element => {
  return (
    <footer className={styles.container}>
      <p className={styles.copyRight}>
        © Copyright {new Date().getFullYear()}, Marcelo Reis
      </p>
    </footer>
  );
};

export default Footer;
