# Yap website

The static marketing site at [yap-speech.vercel.app](https://yap-speech.vercel.app). It has no build step: plain HTML, CSS and JavaScript.

| Path           | Purpose                                         |
| -------------- | ----------------------------------------------- |
| `index.html`   | The page                                        |
| `styles.css`   | Styles                                          |
| `main.js`      | Page interactions                               |
| `scene.js`     | Hero scene                                      |
| `downloads.js` | In-page download picker (reads GitHub releases) |
| `assets/`      | Logos, favicon and social image                 |

## Run locally

```bash
npx serve website
```

## Deploy

The site deploys to Vercel from this folder. Local Vercel settings (`.vercel/`, `.env*`) are git-ignored.
