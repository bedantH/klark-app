import { loadOllamaConfig } from "../utils";

export const sendPrompt = async (
  text: string,
  onToken: (chunk: string) => void,
): Promise<void> => {
  const { url, model } = await loadOllamaConfig();

  const response = await fetch(`${url}:11434/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt: text,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    if (response.status === 404) {
      throw new Error(`Model not found: ${model}`);
    } else {
      throw new Error(`Request failed: ${response.status}`);
    }
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // keep last incomplete line for next read

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const parsed = JSON.parse(line);
        if (parsed.response) {
          onToken(parsed.response);
        }
      } catch {
        // ignore bad JSON
      }
    }
  }
};
