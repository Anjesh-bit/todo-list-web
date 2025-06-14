import { Box } from "@mantine/core";
import { FC } from "react";

import classes from "./layout.module.css";
import { LayoutProps } from "./layout.types";

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box className={classes.mainAppShell}>
      <Box>{children}</Box>
    </Box>
  );
};
