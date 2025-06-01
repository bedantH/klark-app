# Klark Chat

**Klark** is a lightweight macOS **menu-bar application** that provides fast, minimal UI access to your **local LLMs** — such as Gemma, DeepSeek, and others. Designed to sit unobtrusively in your menu bar, Klark lets you chat with powerful local models without opening a browser or heavy client.

Currently tested with **[Ollama](https://ollama.com)** for seamless model management.

---

## ✨ Features

-  **Minimal UI, Always Accessible**: One-click access from your menu bar to start chatting with your local LLMs.
-  **Local-first**: No cloud calls. Privacy-first interactions with models running right on your machine.
-  **Multi-LLM Friendly**: Plug-and-play support for different LLMs — tested with Ollama, works with models like Gemma and DeepSeek.
- **Built with Speed in Mind**: Tauri + Rust backend ensures fast performance and low system usage.
- **Customizable Frontend**: Built with React, TypeScript, and Tailwind CSS v4 — easy to tweak and extend.

---

## 🛠️ Stack

- **Frontend**: React, TypeScript, Tailwind v4
- **Backend/System**: Rust, using [Tauri](https://tauri.app/) for native capabilities
- **Platform**: macOS (menu-bar focused)

> Other platforms/frameworks considered: Electron, Swift.  
> Chose Rust/Tauri for its performance, smaller binary size, and familiarity.

---
## 🧩 Roadmap / To-Do

-  **Image Upload** support for multimodal models (e.g. Gemma with vision capability)    
-  **Session Memory**: Persist previous conversations even with stateless models
-  **Standalone App Mode**: A full-window version for deeper sessions, file uploads, longer context, etc.

---
## 🤝 Open to Contributions

Klark is still early, and contributions are welcome!

- Want to add support for a new LLM runtime?
- Got a custom UI idea for specific model quirks?
- Want better session management or keyboard navigation?
- Just want to improve performance or design?

Feel free to open an issue or submit a PR. Let's make it an even better tool for the local AI ecosystem!

---

## 💬 Get Involved

If you're passionate about local AI tools, LLM UIs, or Rust/React development — this is a great space to experiment. Let’s build fast, private, powerful tools together.