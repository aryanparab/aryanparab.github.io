# Live portfolio

Public URL: https://aryan-parab-pokedex.kindbow12.chatgpt.site

Hosted with Sites. The original React/Vite project remains in this repository root and is still ready for GitHub Pages. No GitHub repository was connected at publication time.

## Hosted source

The publishing checkout is `.sites/portfolio/` (ignored by the root repository). Its `.openai/hosting.json` contains the authoritative Sites project ID. Runtime values belong in Sites environment settings; never add secrets to source files.

The hosted build preserves the React frontend and bundles its assets with an ESM Worker serving `/api/profile`. Build command in the hosting checkout: `npm run build`. The Worker uses the shared profile retrieval agent. Both the local preview and public Site now use the same hosted Groq connection. There is no Ollama fallback.

The mobile layout was checked at 320px, 390px, and 768px, including grid columns, chat form fit, input size, and absence of horizontal overflow.

## AI connection

The supplied Groq credential was rejected by Groq with HTTP 401 (`invalid_api_key`) during verification. It has been removed from hosting. Add a valid replacement `GROQ_API_KEY` as a secret through Sites environment settings, then redeploy the saved version to apply the new environment revision. `RAG_PROVIDER=groq` and `GROQ_MODEL=openai/gpt-oss-20b` are already configured.

The key was never written into source or the frontend bundle. Avoid pasting replacement keys into chats; use the hosting secret field.

## News

The current news edition is the publisher-feed snapshot bundled during publication. The GitHub daily-refresh workflow will operate only after a GitHub repository and Actions are configured. The Sites deployment does not yet run that GitHub schedule.


## Rotom conversation update

Greetings and identity questions are handled instantly without a biography lookup. Profile answers use conversational RAG with one normal model call and at most one additional tool round. Local development proxies to the hosted API so a valid hosting secret enables both surfaces without separate local setup. See AGENT_SETUP.md.
