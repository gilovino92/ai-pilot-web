import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import AppEmpty from "./app/common/AppEmpty";
import router from "./config/router";

export default function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <AppEmpty text="Loading..." />;
  }

  return (
    <RouterProvider
      context={{ isAuthenticated: auth.isAuthenticated }}
      router={router}
    />
  );
}
