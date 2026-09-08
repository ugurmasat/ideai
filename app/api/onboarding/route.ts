export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }
    const userId = (session.user as any).id
    const body = await request.json()
    const { data, subRole } = body ?? {}

    if (!data) {
      return NextResponse.json({ error: 'Profil verisi gereklidir.' }, { status: 400 })
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        data,
        subRole: subRole ?? null,
      },
      update: {
        data,
        subRole: subRole ?? undefined,
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (err: any) {
    console.error('Onboarding error:', err)
    return NextResponse.json({ error: 'Profil kaydedilemedi.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }
    const userId = (session.user as any).id
    const profile = await prisma.profile.findUnique({ where: { userId } })
    return NextResponse.json({ profile })
  } catch (err: any) {
    console.error('Profile fetch error:', err)
    return NextResponse.json({ error: 'Profil getirilemedi.' }, { status: 500 })
  }
}
