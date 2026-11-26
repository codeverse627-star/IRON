# IronPulse — Gym & Strength Club

A complete, responsive one-page website for a fictional strength gym. Built with plain
HTML, CSS and JavaScript — no build step, no dependencies (only Google Fonts and
Unsplash photography, both loaded from the web).

## Run it

Open `index.html` in any browser. That's it.

For a local server (optional, recommended for testing form/scroll behavior):

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All page content and sections |
| `style.css` | Design tokens, layout, responsive styles, animations |
| `script.js` | Navigation, scroll reveals, counters, pricing toggle, form validation |
| `robots.txt` | Crawler rules |

## Sections

- Sticky header with scroll progress and mobile menu
- Full-screen hero with animated stats
- Scrolling marquee
- Six-program grid
- "Why us" section with image collage
- Coach profiles
- Pricing with monthly / annual toggle
- Testimonials
- Free-week lead form with inline validation
- Footer with hours, contact and social links

## Customize

- **Brand colors / fonts** — edit the CSS variables at the top of `style.css` (`--volt`,
  `--bg`, `--font-display`, etc.).
- **Copy and prices** — edit `index.html`. Annual prices live in the `data-annual`
  attributes on `.price-card__value`.
- **Photos** — replace the Unsplash URLs in `index.html` and the two `background-image`
  URLs in `style.css` (hero and trial sections).
- **Form handling** — `script.js` currently validates and shows a success message
  locally. Point the `<form>` at your backend or a service like Formspree/Netlify Forms
  to collect submissions.

## Accessibility & performance notes

- Semantic landmarks, skip link, labelled form fields, visible focus styles and
  `prefers-reduced-motion` support.
- Images are lazy-loaded below the fold.
- No frameworks, no runtime dependencies.
