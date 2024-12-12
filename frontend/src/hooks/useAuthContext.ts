import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
  const user = useContext(AuthContext);

  if (user === undefined) {
    throw new Error("Error using auth context that contains keycloak data");
  }

  return user;
};
