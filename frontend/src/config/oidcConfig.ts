import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

export const userManager = new UserManager({
  authority: import.meta.env.VITE_USER_MANAGER_AUTHORITY,
  client_id: import.meta.env.VITE_KC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_USER_MANAGER_REDIRECT_URL,
  // redirect_uri: `${window.location.origin}${window.location.pathname}`,
  response_type: "code",
  // biome-ignore lint/style/useNamingConvention: Expected
  post_logout_redirect_uri: window.location.origin,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  monitorSession: true, // this allows cross tab login/logout detection
  // ...
});
