import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'

const BG_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260709_082449_46df5cc4-ad98-4541-9236-a2659c1478a4.png&w=1920&q=85'

type TeamMember = {
  name: string
  avatar: string
}

type Project = {
  title: string
  team: TeamMember[]
  image?: string
  description: string
  impact: string
  startDate: string
  launchDate: string
  endDate: string
}

const PROJECTS: Project[] = [
  {
    title: 'PayLater Revamp',
    team: [{ name: 'Steven Joan', avatar: '/team/Joan.png' }],
    description: '',
    impact: '',
    startDate: '',
    launchDate: '',
    endDate: '',
  },
  {
    title: 'KUBER × TTD & Performance Marketing',
    team: [{ name: 'Trista Chlorellano Garno', avatar: '/team/Trista.png' }],
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
    team: [{ name: 'Christopher Christopher', avatar: '/team/Chris.png' }],
    image: '/FDS.png',
    description: 'Improved FDS Pop-up design on Flight.',
    impact:
      'Total Conversions uplift ▲203.79% — [Post Analysis] FDS New Pricing 22 April Scheme Experiment.',
    startDate: 'March 2026',
    launchDate: '22 April 2026 (Start experiment)',
    endDate: '6 May 2026 (End experiment)',
  },
]

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
      <h3 className="text-xl font-medium text-white md:text-2xl">{project.title}</h3>

      {/* Image (or placeholder) */}
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-white/5">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="text-white/20" size={40} strokeWidth={1.5} />
        )}
      </div>

      {/* Team */}
      <div className="flex flex-wrap items-center gap-3">
        <MetaLabel>Team</MetaLabel>
        <div className="flex items-center -space-x-2">
          {project.team.map((member) => (
            <div key={member.name} className="group/avatar relative">
              <img
                src={member.avatar}
                alt={member.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-black/30 transition-transform duration-200 hover:z-10 hover:scale-105"
              />
              <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/avatar:opacity-100">
                {member.name}
              </span>
            </div>
          ))}
        </div>
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
