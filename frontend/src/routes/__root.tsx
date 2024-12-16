import { CustomNavBar } from "@/components/menu/CustomNavBar";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthContextProps } from "react-oidc-context";

type RouterContext = {
  authentication: AuthContextProps;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <CustomNavBar />
      <hr />

      <Outlet />

      <TanStackRouterDevtools />
    </>
  ),
});
