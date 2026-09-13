'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MatchCard } from '@/components/match-card'
import { Container } from '@/components/layouts/container'
import { Section } from '@/components/layouts/section'
import { PageHeader } from '@/components/layouts/page-header'
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate'
import { toast } from 'sonner'
import { User, Briefcase, TrendingUp, Code2, Sparkles, Bell, CheckCircle2, MessageSquare, XCircle, Search } from 'lucide-react'
import Link from 'next/link'

const USER_TYPE_LABELS: Record<string, string> = {
  idea_owner: 'Fikir Sahibi',
  investor: 'Yatırımcı',
  support_team: 'Destek Ekibi',
}

const USER_TYPE_ICONS: Record<string, React.ReactNode> = {
  idea_owner: <Briefcase className="h-5 w-5" />,
  investor: <TrendingUp className="h-5 w-5" />,
  support_team: <Code2 className="h-5 w-5" />,
}

interface MatchItem {
  id: string
  score: number
  status: string
  createdAt: string
  initiatedByMe: boolean
  matchedUser: {
    id: string
    name: string
    email: string
    userType: string
    subRole?: string | null
    profile?: Record<string, any>
  }
}

export function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loadingMatches, setLoadingMatches] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchData = async () => {
      try {
        const [matchRes, profileRes] = await Promise.all([
          fetch('/api/matches'),
          fetch('/api/onboarding'),
        ])
        const matchData = await matchRes.json()
        const profileData = await profileRes.json()
        setMatches(matchData?.matches ?? [])
        setProfile(profileData?.profile ?? null)
      } catch {
        console.error('Failed to fetch dashboard data')
      } finally {
        setLoadingMatches(false)
      }
    }
    fetchData()
  }, [status])

  const handleMatchAction = async (matchId: string, action: string) => {
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, action }),
      })
      if (res.ok) {
        setMatches((prev) =>
          (prev ?? []).map((m: MatchItem) => (m?.id === matchId ? { ...(m ?? {}), status: action } : m) as MatchItem)
        )
        const messages: Record<string, string> = {
          requested: 'Görüşme talebi gönderildi.',
          accepted: 'Eşleşme kabul edildi.',
          rejected: 'Eşleşme reddedildi.',
        }
        toast.success(messages[action] ?? 'Durum güncellendi.')
      }
    } catch {
      toast.error('Bir hata oluştu.')
    }
  }

  const filterMatches = (status: string) => (matches ?? []).filter((m) => m?.status === status)

  const renderMatchGrid = (items: MatchItem[]) => (
    <Stagger className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
      {items.map((m: MatchItem) => (
        <StaggerItem key={m?.id}>
          <MatchCard
            name={m?.matchedUser?.name ?? 'Kullanıcı'}
            userType={m?.matchedUser?.userType ?? ''}
            score={m?.score ?? 0}
            status={m?.status ?? 'pending'}
            subRole={m?.matchedUser?.subRole}
            profile={m?.matchedUser?.profile}
            onAction={(action) => handleMatchAction(m?.id, action)}
          />
        </StaggerItem>
      ))}
    </Stagger>
  )

  const renderEmpty = (title: string, description: string) => (
    <FadeIn delay={0.2}>
      <Card className="mt-4">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </FadeIn>
  )

  if (status === 'loading') {
    return (
      <Section><Container size="lg">
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Container></Section>
    )
  }

  const userType = (session?.user as any)?.userType ?? ''
  const userName = session?.user?.name ?? 'Kullanıcı'

  return (
    <Section>
      <Container size="lg">
        <FadeIn>
          <PageHeader
            title={`Hoş geldin, ${userName}!`}
            description="Eşleşmelerinizi ve profilinizi buradan yönetin."
            actions={
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="mr-1.5 h-4 w-4" /> Profili Düzenle
                </Button>
              </Link>
            }
          />
        </FadeIn>

        {/* Profile Summary */}
        <FadeIn delay={0.1}>
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {USER_TYPE_ICONS[userType] ?? <User className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rol</p>
                  <p className="font-semibold">{USER_TYPE_LABELS[userType] ?? 'Belirsiz'}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profil Durumu</p>
                  <p className="font-semibold">{profile ? 'Tamamlandı' : 'Eksik'}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Eşleşmeler</p>
                  <p className="font-semibold">{matches?.length ?? 0} eşleşme</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Prompt to complete profile */}
        {!profile && (
          <FadeIn delay={0.2}>
            <Card className="mt-6 border-primary/20 bg-primary/5">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Profilinizi tamamlayın</p>
                    <p className="text-sm text-muted-foreground">Daha iyi eşleşmeler için profil bilgilerinizi girin.</p>
                  </div>
                </div>
                <Link href="/onboarding">
                  <Button size="sm">Tamamla</Button>
                </Link>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Matches */}
        <FadeIn delay={0.3}>
          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Eşleşmeleri
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Profilinize en uygun kişiler.</p>
          </div>
        </FadeIn>

        {loadingMatches ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <Tabs defaultValue="pending" className="mt-4">
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="pending" className="gap-1.5">
                <Search className="h-4 w-4 hidden sm:inline" />
                Keşfet
                {filterMatches('pending').length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">{filterMatches('pending').length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="requested" className="gap-1.5">
                <MessageSquare className="h-4 w-4 hidden sm:inline" />
                Taleplerim
                {filterMatches('requested').length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">{filterMatches('requested').length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="accepted" className="gap-1.5">
                <CheckCircle2 className="h-4 w-4 hidden sm:inline" />
                Kabul Edilenler
                {filterMatches('accepted').length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">{filterMatches('accepted').length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-1.5">
                <XCircle className="h-4 w-4 hidden sm:inline" />
                Reddedilenler
                {filterMatches('rejected').length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">{filterMatches('rejected').length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {filterMatches('pending').length > 0
                ? renderMatchGrid(filterMatches('pending'))
                : renderEmpty('Keşfedilecek eşleşme yok', 'Profilinizi tamamladıktan sonra size uygun kişiler burada listelenecek.')}
            </TabsContent>
            <TabsContent value="requested">
              {filterMatches('requested').length > 0
                ? renderMatchGrid(filterMatches('requested'))
                : renderEmpty('Bekleyen görüşme talebi yok', 'Görüşme talebi gönderdiğiniz kişiler burada görünecek.')}
            </TabsContent>
            <TabsContent value="accepted">
              {filterMatches('accepted').length > 0
                ? renderMatchGrid(filterMatches('accepted'))
                : renderEmpty('Kabul edilen eşleşme yok', 'Kabul ettiğiniz eşleşmeler burada görünecek.')}
            </TabsContent>
            <TabsContent value="rejected">
              {filterMatches('rejected').length > 0
                ? renderMatchGrid(filterMatches('rejected'))
                : renderEmpty('Reddedilen eşleşme yok', 'Reddettiğiniz kişiler burada listelenecek.')}
            </TabsContent>
          </Tabs>
        )}
      </Container>
    </Section>
  )
}
