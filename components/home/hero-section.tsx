'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FadeIn, SlideIn } from '@/components/ui/animate'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries?.[0]?.isIntersecting && !animated.current) {
          animated.current = true
          const duration = 1500
          const step = target / (duration / 16)
          let current = 0
          const timer = setInterval(() => {
            current += step
            if (current >= target) {
              current = target
              clearInterval(timer)
            }
            setCount(Math.floor(current))
          }, 16)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="font-mono font-bold text-2xl md:text-3xl text-primary">
      {count.toLocaleString('tr-TR')}{suffix}
    </span>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <Image
        src="/logo.svg"
        alt=""
        fill
        priority
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] dark:opacity-[0.18] object-contain saturate-0 dark:invert"
      />
      <div className="mx-auto max-w-[1200px] px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          <FadeIn>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Yapay Zeka Destekli Eşleştirme</span>
            </div>
          </FadeIn>

          <SlideIn from="bottom" delay={0.1}>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl max-w-4xl">
              Fikirle <span className="text-primary">Parayı</span> Buluştur
            </h1>
          </SlideIn>

          <SlideIn from="bottom" delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Fikir sahiplerini, yatırımcıları ve destek ekiplerini yapay zeka ile eşleştiren
              global platform. Hayallerini gerçeğe dönüştür.
            </p>
          </SlideIn>

          <SlideIn from="bottom" delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="px-8">
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#nasil-calisir">
                <Button size="lg" variant="outline" className="px-8">
                  Nasıl Çalışır?
                </Button>
              </Link>
            </div>
          </SlideIn>

          <FadeIn delay={0.5}>
            <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
              <div className="text-center">
                <AnimatedCounter target={2500} suffix="+" />
                <p className="mt-1 text-sm text-muted-foreground">Aktif Kullanıcı</p>
              </div>
              <div className="text-center">
                <AnimatedCounter target={850} suffix="+" />
                <p className="mt-1 text-sm text-muted-foreground">Başarılı Eşleşme</p>
              </div>
              <div className="text-center">
                <AnimatedCounter target={94} suffix="%" />
                <p className="mt-1 text-sm text-muted-foreground">Memnuniyet</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
