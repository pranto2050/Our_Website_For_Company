import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  TicketCheck, 
  Settings, 
  LogOut,
  Shield,
  Bell,
  ChevronLeft,
  ChevronRight,
  Package,
  Menu,
  X,
  CreditCard,
  FolderOpen,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Clients", url: "/admin/clients", icon: Users },
  { title: "Projects", url: "/admin/projects", icon: FolderKanban },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Support Tickets", url: "/admin/tickets", icon: TicketCheck },
  { title: "Services", url: "/admin/services", icon: Package },
  { title: "Categories", url: "/admin/categories", icon: FolderOpen },
  { title: "Project Tiers", url: "/admin/tiers", icon: Crown },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold hidden sm:block">
                ABIT <span className="text-accent">Admin</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-accent/10 rounded-full">
              <Shield className="w-3 h-3 text-accent" />
              <span className="text-xs font-medium text-accent">Admin Panel</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden sm:flex">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <Button variant="outline" size="icon" onClick={handleSignOut} className="sm:hidden">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed lg:sticky top-[65px] left-0 z-40 h-[calc(100vh-65px)] bg-card border-r border-border transition-all duration-300",
            collapsed ? "w-16" : "w-64",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-3">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive(item.url)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </Link>
                ))}
              </nav>
            </ScrollArea>

            {/* Collapse Button */}
            <div className="hidden lg:block p-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span>Collapse</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-h-[calc(100vh-65px)] transition-all duration-300",
          collapsed ? "lg:ml-0" : "lg:ml-0"
        )}>
          <div className="p-4 md:p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}