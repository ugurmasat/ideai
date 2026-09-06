'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Stagger, StaggerItem, HoverLift } from '@/components/ui/animate'
import { Lightbulb, TrendingUp, Users } from 'lucide-react'
import { Section } from '@/components/layouts/section'
import { Container } from '@/components/layouts/container'

const features = [
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: 'Fikir Sahibi',
    description:
      'Projenizi tanımlayın, ihtiyaç duyduğunuz sermaye ve uzmanlığı belirtin. AI size en uygun yatırımcı ve ekip arkadaşlarını önerir.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Yatırımcı',
    description:
      'Bütçenizi, ilgi alanlarınızı ve risk seviyenizi belirleyin. Yapay zeka size en yüksek potansiyelli projeleri su nar.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Destek Ekibi',
    description:
      'Yazılımcı, pazarlamacı, tasarımcı, avukat veya danışman olarak katılın. Yeteneklerinize uygun projelerde çalışın.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
]

export function FeaturesSection() {
  return (
    <Section id="ozellikler">
      <Container size="lg">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Üç Farklı Rol, Tek Platform
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Hangi rolde olursanız olun, IDEAI sizi doğru kişilerle buluşturur.
          </p>
        </div>

        <Stagger className="grid gap-6 md:grid-cols-3" staggerDelay={0.15}>
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <HoverLift>
                <Card variant="interactive" className="h-full text-center">
                  <CardHeader>
                    <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl ${f.bg} ${f.color}`}>
                      {f.icon}
                    </div>
                    <CardTitle className="text-xl">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {f.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  )
}
