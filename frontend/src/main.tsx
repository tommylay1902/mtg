import ReactDOM from "react-dom/client";
import App from "./App";
import { onSigninCallback, userManager } from "./config/oidcConfig";
import { AuthProvider } from "react-oidc-context";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
      <App />
    </AuthProvider>
  );
}
