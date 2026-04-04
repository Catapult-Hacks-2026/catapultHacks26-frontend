import type { ReactNode } from "react";
import SideNav from "@/components/dashboard/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-on-surface font-sans antialiased">
      <SideNav />
      <main className="min-h-screen flex-1 pl-64">{children}</main>
    </div>
  );
}
