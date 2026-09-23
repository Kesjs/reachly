import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  beforeLoad: () => {
    // Redirection vers le nouveau dashboard
    throw redirect({ to: '/dashboard' })
  },
})