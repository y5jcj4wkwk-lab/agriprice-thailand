import { createRouter } from "@tanstack/react-router";
import { PendingScreen } from "@/components/pending-screen";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultPendingComponent: PendingScreen,
    defaultPreload: "intent",
    scrollRestoration: true,
  });
}
