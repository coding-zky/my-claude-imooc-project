---
name: Traditional Finance Management
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#895200'
  on-secondary: '#ffffff'
  secondary-container: '#ffb157'
  on-secondary-container: '#734400'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdcbc'
  secondary-fixed-dim: '#ffb86a'
  on-secondary-fixed: '#2c1700'
  on-secondary-fixed-variant: '#683d00'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data-mono:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is anchored in the aesthetic of high-end institutional banking. It prioritizes stability, precision, and long-term reliability. The brand personality is authoritative yet accessible, designed to evoke the feeling of a trusted private wealth management firm. 

The visual style is **Corporate / Modern** with a lean toward **Minimalism**. It utilizes generous white space to allow complex financial data to breathe, while high-contrast typography ensures immediate legibility. The interface avoids trendy distractions, focusing instead on structural integrity, clear information hierarchy, and professional-grade data visualization.

## Colors

The color palette is split into two distinct modes to maintain professional rigor across environments.

**Light Mode (Default):**
Uses a deep slate primary for text and structural elements, creating a grounded foundation. The warm gold accent is used sparingly for highlights, CTA focus states, and premium features, suggesting value and tradition. Backgrounds utilize a soft gray-blue to reduce eye strain during long sessions of data entry.

**Dark Mode:**
The palette shifts to a deeper blue primary to maintain the banking aesthetic without sacrificing readability. The accent switches to emerald to emphasize growth and visibility against the darker surface tiers.

**Semantic Indicators:**
Financial status is strictly color-coded: Red (#DC2626) for outflows and Emerald (#059669) for inflows. These colors must maintain high contrast against both light and dark surfaces to ensure accessibility.

## Typography

The design system utilizes **Plus Jakarta Sans** for its balanced geometric proportions and exceptional legibility. 

A critical requirement for this system is the use of `tabular-nums` (tnum) for all financial figures. This ensures that decimals and digits align perfectly in vertical columns, facilitating quick mental arithmetic and professional data presentation.

- **Headlines:** Bold and concise, using tighter letter spacing for a structured, editorial feel.
- **Data Display:** Uses a semi-bold weight to distinguish numbers from descriptive labels.
- **Labels:** Uppercase styles with increased tracking are used for table headers and section overviews to differentiate functional metadata from user content.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for the desktop version, centering content within a 1440px container to ensure a premium, dashboard-like experience. 

- **Grid System:** A 12-column grid with 24px gutters provides the framework for card-based layouts.
- **Rhythm:** An 8px linear scale is used for most spacing, though a 4px increment is allowed for tight data-dense components like line items and form inputs.
- **Structure:** Side navigation is fixed (280px), while the main content area utilizes cards to group related financial metrics.
- **Responsiveness:** For tablet reflow, the 12-column grid collapses to 6 columns, and margins reduce to 24px. The mobile experience (if applicable) would shift to a single-column stack with 16px margins.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a clean, professional appearance.

- **Surfaces:** Depth is created by placing white (`#FFFFFF`) or surface (`#1E293B`) cards on top of the soft background.
- **Borders:** Subtle 1px borders (Slate-200 in light mode) are used to define card boundaries and input fields, reinforcing the structured, "ledger" feel of the tool.
- **Shadows:** When necessary for modals or dropdowns, a single, ultra-diffused shadow is used (0px 10px 30px rgba(15, 23, 42, 0.08)), mimicking natural light without creating visual clutter.

## Shapes

The shape language balances modern approachability with traditional structure. 

- **Default Elements:** Buttons, input fields, and checkboxes use a **12px (rounded-lg)** radius. This offers a softer feel than sharp corporate tools while remaining professional.
- **Containers:** Dashboard cards use a more pronounced **16px (rounded-xl)** radius to clearly define content groupings.
- **Action Elements:** Pill shapes (9999px) are reserved exclusively for status chips (e.g., "Paid", "Pending") and primary floating action buttons to distinguish them from structural UI.

## Components

**Buttons**
Primary buttons use the Deep Slate background with white text. Pill-shaped buttons are used for global actions, while 12px rounded buttons are used for in-line form actions.

**Input Fields**
Standardized with a 12px radius, a 1px border, and generous internal padding (12px 16px). Focus states utilize the Warm Gold accent for the border color to provide clear visual feedback.

**Data Tables**
The core of the system. Tables must use `tabular-nums`. Row heights are generous (56px) to maintain a premium feel. Every second row uses a very faint background tint for easier scanning (zebra striping).

**Cards**
All primary content modules are housed in cards with a 16px radius. Cards include a subtle 1px border and no shadow, creating a "flat-layered" look that feels organized and stable.

**Progress Bars & Visualizers**
Used for budget tracking. These should be slim (8px height) with fully rounded ends, using the Emerald/Red semantic colors to indicate health relative to the set limit.