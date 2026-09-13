'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Container } from '@/components/layouts/container'
import { Section } from '@/components/layouts/section'
import { FadeIn } from '@/components/ui/animate'
import { toast } from 'sonner'
import { Save, Briefcase, DollarSign, Code2, Palette, Scale, Megaphone, Wrench, HelpCircle } from 'lucide-react'

const SUB_ROLES = [
  { value: 'developer', label: 'Yazılımcı', icon: <Code2 className="h-4 w-4" /> },
  { value: 'marketer', label: 'Pazarlamacı', icon: <Megaphone className="h-4 w-4" /> },
  { value: 'designer', label: 'Tasarımcı', icon: <Palette className="h-4 w-4" /> },
  { value: 'lawyer', label: 'Avukat', icon: <Scale className="h-4 w-4" /> },
  { value: 'consultant', label: 'Danışman', icon: <HelpCircle className="h-4 w-4" /> },
  { value: 'manufacturer', label: 'Üretici', icon: <Wrench className="h-4 w-4" /> },
]

const STAGE_OPTIONS = [
  { value: 'idea', label: 'Fikir Aşaması' },
  { value: 'mvp', label: 'MVP (Ürün Geliştiriliyor)' },
  { value: 'early_revenue', label: 'İlk Gelir Elde Ediyor' },
]

const CURRENCY_OPTIONS = [
  { value: 'TRY', label: 'TL (₺)', symbol: '₺' },
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
]

export function OnboardingContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [subRole, setSubRole] = useState('')
  const userType = (session?.user as any)?.userType ?? 'idea_owner'

  // Form states
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...(prev ?? {}), [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: formData,
          subRole: userType === 'support_team' ? subRole : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'Profil kaydedilemedi.')
        return
      }
      toast.success('Profiliniz kaydedildi!')
      router.push('/dashboard')
    } catch {
      toast.error('Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <Section><Container size="sm">
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Container></Section>
    )
  }

  return (
    <Section>
      <Container size="sm">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">Profilini Tamamla</h1>
            <p className="mt-2 text-muted-foreground">Detaylı bilgileriniz, eşleştirme kalitesini artırır.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {userType === 'idea_owner' && <><Briefcase className="h-5 w-5 text-primary" /> Fikir Sahibi Profili</>}
                {userType === 'investor' && <><DollarSign className="h-5 w-5 text-primary" /> Yatırımcı Profili</>}
                {userType === 'support_team' && <><Code2 className="h-5 w-5 text-primary" /> Destek Ekibi Profili</>}
              </CardTitle>
              <CardDescription>Aşağıdaki bilgileri doldurarak profilinizi oluşturun.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Support Team: Sub-role selection */}
                {userType === 'support_team' && (
                  <div className="space-y-2">
                    <Label>Uzmanlık Alanı *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {SUB_ROLES.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSubRole(role.value)}
                          className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                            subRole === role.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {role.icon}
                          {role.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Idea Owner Fields */}
                {userType === 'idea_owner' && (
                  <>
                    <div className="space-y-2">
                      <Label>Fikir Başlığı *</Label>
                      <Input placeholder="Projenizin adı" value={formData?.title ?? ''} onChange={(e) => updateField('title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Kısa Açıklama *</Label>
                      <Textarea placeholder="Projenizi kısaca açıklayın" value={formData?.description ?? ''} onChange={(e) => updateField('description', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sektör</Label>
                        <Select value={formData?.sector ?? ''} onValueChange={(v) => updateField('sector', v)}>
                          <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                          <SelectContent>
                            {['Teknoloji', 'Sağlık', 'Eğitim', 'Finans', 'E-ticaret', 'Tarım', 'Enerji', 'Lojistik', 'Medya', 'Diğer'].map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Proje Aşaması</Label>
                        <Select value={formData?.stage ?? ''} onValueChange={(v) => updateField('stage', v)}>
                          <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                          <SelectContent>
                            {STAGE_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>İhtiyaç Duyulan Sermaye</Label>
                        <Input type="number" placeholder="100.000" value={formData?.capital ?? ''} onChange={(e) => updateField('capital', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Para Birimi</Label>
                        <Select value={formData?.capitalCurrency ?? 'TRY'} onValueChange={(v) => updateField('capitalCurrency', v)}>
                          <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                          <SelectContent>
                            {CURRENCY_OPTIONS.map((c) => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Haftalık Süre (saat)</Label>
                      <p className="text-xs text-muted-foreground">Projeye ayırabileceğiniz haftalık çalışma saati.</p>
                      <Input type="number" placeholder="20" value={formData?.weeklyHours ?? ''} onChange={(e) => updateField('weeklyHours', e.target.value)} />
                    </div>
                  </>
                )}

                {/* Investor Fields */}
                {userType === 'investor' && (
                  <>
                    <div className="space-y-2">
                      <Label>Yatırım Bütçesi (₺) *</Label>
                      <Input type="number" placeholder="500.000" value={formData?.budget ?? ''} onChange={(e) => updateField('budget', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>İlgi Alanları</Label>
                      <Input placeholder="Teknoloji, Sağlık, Finans" value={formData?.interests ?? ''} onChange={(e) => updateField('interests', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Risk Seviyesi</Label>
                      <Select value={formData?.riskLevel ?? ''} onValueChange={(v) => updateField('riskLevel', v)}>
                        <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Düşük Risk</SelectItem>
                          <SelectItem value="medium">Orta Risk</SelectItem>
                          <SelectItem value="high">Yüksek Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ülke</Label>
                        <Input placeholder="Türkiye" value={formData?.country ?? ''} onChange={(e) => updateField('country', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Şehir</Label>
                        <Input placeholder="İstanbul" value={formData?.city ?? ''} onChange={(e) => updateField('city', e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                {/* Support Team Fields */}
                {userType === 'support_team' && (
                  <>
                    <div className="space-y-2">
                      <Label>Uzmanlık Detayı *</Label>
                      <Input placeholder="Örn: React, Node.js, Mobil Uygulama" value={formData?.expertise ?? ''} onChange={(e) => updateField('expertise', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Çalışma Modeli</Label>
                      <Select value={formData?.workModel ?? ''} onValueChange={(v) => updateField('workModel', v)}>
                        <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="partnership">Ortaklık</SelectItem>
                          <SelectItem value="salary">Maaşlı</SelectItem>
                          <SelectItem value="equity">Hisse</SelectItem>
                          <SelectItem value="hybrid">Karma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Haftalık Süre (saat)</Label>
                        <Input type="number" placeholder="20" value={formData?.weeklyHours ?? ''} onChange={(e) => updateField('weeklyHours', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Deneyim (yıl)</Label>
                        <Input type="number" placeholder="5" value={formData?.experience ?? ''} onChange={(e) => updateField('experience', e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" loading={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  Profili Kaydet
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </Section>
  )
}
