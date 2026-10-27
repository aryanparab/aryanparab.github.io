# GitHub hosting and your own domain

The React source is ready for GitHub Pages, with `.github/workflows/deploy.yml` building and deploying it. No GitHub remote/account access is configured in this workspace yet.

1. Create a public repository named `aryanparab.github.io` under your GitHub account and push this repository's source (never `.env.local`).
2. Repository → Settings → Pages → Source → GitHub Actions.
3. The free user-site address will be `https://aryanparab.github.io/` after the workflow succeeds.
4. If you own a domain, add it under Settings → Pages → Custom domain, then configure the registrar DNS using GitHub's instructions. Confirm whether you mean `aryan-portofolio.com` or `aryan-portfolio.com` before registering or changing DNS.

GitHub Pages is static hosting. Rotom needs a separate server to keep the Groq key secret, and analytics needs a collector/database and owner authorization. The current Sites endpoints are same-origin and cannot simply be copied as cross-origin URLs. Migration is not complete until those backend services are deployed and connected on another provider, such as Cloudflare Workers + D1. The current Sites analytics sign-in also needs replacing when moving off Sites.

## Paste the Groq key locally

Open `.env.local` in this folder and paste a new valid key after `GROQ_API_KEY=`. Save and restart `npm run dev`.

```
GROQ_API_KEY=your_new_key
GROQ_MODEL=openai/gpt-oss-20b
```

This configures local development only. For a public backend the same key belongs in that provider's server-side secret settings. A GitHub Actions secret alone does not create a runtime backend, and `VITE_GROQ_API_KEY` would expose the key in the browser.

GitHub documentation: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
