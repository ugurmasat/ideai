'use client'

import { FadeIn } from '@/components/ui/animate'
import { Section } from '@/components/layouts/section'
import { Container } from '@/components/layouts/container'
import { UserPlus, FileText, Cpu, Handshake } from 'lucide-react'

const steps = [
  { icon: <UserPlus className="h-6 w-6" />, title: 'Kayıt Ol', desc: 'Rolünüzü seçin ve hesabınızı oluşturun.' },
  { icon: <FileText className="h-6 w-6" />, title: 'Profilini Tamamla', desc: 'Detaylı bilgilerinizi girerek eşleştirme kalitesini artırın.' },
  { icon: <Cpu className="h-6 w-6" />, title: 'AI Eşleştirme', desc: 'Yapay zeka, profilinize en uygun kişileri bulur.' },
  { icon: <Handshake className="h-6 w-6" />, title: 'İşbirliği Yap', desc: 'Görüşme talebi gönderin ve ortaklık kurun.' },
]

export function HowItWorks() {
  return (
    <Section id="nasil-calisir" className="bg-muted/50">
      <Container size="lg">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Nasıl Çalışır?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Dört basit adımda hayallerinizi gerçeğe dönüştürün.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.15}>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
