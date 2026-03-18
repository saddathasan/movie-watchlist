import { Trash2 } from 'lucide-react'

import { TooltipIconButton } from '#/components'

interface DeleteButtonProps {
  title: string
  onDelete: () => void
}

export function DeleteButton({ title, onDelete }: DeleteButtonProps) {
  return (
    <TooltipIconButton
      icon={<Trash2 className="size-4" />}
      label={`Remove ${title} from watchlist`}
      onClick={onDelete}
    />
  )
}
