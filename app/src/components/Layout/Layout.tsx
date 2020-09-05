import React from "react";
import { Box } from "grommet";

type PropsType = {
  children: React.ReactNode[];
};

const Layout = (props: PropsType): JSX.Element => {
  return (
    <Box
      pad={{ top: "56px", horizontal: "medium", bottom: "44px" }}
      margin="auto"
      width={{ max: "800px" }}
      height={{ min: "100%" }}
    >
      {props.children}
    </Box>
  );
};

export default Layout;
