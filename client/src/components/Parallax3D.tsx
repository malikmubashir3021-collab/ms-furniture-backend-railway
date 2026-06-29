import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  depth?: number
}

export default function Parallax3D({ children, className = '', depth = 0.1 }: Props) {
  const ref = useRef<HTMLDivElement>(null!)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [depth * 80, -depth * 80])

  const springY = useSpring(y, { stiffness: 80, damping: 25 })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: springY,
      }}
    >
      {children}
    </motion.div>
  )
}
