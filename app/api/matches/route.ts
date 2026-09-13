export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }
    const userId = (session.user as any).id

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
      },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
            profile: { select: { data: true, subRole: true } },
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
            profile: { select: { data: true, subRole: true } },
          },
        },
      },
      orderBy: { score: 'desc' },
    })

    const formatted = (matches ?? []).map((m: any) => {
      const isUserA = m?.userAId === userId
      const otherUser = isUserA ? m?.userB : m?.userA
      const profileData = (otherUser?.profile?.data as Record<string, any>) ?? {}
      return {
        id: m?.id,
        score: m?.score,
        status: m?.status,
        createdAt: m?.createdAt,
        initiatedByMe: isUserA,
        matchedUser: {
          id: otherUser?.id,
          name: otherUser?.name,
          email: otherUser?.email,
          userType: otherUser?.userType,
          subRole: otherUser?.profile?.subRole ?? null,
          profile: profileData,
        },
      }
    })

    return NextResponse.json({ matches: formatted })
  } catch (err: any) {
    console.error('Matches error:', err)
    return NextResponse.json({ error: 'Eşleşmeler getirilemedi.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }
    const body = await request.json()
    const { matchId, action } = body ?? {}

    if (!matchId || !action) {
      return NextResponse.json({ error: 'matchId ve action gerekli.' }, { status: 400 })
    }

    const match = await prisma.match.update({
      where: { id: matchId },
      data: { status: action },
    })

    return NextResponse.json({ success: true, match })
  } catch (err: any) {
    console.error('Match update error:', err)
    return NextResponse.json({ error: 'Eşleşme güncellenemedi.' }, { status: 500 })
  }
}
