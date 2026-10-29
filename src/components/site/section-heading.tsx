import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from './reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  sub?: string
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeading({ eyebrow, title, sub, align = 'center', className }: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left max-w-2xl',
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-balance">{title}</h2>
      {sub ? <p className="mt-3 text-base md:text-lg text-muted-foreground text-pretty">{sub}</p> : null}
    </Reveal>
  )
}
