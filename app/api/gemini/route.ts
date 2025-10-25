import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const body = await req.json()
    const prompt = typeof body?.prompt === 'string' ? body.prompt : ''
    const response = await model.generateContent(prompt)
    const text = response.response.text()

    return NextResponse.json({ text })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    const statusLike = (error as { status?: number | string } | undefined)?.status
    const lower = msg.toLowerCase()
    const looks429 = statusLike === 429 || String(statusLike).toUpperCase() === 'RESOURCE_EXHAUSTED' ||
      lower.includes('429') || lower.includes('quota') || lower.includes('exceed') ||
      (lower.includes('resource') && lower.includes('exhaust'))

    if (looks429) {
      // If it's a navigation request, redirect to friendly page; else return JSON 429 for fetch/XHR
      const mode = req.headers.get('sec-fetch-mode') || ''
      const dest = req.headers.get('sec-fetch-dest') || ''
      const accept = req.headers.get('accept') || ''
      const isNavigate = mode === 'navigate' || dest === 'document' || accept.includes('text/html')
      if (isNavigate) {
        const url = new URL('/service-unavailble', req.url)
        return NextResponse.redirect(url, 307)
      }
      return NextResponse.json({ error: 'QUOTA_EXCEEDED' }, { status: 429 })
    }

    return NextResponse.json({ error: msg || 'Unknown error' }, { status: 500 })
  }
}
