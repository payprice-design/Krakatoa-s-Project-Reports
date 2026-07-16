import { useEffect, useRef, useState } from 'react'

const BG_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260709_082449_46df5cc4-ad98-4541-9236-a2659c1478a4.png&w=1920&q=85'

type Feature = {
  title: string
  description: string
  video: string
}

const FEATURES: Feature[] = [
  {
    title: 'Built for ease, not urgency',
    description:
      'Drift strips away the noise that makes organizing feel draining. Every surface is made to be soft, quiet, and intuitive so you can move forward, not get stuck decoding.',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_102608_5fa1187d-9ac6-44fb-82ab-54376200abc0.mp4',
  },
  {
    title: 'The gentlest way to start',
    description:
      'Beginning your day should feel natural, not daunting. Drift eases you into motion with subtle cues and a quiet view of what deserves your energy right now.',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260625_174131_395bc785-bb21-4e65-abf6-27c56f0764b6.mp4',
  },
  {
    title: 'Deep, undivided focus',
    description:
      'No interruptions, no clutter. Drift holds you in the present task with a stripped-back layout that softens all else until you are truly ready to shift.',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260525_052706_d2e390fd-1846-4fe7-a4d8-8d2f1c875358.mp4',
  },
]

function FeatureLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 256 256"
      fill="none"
    >
      <path
        d="M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z"
        fill="rgba(255,255,255,0.8)"
      />
    </svg>
  )
}

function FeatureCard({
  feature,
  index,
  onActive,
  registerRef,
}: {
  feature: Feature
  index: number
  onActive: (index: number) => void
  registerRef: (index: number, el: HTMLElement | null) => void
}) {
  const cardRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    // Reveal animation (threshold 0.15) — once revealed, stays visible
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true)
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    // Active detection (threshold 0.6)
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onActive(index)
        })
      },
      { threshold: 0.6 }
    )

    revealObserver.observe(el)
    activeObserver.observe(el)

    return () => {
      revealObserver.disconnect()
      activeObserver.disconnect()
    }
  }, [index, onActive])

  return (
    <article
      ref={(el) => {
        cardRef.current = el
        registerRef(index, el)
      }}
      className={`flex flex-col gap-6 rounded-3xl bg-black/20 p-6 backdrop-blur-sm transition-all duration-700 ease-out md:p-10 ${
        revealed ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
      }`}
    >
      <FeatureLogo />
      <h3 className="text-xl font-medium text-white md:text-2xl">{feature.title}</h3>
      <div className="aspect-video overflow-hidden rounded-2xl bg-black/30">
        <video
          className="h-full w-full object-cover"
          src={feature.video}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <p className="text-sm font-medium leading-relaxed text-white/60 md:text-base">
        {feature.description}
      </p>
    </article>
  )
}

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  const registerRef = (index: number, el: HTMLElement | null) => {
    cardRefs.current[index] = el
  }

  const scrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="relative px-5 py-20 md:px-10 md:py-40 lg:px-16 lg:py-48">
      {/* Fixed background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url("${BG_IMAGE}")` }}
      />

      <div className="mx-auto grid max-w-7xl gap-24 lg:grid-cols-[400px_1fr] xl:grid-cols-[460px_1fr] xl:gap-48">
        {/* Left column (sticky on desktop) */}
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:pb-32">
          <div>
            <h2 className="text-2xl font-normal leading-[1.2] text-white sm:text-3xl lg:text-[46px]">
              Krakatoa's Projects
            </h2>
            <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-white/60 md:text-base">
              Home base for everything we're building — Pricing, Promo, Insurance,
              Payment, PayLater, and Refund, all in one spot.
            </p>
          </div>

          {/* Feature nav buttons */}
          <div className="hidden flex-col gap-3 lg:flex">
            {FEATURES.map((feature, i) => (
              <button
                key={feature.title}
                onClick={() => scrollToCard(i)}
                className={`rounded-xl px-4 py-3 text-left text-base font-medium transition-colors ${
                  activeIndex === i
                    ? 'bg-black/20 text-white'
                    : 'bg-black/20 text-white/40'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="hidden items-center gap-4 rounded-xl bg-black/25 py-1 pl-6 pr-1 backdrop-blur-md lg:flex">
            <span className="text-sm font-medium text-white">
              No noise. No complicated systems. Just your day, gently sorted.
            </span>
            <button className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90">
              Start for free
            </button>
          </div>
        </div>

        {/* Right column (scrolling cards) */}
        <div className="flex flex-col gap-16 md:gap-24">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={i}
              onActive={setActiveIndex}
              registerRef={registerRef}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
