---
name: Serene Earth Night
colors:
  surface: '#10150c'
  surface-dim: '#10150c'
  surface-bright: '#363b30'
  surface-container-lowest: '#0b1007'
  surface-container-low: '#181d14'
  surface-container: '#1c2118'
  surface-container-high: '#272b22'
  surface-container-highest: '#31362c'
  on-surface: '#e0e4d6'
  on-surface-variant: '#c2c8bf'
  inverse-surface: '#e0e4d6'
  inverse-on-surface: '#2d3228'
  outline: '#8c938a'
  outline-variant: '#424841'
  surface-tint: '#a8d1ab'
  primary: '#a8d1ab'
  on-primary: '#13371d'
  primary-container: '#739a78'
  on-primary-container: '#0b3017'
  inverse-primary: '#426748'
  secondary: '#e3c290'
  on-secondary: '#412d07'
  secondary-container: '#5c451e'
  on-secondary-container: '#d4b483'
  tertiary: '#c5c7c1'
  on-tertiary: '#2e312d'
  tertiary-container: '#8f928c'
  on-tertiary-container: '#272b26'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3edc6'
  primary-fixed-dim: '#a8d1ab'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#2a4e32'
  secondary-fixed: '#ffdeac'
  secondary-fixed-dim: '#e3c290'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#59431c'
  tertiary-fixed: '#e1e3dc'
  tertiary-fixed-dim: '#c5c7c1'
  on-tertiary-fixed: '#191c18'
  on-tertiary-fixed-variant: '#444843'
  background: '#10150c'
  on-background: '#e0e4d6'
  surface-variant: '#31362c'
typography:
  h1:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: '8'
  container-max: '1280'
  gutter: '24'
  margin-mobile: '20'
  margin-desktop: '64'
  stack-sm: '12'
  stack-md: '24'
  stack-lg: '48'
  stack-xl: '80'
---

## Brand & Style

The design system is rooted in the principles of biophilic design, specifically focusing on the tranquility of the natural world at night. It targets high-end wellness, sustainable architecture, and mindful lifestyle brands that prioritize decompression and intentionality.

The aesthetic style is a refined blend of **Minimalism** and **Tactile Organicism**. In this dark mode implementation, the sterile "black-out" of typical dark modes is avoided in favor of deep, earthy neutrals. The emotional response is one of immediate nocturnal calm—a digital "night walk" characterized by high legibility, generous negative space, and a grounded, stable composition.

## Colors

The palette is derived from natural landscapes under moonlight—deep forest shadows, muted sands, and cool midnight skies.

- **Primary (Sage Green):** A grounded green used for key actions and progress, symbolizing resilient growth.
- **Secondary (Warm Sand):** Used for highlights and secondary interactions to provide a touch of warmth against the dark background.
- **Tertiary (Cloud Grey):** A soft, cool light grey used for subtle accents and high-tier containers.
- **Neutral (Deep Earth):** The foundation of the dark mode, providing a rich, organic dark-grey base that is easier on the eyes than pure black.

The color system maintains a "calm" profile by utilizing low-saturation transitions and organic tones, ensuring the interface feels like a natural environment rather than a digital screen.

## Typography

This design system utilizes a sophisticated typographic pairing to balance tradition and modernity. 

**Noto Serif** is used for headlines to convey authority, grace, and a literary quality. In dark mode, font weights are carefully balanced to ensure serifs remain crisp against dark backgrounds.

**Manrope** serves as the functional workhorse for body text and interface labels. Its geometric yet soft construction ensures high readability. Line heights are generous (1.6x) to contribute to the overall "airy" feel, preventing text from feeling cramped in a low-light UI.

## Layout & Spacing

The layout philosophy follows a **fixed-fluid hybrid grid**. While content is contained within a maximum width of 1280px to prevent excessive line lengths, the surrounding margins are expansive to isolate the content from the "noise" of the screen edges.

The spacing rhythm is built on an 8px base unit. Vertical rhythm is critical; the design system utilizes "Stack" increments to group related elements tightly (12px-24px) while separating distinct sections with significant breathing room (80px+). This creates a rhythmic "ebb and flow" that guides the user’s eye without forcing it.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Subtle Glows** rather than traditional heavy shadows, which are less effective in dark modes.

1.  **Surface Tiers:** The background uses the deepest neutral. Elevated surfaces (like cards or menus) use progressively lighter tones of the neutral palette to indicate height.
2.  **Shadow Character:** Instead of dark shadows, elevated elements use very subtle, high-spread shadows tinted with the Primary Sage color (#709775) at low opacity to create a "lifting" effect.
3.  **Depth Levels:**
    *   *Low:* Subtle 1px outline using a low-opacity Sand color.
    *   *Medium:* Tonal shift to a lighter neutral background for interactive cards.
    *   *High:* Layered tonal shift with a soft, tinted ambient glow for modals and navigation overlays.

## Shapes

The design system embraces a highly approachable, fluid aesthetic using **Pill-shaped** geometry. With a standard **Rounded** setting (level 3), the UI moves away from boxy constraints toward a more organic, continuous silhouette.

Small components like buttons use the base `rounded` (1rem), creating a distinct pill or capsule look. Larger containers like cards and content sections utilize `rounded-xl` (3rem) to emphasize a soft, cocoon-like quality. Icons and interactive elements should mirror this fluidity, favoring generous radii and rounded terminals.

## Components

- **Buttons:** Primary buttons use a solid Sage Green background with dark neutral text. Given the level 3 roundedness, they appear as full capsules. Secondary buttons use a Sand-colored border. All buttons feature a 500ms transition to mimic natural movement.
- **Cards:** Cards use a slightly lighter shade of the neutral background with a very generous `rounded-xl` corner radius (3rem), making them feel like smooth, weathered stones.
- **Input Fields:** Fields are designed as soft-filled surfaces (darker than the card background) with a high corner radius to match the pill-shaped button style.
- **Chips/Tags:** These are fully circular/capsule-shaped, utilizing the Sand color at 15% opacity with light secondary-colored text.
- **Lists:** Lists should avoid dividers when possible, instead using generous vertical padding to separate items.
- **Selection Controls:** Checkboxes and radios are soft and rounded; radio buttons are perfect circles while checkboxes feature a significant radius to maintain the "soft-edge" theme.
- **Progress Indicators:** Use thick, fully rounded bars. Avoid "loading spinners" in favor of gentle pulse animations or linear skeleton screens to maintain the calm atmosphere.