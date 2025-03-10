import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider >
      <AppSidebar />
      <SidebarInset>
        <main>
          <DashboardHeader />
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}