import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Moon, Sun } from 'lucide-react'
import BorderGlow from './BorderGlow'
import DotGrid from './DotGrid'

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
  avatar: string
}

// --- Local "properties" loading -------------------------------------------
// Each project's content lives in card-templates/<slug>/project.txt (its
// "local properties"). We read those files at build/dev time so editing one
// updates the preview live via Vite HMR — no code change needed. Assets
// (image/video/avatars) referenced by filename resolve to the files sitting
// next to their project.txt.

// Raw text of every project.txt, keyed by module path.
const projectFiles = import.meta.glob('../../card-templates/*/project.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Every image/video in the card-templates folders, resolved to a URL.
const mediaFiles = import.meta.glob('../../card-templates/*/*.{jpg,jpeg,png,webp,webm}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

const basename = (path: string) => path.slice(path.lastIndexOf('/') + 1)
const dirOf = (path: string) => path.slice(0, path.lastIndexOf('/'))

// filename -> URL, so avatars can be found regardless of which folder holds them.
const mediaByName: Record<string, string> = {}
for (const p in mediaFiles) mediaByName[basename(p)] = mediaFiles[p]

// Resolve a filename from a project.txt to a real asset URL: prefer the file
// sitting in the same folder, then any card-templates folder, then /public/team.
function resolveMedia(dir: string, file: string): string | undefined {
  if (!file) return undefined
  return mediaFiles[`${dir}/${file}`] ?? mediaByName[file] ?? `/team/${file}`
}

const PROJECT_FIELDS = [
  'TITLE',
  'TEAM',
  'TEAM AVATAR',
  'IMAGE',
  'VIDEO',
  'DESCRIPTION',
  'IMPACT',
  'START DATE',
  'LAUNCH DATE',
  'END DATE',
] as const

// Parse the `KEY: value` format. A line whose leading token is a known field
// starts a new field; any other line is appended to the current field, so
// DESCRIPTION and IMPACT can span multiple lines (e.g. bulleted impact).
function parseProjectFile(raw: string): Record<string, string> {
  const data: Record<string, string> = {}
  let currentKey: string | null = null
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z][A-Z ]*?):\s?(.*)$/)
    if (m && (PROJECT_FIELDS as readonly string[]).includes(m[1])) {
      currentKey = m[1]
      data[currentKey] = m[2]
    } else if (currentKey) {
      data[currentKey] += `\n${line}`
    }
  }
  for (const k in data) data[k] = data[k].trim()
  return data
}

const splitList = (value = '') =>
  value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

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
  team: TeamMember[]
  image?: string
  /** Optional video shown in the media slot; `image` acts as its poster/fallback. */
  video?: string
  description: string
  impact: string
  startDate: string
  launchDate: string
  endDate: string
}

// Build the card list from the local project.txt files, ordered by folder name
// (01-, 02-, …). The `_template` scaffold is skipped. Editing any project.txt
// re-runs this via HMR, so the preview always mirrors the local files.
const PROJECTS: Project[] = Object.keys(projectFiles)
  .filter((path) => !path.includes('/_template/'))
  .sort()
  .map((path) => {
    const dir = dirOf(path)
    const data = parseProjectFile(projectFiles[path])
    const names = splitList(data.TEAM)
    const avatars = splitList(data['TEAM AVATAR'])
    return {
      title: data.TITLE ?? '',
      team: names.map((name, i) => ({
        name,
        avatar: resolveMedia(dir, avatars[i] ?? '') ?? '',
      })),
      image: resolveMedia(dir, data.IMAGE),
      video: resolveMedia(dir, data.VIDEO),
      description: data.DESCRIPTION ?? '',
      impact: data.IMPACT ?? '',
      startDate: data['START DATE'] ?? '',
      launchDate: data['LAUNCH DATE'] ?? '',
      endDate: data['END DATE'] ?? '',
    }
  })

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
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Crossfade the poster image and the video on hover: play (from the start)
  // while fading the video in, then pause while fading back to the poster.
  const handleEnter = () => {
    setHovered(true)
    const v = videoRef.current
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
    }
  }
  const handleLeave = () => {
    setHovered(false)
    videoRef.current?.pause()
  }

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
      className={`transition-all duration-700 ease-out hover:-translate-y-2 lg:scroll-mt-32 ${
        revealed ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
      }`}
    >
      <BorderGlow
        className="h-full"
        backgroundColor="var(--card-surface)"
        borderRadius={12}
        glowColor="205 90 62"
        glowRadius={32}
        glowIntensity={1}
        coneSpread={25}
        colors={['#c084fc', '#f472b6', '#38bdf8']}
      >
        <div className="flex flex-col gap-6 p-6 md:p-10">
          <h3 className="text-xl font-medium text-neutral-900 dark:text-white md:text-2xl">{project.title}</h3>

      {/* Video, image, or placeholder */}
      <div
        className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-black/5 dark:bg-white/5"
        onMouseEnter={project.video ? handleEnter : undefined}
        onMouseLeave={project.video ? handleLeave : undefined}
      >
        {project.video ? (
          <>
            <video
              ref={videoRef}
              src={project.video}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              loop
              playsInline
              preload="metadata"
            />
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                  hovered ? 'opacity-0' : 'opacity-100'
                }`}
              />
            )}
          </>
        ) : project.image ? (
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
          <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-neutral-900 dark:text-white md:text-base">
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
            {project.team.map((member, i) => (
              <div key={i} className="group/avatar relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-black/30 transition-transform duration-200 hover:z-10 hover:scale-105"
                />
                <span className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-neutral-900 opacity-0 shadow-lg transition-opacity duration-200 group-hover/avatar:opacity-100">
                  <span className="absolute bottom-full right-4 border-4 border-transparent border-b-white" />
                  {member.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
        </div>
      </BorderGlow>
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
      {/* Fixed interactive dot-grid background (reacts to cursor + clicks) */}
      <div className="fixed inset-0 -z-10 bg-[#F4F1F8] dark:bg-[#120F17]">
        <DotGrid
          dotSize={3}
          gap={17}
          baseColor={theme === 'dark' ? '#26272f' : '#d4d0dd'}
          activeColor={theme === 'dark' ? '#8ab4ff' : '#5227FF'}
          proximity={150}
          shockRadius={290}
          shockStrength={6}
          resistance={1550}
          returnDuration={1.6}
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

        {/* Right column — the only scroller on desktop. The negative margin +
            matching padding widen the scroll clip region so the cards'
            BorderGlow isn't hard-clipped at the left/right edges (overflow-y
            auto forces the x-axis to clip too). */}
        <div className="scrollbar-hide flex flex-1 flex-col gap-16 md:gap-24 lg:-mx-10 lg:h-screen lg:overflow-y-auto lg:px-10 lg:py-32">
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
