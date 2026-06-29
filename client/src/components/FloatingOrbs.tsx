import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const FLOATING_ORBS = [
  { color: 'gold', size: 'min(300px, 60vw)', x: '10%', y: '20%', delay: 0 },
  { color: 'gold', size: 'min(200px, 40vw)', x: '80%', y: '60%', delay: 1.5 },
  { color: 'gold', size: 'min(150px, 30vw)', x: '60%', y: '15%', delay: 3 },
  { color: 'gold', size: 'min(250px, 50vw)', x: '20%', y: '75%', delay: 2 },
]

export default function FloatingOrbs() {
  const ref = useRef<HTMLDivElement>(null!)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {FLOATING_ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-[0.03]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, #C9A84C 0%, transparent 70%)`,
            y,
          }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6 + orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  )
}
