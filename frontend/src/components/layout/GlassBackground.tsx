import { motion } from 'framer-motion'

export function GlassBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Ambient Radial Lights */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.18, 0.28, 0.18],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-15%] left-[20%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-sky-500/25 to-blue-600/10 blur-[130px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.22, 0.12],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-[30%] right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-indigo-500/20 to-cyan-500/10 blur-[140px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/15 to-emerald-500/10 blur-[150px]"
      />

      {/* Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  )
}
