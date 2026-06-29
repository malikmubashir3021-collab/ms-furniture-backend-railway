interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionHeading({ title, subtitle, className = '' }: SectionHeadingProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground font-light tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-foreground-muted text-sm font-body tracking-wider">
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-6 w-12 h-px bg-gold/60" />
    </div>
  )
}
