'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { User, Briefcase, Code2, MessageSquare, CheckCircle2, XCircle } from 'lucide-react'
import { HoverLift } from '@/components/ui/animate'

const USER_TYPE_LABELS: Record<string, string> = {
  idea_owner: 'Fikir Sahibi',
  investor: 'Yatırımcı',
  support_team: 'Destek Ekibi',
}

const USER_TYPE_ICONS: Record<string, React.ReactNode> = {
  idea_owner: <Briefcase className="h-5 w-5" />,
  investor: <User className="h-5 w-5" />,
  support_team: <Code2 className="h-5 w-5" />,
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor',
  requested: 'Talep Gönderildi',
  accepted: 'Kabul Edildi',
  rejected: 'Reddedildi',
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  requested: 'default',
  accepted: 'default',
  rejected: 'destructive',
}

interface MatchedProfile {
  title?: string
  description?: string
  bio?: string
  investmentAreas?: string
  skills?: string
  interests?: string
  expertise?: string
  sector?: string
  stage?: string
  capital?: string
  capitalCurrency?: string
  budget?: string
  budgetCurrency?: string
  [key: string]: any
}

interface MatchCardProps {
  name: string
  userType: string
  score: number
  status: string
  subRole?: string | null
  profile?: MatchedProfile
  onAction?: (action: string) => void
}

function getProfileSummary(userType: string, profile?: MatchedProfile) {
  if (!profile) return null
  switch (userType) {
    case 'investor':
      return profile.investmentAreas || profile.interests || profile.bio || null
    case 'support_team':
      return profile.skills || profile.expertise || profile.bio || null
    case 'idea_owner':
      return profile.title || profile.description || profile.bio || null
    default:
      return profile.bio || null
  }
}

function getProfileDetail(userType: string, profile?: MatchedProfile) {
  if (!profile) return null
  const parts: string[] = []
  if (userType === 'idea_owner') {
    if (profile.sector) parts.push(`Sektör: ${profile.sector}`)
    if (profile.stage) parts.push(`Aşama: ${profile.stage}`)
  }
  if (userType === 'investor') {
    if (profile.interests) parts.push(`İlgi: ${profile.interests}`)
  }
  if (userType === 'support_team') {
    if (profile.expertise) parts.push(`Uzmanlık: ${profile.expertise}`)
    if (profile.workModel) parts.push(`Model: ${profile.workModel}`)
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

export function MatchCard({ name, userType, score, status, subRole, profile, onAction }: MatchCardProps) {
  const scoreColor = (score ?? 0) >= 80 ? 'text-emerald-500' : (score ?? 0) >= 60 ? 'text-amber-500' : 'text-red-500'
  const summary = getProfileSummary(userType, profile)
  const detail = getProfileDetail(userType, profile)

  return (
    <HoverLift>
      <Card variant="interactive" className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {USER_TYPE_ICONS[userType] ?? <User className="h-5 w-5" />}
              </div>
              <div>
                <CardTitle className="text-base">{name ?? 'Kullanıcı'}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {USER_TYPE_LABELS[userType] ?? userType}
                  {subRole ? ` · ${subRole}` : ''}
                </p>
              </div>
            </div>
            <Badge variant={STATUS_VARIANTS[status] ?? 'secondary'}>
              {STATUS_LABELS[status] ?? status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">AI Uyum Skoru</span>
              <span className={`font-mono font-bold ${scoreColor}`}>%{score ?? 0}</span>
            </div>
            <Progress value={score ?? 0} className="h-2" />
          </div>

          {(summary || detail) && (
            <div className="mb-4 space-y-1.5 rounded-lg bg-muted/50 p-3 text-sm">
              {summary && (
                <p className="line-clamp-3 text-foreground/90">
                  <span className="font-medium">{userType === 'investor' ? 'Yatırım Alanları: ' : userType === 'support_team' ? 'Hünerler: ' : 'Fikir: '}</span>
                  {summary}
                </p>
              )}
              {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
            </div>
          )}

          <div className="mt-auto">
            {status === 'pending' && onAction && (
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => onAction?.('requested')}>
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  Görüşme Talebi
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => onAction?.('rejected')}>
                  Reddet
                </Button>
              </div>
            )}
            {status === 'requested' && onAction && (
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => onAction?.('accepted')}>
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Kabul Et
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => onAction?.('rejected')}>
                  <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  Reddet
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </HoverLift>
  )
}
