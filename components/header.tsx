'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAuthed = status === 'authenticated'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Image src="/logo.png" alt="IDEAI Logo" width={20} height={20} className="h-5 w-5 object-contain" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">IDEAI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {isAuthed ? (
            <>
              <Link href="/dashboard">
                <Button variant={pathname === '/dashboard' ? 'default' : 'ghost'} size="sm">
                  <LayoutDashboard className="mr-1.5 h-4 w-4" />
                  Panel
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant={pathname === '/profile' ? 'default' : 'ghost'} size="sm">
                  <User className="mr-1.5 h-4 w-4" />
                  Profil
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ redirectTo: '/' })}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Giriş Yap</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Ücretsiz Başla</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-2 pt-2">
            {isAuthed ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Panel
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" /> Profil
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => { signOut({ redirectTo: '/' }); setMobileOpen(false) }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Çıkış
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full">Giriş Yap</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Ücretsiz Başla</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
