'use client'

import { useState, useEffect } from 'react'
import { Calendar, Users, Clock, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Queue', href: '/queue', icon: Clock },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className={cn(
          "fixed inset-y-0 z-50 flex w-72 flex-col bg-white",
          isSidebarOpen ? "left-0" : "-left-72"
        )}>
          <div className="flex h-16 items-center justify-between border-b px-6">
            <h2 className="text-lg font-semibold">VetCare</h2>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <nav className="flex-1 space-y-1 p-4">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t">
              <div className="mb-2">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
        <main className={cn(
          "flex-1 transition-all duration-200",
          isSidebarOpen ? "ml-72" : "ml-0"
        )}>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}