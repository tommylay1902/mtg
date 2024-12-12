import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  beforeLoad: ({ context }) => {
    if (!context.authentication) {
      return;
    }

    if (context.authentication.isLoading) {
      console.log("loading");
      return;
    }

    if (!context.authentication.isAuthenticated) {
      console.log("redirecting");
      throw context.authentication.signinRedirect();
    } else {
      console.log(context.authentication);
    }
  },
  component: About,
});

function About() {
  return <div className="p-2">Hello from About </div>;
}
