# Nanoread - AI Webpage Summarizer

A clean, fast web app that summarizes any webpage using AI. Paste a URL, pick your provider, and get the key points in seconds.


Access here: [Nanoread](https://nanoread.vercel.app)

---

## Features

- **Paste any URL** - articles, wikis, news, docs, anything publicly accessible
- **Multi-provider** - works with OpenAI, Groq, Ollama, OpenRouter, LM Studio, Together, and any OpenAI-compatible endpoint
- **Your key, your data** - users supply their own API key, stored only in their browser
- **Light & dark mode** - auto-detects system preference, toggle anytime
- **Summary history** - last 20 summaries saved locally in the browser
- **No backend storage** - nothing is logged or stored server-side

---

## Supported AI Providers

Any provider that supports the OpenAI `/v1/chat/completions` format works out of the box.

| Provider | Base URL | Free tier |
|---|---|---|
| OpenAI | `https://api.openai.com/v1` | No |
| Groq | `https://api.groq.com/openai/v1` | ✅ Yes |
| OpenRouter | `https://openrouter.ai/api/v1` | ✅ Some models |
| Together AI | `https://api.together.xyz/v1` | ✅ Trial credits |
| Ollama (local) | `http://localhost:11434/v1` | ✅ Fully free |
| LM Studio (local) | `http://localhost:1234/v1` | ✅ Fully free |

> **No budget?** Ollama runs entirely on your machine with no API key needed. Groq has a generous free tier.

---

## Built By

**Gopalakrishnan** ([codebygk.com](https://codebygk.vercel.app))

- LinkedIn: [linkedin.com/in/codebygk](https://linkedin.com/in/codebygk)
- GitHub: [github.com/codebygk](https://github.com/codebygk)

---

## License

MIT - free to use and modify.
