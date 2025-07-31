import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export const userManager = new UserManager({
  authority: import.meta.env.VITE_AUTH_KEYCLOAK_AUTHORITY,
  client_id: import.meta.env.VITE_AUTH_KEYCLOAK_CLIENT_ID,
  client_secret: import.meta.env.VITE_AUTH_KEYCLOAK_CLIENT_SECRET,
  redirect_uri: import.meta.env.VITE_AUTH_KEYCLOAK_REDIRECT_URI,
  scope: "organization offline_access",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
});

userManager.events.addAccessTokenExpired(() => {
  userManager.removeUser();
});

userManager.events.addAccessTokenExpiring(() => {
  console.log("Access token expiring");
});

userManager.events.addSilentRenewError(() => {
  console.log("Silent renew error");
});
