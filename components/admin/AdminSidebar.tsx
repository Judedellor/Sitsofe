"use client"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Users, Settings, BarChart3, LogOut, X, Shield, MessageSquare, AlertTriangle, Bell } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useAuth()

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard/admin",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Properties",
      path: "/dashboard/admin?tab=properties",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      name: "Users",
      path: "/dashboard/admin?tab=users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Reports",
      path: "/dashboard/admin?tab=reports",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      name: "Messages",
      path: "/dashboard/admin?tab=messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Notifications",
      path: "/dashboard/admin?tab=notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      path: "/dashboard/admin?tab=analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/dashboard/admin?tab=settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant={pathname === item.path ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === item.path ? "bg-primary text-primary-foreground" : "",
                    )}
                    onClick={() => {
                      router.push(item.path)
                      if (window.innerWidth < 768) {
                        onClose()
                      }
                    }}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
