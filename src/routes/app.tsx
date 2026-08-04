import { useEffect } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app/app-sidebar";
import { TopBar } from "@/components/app/top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth";
import { useWorkspaceLoader } from "@/lib/workspace-sync";
import { useHydrated, useWorkspace } from "@/lib/workspace";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { state } = useWorkspace();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const user = session?.user;
  const workspaceLoaded = useWorkspaceLoader(user?.id, user?.email ?? "");
  const { dir, option } = useI18n();

  useEffect(() => {
    // Only the language marker goes on <html>; direction is applied to the
    // content column so the sidebar chrome keeps its layout.
    document.documentElement.setAttribute("lang", option.locale);
  }, [option.locale]);

  useEffect(() => {
    if (!hydrated || loading) return;
    if (!session) {
      // Demo workspaces stay browser-only and need no account.
      if (!state.signedIn) navigate({ to: "/auth" });
      return;
    }
    if (workspaceLoaded && !state.onboardingComplete) {
      navigate({ to: "/onboarding" });
    }
  }, [hydrated, loading, session, workspaceLoaded, state.signedIn, state.onboardingComplete, navigate]);

  if (!hydrated || loading || (session && !workspaceLoaded)) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-background">
          <TopBar />
          <main dir={dir} className="min-w-0 flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}