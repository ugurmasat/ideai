'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/ui/animate'
import { Section } from '@/components/layouts/section'
import { Container } from '@/components/layouts/container'
import { Rocket } from 'lucide-react'

export function CTASection() {
  return (
    <Section>
      <Container size="lg">
        <FadeIn>
          <div className="rounded-2xl bg-primary p-8 md:p-16 text-center text-primary-foreground">
            <Rocket className="mx-auto mb-4 h-10 w-10" />
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Hazır mısın?
            </h2>
            <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
              Binlerce fikir sahibi, yatırımcı ve profesyonel seni bekliyor.
              Şimdi katıl ve fırsatları yakala.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="mt-6 px-8">
                Hemen Kayıt Ol
              </Button>
            </Link>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}
