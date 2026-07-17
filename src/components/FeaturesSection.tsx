import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Moon, Sun } from 'lucide-react'
import fdsImage from '../../card-templates/03-fds-popup-revamp/FDS.png'
import fdsImageCopy from '../../card-templates/04-fds-popup-revamp copy/FDS.png'
import DotField from './DotField'

type Theme = 'dark' | 'light'

// Persists the chosen theme and toggles the `dark` class on <html> so Tailwind's
// class-based dark variants apply across the whole document.
function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem('theme') as Theme) || 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}

type TeamMember = {
  name: string
  /** Image filename inside /public/team (defaults to `<key>.png`). */
  file?: string
}

// Central roster. Add a collaborator here once — their avatar is pulled from
// /public/team/<file> (defaults to <key>.png). Reference them from a project's
// `team` array by key; a project can list as many collaborators as needed.
const TEAM: Record<string, TeamMember> = {
  joan: { name: 'Steven Joan' },
  trista: { name: 'Trista Chlorellano Garno' },
  chris: { name: 'Christopher Christopher' },
  adit: { name: 'Adit Septian', file: 'Adit.jpg' },
  asad: { name: 'Asad' },
}

const avatarSrc = (key: string) => `/team/${TEAM[key]?.file ?? `${capitalize(key)}.png`}`

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Matches impact metrics like "▲+141%", ">20", ">=15", "-12%", "3x" — but not
// plain numbers/years/dates (e.g. "2026", "22 April").
const METRIC_RE =
  /([▲▼]\s?[+-]?\d[\d.,]*%?|[<>]=?\s?\d[\d.,]*%?|[+-]\d[\d.,]*%?|\d[\d.,]*%|\d[\d.,]*x)/g

const DECRYPT_CHARS = '!<>-_\\/[]{}—=+*^?#________'

// Scrambles the text with random glyphs on mount/scroll-in, then settles onto
// the real characters left-to-right for a "decrypting" reveal.
function DecryptedText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text)
  const ref = useRef<HTMLSpanElement | null>(null)
  const played = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const scramble = () => {
      const chars = text.split('')
      let frame = 0
      const totalFrames = chars.length * 3 + 8
      const interval = window.setInterval(() => {
        const revealed = Math.floor(frame / 3)
        setDisplay(
          chars
            .map((ch, i) => {
              if (ch === ' ') return ' '
              if (i < revealed) return ch
              return DECRYPT_CHARS[Math.floor(Math.random() * DECRYPT_CHARS.length)]
            })
            .join('')
        )
        frame += 1
        if (frame > totalFrames) {
          window.clearInterval(interval)
          setDisplay(text)
        }
      }, 40)
      return interval
    }

    let interval: number | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !played.current) {
            played.current = true
            interval = scramble()
          }
        })
      },
      { threshold: 0.6 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (interval) window.clearInterval(interval)
    }
  }, [text])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

function highlightMetrics(text: string) {
  // String.split with one capturing group interleaves matches at odd indices.
  return text.split(METRIC_RE).map((part, i) => {
    if (!part) return null
    if (i % 2 === 0) return part
    const down = /[▼<]/.test(part) || /^\s*-/.test(part)
    return (
      <DecryptedText
        key={i}
        text={part}
        className={`rounded-lg px-1 ${
          down
            ? 'font-semibold bg-rose-400/15 text-rose-300'
            : 'font-bold bg-emerald-400/15 text-[#009e4c]'
        }`}
      />
    )
  })
}

type Project = {
  title: string
  team: string[] // keys into TEAM — supports multiple collaborators
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
    team: ['joan'],
    description: '',
    impact: '',
    startDate: '',
    launchDate: '',
    endDate: '',
  },
  {
    title: 'KUBER × TTD & Performance Marketing',
    team: ['trista'],
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
    team: ['chris'],
    image: fdsImage,
    description: 'Improved FDS Pop-up design on Flight.',
    impact:
      'Total Conversions uplift ▲+141% — [Post Analysis] FDS New Pricing 22 April Scheme Experiment.',
    startDate: 'March 2026',
    launchDate: '22 April 2026 (Start experiment)',
    endDate: '6 May 2026 (End experiment)',
  },
  {
    title: 'FDS Popup Revamp',
    team: ['chris', 'adit'],
    image: fdsImageCopy,
    description: 'Improved FDS Pop-up design on Flight.',
    impact:
      'Total Conversions uplift ▲+141% — [Post Analysis] FDS New Pricing 22 April Scheme Experiment.',
    startDate: 'March 2026',
    launchDate: '22 April 2026 (Start experiment)',
    endDate: '6 May 2026 (End experiment)',
  },
]

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-white/40">
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
      className={`flex flex-col gap-6 rounded-xl bg-white/70 p-6 backdrop-blur-sm transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 dark:bg-black/20 dark:hover:shadow-black/40 md:p-10 lg:scroll-mt-32 ${
        revealed ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
      }`}
    >
      <h3 className="text-xl font-medium text-neutral-900 dark:text-white md:text-2xl">{project.title}</h3>

      {/* Image (or placeholder) */}
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="text-neutral-400 dark:text-white/20" size={40} strokeWidth={1.5} />
        )}
      </div>

      {/* Description */}
      {project.description && (
        <div className="flex flex-col gap-1.5">
          <MetaLabel>Description</MetaLabel>
          <p className="text-sm font-medium leading-relaxed text-neutral-600 dark:text-white/60 md:text-base">
            {project.description}
          </p>
        </div>
      )}

      {/* Impact */}
      {project.impact && (
        <div className="flex flex-col gap-1.5 rounded-lg bg-black/5 p-4 dark:bg-white/5 md:p-5">
          <MetaLabel>Impact</MetaLabel>
          <p className="text-sm font-medium leading-relaxed text-neutral-900 dark:text-white md:text-base">
            {highlightMetrics(project.impact)}
          </p>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-3 gap-4 border-t border-black/10 pt-6 dark:border-white/10">
        <div className="flex flex-col gap-1">
          <MetaLabel>Design</MetaLabel>
          <p className="text-sm font-medium text-neutral-700 dark:text-white/80">{project.startDate || 'TBD'}</p>
        </div>
        <div className="flex flex-col gap-1">
          <MetaLabel>Launch</MetaLabel>
          <p className="text-sm font-medium text-neutral-700 dark:text-white/80">{project.launchDate || 'TBD'}</p>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex items-center -space-x-2">
            {project.team.map((key) => {
              const member = TEAM[key]
              if (!member) return null
              return (
                <div key={key} className="group/avatar relative">
                  <img
                    src={avatarSrc(key)}
                    alt={member.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-black/30 transition-transform duration-200 hover:z-10 hover:scale-105"
                  />
                  <span className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-neutral-900 opacity-0 shadow-lg transition-opacity duration-200 group-hover/avatar:opacity-100">
                    <span className="absolute bottom-full right-4 border-4 border-transparent border-b-white" />
                    {member.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const { theme, toggle } = useTheme()

  const registerRef = (index: number, el: HTMLElement | null) => {
    cardRefs.current[index] = el
  }

  const scrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative px-5 py-20 md:px-10 md:py-40 lg:h-screen lg:overflow-hidden lg:px-16 lg:py-0">
      {/* Fixed interactive dot-field background */}
      <div className="fixed inset-0 -z-10 bg-[#F4F1F8] dark:bg-[#120F17]">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom={theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : '#000000'}
          gradientTo={theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : '#000000'}
        />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-24 lg:h-screen lg:flex-row xl:gap-48">
        {/* Left column — fixed, unaffected by scroll */}
        <div className="flex flex-col lg:h-screen lg:w-[400px] lg:shrink-0 lg:justify-start lg:pt-32 xl:w-[460px]">
          {/* Theme toggle — above the text but outside the heading/nav container */}
          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-neutral-700 transition-colors hover:bg-black/20 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20"
          >
            {theme === 'dark' ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
          </button>

          {/* Heading + nav buttons grouped, aligned to top */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-2xl font-bold leading-[1.2] tracking-[-1.7px] text-neutral-900 dark:text-white sm:text-3xl lg:text-[46px]">
                Krakatoa's Projects
              </h2>
              <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-neutral-600 dark:text-white/60 md:text-base">
                Home base for everything we're building — Pricing, Promo, Insurance,
                Payment, PayLater, and Refund, all in one spot.
              </p>
            </div>

            {/* Project nav buttons */}
            <div className="hidden flex-col gap-3 lg:flex">
              {PROJECTS.map((project, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCard(i)}
                  className={`rounded-lg px-4 py-3 text-left text-base font-semibold transition-colors ${
                    activeIndex === i
                      ? 'bg-white text-neutral-900 dark:bg-black/80 dark:text-white'
                      : 'bg-white/90 text-neutral-400 dark:bg-[#121212] dark:text-white/20'
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
              key={i}
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
