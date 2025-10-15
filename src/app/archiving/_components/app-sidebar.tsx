"use client";

import {
  BarChart,
  FileText,
  ListChecks,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth.client";

// Menu items.
const itemsArchiving = [

  {
    title: "Registrar processo",
    url: "/archiving/register",
    icon: PlusCircle,
  },
  {
    title: "Gerenciar processos",
    url: "/archiving/audit",
    icon: ListChecks,
  },
];

const itemsReports = [
  {
    title: "Relatório de processos",
    url: "/archiving/reports",
    icon: FileText,
  },
  {
    title: "Relatório de resultados",
    url: "/archiving/dashboard",
    icon: BarChart,
  },
];


export function AppSidebar() {
  const session = authClient.useSession();

  const pathname = usePathname();

  const userInitials = session.data?.user?.name
    ?.split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-background flex items-center justify-center border-b p-4" />

      <SidebarContent className="bg-background">

        <SidebarGroup>
          <SidebarGroupLabel>Arquivamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsArchiving.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Relatórios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsReports.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter className="bg-background border-t py-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Avatar className="h-12 w-12 rounded-full border-2 border-green-500 group-data-[state=collapsed]:h-8 group-data-[state=collapsed]:w-8">
              <AvatarImage src={session.data?.user?.image || ""} />
              {!session.data?.user?.image && (
                <AvatarFallback>{userInitials}</AvatarFallback>
              )}
            </Avatar>
            <div className="group-data-[state=collapsed]:hidden">
              <p className="text-sm">{session.data?.user?.name}</p>
              <p className="text-muted-foreground text-xs">
                {session.data?.user.email}
              </p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
