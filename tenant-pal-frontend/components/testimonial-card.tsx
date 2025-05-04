interface TestimonialCardProps {
    quote: string
    author: string
    role: string
    imageUrl: string
  }
  
  export default function TestimonialCard({ quote, author, role, imageUrl }: TestimonialCardProps) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <span className="absolute -left-3 -top-2 text-5xl text-emerald-200">&quot;</span>
            <p className="relative text-muted-foreground z-10">{quote}</p>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img src={imageUrl || "/placeholder.svg"} alt={author} className="h-full w-full object-cover" />
            </div>
            <div>
              <h4 className="font-semibold">{author}</h4>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  