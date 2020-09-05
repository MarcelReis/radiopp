import React from "react";
import Link from "next/link";
import { Box, Button } from "grommet";

import { Menu, Search } from "@styled-icons/boxicons-regular/";
import { Radio } from "@styled-icons/entypo/Radio";

import * as S from "./AppBar.styled";

const AppBar = (): JSX.Element => {
  return (
    <S.Container>
      <Box
        direction="row"
        align="center"
        justify="between"
        pad={{ horizontal: "medium", vertical: "small" }}
        background="brand"
      >
        <Box flex direction="row" margin="auto" width={{ max: "800px" }}>
          <Button onClick={() => null}>
            <Menu size={32}>Menu</Menu>
          </Button>
          <Box width="100%">
            <Link href="/">
              <a href="" style={{ margin: "auto" }}>
                <Radio size={32} />
              </a>
            </Link>
          </Box>
          <Button onClick={() => alert("dev")}>
            <Search size={32}>Search</Search>
          </Button>
        </Box>
      </Box>
    </S.Container>
  );
};

export default AppBar;
