import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface SparkleConfettiProps {
  show: boolean
}

export function SparkleConfetti({ show }: SparkleConfettiProps) {
  const particles = useMemo(() => {
    const colors = ['#38bdf8', '#10b981', '#60a5fa', '#a78bfa', '#f59e0b']
    return Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * 360
      const distance = 40 + (i * 7) % 50
      const rad = (angle * Math.PI) / 180
      return {
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
        color: colors[i % colors.length],
      }
    })
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 flex items-center justify-center">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [1, 1, 0],
                scale: [0, 1.4, 0.4],
                x: p.x,
                y: p.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
