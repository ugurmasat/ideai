'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { User, Briefcase, Code2, MessageSquare } from 'lucide-react'
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

interface MatchCardProps {
  name: string
  userType: string
  score: number
  status: string
  onAction?: (action: string) => void
}

export function MatchCard({ name, userType, score, status, onAction }: MatchCardProps) {
  const scoreColor = (score ?? 0) >= 80 ? 'text-emerald-500' : (score ?? 0) >= 60 ? 'text-amber-500' : 'text-red-500'

  return (
    <HoverLift>
      <Card variant="interactive" className="h-full">
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
                </p>
              </div>
            </div>
            <Badge variant={status === 'accepted' ? 'default' : 'secondary'}>
              {status === 'pending' ? 'Bekliyor' : status === 'accepted' ? 'Kabul' : 'Reddedildi'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">AI Uyum Skoru</span>
              <span className={`font-mono font-bold ${scoreColor}`}>%{score ?? 0}</span>
            </div>
            <Progress value={score ?? 0} className="h-2" />
          </div>
          {status === 'pending' && onAction && (
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => onAction?.('accepted')}>
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                Görüşme Talebi
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => onAction?.('rejected')}>
                Reddet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </HoverLift>
  )
}
