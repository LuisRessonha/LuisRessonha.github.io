# LuisRessonha.github.io

Personal portfolio and landing page hosted on GitHub Pages.

**Live site:** [luisressonha.github.io](https://luisressonha.github.io)

---

## Pages & Endpoints

| File | Purpose |
|------|---------|
| `index.html` | Landing / home page |
| `portfolio.html` | Full CV & portfolio (About, Skills, Experience, Certifications, Education, Projects) |
| `404.html` | Branded 404 error page |
| `sitemap.xml` | Search engine indexing declaration |
| `robots.txt` | Crawler configuration and sitemap pointer |

## File Structure

```
├── index.html                        Landing page
├── portfolio.html                    Full portfolio / CV page
├── 404.html                          Custom branded 404 page
├── robots.txt                        Search engine instructions
├── sitemap.xml                       Sitemap
├── css/
│   └── styles.css                    Shared stylesheet (with print and modal styles)
├── js/
│   └── script.js                      Shared script (theme toggle, scrollspy, modal, aria)
├── assets/
│   ├── og-preview.svg                Open Graph & Twitter social share card
│   └── certificates/                 Certificate images
├── .github/
│   └── workflows/
│       └── sync-certifications.yml   GitHub Actions auto-sync workflow
├── training-and-certifications.md    Editable source for the Certifications section
├── scripts/
│   └── sync-training-certifications.js  Node.js sync build script
└── package.json
```

## Adding / Updating a Certification

You can update certifications in two ways:

### Option A: Automatic Cloud Sync (Recommended — No Node.js required!)
1. Edit [`training-and-certifications.md`](training-and-certifications.md) directly on GitHub or locally and push to `main`.
2. The GitHub Actions workflow (`.github/workflows/sync-certifications.yml`) will automatically run the sync script in the cloud and commit the updated `portfolio.html` for you.

### Option B: Local Sync (If Node.js is installed)
1. Edit [`training-and-certifications.md`](training-and-certifications.md).
2. Run from the repository root:
```bash
npm run sync
# or directly:
node scripts/sync-training-certifications.js
```
3. Commit both `training-and-certifications.md` and `portfolio.html`.

## Local Preview

Open `index.html` or `portfolio.html` directly in any web browser, or run a local server:

```bash
npx -y serve .
```
