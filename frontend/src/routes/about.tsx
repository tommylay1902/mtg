import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const auth = useAuth();
  return <div className="p-2">Hello from About {auth.user?.access_token}</div>;
}
