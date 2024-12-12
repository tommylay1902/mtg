// import { useEffect, useState } from "react";
// import Keycloak, { KeycloakOnLoad } from "keycloak-js";
// import initKeycloak from "@/keycloak/keycloak";

// const useKeycloak = (): Keycloak => {
//   const [keycloak, setKeycloak] = useState<undefined | Keycloak>(undefined);
//   // const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     setKeycloak(initKeycloak());
//   }, []);

//   useEffect(() => {
//     if (keycloak) {
//       keycloak
//         .init({
//           onLoad: "login-required" as KeycloakOnLoad,
//           checkLoginIframe: false,
//           pkceMethod: "S256",
//         })
//         .then(
//           (auth) => {
//             if (auth) {
//               setAuthenticated(true);
//             } else {
//               // setAuthenticated(true);
//             }
//           },
//           (err: Error) => {
//             throw err;
//             // console.error("Authenticated Failed", err);
//           }
//         );
//     } else {
//       console.log("hello from keycloak hook");
//     }
//   }, [keycloak]);

//   return keycloak;
// };

// export default useKeycloak;
