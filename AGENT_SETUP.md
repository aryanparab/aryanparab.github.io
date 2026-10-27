# Rotom Dex — Groq only

Rotom specializes in Aryan Parab’s work, projects, skills, education, leadership, and interests. It has 61 searchable passages covering the supplied resumes and profile notes.

## No Ollama setup

Run `npm run dev` and open the printed local URL. The development server sends profile questions to the already-deployed Rotom endpoint. It does not start or call Ollama. Local and hosted visitors share one Groq connection. No local API key or `.env.local` is needed when the hosting secret is valid.

Current shared endpoint: https://aryan-parab-pokedex.kindbow12.chatgpt.site/api/profile

## One remaining owner action

Groq rejected the previously supplied key with HTTP 401 (`invalid_api_key`), and it was removed from hosting. A valid replacement **GROQ_API_KEY** must be added as a **secret** to the existing Site’s runtime environment, then the saved Site version must be redeployed to apply it. This is a one-time server-side credential, not a setup step for portfolio visitors or local development. Never put it in a `VITE_` variable, React source, or a chat message.

The hosted runtime already selects Groq with `GROQ_MODEL=openai/gpt-oss-20b` and low reasoning effort. There is no automatic local-model fallback. A model cannot authenticate without a working provider key; the application does not fabricate generated answers when that connection is missing.

## Conversation and retrieval behavior

- Greetings, introductions, help, thanks, and farewells use instant conversational responses without retrieval or model calls. They never append Aryan’s education or GPA.
- Profile questions use the actual conversation messages and four focused evidence passages.
- Follow-up retrieval carries the previous topic only when the question refers back to it. A new topic does not inherit an unrelated earlier question.
- The normal path is one Groq completion. If evidence is insufficient, the model can call `search_profile` or `read_profile`, followed by one final completion (at most two total).
- Tool outputs use standard assistant/tool messages. The full document index is no longer sent on every turn.
- Answers include profile source links. Rotom keeps a friendly personal-Dex voice and answers the current question directly.

The published Site is public and retains the existing per-IP question limit. Questions and retrieved profile passages are sent to Groq for generated answers. No chat history is stored on the server.

## Optional: run a separate direct Groq backend

For a standalone copy of the API, set `GROQ_API_KEY` in the server environment (or ignored `.env.local`) and run `npm run agent`. The default model is `openai/gpt-oss-20b`. This is optional; the portfolio development server already proxies to the hosted service when no local key exists.

Groq function calling documentation: https://console.groq.com/docs/tool-use/local-tool-calling
