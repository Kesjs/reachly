import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '~/lib/utils'

export interface SelectFieldOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
  hint?: string
}

// Remplace le <select> natif par un menu aux couleurs de l'app — même
// logique que DatePickerField pour les dates. Générique sur T pour être
// réutilisé partout (fréquence de test, plan, canal d'alerte…).
export function SelectField<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: {
  value: T
  onChange: (value: T) => void
  options: SelectFieldOption<T>[]
  ariaLabel: string
  className?: string
}) {
  const selected = options.find((o) => o.value === value)

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-md border border-border bg-elevated px-3 py-2 text-sm text-ink-primary hover:bg-elevated/80',
            className,
          )}
        >
          <span className="truncate">{selected?.label ?? 'Sélectionner…'}</span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-muted" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-hidden rounded-md border border-border bg-elevated p-1 shadow-lg"
        >
          {options.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              disabled={option.disabled}
              onSelect={() => onChange(option.value)}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-sm text-ink-secondary outline-none hover:bg-canvas hover:text-ink-primary',
                option.disabled && 'cursor-not-allowed opacity-40',
                option.value === value && 'text-ink-primary',
              )}
            >
              <span className="flex flex-col">
                {option.label}
                {option.hint && <span className="text-[11px] text-ink-muted">{option.hint}</span>}
              </span>
              {option.value === value && <Check className="size-3.5 shrink-0 text-brand-text" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
