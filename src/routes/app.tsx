import { useEffect } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppSidebar } from "@/components/app/app-sidebar";
import { TopBar } from "@/components/app/top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { state } = useWorkspace();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.signedIn) {
      navigate({ to: "/" });
    } else if (!state.onboardingComplete) {
      navigate({ to: "/onboarding" });
    }
  }, [state.signedIn, state.onboardingComplete, navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-background">
          <TopBar />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}