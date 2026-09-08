export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body ?? {}
    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre gereklidir.' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Geçersiz e-posta veya şifre.' }, { status: 401 })
    }
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Geçersiz e-posta veya şifre.' }, { status: 401 })
    }
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, userType: user.userType } })
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Giriş başarısız.' }, { status: 500 })
  }
}
