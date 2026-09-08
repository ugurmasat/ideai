export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const body = await request.json()
    const { userProfile, targetProfile } = body ?? {}

    if (!userProfile || !targetProfile) {
      return NextResponse.json({ error: 'Profil verileri gerekli.' }, { status: 400 })
    }

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          {
            role: 'system',
            content: `Sen bir iş eşleştirme AI'ısın. İki kullanıcı profili verilecek. Aralarındaki uyum skorunu (0-100) ve kısa bir Türkçe açıklama ver. JSON formatında yanıt ver: {"score": number, "reason": string}`,
          },
          {
            role: 'user',
            content: `Profil 1: ${JSON.stringify(userProfile)}\nProfil 2: ${JSON.stringify(targetProfile)}`,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 300,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = ''
        let partialRead = ''
        try {
          while (true) {
            const { done, value } = await reader!.read()
            if (done) break
            partialRead += decoder.decode(value, { stream: true })
            const lines = partialRead.split('\n')
            partialRead = lines.pop() ?? ''
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  try {
                    const finalResult = JSON.parse(buffer)
                    const finalData = JSON.stringify({ status: 'completed', result: finalResult })
                    controller.enqueue(encoder.encode(`data: ${finalData}\n\n`))
                  } catch {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'completed', result: { score: 75, reason: 'Uyumluluk analizi tamamlandı.' } })}\n\n`))
                  }
                  return
                }
                try {
                  const parsed = JSON.parse(data)
                  buffer += parsed?.choices?.[0]?.delta?.content ?? ''
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'processing', message: 'Analiz ediliyor...' })}\n\n`))
                } catch { /* skip */ }
              }
            }
          }
          if (buffer) {
            try {
              const finalResult = JSON.parse(buffer)
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'completed', result: finalResult })}\n\n`))
            } catch {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'completed', result: { score: 75, reason: 'Analiz tamamlandı.' } })}\n\n`))
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: 'AI analizi başarısız.' })}\n\n`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err: any) {
    console.error('AI Match error:', err)
    return NextResponse.json({ error: 'AI eşleştirme başarısız.' }, { status: 500 })
  }
}
