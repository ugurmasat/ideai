import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-[1200px] px-4 py-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Image src="/logo.png" alt="IDEAI Logo" width={16} height={16} className="h-4 w-4 object-contain" />
          </div>
          <span className="font-display text-sm font-semibold">IDEAI</span>
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/#ozellikler" className="hover:text-foreground transition-colors">Özellikler</Link>
          <Link href="/#nasil-calisir" className="hover:text-foreground transition-colors">Nasıl Çalışır</Link>
          <Link href="/signup" className="hover:text-foreground transition-colors">Kayıt Ol</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© 2026 IDEAI. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  )
}
