"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Home, LogOut, Menu, MessageSquare, User, X, Settings, HelpCircle } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export function Navbar() {
  const { user, profile, signOut, loading } = useAuth()
  const { unreadCount } = useNotifications()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { toast } = useToast()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Determine if a nav link is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname?.startsWith(path)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HomeHub</span>
            </Link>

            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/properties"
                className={`transition-colors ${
                  isActive("/properties") ? "text-primary font-medium" : "text-foreground/80 hover:text-primary"
                }`}
              >
                Properties
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className={`transition-colors ${
                      isActive("/dashboard") ? "text-primary font-medium" : "text-foreground/80 hover:text-primary"
                    }`}
                  >
                    Dashboard
                  </Link>
                  {profile?.role === "owner" && (
                    <Link
                      href="/properties/new"
                      className={`transition-colors ${
                        isActive("/properties/new")
                          ? "text-primary font-medium"
                          : "text-foreground/80 hover:text-primary"
                      }`}
                    >
                      List Property
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/notifications" className="relative">
                      <Bell className="h-5 w-5 text-foreground/80 hover:text-primary transition-colors" />
                      {unreadCount > 0 && (
                        <Badge
                          variant="default"
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={profile?.avatar_url || "/placeholder.svg"}
                              alt={profile?.full_name || "User"}
                            />
                            <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          <div className="flex flex-col">
                            <span>My Account</span>
                            <span className="text-xs text-muted-foreground capitalize">{profile?.role} Account</span>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/${profile?.role}`} className="cursor-pointer">
                            <Home className="mr-2 h-4 w-4" />
                            <span>{profile?.role === "admin" ? "Admin" : "Dashboard"}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/notifications" className="cursor-pointer">
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                              <Badge variant="default" className="ml-auto text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/messages" className="cursor-pointer">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Messages</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/settings" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/support" className="cursor-pointer">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>Help & Support</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="hidden md:flex md:items-center md:space-x-4">
                    <Link href="/login">
                      <Button variant="ghost">Sign in</Button>
                    </Link>
                    <Link href="/signup">
                      <Button>Sign up</Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            <button
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-foreground/80 hover:bg-accent hover:text-foreground"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/properties"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                isActive("/properties")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground"
              }`}
            >
              Properties
            </Link>

            {user ? (
              <>
                <Link
                  href={`/dashboard/${profile?.role}`}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/dashboard")
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  Dashboard
                </Link>

                {profile?.role === "owner" && (
                  <Link
                    href="/properties/new"
                    className={`block rounded-md px-3 py-2 text-base font-medium ${
                      isActive("/properties/new")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    List Property
                  </Link>
                )}

                <Link
                  href="/profile"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/profile")
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  Profile
                </Link>

                <Link
                  href="/notifications"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/notifications")
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="default" className="ml-2 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>

                <Link
                  href="/messages"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/messages")
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  Messages
                </Link>

                <Link
                  href="/settings"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/settings")
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  Settings
                </Link>

                <button
                  onClick={handleSignOut}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-accent hover:text-destructive"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/login")
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  Sign in
                </Link>

                <Link
                  href="/signup"
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive("/signup")
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
