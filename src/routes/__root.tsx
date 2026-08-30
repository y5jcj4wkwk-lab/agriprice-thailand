import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppProviders } from "@/components/providers";
import { AppErrorComponent } from "@/lib/error-component";
import appCss from "../styles.css?url";

const APP_NAME = "AgriPrice Thailand";
const BASE = import.meta.env.BASE_URL || "/";
const asset = (path: string) => `${BASE}${path.replace(/^\//, "")}`;


export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: "ระบบติดตามราคาพืชผลทางการเกษตรและวิเคราะห์แนวโน้มตลาดด้วย AI",
      },
      { name: "theme-color", content: "#16a34a" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: asset("favicon.svg") },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: asset("__grok/manifest.webmanifest") },
      { rel: "apple-touch-icon", href: asset("__grok/icon-180.png") },
    ],
  }),
  errorComponent: AppErrorComponent,
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="th" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <AppProviders>
            <Outlet />
          </AppProviders>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
