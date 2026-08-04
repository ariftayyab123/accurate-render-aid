import { Link, useRouterState } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";
import { BrandMark } from "@/components/brand-mark";
import { NAV_GROUPS } from "./nav";

export function AppSidebar() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (router) => router.location.pathname });
  const isActive = (url: string) => pathname === url || pathname === `${url}/`;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-1 py-1.5">
          <BrandMark className="size-7 shrink-0" />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold leading-tight">Retained</p>
            <p className="truncate text-xs text-muted-foreground">{t("brand.tagline")}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {NAV_GROUPS.map((group, index) => (
          <div key={group.label}>
            {index === 1 ? <SidebarSeparator className="my-1" /> : null}
            <SidebarGroup>
              <SidebarGroupLabel>{t(group.key)}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={t(item.key)}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="size-4 shrink-0" />
                          <span className="truncate">{t(item.key)}</span>
                          {item.soon ? (
                            <span className="ml-auto rounded border border-border px-1 text-[10px] uppercase tracking-wide text-muted-foreground group-data-[collapsible=icon]:hidden">
                              {t("nav.soon")}
                            </span>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}