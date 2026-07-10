import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationConfig {
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
}

export function useScrollAnimation<T extends HTMLElement>(config: ScrollAnimationConfig) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        config.from || { opacity: 0, y: 30 },
        {
          ...config.to,
          scrollTrigger: {
            trigger: config.trigger || el,
            start: config.start || 'top 85%',
            end: config.end,
            scrub: config.scrub,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [config])

  return ref
}
