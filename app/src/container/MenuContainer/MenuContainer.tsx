import React, { useState } from "react";
import Menu from "src/components/Menu";

import Overlay from "src/components/Overlay";

const mockUser = {
  username: "marcelreis",
  name: "Marcelo Reis",
  thumb: "https://placekitten.com/200",
};

type PropsType = {
  toggleMenu: () => void;
  isOpen: boolean;
};

const MenuContainer = (props: PropsType): JSX.Element => {
  const [state, setState] = useState({ userCardOpen: false, user: null });

  const login = () => {
    setState((state) => ({ ...state, user: mockUser }));
  };

  const logout = () => {
    setState((state) => ({ ...state, user: null, userCardOpen: false }));
  };

  const toggleUserCard = () =>
    setState((state) => ({ ...state, userCardOpen: !state.userCardOpen }));

  return (
    <>
      <Menu
        toggle={props.toggleMenu}
        isOpen={props.isOpen}
        user={state.user}
        login={login}
        logout={logout}
        toggleUserCard={toggleUserCard}
        userCardOpen={state.userCardOpen}
      />
      <Overlay onClick={props.toggleMenu} show={props.isOpen} />
    </>
  );
};

export default MenuContainer;
