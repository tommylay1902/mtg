import Keycloak from "keycloak-js";
function keycloak() {
  const initOptions = {
    url: import.meta.env.VITE_KC_BASE_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID,
    // KeycloakResponseType: "code",
    // checkLoginFrame: false,
    // enableLogging: true,
    // silentCheckSsoRedirectUri:
    //   window.location.origin + "/silent-check-sso.html",
  };

  return new Keycloak(initOptions);
}

export default keycloak;
