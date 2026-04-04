# Galileo Dashboard — Implementation Spec

## Stack & Bootstrap

**Current state:** Vite + React 19 + TypeScript. Blank starter. No Tailwind, no router, no icons.

**Install these packages first:**
```bash
npm install react-router-dom@7 framer-motion
npm install -D tailwindcss @tailwindcss/vite
```

Add to `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite'
plugins: [react(), tailwindcss()]
```

Replace `src/index.css` with:
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

body { font-family: 'Inter', sans-serif; }
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.glass-panel {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(16px);
}
```

---

## Tailwind Config (`tailwind.config.ts`)

```ts
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-container':        '#131b2e',
        'on-primary-container':     '#7c839b',
        'on-primary-fixed-variant': '#3f465c',
        'on-primary-fixed':         '#131b2e',
        'primary-fixed':            '#dae2fd',
        'primary-fixed-dim':        '#bec6e0',
        'inverse-primary':          '#bec6e0',
        'secondary':                '#0058be',
        'secondary-container':      '#2170e4',
        'on-secondary':             '#ffffff',
        'on-secondary-container':   '#fefcff',
        'secondary-fixed':          '#d8e2ff',
        'secondary-fixed-dim':      '#adc6ff',
        'on-secondary-fixed':       '#001a42',
        'on-secondary-fixed-variant':'#004395',
        'tertiary':                 '#000000',
        'tertiary-container':       '#002113',
        'on-tertiary':              '#ffffff',
        'on-tertiary-container':    '#009668',
        'tertiary-fixed':           '#6ffbbe',
        'tertiary-fixed-dim':       '#4edea3',
        'on-tertiary-fixed':        '#002113',
        'on-tertiary-fixed-variant':'#005236',
        'surface':                  '#faf8ff',
        'surface-dim':              '#d2d9f4',
        'surface-bright':           '#faf8ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low':    '#f2f3ff',
        'surface-container':        '#eaedff',
        'surface-container-high':   '#e2e7ff',
        'surface-container-highest':'#dae2fd',
        'surface-variant':          '#dae2fd',
        'surface-tint':             '#565e74',
        'on-surface':               '#131b2e',
        'on-surface-variant':       '#45464d',
        'on-background':            '#131b2e',
        'inverse-surface':          '#283044',
        'inverse-on-surface':       '#eef0ff',
        'outline':                  '#76777d',
        'outline-variant':          '#c6c6cd',
        'error':                    '#ba1a1a',
        'error-container':          '#ffdad6',
        'on-error':                 '#ffffff',
        'on-error-container':       '#93000a',
        'background':               '#faf8ff',
        'primary':                  '#000000',
        'on-primary':               '#ffffff',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        '2xl':   '1rem',
        '3xl':   '1.5rem',
        full:    '0.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ambient': '0px 24px 48px rgba(19,27,46,0.08)',
        'ambient-sm': '0px 24px 48px rgba(19,27,46,0.04)',
        'nav': '24px 0 48px rgba(19,27,46,0.08)',
      },
    },
  },
}
```

---

## File Structure

```
src/
  components/
    ui/
      Button.tsx
      Chip.tsx
      StatCard.tsx
    SideNav.tsx
  pages/
    Dashboard.tsx
    MarketInsights.tsx
    Companies.tsx
    SupplierProfile.tsx
    ConfigureNegotiation.tsx
    NegotiationShell.tsx
    AgentDetail.tsx
  App.tsx
  main.tsx
  index.css
```

---

## Routing (`src/App.tsx`)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SideNav from './components/SideNav'
import Dashboard from './pages/Dashboard'
import MarketInsights from './pages/MarketInsights'
import Companies from './pages/Companies'
import SupplierProfile from './pages/SupplierProfile'
import ConfigureNegotiation from './pages/ConfigureNegotiation'
import NegotiationShell from './pages/NegotiationShell'
import AgentDetail from './pages/AgentDetail'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-background text-on-surface font-sans antialiased">
        <SideNav />
        <div className="ml-64 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/market-insights" element={<MarketInsights />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<SupplierProfile />} />
            <Route path="/negotiations/configure" element={<ConfigureNegotiation />} />
            <Route path="/negotiations/:id" element={<NegotiationShell />} />
            <Route path="/negotiations/:id/agent" element={<AgentDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
```

---

## `src/components/SideNav.tsx`

Exact design from all HTML files. Active route highlighted with `bg-[#2170E4] text-white rounded-lg shadow-lg shadow-[#0058BE]/20`. Inactive: `text-slate-400 hover:text-white hover:bg-[#1C263D]`. Use `useLocation()` from react-router-dom to determine active state.

```
Nav structure:
  Logo area:
    - 32×32 rounded bg-[#2170E4] icon: "dashboard" Material Symbol, white
    - "Galileo" text-2xl font-black text-white
    - "Autonomous Procurement" text-[10px] uppercase tracking-widest text-slate-500

  Nav links (mx-2 px-4 py-3 gap-3 flex items-center text-sm font-medium):
    - Dashboard     icon: dashboard   href: /
    - Market Insights icon: analytics href: /market-insights
    - Companies     icon: business    href: /companies

  Bottom (mt-auto px-4):
    - Settings link  icon: settings   href: /settings
    - Support link   icon: help       href: /support
    - "New Negotiation" button: full-width bg-[#2170E4] rounded-lg py-3 font-bold
      with add icon, navigates to /negotiations/configure
```

Sidebar: `bg-[#131B2E] h-screen w-64 fixed left-0 top-0 flex flex-col py-6 shadow-nav z-50`

---

## `src/pages/Dashboard.tsx`

Reference: `design/galileo_dashboard_no_top_bar/code.html`

**Layout:** `pt-12 pb-12 px-10 min-h-screen bg-surface`

### Hero Section
```
Fiscal Performance YTD  ← text-[11px] font-bold text-on-primary-container uppercase tracking-[0.2em]
$1.2M                   ← text-6xl font-black tracking-tight text-on-surface
[14.2% Optimization] chip (bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full text-xs font-bold)
"Total Money Saved via Galileo Intelligence" text-on-surface-variant

Right: "New Negotiation" button
  bg-gradient-to-br from-secondary to-secondary-container
  text-white font-bold px-8 py-4 rounded-xl
  shadow-xl shadow-secondary/20
  hover:scale-[1.02] active:scale-95 transition-all
  bolt icon (FILL 1) + "New Negotiation"
  onClick → navigate('/negotiations/configure')
```

### Active Agents Table
Container: `bg-surface-container-highest rounded-3xl overflow-hidden shadow-xl shadow-on-surface/5`

Table header row: `text-[11px] font-black uppercase tracking-[0.15em] text-on-primary-container`
Columns: Company | Target Price | Negotiation Price | Status | Action

Table row hover: `hover:bg-surface-container transition-colors border-t border-outline-variant/5`

**Row data (hardcoded):**

| Company | Target | Negotiated | Status |
|---|---|---|---|
| Hilton Worldwide (Hospitality/Corporate) | $185.00 | $192.50 (-3.4%) in `text-secondary` | Negotiating chip: `bg-secondary-fixed text-on-secondary-fixed` with animated pulse dot |
| Delta Air Lines (Aviation/Logistics) | $450.00 | $455.00 (-1.1%) in `text-on-surface` | Reviewing chip: `bg-surface-container-high text-on-surface-variant` |
| Marriott Intl. (Hospitality/Luxury) | $210.00 | $208.00 (+0.9%) in `text-on-tertiary-container` | Optimized chip: `bg-tertiary-fixed text-on-tertiary-fixed` |

Company logo: `w-10 h-10 rounded-lg bg-white shadow-sm` containing a letter-avatar (no external images — build a colored div with the company's first letter in `text-secondary font-black`).

Action column: `text-on-surface-variant hover:text-secondary font-bold text-xs uppercase tracking-widest` "Details" button → `navigate('/negotiations/hilton/agent')`

Table footer: `bg-surface-container-low px-8 py-6 flex justify-between border-t border-outline-variant/5`
"Showing 3 of 12 active Galileo cycles" + "View All Agents" button

---

## `src/pages/Companies.tsx`

Reference: `design/companies_search_directory_no_top_bar/code.html`

**Layout:** `p-8 min-h-screen flex flex-col gap-8`

### Page Header
```
"Companies"  ← text-[3.5rem] font-black tracking-tight leading-none text-on-surface
"Curated directory of autonomous procurement partners and global chains." ← text-on-surface-variant text-lg
```

### Grid: `grid grid-cols-12 gap-8`

**Filter Sidebar (col-span-3):** `bg-surface-container-low p-6 rounded-xl space-y-6`

Filters:
1. "Total Savings" — checkboxes (Over $1M, $500k–$1M checked with `bg-secondary`, Under $500k)
   - Unchecked: `w-5 h-5 rounded border-2 border-outline-variant hover:border-secondary`
   - Checked: `w-5 h-5 rounded border-2 border-secondary bg-secondary` with check Material Symbol white
2. "Industry" — chips: Hospitality (`bg-secondary text-white`), Aviation/Logistics/SaaS (`bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high cursor-pointer`)
3. "Region" — `<select>` with `bg-surface-container-lowest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary/20`
4. "Supplier Rating" — 4 filled stars + 1 outline in `text-secondary`, "4.0+" label

**Company Grid (col-span-9): `grid grid-cols-2 gap-6`**

Each card: `bg-surface-container-lowest rounded-xl p-8 hover:shadow-ambient transition-all duration-500 border border-transparent hover:border-surface-container-highest group`

Card structure:
```
Top row: flex justify-between items-start mb-8
  Left: logo (w-14 h-14 rounded-xl bg-slate-50 border border-surface-container) + name/badge
  Right: more_vert icon button

Savings block mb-8:
  "Total Savings Realized" ← text-xs font-bold uppercase tracking-widest text-on-surface-variant
  $X,XXX,XXX text-4xl font-black text-on-tertiary-container tracking-tight
  YoY badge: positive → bg-tertiary-fixed text-on-tertiary-container, negative → bg-error-container text-error

Stats grid: grid grid-cols-2 gap-4 pt-6 border-t border-surface-container
  Avg Delta | Total Bookings  ← text-[10px] uppercase labels + text-lg font-bold values
```

**Company data:**
```
Hilton:    $1,240,500 (+12% YoY), Avg Delta 18.4%, Bookings 4,821,   badge: "Strategic Partner" bg-tertiary-fixed text-on-tertiary-fixed-variant
Marriott:  $842,200   (+8% YoY),  Avg Delta 15.2%, Bookings 3,102,   badge: "Preferred Supplier" bg-surface-container-highest text-on-secondary-fixed-variant
Delta:     $2,105,800 (+21% YoY), Avg Delta 24.1%, Bookings 12,544,  badge: "Strategic Partner" bg-tertiary-fixed text-on-tertiary-fixed-variant
Hyatt:     $412,000   (-2% YoY),  Avg Delta 9.2%,  Bookings 1,850,   badge: "Preferred Supplier" bg-surface-container-highest text-on-secondary-fixed-variant
```

Logo avatars: colored divs with company initials, no external images.

Card click → `navigate('/companies/hilton')` (or respective id)

**Pagination footer:**
```
"Showing 4 of 128 suppliers"
"Load More Suppliers" button: bg-surface-container-highest text-on-surface font-bold rounded-full px-6 py-3 with expand_more icon
```

---

## `src/pages/SupplierProfile.tsx`

Reference: `design/supplier_profile_no_top_bar/code.html`

**Layout:** `p-8 space-y-8 max-w-7xl mx-auto`

### Hero Section: `grid grid-cols-12 gap-8 items-end`

Left (col-span-8): Logo avatar (w-32 h-32 rounded-3xl bg-primary-container with company initials, verified badge `bg-tertiary-fixed-dim text-on-tertiary-fixed p-1.5 rounded-lg` absolute -bottom-2 -right-2) + company details

Company info:
```
"Lumina Hospitality Group"  ← text-4xl font-extrabold tracking-tight
"Preferred Tier I" badge: bg-surface-container-highest text-secondary text-[10px] font-black uppercase rounded-full px-3 py-1
Description text-on-surface-variant text-sm
Contact row: phone (text-secondary), website, location (text-on-surface-variant)
```

Right (col-span-4): `bg-surface-container-low p-8 rounded-3xl`
```
"Total Lifetime Savings" label
$1.2M  ← text-[3.5rem] font-extrabold leading-none tracking-tighter
+14% with trending_up icon in text-on-tertiary-container
"Negotiated across 14 master service agreements."
```

### Bento Grid: `grid grid-cols-3 gap-6`

**Pricing Trends (col-span-2):** `bg-surface-container-lowest p-8 rounded-3xl h-[400px]`
- Header: "Pricing Trends" + 1Y/ALL filter buttons (ALL active: `bg-secondary text-white`, inactive: `bg-surface-container text-on-surface-variant`)
- SVG chart: `viewBox="0 0 800 200"`, draw path `M0 150 Q 100 130 200 160 T 400 80 T 600 110 T 800 40`, gradient fill from `#0058BE` at 10% opacity to transparent, stroke `url(#gradient-line)` secondary→secondary-container
- Animated highlight circle at (400,80): outer ring `fill-opacity: 0.2`
- Glass tooltip absolute centered: `glass-panel p-3 rounded-xl border border-white shadow-xl` showing "$485 / night avg"
- Month labels row: JAN MAR MAY JUL SEP NOV in `text-[10px] font-bold text-on-primary-container uppercase tracking-widest`

**Booking Window Heatmap (col-span-1):** `bg-surface-container-high p-8 rounded-3xl`
- `grid grid-cols-4 gap-3`
- Best Deal months (FEB, JUL, DEC): `bg-tertiary-fixed-dim rounded-xl` with star icon FILL 1
- Mid months (MAR, JUN, SEP): `bg-secondary-fixed rounded-xl opacity-70`
- Slow months (JAN, APR, MAY, AUG, OCT, NOV): `bg-surface-container-lowest rounded-xl opacity-40`
- Legend: tertiary-fixed-dim = "Best Deal", surface-container-lowest = "Peak Price"

**Previous Negotiations (col-span-3):** `bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/15`
- Table with `border-separate border-spacing-y-4`
- Columns: Contract ID | Focus Region | Duration | Negotiated Rate | Net Savings | Status
- Header: `text-[10px] font-black text-on-primary-container uppercase tracking-[0.2em]`
- Rows hover: `hover:bg-surface-container-low transition-colors` with `rounded-l-2xl rounded-r-2xl` on first/last cells

**Row data:**
```
LH-2023-0492 | EMEA Corporate (public icon)     | 24 Months | $242/avg | +$420,000 text-on-tertiary-container | ACTIVE bg-tertiary-fixed text-on-tertiary-fixed
LH-2022-0115 | North America (apartment icon)   | 12 Months | $310/avg | +$285,000 text-on-tertiary-container | ARCHIVED bg-surface-container text-on-surface-variant
LH-2021-0882 | APAC Logistics (flight_takeoff)  | 36 Months | $185/avg | +$512,000 text-on-tertiary-container | ARCHIVED bg-surface-container text-on-surface-variant
```

---

## `src/pages/ConfigureNegotiation.tsx`

Reference: `design/configure_negotiation_no_top_bar/code.html`

**Layout:** `pt-12 pb-12 px-10 min-h-screen bg-surface`

### Breadcrumb
`text-[10px] uppercase tracking-widest font-bold text-on-primary-container`
"Negotiations > Deploy Agent" — "Deploy Agent" in `text-secondary`

### Page Title
```
"Configure Negotiation"  ← text-5xl font-black tracking-tighter text-on-surface
"Phase 1: Define parameters and intent for the autonomous sourcing engine."
```

### Two-column Grid: `grid grid-cols-12 gap-8`

**Form Panel (col-span-7):** `bg-surface-container-lowest p-8 rounded-xl shadow-ambient-sm`

Step indicator: `w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-xs font-bold` showing "01" + "Event Parameters" heading

Fields:
1. **Time Range** — label + input with calendar_today icon on left, value "Oct 12, 2024 - Oct 18, 2024"
   - Input: `bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-4 focus:ring-2 focus:ring-secondary/20`
2. **Type of Service** — toggle row `flex p-1 bg-surface-container-low rounded-xl`
   - Hotel (active): `bg-white shadow-sm text-secondary font-bold` with hotel icon
   - Airline (inactive): `text-on-primary-container hover:text-on-surface` with flight icon
   - Use `useState` for active tab
3. **Specific Requirements** — textarea 4 rows, placeholder "e.g., '120 Deluxe Rooms, 5 Suites, Group Baggage Handling'"
   - `bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-secondary/20`

"Next Step" button (right-aligned): `bg-[#2170E4] text-white font-bold py-3 px-8 rounded-lg` with arrow_forward icon
onClick → `navigate('/negotiations/new')`

**Right Panel (col-span-5):** Empty in design — render a preview card:
`bg-surface-container-low p-8 rounded-xl`
"Agent Preview" label + summary of entered parameters as a styled readout.

---

## `src/pages/NegotiationShell.tsx`

Reference: `design/negotiation_shell_no_top_bar/code.html`

**Layout:** `p-10 max-w-5xl mx-auto`

### Breadcrumb
"Negotiations > Start Negotiation"

### Header
```
"Negotiation Shell"  ← text-[3.5rem] font-bold tracking-tighter text-on-surface leading-none
"Define the parameters for the vendor negotiation cycle. Analysis suggests a 19.2% margin improvement potential."
```

### Section 1: Market Analysis (`bg-surface-container-low rounded-xl p-8 relative overflow-hidden group`)
Background watermark: `trending_down` icon, `absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 text-[120px]`

```
"Market Analysis Intelligence" ← text-[10px] font-bold uppercase tracking-widest text-on-primary-container

Row: Expected Market Price | divider | Predicted Win price
  $245/night  ← text-4xl font-bold text-on-surface
  $198/night  ← text-[4rem] font-black text-on-surface with "PREDICTED WIN" absolute badge bg-tertiary-fixed text-on-tertiary-fixed

Progress bar:
  Label row: "Negotiation Delta" | "-$47.00 (19.2%)" text-on-tertiary-container
  Bar: bg-surface-container-highest h-3 rounded-full
  Fill: bg-gradient-to-r from-secondary to-secondary-container at 19.2% width
```

### Section 2: Strategic Inputs (`bg-surface-container-lowest rounded-xl p-8 shadow-ambient-sm border border-outline-variant/10`)

Two inputs (grid grid-cols-2 gap-8):
- "Ideal Price" — $ prefix, placeholder "185.00", type number
- "Highest Price Willing to Pay" — $ prefix, placeholder "215.00", type number
- Both: `bg-surface-container-low border-none rounded-lg py-4 pl-8 pr-4 focus:ring-2 focus:ring-secondary`
- Helper text below each: `text-[10px] text-on-surface-variant`

"Start Negotiations" button: `w-full max-w-md bg-secondary text-white font-bold py-5 px-10 rounded-xl shadow-lg hover:bg-secondary/90 active:scale-[0.98]` with arrow_forward icon
onClick → `navigate('/negotiations/new/agent')`

---

## `src/pages/AgentDetail.tsx`

Reference: `design/galileo_agent_detail_markers_on_path/code.html`

**Layout:** `h-screen overflow-y-auto bg-surface`; inner `max-w-7xl mx-auto p-8 space-y-8`

### Hero Header: `grid grid-cols-12 gap-8 items-end`

Left (col-span-8):
```
"Live Negotiation" chip bg-tertiary-fixed + "London, UK" with location_on icon
"Hilton London"  ← text-5xl font-black tracking-tight text-on-surface
"Autonomous Agent Nexus-7 is currently processing volume discounts for Q4 corporate travel."
  "Nexus-7" in font-bold text-secondary
```

Right (col-span-4): two stat blocks
```
Target Price: $220 — text-4xl font-black text-on-surface, label text-[11px] text-on-surface-variant uppercase
Current Price: $245 — text-4xl font-black text-secondary, label text-[11px] text-secondary uppercase
```

### Bento Grid: `grid grid-cols-3 gap-8`

**Chart Panel (col-span-2):** `bg-surface-container-low rounded-xl p-8`

Header: "Negotiation Price Path" + subtitle + right stats block:
- "Savings to Date: $55.00" in text-on-tertiary-container
- "Distance to Goal: $25.00" in text-error
- Legend: 3 colored dots (secondary/on-tertiary-container/amber-500) + labels

SVG chart `viewBox="0 0 100 100" preserveAspectRatio="none"` in a `h-64 relative` div:

Y-axis labels (absolute positioned lines):
- `$300 MARKET PRICE` — solid border-t-2 border-slate-300, badge bg-white
- `$220 TARGET` — border-t-2 border-dashed border-on-tertiary-container/30, badge bg-tertiary-fixed text-on-tertiary-container
- `$200` — border-t border-slate-100 opacity-50

SVG elements:
```svg
<!-- gradient fill area -->
<linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
  stop 0%: rgba(78,222,163,0.3)  stop 100%: rgba(78,222,163,0)
</linearGradient>
<path d="M 0 0 L 100 0 L 100 55 L 75 45 L 50 35 Q 25 20, 0 0 Z" fill="url(#grad1)" />
<!-- negotiated price line: stroke #2170E4 stroke-width 2.5 -->
<path d="M 0 0 Q 25 20, 50 35 L 75 45 L 100 55" fill="none" stroke="#2170E4" stroke-linecap="round" stroke-width="2.5"/>
<!-- current position: cx=100 cy=55 fill #2170E4 with outer ring opacity 0.2 r=8 -->
<!-- Galileo target: cx=75 cy=45 fill #009668 r=3 -->
<!-- Supplier offer: cx=25 cy=20 fill #f59e0b r=3 -->
```

**Right Panel (col-span-1): two cards stacked**

CTA Card: `bg-[#131B2E] p-8 rounded-xl text-white shadow-2xl relative overflow-hidden group`
- Decorative circle: `absolute -right-10 -bottom-10 w-40 h-40 bg-[#2170E4] rounded-full blur-3xl opacity-20 group-hover:opacity-40`
- "Intervene Manually" h4
- Description text in text-on-primary-container text-sm
- "Jump into Call" button: `w-full py-4 bg-white text-[#131B2E] text-sm font-black rounded-lg hover:bg-slate-100 flex items-center justify-center gap-3` with call icon

Activity Stream: `bg-surface-container-lowest rounded-xl p-6 border border-slate-100`
Label: "Activity Stream" text-sm font-bold text-on-surface-variant uppercase tracking-widest

3 items in `space-y-6`. Each: `relative pl-6` with vertical connector line using `before:` pseudo (`before:absolute before:left-0 before:top-2 before:bottom-[-24px] before:w-[2px] before:bg-slate-100 last:before:hidden`)

Dot: `absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white`
- Active (first): `bg-secondary`
- Inactive: `bg-slate-300`

Activity data:
```
$245.00 | "Saved 5.2%" badge bg-tertiary-fixed text-on-tertiary-container | -$15.00 from previous bid | 2m ago
$260.00 | no badge                                                         | +$10.00 bg-error-container text-on-error Counter-offer received | 1h ago
$250.00 | "Saved 2.1%" badge                                              | -$8.00 Initial agent push  | 3h ago
```

### Transcript Section
`bg-surface-container-highest/30 rounded-2xl p-8 border border-slate-200/50 backdrop-blur-sm`

Header: "Negotiation Transcript" + subtitle + "Expand to Full Transcript" button `bg-surface-container-lowest text-on-surface text-sm font-bold rounded-lg border border-slate-200 px-6 py-2.5`

Two messages:

Agent message (left):
```
Avatar: w-10 h-10 rounded-full bg-[#131B2E] flex items-center justify-center
  smart_toy icon text-white text-sm
Bubble: bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100
  "Based on our projected volume of 450 room nights..."
  timestamp: "Agent Nexus-7 • 14:02:11" text-[10px] text-slate-400
```

Vendor reply (right, `flex-row-reverse`):
```
Avatar: bg-[#2170E4] with person icon
Bubble: bg-secondary/5 p-4 rounded-2xl rounded-tr-none border border-secondary/10 text-right
  "We acknowledge the volume..."
  timestamp: "Hilton Portal Rep • 14:02:45"
```

---

## `src/pages/MarketInsights.tsx`

Reference: `design/market_insights_no_top_bar/code.html`

**Layout:** `pt-12 pb-12 px-10 min-h-screen bg-surface`; inner `p-8 max-w-6xl mx-auto w-full flex flex-col gap-8`

### Hero
```
"Autonomous Landscape" ← text-[10px] font-black tracking-[0.3em] text-secondary uppercase
"Market Insights" ← text-6xl font-black text-on-surface tracking-tighter leading-none
```

### Chat Interface: `flex flex-col gap-6 min-h-[750px]`

Messages area: `flex-1 overflow-y-auto flex flex-col gap-8 pr-4`

**User message (right-aligned):**
`max-w-[80%] bg-surface-container-high p-6 rounded-3xl rounded-tr-none shadow-sm`
- "What's the best time for a 100-person company outing to Las Vegas this year?"
- timestamp: "10:42 AM • Alex Thompson" text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider

**AI response:**
Avatar: `w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-blue-400 shadow-lg` with auto_awesome icon

Response bubble: `bg-surface-container-lowest p-8 rounded-3xl rounded-tl-none shadow-ambient-sm border border-surface-container`

Intro text mentioning **October 22-26** in `font-bold text-secondary`

**Data Card** (nested): `bg-surface-container-low rounded-2xl p-6 mb-8 flex flex-col gap-6`
```
Header row: justify-between
  Left: "Recommended Window" text-xs uppercase + "Oct 22 - Oct 26" text-2xl font-black
  Right: "94% SAVINGS PROBABILITY" badge bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-[10px] font-bold

Stats grid: grid grid-cols-2 gap-4
  "Average Nightly Rate": $184 text-xl font-bold + "▼ 12% vs Market" text-[10px] text-on-tertiary-container font-bold
  "Flight Availability": High text-xl font-bold + "Optimum Window" text-[10px] text-on-surface-variant font-bold
  Both stat boxes: bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10

Top Companies list:
  "Top Companies Visiting During Window" text-[10px] uppercase label
  TechCorp (secondary dot, Group Size: 450)
  Innovate Inc (tertiary-fixed-dim dot, Group Size: 120)
  Item style: flex justify-between py-2 bg-surface-container-lowest px-4 rounded-lg
```

CTA buttons:
- "Start Negotiation": `bg-gradient-to-r from-secondary to-secondary-container text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-xl hover:shadow-secondary/30 transition-all`
- "Save to Discovery": `text-on-primary-fixed-variant px-6 py-3 rounded-full font-bold text-sm hover:bg-surface-container-high transition-colors`

AI timestamp: "AI AGENT • VERIFIED MARKET DATA" text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider

**Chat Input (bottom of chat):**
`bg-surface-container-lowest border border-surface-container p-2 pl-6 pr-2 rounded-full flex items-center shadow-xl shadow-on-surface/5`
- `<input>` flex-1 bg-transparent placeholder "Ask Nexus-Procure about other markets..."
- Send button: `w-10 h-10 rounded-full bg-on-surface text-white flex items-center justify-center hover:opacity-90` with send icon

State: `useState` for input value. On submit, no-op (static demo).

---

## Shared UI Components

### `src/components/ui/Button.tsx`
```tsx
type ButtonVariant = 'primary' | 'ghost'
// primary: bg-gradient-to-br from-secondary to-secondary-container text-white rounded-xl px-8 py-4 font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all
// ghost: text-on-primary-fixed-variant px-6 py-3 rounded-full font-bold hover:bg-surface-container-high transition-colors
```

### `src/components/ui/Chip.tsx`
```tsx
type ChipVariant = 'success' | 'negotiating' | 'neutral' | 'error'
// success:     bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold px-3 py-1 rounded-full
// negotiating: bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-3 py-1 rounded-full with animated pulse dot
// neutral:     bg-surface-container-high text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full
// error:       bg-error-container text-error text-xs font-bold px-3 py-1 rounded-full
```

### Material Symbols Usage Pattern
```tsx
// All icons use the Material Symbols Outlined web font
// Filled icons: inline style={{ fontVariationSettings: "'FILL' 1" }}
// Never import icon libraries — use the font class directly:
<span className="material-symbols-outlined">icon_name</span>
```

---

## Design Rules to Enforce Everywhere

1. **No raw borders**: Never `border border-gray-200`. Use `border-outline-variant/10` or `border-surface-container` max.
2. **No drop shadows with opacity > 0.08**: Use `shadow-ambient` custom token or `shadow-on-surface/5`.
3. **No dividers in lists**: Use `space-y-4` or alternating `hover:bg-surface-container` backgrounds.
4. **Buttons**: Primary always gradient `from-secondary to-secondary-container`. Never flat `bg-blue-500`.
5. **Success/savings color**: Always `text-on-tertiary-container` (`#009668`) on `bg-tertiary-fixed` (`#6ffbbe`). Never `text-green-500`.
6. **Logo/avatar images**: Build colored letter-avatars using `bg-primary-container` or `bg-surface-container-high` divs with the company's first letter in `text-secondary font-black text-2xl`. Do not reference any external image URLs.
7. **Typography scale**:
   - Hero numbers: `text-6xl font-black tracking-tight`
   - Page titles: `text-5xl font-black tracking-tighter`  
   - Section titles: `text-2xl font-bold`
   - Labels/metadata: `text-[10px] font-bold uppercase tracking-widest text-on-primary-container`
   - Body: `text-sm text-on-surface-variant`

---

## Execution Order

1. Install deps + configure Tailwind + update `index.css`
2. Create `tailwind.config.ts` with full token set above
3. Build `SideNav.tsx` (shared, used by all pages)
4. Build `App.tsx` with router
5. Build pages in order: Dashboard → Companies → SupplierProfile → ConfigureNegotiation → NegotiationShell → AgentDetail → MarketInsights
6. Build shared `Button.tsx` and `Chip.tsx` during Dashboard step, reuse in subsequent pages
7. Run `npm run build` at end — fix any TypeScript errors silently
