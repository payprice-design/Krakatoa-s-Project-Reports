import { useState } from 'react'

const LINKS = ['Features', 'Drift AI', 'FAQ']

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-xs">
      {/* Floating pill */}
      <div className="flex items-center justify-between bg-white rounded-full shadow-lg pl-5 pr-3 py-3">
        <span className="text-lg font-bold tracking-tight text-black">Drift.</span>

        {/* Animated hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="relative flex h-6 w-6 flex-col items-center justify-center gap-[5px]"
        >
          <span
            className="block h-[2px] w-5 bg-black transition-transform duration-300"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.77,0,0.175,1)',
              transform: open ? 'translateY(3.5px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block h-[2px] w-5 bg-black transition-transform duration-300"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.77,0,0.175,1)',
              transform: open ? 'translateY(-3.5px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Dropdown */}
      <div
        className={`mt-3 origin-top rounded-2xl bg-white p-2 shadow-lg transition-all duration-300 ${
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.77,0,0.175,1)' }}
      >
        {LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="block rounded-xl px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-black/5"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  )
}
