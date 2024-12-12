import { createRouter, RouterProvider } from "@tanstack/react-router";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { useAuth } from "react-oidc-context";
// import { oidcConfig } from "./config/oidcConfig";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { authentication: undefined! },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const authentication = useAuth();
  console.log(authentication, "from app");
  return <RouterProvider router={router} context={{ authentication }} />;
};

export default App;
