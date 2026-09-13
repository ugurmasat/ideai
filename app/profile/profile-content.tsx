'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layouts/container'
import { Section } from '@/components/layouts/section'
import { PageHeader } from '@/components/layouts/page-header'
import { FadeIn } from '@/components/ui/animate'
import { toast } from 'sonner'
import { Save, User, Mail, Phone, Shield, Edit2 } from 'lucide-react'

const USER_TYPE_LABELS: Record<string, string> = {
  idea_owner: 'Fikir Sahibi',
  investor: 'Yatırımcı',
  support_team: 'Destek Ekibi',
}

const SUB_ROLE_LABELS: Record<string, string> = {
  developer: 'Yazılımcı',
  marketer: 'Pazarlamacı',
  designer: 'Tasarımcı',
  lawyer: 'Avukat',
  consultant: 'Danışman',
  manufacturer: 'Üretici',
}

const STAGE_LABELS: Record<string, string> = {
  idea: 'Fikir Aşaması',
  mvp: 'MVP (Ürün Geliştiriliyor)',
  early_revenue: 'İlk Gelir Elde Ediyor',
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
}

const PROFILE_FIELD_LABELS: Record<string, string> = {
  title: 'Fikir Başlığı',
  description: 'Açıklama',
  sector: 'Sektör',
  stage: 'Proje Aşaması',
  capital: 'Sermaye',
  capitalCurrency: 'Para Birimi',
  weeklyHours: 'Haftalık Süre (saat)',
  budget: 'Bütçe',
  interests: 'İlgi Alanları',
  riskLevel: 'Risk Seviyesi',
  country: 'Ülke',
  city: 'Şehir',
  expertise: 'Uzmanlık',
  workModel: 'Çalışma Modeli',
  experience: 'Deneyim (yıl)',
}

function formatCurrency(value: string, currency: string) {
  const num = Number(value)
  if (Number.isNaN(num)) return value || '-'
  const symbol = CURRENCY_SYMBOLS[currency] ?? '₺'
  return `${num.toLocaleString('tr-TR')} ${symbol}`
}

function formatValue(key: string, value: string, data: Record<string, string>) {
  if (key === 'stage') return STAGE_LABELS[value] ?? value || '-'
  if (key === 'capital') return formatCurrency(value, data?.capitalCurrency ?? 'TRY')
  if (key === 'budget') return formatCurrency(value, data?.budgetCurrency ?? 'TRY')
  if (key === 'riskLevel') {
    const map: Record<string, string> = { low: 'Düşük Risk', medium: 'Orta Risk', high: 'Yüksek Risk' }
    return map[value] ?? value || '-'
  }
  if (key === 'workModel') {
    const map: Record<string, string> = { partnership: 'Ortaklık', salary: 'Maaşlı', equity: 'Hisse', hybrid: 'Karma', freelance: 'Freelance', volunteer: 'Gönüllü' }
    return map[value] ?? value || '-'
  }
  return value || '-'
}

export function ProfileContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/onboarding')
        const data = await res.json()
        setProfile(data?.profile ?? null)
        setFormData((data?.profile?.data as Record<string, string>) ?? {})
      } catch {
        console.error('Profile fetch failed')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [status])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: formData,
          subRole: profile?.subRole ?? null,
        }),
      })
      if (res.ok) {
        toast.success('Profil güncellendi!')
        setEditing(false)
        const updatedRes = await fetch('/api/onboarding')
        const updatedData = await updatedRes.json()
        setProfile(updatedData?.profile ?? null)
      } else {
        toast.error('Güncelleme başarısız.')
      }
    } catch {
      toast.error('Bir hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <Section><Container size="lg">
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Container></Section>
    )
  }

  const userType = (session?.user as any)?.userType ?? ''

  return (
    <Section>
      <Container size="lg">
        <FadeIn>
          <PageHeader
            title="Profil"
            description="Kişisel ve profesyonel bilgilerinizi görüntüleyin ve düzenleyin."
            actions={
              !editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Edit2 className="mr-1.5 h-4 w-4" /> Düzenle
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} loading={saving}>
                    <Save className="mr-1.5 h-4 w-4" /> Kaydet
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setEditing(false); setFormData((profile?.data as Record<string, string>) ?? {}) }}>
                    İptal
                  </Button>
                </div>
              )
            }
          />
        </FadeIn>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Account Info */}
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Hesap Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">E-posta</p>
                    <p className="text-sm font-medium" suppressHydrationWarning>{session?.user?.email ?? ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Rol</p>
                    <div className="flex items-center gap-2">
                      <Badge>{USER_TYPE_LABELS[userType] ?? userType}</Badge>
                      {profile?.subRole && (
                        <Badge variant="secondary">{SUB_ROLE_LABELS[profile.subRole] ?? profile.subRole}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Profile Data */}
          <FadeIn delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Profil Detayları</CardTitle>
                <CardDescription>
                  {profile ? 'Profilinizde kaydedilen bilgiler.' : 'Henüz profil oluşturulmamış.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile ? (
                  <div className="space-y-3">
                    {Object.entries((profile?.data as Record<string, string>) ?? {})
                      .filter(([key]) => key !== 'capitalCurrency' && key !== 'budgetCurrency')
                      .map(([key, value]: [string, string]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground">{PROFILE_FIELD_LABELS[key] ?? key}</p>
                          {editing ? (
                            <Input
                              value={formData?.[key] ?? ''}
                              onChange={(e) => setFormData((prev) => ({ ...(prev ?? {}), [key]: e.target.value }))}
                              className="mt-1"
                            />
                          ) : (
                            <p className="text-sm font-medium">{formatValue(key, value, (profile?.data as Record<string, string>) ?? {})}</p>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground text-sm">Profil bilgilerinizi tamamlamak için onboarding sayfasına gidin.</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => router.push('/onboarding')}>
                      Profili Tamamla
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}
