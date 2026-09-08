export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, phone, userType } = body ?? {}

    if (!email || !password || !name || !userType) {
      return NextResponse.json(
        { error: 'Ad, e-posta, şifre ve kullanıcı tipi zorunludur.' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kayıtlı.' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        passwordHash,
        userType,
      },
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, userType: user.userType },
    })
  } catch (err: any) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Kayıt başarısız.' }, { status: 500 })
  }
}
