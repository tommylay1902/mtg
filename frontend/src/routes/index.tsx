import { createFileRoute, redirect } from "@tanstack/react-router";

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
