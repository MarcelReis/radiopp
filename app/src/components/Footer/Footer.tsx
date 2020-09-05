import React from "react";
import { Footer, Text } from "grommet";

const AppFooter = (): JSX.Element => {
  return (
    <Footer as="div" background="light-4" justify="center" pad="small">
      <Text textAlign="center" size="small">
        © {new Date().getFullYear()} Copyright{" "}
        <a href="https://marcelreis.dev">Marcelo Reis</a>
      </Text>
    </Footer>
  );
};

export default AppFooter;
