import React from "react";
import Link from "next/link";

import styles from "./Menu.module.css";

import UserCard from "../UserCard";

const commonRoutes = [
  { text: "Novidades", href: "/releases" },
  { text: "Populares", href: "/trending" },
  { text: "Apps", href: "/apps" },
];

type PropsType = {
  isOpen: boolean;
  toggle: () => void;

  user: null | { [key: string]: any };
  login: () => void;
  logout: () => void;

  userCardOpen: boolean;
  toggleUserCard: () => void;
};

const Menu = (props: PropsType): JSX.Element => {
  return (
    <div className={props.isOpen ? styles.container : styles.containerHidden}>
      <UserCard
        user={props.user}
        isOpen={props.userCardOpen}
        toggle={props.toggleUserCard}
        login={props.login}
        logout={props.logout}
      />

      {props.userCardOpen && (
        <ul className={styles.menuList}>
          {[
            { text: "Perfil" },
            { text: "Favoritos" },
            { text: "Histórico" },
            { text: "Adicionar Rádio" },
          ].map(({ text }) => (
            <li className={styles.menuListItem} key={text}>
              <Link href="/user/[user]" as={`/user/${props.user?.username}`}>
                <a className={styles.menuListText}>{text}</a>
              </Link>
            </li>
          ))}
          <li className={styles.menuListItem} onClick={props.logout}>
            <span className={styles.menuListText}>Sair</span>
          </li>
        </ul>
      )}
      <hr />

      <ul className={styles.menuList}>
        {commonRoutes.map(({ text, href }) => (
          <li className={styles.menuListItem} key={href}>
            <Link href={href}>
              <a className={styles.menuListText}>{text}</a>
            </Link>
          </li>
        ))}
        <li className={styles.menuListItem}>
          <a
            className={styles.menuListText}
            href="https://www.letras.mus.br"
            target="_blank"
            rel="noreferrer"
          >
            Letras
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
