import { useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  maxTilt?: number
  perspective?: number
  scale?: number
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 6,
  perspective = 1200,
  scale = 1.02,
}: Props) {
  const ref = useRef<HTMLDivElement>(null!)
  const touchStartRef = useRef({ x: 0, y: 0 })

  const applyTilt = (clientX: number, clientY: number) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const tiltX = ((y - centerY) / centerY) * maxTilt
    const tiltY = ((centerX - x) / centerX) * maxTilt
    ref.current.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`
  }

  const resetTilt = () => {
    if (!ref.current) return
    ref.current.style.transform = ''
    ref.current.style.transition = 'transform 0.5s ease-out'
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    applyTilt(e.clientX, e.clientY)
  }

  const handleMouseLeave = () => {
    resetTilt()
  }

  const handleMouseEnter = () => {
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.08s ease-out'
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.08s ease-out'
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    applyTilt(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    resetTilt()
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={className}
    >
      {children}
    </div>
  )
}
