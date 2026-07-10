import type { ReactNode } from 'react'
import { useMagneticEffect } from '../../hooks/useMagneticEffect'

interface MagneticWrapperProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function MagneticWrapper({ children, strength = 0.3, className }: MagneticWrapperProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticEffect({ strength })

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: 'transform 0.3s ease-out' }}
    >
      {children}
    </div>
  )
}
