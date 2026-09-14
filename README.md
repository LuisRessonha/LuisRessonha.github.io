# LuisRessonha.github.io

Personal portfolio and landing page hosted on GitHub Pages.

**Live site:** [luisressonha.github.io](https://luisressonha.github.io)

---

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing / home page |
| `portfolio.html` | Full CV & portfolio (About, Skills, Experience, Certifications, Education, Projects) |

## File Structure

```
├── index.html                        Landing page
├── portfolio.html                    Full portfolio / CV page
├── css/styles.css                    Shared stylesheet
├── js/script.js                      Shared browser-side script (theme toggle, nav, aria)
├── assets/certificates/              Certificate images
├── training-and-certifications.md    Editable source for the Certifications section
├── scripts/
│   └── sync-training-certifications.js  Node.js build script (not served to browser)
└── package.json
```

## Adding / Updating a Certification

1. Edit [`training-and-certifications.md`](training-and-certifications.md) following the template at the bottom of that file.
2. Run the sync script from the repo root:

```bash
npm run sync
# or directly:
node scripts/sync-training-certifications.js
```

3. Commit both `training-and-certifications.md` and the updated `portfolio.html`.

> **Note:** The sync script requires Node.js ≥ 18.

## Local Preview

Open `index.html` or `portfolio.html` directly in your browser, or use a simple local server:

```bash
npx -y serve .
```
