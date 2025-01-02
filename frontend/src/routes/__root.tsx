import { CustomNavBar } from "@/components/menu/CustomNavBar";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthContextProps } from "react-oidc-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

type RouterContext = {
  authentication: AuthContextProps;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <CustomNavBar />
      <hr />
      <QueryClientProvider client={new QueryClient()}>
        <Outlet />
        <Toaster />
      </QueryClientProvider>

      <TanStackRouterDevtools />
    </>
  ),
});
