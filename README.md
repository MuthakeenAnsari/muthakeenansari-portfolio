# Muthakeen Ansari M — Personal Portfolio

A single-page static portfolio for **Muthakeen Ansari M** covering QA automation, cybersecurity, AI and data science, and the ongoing **NGIULS** Linux systems project.

The site is plain HTML, CSS and JavaScript. There is no build step, backend, database, framework runtime or package dependency.

> **Live site:** <https://muthakeenansari.github.io/muthakeenansari-portfolio/> — published with GitHub Pages from `main` / root. See [`PORTFOLIO_DEPLOYMENT_STATUS.md`](PORTFOLIO_DEPLOYMENT_STATUS.md) for deployment and verification details.

## Preview locally

From this folder:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Opening `index.html` directly also works, but a local server matches normal hosting behaviour.

## Structure

```text
muthakeenansari-portfolio/
├── index.html                 # Page content and metadata
├── 404.html                   # Matching not-found page
├── assets/
│   ├── css/styles.css         # Design tokens, sections and responsive rules
│   ├── js/main.js             # Navigation, skills, certifications and effects
│   ├── icons/
│   │   ├── favicon.svg
│   │   ├── apple-touch-icon.png
│   │   └── skills/            # Local skill logos (no runtime CDN requests)
│   └── images/og-cover.png    # Social sharing image
├── _headers                   # Cloudflare Pages security/cache headers
├── robots.txt
├── README.md
├── .gitignore
└── PORTFOLIO_DEPLOYMENT_STATUS.md
```

## Design

The approved warm, light-only design is preserved:

- `#F7F0EC` background, `#FFFCF9` surfaces, `#F3EADD` cream, `#241E1D` ink, `#6B605C` muted text, `#7A263D` wine, `#D6A63A` champagne gold, `#D97941` orange and `#E9DDD2` borders.
- **Manrope** for UI/body text and **DM Serif Display** for headlines, with system fallbacks.
- Distinct foil, soft-UI, clay, glass, wine/gold-edge and dashed future-work panel treatments.
- Restrained ambient light, reveal movement, pointer-tracked card light, capped magnetic movement and a 24-particle click scatter using one shared canvas.
- Category filter pills deliberately **do not move** under the pointer; feedback is colour, border and shadow only.
- `prefers-reduced-motion` disables the decorative particle canvas and animation-heavy behaviour while keeping all content visible.

## Editing content

- **Page text and sections:** `index.html`.
- **Skills and categories:** the `skills` array in `assets/js/main.js`.
- **Certifications:** the `certifications` object in `assets/js/main.js`.
- **Design tokens and layout:** the `:root` block and section rules in `assets/css/styles.css`.

Skills use local logos from `assets/icons/skills/`. If a logo file is absent or fails, the existing acronym fallback is shown automatically. Keep the fallback when adding a skill without an icon.

## Contact actions

The Contact section contains five real actions and no form:

| Action | Destination |
| --- | --- |
| Email | `mailto:muthakeenansariofficial@gmail.com` |
| Call | `tel:+918122638506` |
| WhatsApp | `https://wa.me/918122638506` |
| LinkedIn | `https://www.linkedin.com/in/muthakeen-ansari-033781309/` |
| GitHub | `https://github.com/MuthakeenAnsari` |

`mailto:` and `tel:` are handled by the visitor's operating system. WhatsApp and the social links open in a new tab with `rel="noopener noreferrer"`.

## Accessibility and validation

- Semantic landmarks, one `h1`, ordered headings, visible focus rings, a skip link, 44px-plus contact targets and accessible names.
- Skills Explorer filter state uses `aria-pressed`; the detail panel and result count use polite live regions.
- Responsive navigation updates `aria-expanded`, closes on link activation, outside click and <kbd>Escape</kbd>.
- All internal anchors resolve; every local asset returns HTTP 200.
- Browser checks at 320, 375, 390, 768, 1024, 1440, 1920 and a wide desktop viewport show no horizontal overflow.
- Automated accessibility audit (axe-core, WCAG 2.0/2.1 A/AA) reported **0 violations** on the home page at desktop and mobile widths and on the 404 page.

## Deployment

### GitHub Pages (current deployment, free)

**Live URL:** <https://muthakeenansari.github.io/muthakeenansari-portfolio/>

- Repository: <https://github.com/MuthakeenAnsari/muthakeenansari-portfolio>
- Source: branch `main`, folder `/ (root)`, no build step.
- Pushing to `main` triggers a new Pages build automatically.
- The `.nojekyll` file is present so files and folders are served as-is.

GitHub Pages has documented soft bandwidth and size limits (currently around 100 GB per month for the free service); consult the [current limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Do not treat any free host as an unlimited or guaranteed-uptime service.

### Cloudflare Pages (optional migration, free static plan)

The site can be moved to Cloudflare Pages later without code changes:

1. In the Cloudflare dashboard open **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorize GitHub access for the Cloudflare account if prompted.
3. Select the `muthakeenansari-portfolio` repository.
4. Use production branch `main`, framework preset **None**, leave the build command empty, and set the build output directory to `/` (the repository root).
5. Save and deploy. Cloudflare assigns a free `*.pages.dev` address.
6. Open the assigned URL and verify the page, assets and contact links before treating it as published.

No Functions, Worker, database or paid add-on is required. Cloudflare's free plan still has build, file-count and file-size limits; static asset delivery is documented as free and unlimited, but uptime and traffic are still subject to the provider's terms.

Official references: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/), [limits](https://developers.cloudflare.com/pages/platform/limits/), [Functions pricing/static assets](https://developers.cloudflare.com/pages/functions/pricing/).

## Assets and attribution

- Skill logos are from [Simple Icons](https://simpleicons.org/) (CC0 1.0). Brand names and logos remain the property of their respective owners.
- The favicon, monogram and social cover were created for this portfolio in the site's existing palette.
- Fonts are loaded from Google Fonts with local system fallbacks. If the request fails, the site remains usable.

---

© Muthakeen Ansari M. Personal portfolio content.
