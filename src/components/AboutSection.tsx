import { Mail, Plus } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="relative z-10 rounded-t-[25px] bg-[#F6E4CF] px-6 py-20 md:py-32">
      {/* Top area */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <p className="max-w-lg text-center text-base leading-relaxed text-[#321C04] md:text-lg">
          We craft tools that move with your rhythm, not over it. Designed for ease,
          presence, and flow.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Say hello */}
          <button className="group flex items-center gap-3 rounded-full bg-[#321C04] py-2 pl-2 pr-6 text-[#FFF9F2] transition-colors hover:bg-[#1F1003]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#321C04]">
              <Mail size={16} />
            </span>
            <span className="text-sm font-medium uppercase tracking-wide">Say hello</span>
          </button>

          {/* Stay informed */}
          <button className="group flex items-center gap-3 rounded-full bg-[#D9C4AA] py-2 pl-2 pr-6 text-[#321C04] transition-colors hover:bg-[#CEBA9E]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#321C04]">
              <Plus size={16} />
            </span>
            <span className="text-sm font-medium uppercase tracking-wide">Stay informed</span>
          </button>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="mx-auto my-16 flex w-full items-center gap-[2px]">
        <span className="h-2 w-2 rounded-full bg-[#D9C4AA]" />
        <span className="h-[2px] flex-1 bg-[#D9C4AA]" />
        <span className="h-2 w-2 rounded-full bg-[#D9C4AA]" />
      </div>

      {/* Bottom area */}
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:gap-16">
        <div className="flex shrink-0 flex-col gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 256 256"
            fill="none"
          >
            <path
              d="M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z"
              fill="#321C04"
            />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#321C04]">
            Calm
            <br />
            Amplified
          </span>
        </div>

        <p className="text-2xl font-normal leading-[1.3] text-[#321C04] sm:text-3xl md:text-4xl lg:text-[42px]">
          We make AI tools and assistants. But, most importantly, we help you remember
          what gentle productivity looks like when software moves with you, not over you.
          We create systems that carry the cognitive weight, so you can attend to what
          truly counts.
        </p>
      </div>
    </section>
  )
}
