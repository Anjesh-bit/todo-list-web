import { ReactElement } from "react";

export type LayoutProps = {
  children: ReactElement;
};

export type MainLayoutProps = {
  children?: JSX.Element;
  opened: boolean;
};
