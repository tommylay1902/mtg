import { createFileRoute, redirect } from "@tanstack/react-router";
// import { useAuth } from "react-oidc-context";
// import { hasAuthParams } from "react-oidc-context";

export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) => {
    const auth = context.authentication;
    if (!auth.isAuthenticated) {
      throw redirect({ to: "/about" });
    }
  },
});

function Index() {
  return <div className="p-2">Welcome to homepage!</div>;
}
