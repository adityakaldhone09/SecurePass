import { cn } from '../../lib/utils'

export interface SliderProps {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
  className?: string
}

export function Slider({
  value,
  onChange,
  min = 8,
  max = 64,
  step = 1,
  label,
  unit = '',
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <div className="flex justify-between items-center text-sm">
        {label && <span className="font-medium text-[var(--text-secondary)]">{label}</span>}
        <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold shadow-inner">
          {value} {unit}
        </span>
      </div>

      <div className="relative flex items-center h-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full relative z-10"
          style={{
            background: `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${percentage}%, rgba(148, 163, 184, 0.16) ${percentage}%, rgba(148, 163, 184, 0.16) 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-[var(--text-muted)] font-mono">
        <span>{min} {unit}</span>
        <span>{Math.round((min + max) / 2)} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  )
}
