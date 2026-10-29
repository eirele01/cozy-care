import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/30'
          )}
          aria-hidden
        />
      ))}
    </span>
  )
}
