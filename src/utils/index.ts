import { invoke } from "@tauri-apps/api/core";

export async function loadOllamaConfig() {
  const [url, model] = (await invoke("get_ollama_config")) as any;

  console.log("OLLAMA_URL:", url);
  console.log("OLLAMA_MODEL:", model);

  return {
    url,
    model,
  };
}
