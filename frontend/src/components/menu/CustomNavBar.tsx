"use client";

import { NavigationMenuItem } from "@radix-ui/react-navigation-menu";

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Link } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import { Button } from "../ui/button";

export const CustomNavBar = () => {
  const auth = useAuth();

  const login = () => {
    throw auth.signinRedirect();
  };

  const logout = () => {
    throw auth.signoutRedirect();
  };

  return (
    <>
      <NavigationMenu>
        <NavigationMenuList className={"w-[99vw]"}>
          {auth.isAuthenticated ? (
            <>
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/medication">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Medication
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          ) : (
            <></>
          )}

          <NavigationMenuItem className={"grow"}>
            <Link href="/about">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {auth.isAuthenticated ? (
            <NavigationMenuItem className={"p-2"}>
              <Button size="sm" className={"bg-red-600"} onClick={logout}>
                Logout
              </Button>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem className={"p-2"}>
              <Button size="sm" className={"bg-cyan-600"} onClick={login}>
                Login
              </Button>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default CustomNavBar;
