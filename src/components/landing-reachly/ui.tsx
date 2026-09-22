import type { ReactNode } from 'react'

export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-1200 px-6 md:px-8 ${className}`}>{children}</div>
}

export function Button({
  children,
  href = '#',
  variant = 'primary',
  className = '',
}: {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'ghost'
  className?: string
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-5 py-3 text-[15px] font-semibold transition-colors duration-150'
  const variants = {
    primary: 'bg-brand text-canvas hover:bg-brand-hover',
    ghost:
      'bg-transparent text-ink-primary border border-border-strong hover:border-brand/60 hover:text-white',
  }
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </a>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[13px] font-medium text-ink-secondary">
      <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-dot" />
      {children}
    </span>
  )
}
