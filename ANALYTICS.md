# Portfolio analytics

Live private dashboard: https://aryan-parab-pokedex.kindbow12.chatgpt.site/analytics

Sign in with the ChatGPT account that owns the Site. `ANALYTICS_OWNER_EMAIL` is a server-side secret used to authorize both the dashboard and its data API. The portfolio remains public.

Tracks page views, public section views, note expansions, outgoing-link and email clicks, Rotom question/answer/error counts, and average load time/LCP/CLS. Never sends chat messages or form contents. No cookies or visitor IDs; repeat visits count as additional page views. Browser Do Not Track and obvious bots are excluded. Local development does not record events.

Storage: Sites-managed D1 `DB`, daily aggregates, rolling 90-day retention. SQL migration is in the hosting checkout's drizzle directory. Reports offer 7/30/90-day windows and use UTC dates. Client counts can be blocked or inflated and are directional analytics, not billing or audit records.

Hosted implementation lives in `.sites/portfolio`; `src/analytics.js` is shared with the GitHub-ready source. GitHub Pages alone cannot serve the collector or private dashboard; retain a backend when moving hosting.
