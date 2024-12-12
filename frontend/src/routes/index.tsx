import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
// import { hasAuthParams } from "react-oidc-context";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const authentication = useAuth();

  if (!authentication.isAuthenticated && !authentication.isLoading) {
    console.log("redirecting");
    throw authentication.signinRedirect();
  }

  return <div>Welcome to homepage!</div>;
}
