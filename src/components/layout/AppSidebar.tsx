import {
  BookOpen01,
  File06,
  MessageQuestionSquare,
  Settings01,
  ShieldTick,
} from '@untitledui/icons'
import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router'
import { cn } from '@/lib/utils/cn'
import { paths } from '@/routes/paths'

interface NavItem {
  label: string
  to: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

const NAV_ITEMS: NavItem[] = [
  { label: 'RFPs', to: paths.rfps, icon: File06 },
  { label: 'Question Library', to: paths.questionLibrary, icon: MessageQuestionSquare },
  { label: 'Content Library', to: paths.contentLibrary, icon: BookOpen01 },
  { label: 'Compliance', to: paths.compliance, icon: ShieldTick },
  { label: 'Settings', to: paths.settings, icon: Settings01 },
]

export function AppSidebar() {
  return (
    <aside className="flex shrink-0 flex-col border-b border-neutral-200 bg-white md:sticky md:top-0 md:h-screen md:w-60 md:border-r md:border-b-0">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <img src="/favicon.svg" alt="" className="size-7" />
        <div className="leading-tight">
          <div className="text-sm font-semibold text-neutral-900">RFP Buddy</div>
          <div className="text-xs text-neutral-500">Fieldtrip</div>
        </div>
      </div>
      <nav aria-label="Primary" className="px-3 pb-3 md:pt-2">
        <ul className="flex gap-1 overflow-x-auto md:flex-col">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap outline-none',
                    'focus-visible:ring-2 focus-visible:ring-accent-500',
                    isActive
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
                  )
                }
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
