import type { Transition, Variants } from 'framer-motion'

export const appleSpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
  mass: 0.8,
}

export const smoothSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 0.9,
}

export const slowSpring: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 22,
  mass: 1,
}

export const gentleEase: Transition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1], // Apple cubic bezier
}

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: smoothSpring },
  exit: { opacity: 0, scale: 0.98, y: -8, transition: { duration: 0.2 } },
}

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: smoothSpring },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

export const heroHeaderVariants: Variants = {
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}
