export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

const FALLBACK_DATA = [
  { symbol: 'USD/TRY', price: 38.45, change: 0.23 },
  { symbol: 'EUR/TRY', price: 41.12, change: -0.15 },
  { symbol: 'BTC/USD', price: 98750, change: 1.85 },
  { symbol: 'ETH/USD', price: 3845, change: 2.12 },
  { symbol: 'BIST100', price: 11245, change: 0.67 },
  { symbol: 'XAU/USD', price: 2985, change: -0.32 },
]

export async function GET() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,try&include_24hr_change=true',
      { signal: controller.signal, next: { revalidate: 60 } }
    )
    clearTimeout(timeout)

    if (!res.ok) throw new Error('CoinGecko API error')
    const data = await res.json()

    const marketData = [
      { symbol: 'USD/TRY', price: 38.45, change: 0.23 },
      { symbol: 'EUR/TRY', price: 41.12, change: -0.15 },
      {
        symbol: 'BTC/USD',
        price: Math.round(data?.bitcoin?.usd ?? 98750),
        change: Number((data?.bitcoin?.usd_24h_change ?? 1.85).toFixed(2)),
      },
      {
        symbol: 'ETH/USD',
        price: Math.round(data?.ethereum?.usd ?? 3845),
        change: Number((data?.ethereum?.usd_24h_change ?? 2.12).toFixed(2)),
      },
      { symbol: 'BIST100', price: 11245, change: 0.67 },
      { symbol: 'XAU/USD', price: 2985, change: -0.32 },
    ]

    return NextResponse.json({ data: marketData })
  } catch (err: any) {
    console.error('Market API error:', err?.message)
    return NextResponse.json({ data: FALLBACK_DATA })
  }
}
