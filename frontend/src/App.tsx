import Keycloak from "keycloak-js";
import { createContext } from "react";
import useKeycloak from "./hooks/useKeycloak";

export const AuthContext = createContext<Keycloak | null>(null);

const App = () => {
  const { keycloak } = useKeycloak();
  return (
    <AuthContext.Provider value={keycloak}>
      <main className="flex h-screen">
        <div>hello</div>
      </main>
    </AuthContext.Provider>
  );
};

export default App;
