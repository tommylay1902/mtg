import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

export const Route = createFileRoute("/prescriptions/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    throw auth.signinRedirect();
  }
  return <div>Hello "/medication/$id"!</div>;
}
