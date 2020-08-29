import React from "react";
import IconButton from "../Button/IconButton";

import styles from "./UserCard.module.css";

import { MdKeyboardArrowDown } from "react-icons/md";

type PropsType = {
  user: null | { [key: string]: any };
  isOpen: boolean;

  toggle: () => void;

  login: () => void;
  logout: () => void;
};

const UserCard = (props: PropsType): JSX.Element => {
  return (
    <div
      className={styles.userCard}
      tabIndex={0}
      onClick={props.user ? props.toggle : props.login}
    >
      <img
        className={styles.userPhoto}
        src={props.user?.thumb ?? "/public/img/void-user.png"}
        alt=""
      />
      <span className={styles.userName}>{props.user?.name ?? "Entrar"}</span>
      {props.user !== null && (
        <IconButton>
          <MdKeyboardArrowDown />
        </IconButton>
      )}
    </div>
  );
};

export default UserCard;
