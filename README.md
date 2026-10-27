# Aryan Parab · Portfolio

React/Vite portfolio with Pokémon companions, project overviews and expandable notes, experience, an interest digest, and Rotom conversational RAG.

## Hosting

Frontend: https://aryanparab.github.io/
Source: https://github.com/aryanparab/aryanparab.github.io

GitHub Actions builds and deploys to GitHub Pages on pushes to main. The daily workflow refreshes the publisher-feed digest. Repository variables `VITE_RAG_API_URL` and `VITE_ANALYTICS_API_URL` contain public backend endpoint URLs only.

The AI and analytics backend remains on Sites while the frontend is served by GitHub. Its exact allowed cross-origin client is `https://aryanparab.github.io`. The private analytics dashboard remains at https://aryan-parab-pokedex.kindbow12.chatgpt.site/analytics and requires the owner's ChatGPT sign-in. The ignored `.sites/portfolio` checkout holds its publishing configuration and D1 migrations. GitHub Pages cannot execute the backend or store runtime secrets.

## Local development

Run `npm ci` then `npm run dev`. Paste a valid Groq key into ignored `.env.local`:

```env
GROQ_API_KEY=your_new_key
GROQ_MODEL=openai/gpt-oss-20b
```

Restart the dev server after changes. This key is local only; public AI answers require the key in the backend's server-side runtime secrets too. Never use a `VITE_` prefix for an API key or place it in a GitHub Actions build variable.

Groq is the only model provider. Social greetings and identity replies are instant; profile answers retrieve relevant notes and support one additional agent tool round. A valid hosted Groq credential is still needed.

Run `npm test`, `python3 -m unittest discover -s tests -p 'test_*.py'`, and `npm run build` to verify changes. See `GITHUB_SETUP.md`, `AGENT_SETUP.md`, and `ANALYTICS.md` for details.
