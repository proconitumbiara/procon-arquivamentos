"use client";

<<<<<<< HEAD
<<<<<<< HEAD
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
=======
import {
  File,
  LogOutIcon,
} from "lucide-react";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
>>>>>>> 6dc8cf2 (first commit)
=======
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
<<<<<<< HEAD
<<<<<<< HEAD
=======
  SidebarGroupLabel,
>>>>>>> 6dc8cf2 (first commit)
=======
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth.client";

<<<<<<< HEAD
<<<<<<< HEAD
import AddArchivingForm from "../archiving/_components/add-archiving-form";


export function AppSidebar() {
  const session = authClient.useSession();

=======
// Menu items.
const itemsArchiving = [
  {
    title: "Arquivamentos",
    url: "/archiving",
    icon: File,
  },
];
=======
import AddArchivingForm from "../archiving/_components/add-archiving-form";
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)


export function AppSidebar() {
  const session = authClient.useSession();

<<<<<<< HEAD
  const pathname = usePathname();

  const { setTheme, resolvedTheme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

>>>>>>> 6dc8cf2 (first commit)
=======
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
  const userInitials = session.data?.user?.name
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-background flex items-center justify-center border-b p-4" />

<<<<<<< HEAD
<<<<<<< HEAD
      <SidebarContent className="bg-background flex items-center justify-center">
        {/* Formulário dentro da sidebar */}
        <SidebarGroup className="group-data-[state=collapsed]:hidden">
          <SidebarGroupContent>
            <AddArchivingForm />
          </SidebarGroupContent>
        </SidebarGroup>
=======
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel>Arquivamentos</SidebarGroupLabel>
=======
      <SidebarContent className="bg-background flex items-center justify-center">
        {/* Formulário dentro da sidebar */}
        <SidebarGroup className="group-data-[state=collapsed]:hidden">
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
          <SidebarGroupContent>
            <AddArchivingForm />
          </SidebarGroupContent>
        </SidebarGroup>
<<<<<<< HEAD

>>>>>>> 6dc8cf2 (first commit)
=======
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
      </SidebarContent>

      <SidebarFooter className="bg-background border-t py-4">
        <SidebarMenu>
          <SidebarMenuItem>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)

            <SidebarMenuButton size="lg">
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
            </SidebarMenuButton>
<<<<<<< HEAD
=======
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
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
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {resolvedTheme === "dark" ? "Tema claro" : "Tema escuro"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOutIcon className="mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
>>>>>>> 6dc8cf2 (first commit)
=======
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
