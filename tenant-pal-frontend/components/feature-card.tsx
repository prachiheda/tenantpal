import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
        <Icon className="h-6 w-6 text-emerald-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
