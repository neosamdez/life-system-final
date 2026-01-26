"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ScrollText, Trophy, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/api";
import { useRouter } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Quests",
    href: "/dashboard/quests",
    icon: ScrollText,
  },
  {
    title: "Rank",
    href: "/dashboard/rank",
    icon: Trophy,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card/50 backdrop-blur-sm">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Life System</h1>
        <p className="text-xs text-muted-foreground">Solo Leveling Edition</p>
      </div>
      
      <div className="flex-1 px-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" size="sm">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" 
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
