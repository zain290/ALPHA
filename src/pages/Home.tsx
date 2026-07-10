import { motion } from 'framer-motion'
import { Scene } from '../components/three/Scene'
import { Model } from '../components/three/Model'
import { ParticleField } from '../components/three/ParticleField'
import { Button } from '../components/ui/Button'
import { AnimatedSection } from '../components/animation/AnimatedSection'

export function Home() {
  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Scene cameraPosition={[0, 0, 8]} controls={false}>
            <ParticleField count={300} spread={12} color="#E8391D" speed={0.3} />
            <Model fallback="torusKnot" />
          </Scene>
        </div>

        <div className="text-center px-4">
          <motion.h1
            className="text-6xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            ZEMZ
          </motion.h1>
          <motion.p
            className="text-xl text-muted mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            We craft digital experiences that push boundaries.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Button variant="primary" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
              Explore Our Work
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-6xl font-bold mb-12">What We Do</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['UI/UX Design', '3D Development', 'Motion Design'].map((service, i) => (
              <AnimatedSection key={service} delay={i * 0.15}>
                <div className="p-8 rounded-lg border border-nav-border hover:border-primary transition-colors">
                  <h3 className="text-2xl font-semibold mb-4">{service}</h3>
                  <p className="text-muted">
                    We create stunning digital experiences that captivate and engage.
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
