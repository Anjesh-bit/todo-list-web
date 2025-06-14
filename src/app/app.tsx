import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";

import { Layout } from "./components/layout/layout";
import { theme } from "../config/theme";

function App() {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <Layout>
          <p>Welcome to Todo List App</p>
        </Layout>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
