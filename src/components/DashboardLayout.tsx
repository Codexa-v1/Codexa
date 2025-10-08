import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, LayoutDashboard, Users, Building2, FileText, LogOut, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Guests", href: "/guests", icon: Users },
    { name: "Vendors", href: "/vendors", icon: Building2 },
    { name: "Documents", href: "/documents", icon: FileText },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                PlanIt
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-muted-foreground">
              Welcome back, <span className="font-semibold text-foreground">User</span>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0 lg:w-20"
          } transition-all duration-300 border-r border-border/50 bg-muted/30 fixed lg:sticky top-16 h-[calc(100vh-4rem)] overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    !sidebarOpen && "lg:justify-center"
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-0" : ""}`}>
          <div className="container mx-auto p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
