'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarketItem {
  symbol: string
  price: number
  change: number
}

export function MarketTicker() {
  const [data, setData] = useState<MarketItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/market')
        const json = await res.json()
        setData(json?.data ?? [])
      } catch {
        setData([])
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if ((data?.length ?? 0) === 0) return null

  const doubled = [...(data ?? []), ...(data ?? [])]

  return (
    <div className="overflow-hidden border-b bg-card">
      <div className="ticker-scroll flex gap-8 whitespace-nowrap py-2 px-4">
        {doubled.map((item: MarketItem, i: number) => (
          <div key={`${item?.symbol}-${i}`} className="flex items-center gap-2 text-sm font-mono">
            <span className="font-semibold text-foreground">{item?.symbol}</span>
            <span className="text-muted-foreground">
              {typeof item?.price === 'number' && item.price > 1000
                ? item.price.toLocaleString('tr-TR')
                : item?.price?.toFixed?.(2) ?? '0'}
            </span>
            <span
              className={cn(
                'flex items-center gap-0.5',
                (item?.change ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {(item?.change ?? 0) >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {(item?.change ?? 0) >= 0 ? '+' : ''}
              {item?.change?.toFixed?.(2) ?? '0'}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
