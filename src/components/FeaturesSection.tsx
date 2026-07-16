import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'

const BG_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260709_082449_46df5cc4-ad98-4541-9236-a2659c1478a4.png&w=1920&q=85'

type Project = {
  title: string
  team: string
  description: string
  impact: string
  startDate: string
  launchDate: string
  endDate: string
}

const PROJECTS: Project[] = [
  {
    title: 'PayLater Revamp',
    team: 'Steven Joan',
    description: '',
    impact: '',
    startDate: '',
    launchDate: '',
    endDate: '',
  },
  {
    title: 'KUBER × TTD & Performance Marketing',
    team: 'Trista Chlorellano Garno',
    description:
      'Designed and executed alignment workshops to bridge TTD Commercial, Performance Marketing, and Pricing teams regarding needs on Pricing and Promo Dashboards.',
    impact:
      'Directly resulted in >20 distinct items ready to act upon and >15 items funneled into planned technical development.',
    startDate: '30 Mar 2026',
    launchDate: '10 Jul 2026',
    endDate: '10 Jul 2026',
  },
  {
    title: 'FDS Popup Revamp',
    team: 'Christopher Christopher',
    description: 'Improved FDS Pop-up design on Flight.',
    impact:
      'Total Conversions uplift ▲203.79% — [Post Analysis] FDS New Pricing 22 April Scheme Experiment.',
    startDate: 'March 2026',
    launchDate: '22 April 2026 (Start experiment)',
    endDate: '6 May 2026 (End experiment)',
  },
]

function ProjectLogo() {
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

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
      {children}
    </span>
  )
}

function ProjectCard({
  project,
  index,
  onActive,
  registerRef,
}: {
  project: Project
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
      <ProjectLogo />
      <h3 className="text-xl font-medium text-white md:text-2xl">{project.title}</h3>

      {/* Image placeholder */}
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-white/5">
        <ImageIcon className="text-white/20" size={40} strokeWidth={1.5} />
      </div>

      {/* Team */}
      <div className="flex flex-wrap items-center gap-3">
        <MetaLabel>Team</MetaLabel>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
          {project.team}
        </span>
      </div>

      {/* Description */}
      {project.description && (
        <div className="flex flex-col gap-1.5">
          <MetaLabel>Description</MetaLabel>
          <p className="text-sm font-medium leading-relaxed text-white/60 md:text-base">
            {project.description}
          </p>
        </div>
      )}

      {/* Impact */}
      {project.impact && (
        <div className="flex flex-col gap-1.5 rounded-2xl bg-white/5 p-4 md:p-5">
          <MetaLabel>Impact</MetaLabel>
          <p className="text-sm font-medium leading-relaxed text-white md:text-base">
            {project.impact}
          </p>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
        <div className="flex flex-col gap-1">
          <MetaLabel>Start</MetaLabel>
          <p className="text-sm font-medium text-white/80">{project.startDate || 'TBD'}</p>
        </div>
        <div className="flex flex-col gap-1">
          <MetaLabel>Launch</MetaLabel>
          <p className="text-sm font-medium text-white/80">{project.launchDate || 'TBD'}</p>
        </div>
        <div className="flex flex-col gap-1">
          <MetaLabel>End</MetaLabel>
          <p className="text-sm font-medium text-white/80">{project.endDate || 'TBD'}</p>
        </div>
      </div>
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
    <section className="relative px-5 py-20 md:px-10 md:py-40 lg:h-screen lg:overflow-hidden lg:px-16 lg:py-0">
      {/* Fixed background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url("${BG_IMAGE}")` }}
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-24 lg:h-screen lg:flex-row xl:gap-48">
        {/* Left column — fixed, unaffected by scroll */}
        <div className="flex flex-col lg:h-screen lg:w-[400px] lg:shrink-0 lg:justify-start lg:pt-32 xl:w-[460px]">
          {/* Heading + nav buttons grouped, aligned to top */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-2xl font-normal leading-[1.2] text-white sm:text-3xl lg:text-[46px]">
                Krakatoa's Projects
              </h2>
              <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-white/60 md:text-base">
                Home base for everything we're building — Pricing, Promo, Insurance,
                Payment, PayLater, and Refund, all in one spot.
              </p>
            </div>

            {/* Project nav buttons */}
            <div className="hidden flex-col gap-3 lg:flex">
              {PROJECTS.map((project, i) => (
                <button
                  key={project.title}
                  onClick={() => scrollToCard(i)}
                  className={`rounded-xl px-4 py-3 text-left text-base font-medium transition-colors ${
                    activeIndex === i
                      ? 'bg-black/20 text-white'
                      : 'bg-black/20 text-white/40'
                  }`}
                >
                  {project.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — the only scroller on desktop */}
        <div className="scrollbar-hide flex flex-1 flex-col gap-16 md:gap-24 lg:h-screen lg:overflow-y-auto lg:py-32">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
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
