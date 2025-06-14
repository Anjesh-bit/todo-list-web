import type { Preview } from "@storybook/react";
import "@mantine/core/styles.css";
import "swiper/css";
import "swiper/css/pagination";
import { MantineProvider, createTheme } from "@mantine/core";

import React from "react";

const theme = createTheme({});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <Story />
      </MantineProvider>
    ),
  ],
};

export default preview;
