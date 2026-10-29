'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BeforeAfterSliderProps {
  before: string
  after: string
  alt: string
  className?: string
}

/** Draggable before/after comparison slider (pointer + keyboard accessible) */
export function BeforeAfterSlider({ before, after, alt, className }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(96, Math.max(4, pct)))
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setDragging(true)
    updateFromClientX(e.clientX)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    updateFromClientX(e.clientX)
  }

  const endDrag = () => setDragging(false)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setPos((p) => Math.max(4, p - 4))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setPos((p) => Math.min(96, p + 4))
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none overflow-hidden rounded-2xl border bg-muted shadow-sm touch-none',
        dragging ? 'cursor-grabbing' : 'cursor-grab',
        className
      )}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      {/* After (base, defines layout) */}
      <Image
        src={after}
        alt={`${alt} — after CozyCare PH deep cleaning`}
        width={1152}
        height={864}
        className="pointer-events-none block w-full object-cover"
        draggable={false}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Before (clipped overlay) */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={before}
          alt=""
          width={1152}
          height={864}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
        After
      </span>

      {/* Handle */}
      <div className="absolute inset-y-0 z-10" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.45)]" />
        <button
          type="button"
          role="slider"
          aria-label={`Reveal before and after comparison for ${alt}. Use arrow keys to move.`}
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <ChevronsLeftRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
