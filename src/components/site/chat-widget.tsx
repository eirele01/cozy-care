'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircleHeart, X, SendHorizonal, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CHAT_QUICK_REPLIES } from '@/lib/business'
import { cn } from '@/lib/utils'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const GREETING: Msg = {
  role: 'assistant',
  content:
    'Hi! I\'m Coco, CozyCare\'s cleaning buddy. 🧽 Ask me about pricing, services, schedules, or coverage — I reply instantly, 24/7!',
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(false)
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    const content = text.trim()
    if (!content || loading) return

    const next: Msg[] = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-12) }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.reply ?? data.error ?? 'Sorry, please try again!' }])
    } catch {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: 'Hmm, my connection hiccuped! Try again, or reach us at +63 954-324-5023 — we answer fast.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat assistant' : 'Chat with Coco, our AI assistant'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-ring"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <MessageCircleHeart className="h-6 w-6" aria-hidden />}
        {unread && !open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" aria-hidden />
            <span className="relative h-3 w-3 rounded-full border-2 border-background bg-amber-400" aria-hidden />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            role="dialog"
            aria-label="CozyCare AI chat assistant"
            className="fixed bottom-[5.5rem] right-5 z-50 flex h-[32rem] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b bg-primary px-4 py-3.5 text-primary-foreground">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-5 w-5" aria-hidden />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-primary bg-emerald-300" aria-label="Online" />
              </span>
              <div className="flex-1 leading-tight">
                <p className="text-sm font-extrabold">Coco — Cleaning Assistant</p>
                <p className="text-[11px] font-semibold opacity-85">Online 24/7 · replies instantly</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 hover:bg-white/15 transition-colors focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X className="h-4.5 w-4.5" aria-hidden />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="scroll-slim flex-1 space-y-3 overflow-y-auto bg-secondary/40 px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-sm',
                      m.role === 'user'
                        ? 'rounded-br-md bg-primary text-primary-foreground'
                        : 'rounded-bl-md border bg-card text-foreground'
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start" aria-live="polite">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border bg-card px-4 py-3 shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" aria-hidden />
                    <span className="text-xs text-muted-foreground">Coco is typing…</span>
                  </div>
                </div>
              )}

              {/* Quick replies */}
              {messages.length <= 1 && !loading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {CHAT_QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border bg-card px-3 py-1.5 text-[12px] font-semibold text-primary shadow-sm transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t bg-card p-3">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about pricing, areas, schedules…"
                  aria-label="Type your message"
                  maxLength={500}
                  className="h-11 flex-1 rounded-full"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="h-11 w-11 shrink-0 rounded-full"
                >
                  {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden /> : <SendHorizonal className="h-4.5 w-4.5" aria-hidden />}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
