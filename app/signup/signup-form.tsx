'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Mail, Lock, User, Phone, UserPlus, Lightbulb, TrendingUp, Users } from 'lucide-react'
import { toast } from 'sonner'

const USER_TYPES = [
  { value: 'idea_owner', label: 'Fikir Sahibi', icon: <Lightbulb className="h-4 w-4" />, desc: 'Projenizi tanıtın' },
  { value: 'investor', label: 'Yatırımcı', icon: <TrendingUp className="h-4 w-4" />, desc: 'Yatırım yapın' },
  { value: 'support_team', label: 'Destek Ekibi', icon: <Users className="h-4 w-4" />, desc: 'Uzmanlığınızı sunun' },
]

export function SignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('idea_owner')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !userType) {
      toast.error('Lütfen tüm zorunlu alanları doldurun.')
      return
    }
    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || undefined, password, userType }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'Kayıt başarısız.')
        return
      }
      // Auto sign-in
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (signInResult?.error) {
        toast.error('Kayıt başarılı, giriş yapamıyorum.')
        router.push('/login')
      } else {
        toast.success('Hoş geldiniz!')
        router.push('/onboarding')
      }
    } catch {
      toast.error('Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Ad Soyad *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="name" placeholder="Adınız Soyadınız" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-posta *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="email" type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="phone" placeholder="0555 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Şifre *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="password" type="password" placeholder="En az 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Kullanıcı Tipi *</Label>
        <RadioGroup value={userType} onValueChange={setUserType} className="grid grid-cols-1 gap-2">
          {USER_TYPES.map((t) => (
            <Label
              key={t.value}
              htmlFor={t.value}
              className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                userType === t.value ? 'border-primary bg-primary/5' : 'hover:bg-muted'
              }`}
            >
              <RadioGroupItem value={t.value} id={t.value} />
              <div className="flex items-center gap-2">
                <span className="text-primary">{t.icon}</span>
                <div>
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        <UserPlus className="mr-2 h-4 w-4" />
        Kayıt Ol
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Zaten hesabın var mı?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Giriş Yap
        </Link>
      </p>
    </form>
  )
}
