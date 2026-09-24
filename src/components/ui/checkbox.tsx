import * as React from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '~/lib/utils'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

/**
 * Checkbox stylée maison (pas de <input type="checkbox"> nu à l'écran).
 * L'input natif reste présent mais visuellement masqué, pour garder
 * l'accessibilité clavier/lecteur d'écran gratuite ; le carré visible
 * est un <span> animé avec les mêmes tokens que Button (brand/border).
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, className, id, ...props }, ref) => {
    return (
      <span className="relative inline-flex h-5 w-5 shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
          {...props}
        />
        <span
          className={cn(
            'pointer-events-none flex h-5 w-5 items-center justify-center rounded-md border transition-colors',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
            checked
              ? 'border-brand bg-brand'
              : 'border-border bg-elevated peer-hover:border-brand/50',
            className
          )}
        >
          {checked && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="h-3.5 w-3.5 text-canvas" strokeWidth={3} />
            </motion.span>
          )}
        </span>
      </span>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
