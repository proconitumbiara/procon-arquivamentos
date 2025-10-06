import LogoutButton from "@/components/ui/logout-button"
import { SidebarProvider } from "@/components/ui/sidebar"
import ThemeToggle from "@/components/ui/theme-toggle"

<<<<<<< HEAD
<<<<<<< HEAD
import { AppSidebar } from "./_components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
=======
=======
import { AppSidebar } from "./_components/app-sidebar"

>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
<<<<<<< HEAD
                <div className="absolute right-3 bottom-3 items-center">
                    <h1 className="text-xl font-bold text-primary">PROCON</h1>
                    <span className="text-sm text-muted-foreground">Itumbiara - GO</span>
                </div>
>>>>>>> 6dc8cf2 (first commit)
=======
>>>>>>> a927d70 (Refactor: UI, responsiveness and usability adjustments)
                <div className="absolute right-2 top-2 items-center">
                    <ThemeToggle />
                    <LogoutButton />
                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}