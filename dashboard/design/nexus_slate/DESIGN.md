# Design System Strategy: The Sovereign Navigator

## 1. Overview & Creative North Star
The core philosophy of this design system is **"The Sovereign Navigator."** In the world of autonomous travel procurement, we move away from the cluttered, "dashboard-heavy" aesthetics of legacy B2B platforms. Instead, we embrace a high-end editorial experience that feels authoritative yet effortless. 

This system breaks the "template" look through **intentional asymmetry** and **tonal depth**. We treat data not as a series of boxes, but as a curated story. By leveraging extreme typographic scale and overlapping glass surfaces, we create a sense of "Autonomous Luxury"—where the interface feels like it is thinking three steps ahead of the procurement officer.

## 2. Colors: Tonal Architecture
The palette is rooted in the depth of `primary_container` (#131B2E). We do not use color simply for decoration; we use it to define the architecture of the space.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions. 
- **Method:** To separate a sidebar from a main feed, use `surface_container_low` for the sidebar against a `surface` background. The transition of color is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted glass.
- **Nesting Logic:** Place a `surface_container_lowest` card on a `surface_container_low` section to create natural lift. 
- **The Glass & Gradient Rule:** For floating elements or primary CTAs, use Glassmorphism. Apply a semi-transparent `surface_tint` with a `backdrop-blur` of 12px–20px. 
- **Signature Textures:** Main CTAs should utilize a subtle linear gradient transitioning from `secondary` (#0058BE) to `secondary_container` (#2170E4) at a 135-degree angle. This adds a "soul" to the professional polish.

## 3. Typography: Editorial Authority
We use **Inter** as our typographic backbone. The goal is to create a clear hierarchy that feels like a premium financial journal.

- **Display Scale:** Use `display-lg` (3.5rem) for singular, high-impact numbers (e.g., Total Annual Savings). These should have a slight negative letter-spacing (-0.02em) to feel "tight" and professional.
- **Contrast:** Pair `headline-sm` (1.5rem) in `on_surface` with `label-sm` (0.6875rem) in `on_primary_container` for metadata. This "Big-Small" pairing creates an editorial rhythm that guides the eye.
- **Labels:** Labels are never just "grey." Use `on_surface_variant` to ensure they feel integrated into the Deep Navy atmosphere while maintaining WCAG compliance.

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "web 2.0." We achieve depth through light and physics.

- **The Layering Principle:** Stack `surface-container` tiers (Lowest to Highest). A "High" tier surface should only ever sit on a "Low" or "Base" tier surface.
- **Ambient Shadows:** When an element must float (like a modal or dropdown), use an extra-diffused shadow. 
    - **Value:** `0px 24px 48px rgba(19, 27, 46, 0.08)`. 
    - **Note:** The shadow color is a tinted version of `on_surface`, not pure black, mimicking natural ambient light.
- **The "Ghost Border" Fallback:** If a border is required for extreme accessibility needs, use the `outline_variant` token at **15% opacity**. Never 100%.

## 5. Components: Refined Primitives

### Buttons
- **Primary:** Gradient fill (`secondary` to `secondary_container`), white text, `lg` (0.5rem) roundedness.
- **Tertiary:** No background, `on_primary_fixed_variant` text. Use a subtle `surface_container_high` background only on hover.

### Inputs & Fields
- **Styling:** Use `surface_container_lowest` for the field background. 
- **The "Focus State":** Do not use a heavy border. Use a 2px `secondary` bottom-bar or a subtle outer glow using the `surface_tint`.

### Chips & Governance Indicators
- **Selection Chips:** Use `full` (9999px) roundedness. 
- **Autonomous Status:** Use `on_tertiary_container` (#009668) for "Savings Optimized" flags, paired with a `tertiary_fixed` background.

### Cards & Data Lists
- **The "No Divider" Mandate:** Forbid the use of 1px horizontal lines between list items. Instead, use vertical white space (16px–24px) or a alternating subtle background shift (`surface` to `surface_container_low`).
- **Nesting:** Data-rich tables should be housed in a `surface_container_highest` container to elevate the "working area" above the navigation.

### Specialized Component: The Governance Timeline
For travel routes, use a "threaded" layout. Instead of a line, use a series of soft-glow pulses (using `secondary_fixed_dim`) to indicate the autonomous pathing, avoiding harsh geometric connectors.

## 6. Do's and Don'ts

### Do:
- **Do** use `display-lg` for the "One Big Number" on every page.
- **Do** use `surface_container` shifts to define "work zones" vs "info zones."
- **Do** allow for generous white space (32px+) between major sections to let the data breathe.

### Don't:
- **Don't** use 1px #000000 or #CCCCCC borders. Ever.
- **Don't** use standard "Drop Shadows" with high opacity.
- **Don't** use dividers in lists; let the typography and spacing handle the separation.
- **Don't** use bright, saturated greens for success—use the sophisticated `tertiary` (#002113 / #009668) palette for a more mature B2B feel.