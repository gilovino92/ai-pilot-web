import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oidc-context";

import App from "./app";
import { userManager } from "./config/auth";
import queryClient from "./config/query";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider
    onSigninCallback={() => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }}
    userManager={userManager}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </AuthProvider>,
);
