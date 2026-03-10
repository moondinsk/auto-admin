import { AppProviders } from "./providers/AppProviders";
import { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes/router";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";

function App() {
  const initialState = {};

  return (
    <AppProviders initialState={initialState}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AppProviders>
  );
}

export default App;
