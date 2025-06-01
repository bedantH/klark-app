import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { loadOllamaConfig } from "./utils";
import { invoke } from "@tauri-apps/api/core";

const SettingsPage = () => {
  const [ollamaUrl, setOllamaUrl] = useState<string>("");
  const [model, setModel] = useState<string>("");

  const [modelOptions, setModelOptions] = useState<string[]>([]);

  const setOllamaConfig = async () => {
    const config = await loadOllamaConfig();

    setOllamaUrl(config.url);
    setModel(config.model);
  };

  const handleFetchModels = async () => {
    try {
      const response = await fetch(`${ollamaUrl}:11434/v1/models`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      const options = data.data.map((model: { id: string }) => model.id);

      setModelOptions(options);
    } catch (error) {
      console.error("Error fetching models:", error);
      alert("Failed to fetch models. Please check the OLLAMA URL.");
    }
  };

  useEffect(() => {
    if (ollamaUrl) {
      handleFetchModels();
    }
  }, [ollamaUrl]);

  useEffect(() => {
    setOllamaConfig();
  }, []);

  const handleSave = async () => {
    if (!ollamaUrl || !model) {
      alert("Please enter both OLLAMA URL and select a model.");
      return;
    }

    try {
      await invoke("set_environment_variable", {
        key: "OLLAMA_URL",
        value: ollamaUrl,
      });

      await invoke("set_environment_variable", {
        key: "OLLAMA_MODEL",
        value: model,
      });

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <main className="p-5 bg-white">
      <div className="flex gap-2 items-center">
        <img src="/klark.png" alt="logo" className="size-8" />
        <h1 className="font-bold">Settings</h1>
      </div>

      <div className="flex flex-col gap-4 mt-5">
        <div>
          <input
            value={ollamaUrl}
            onChange={(e) => setOllamaUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFetchModels();
              }
            }}
            type="text"
            placeholder="Enter OLLAMA URL:"
            className="px-3 py-3 text-sm w-full rounded-lg outline outline-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1 italic">
            Example: http://localhost, Don't include the port number.
            <p className="font-medium">Press "Enter" to fetch models.</p>
          </p>
        </div>
        <div className="flex items-center gap-2 relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="px-3 py-3 w-full text-sm bg-white rounded-lg outline outline-gray-300 focus:outline-none focus:ring focus:ring-blue-500 appearance-none"
          >
            <option value="" disabled selected>
              Select a model
            </option>
            {modelOptions.map((modelOption) => (
              <option key={modelOption} value={modelOption}>
                {modelOption}
              </option>
            ))}
          </select>

          <ChevronDown size={20} className="absolute right-3" />
        </div>

        <button
          onClick={handleSave}
          className="bg-black/80 text-white p-3 rounded-lg cursor-pointer hover:bg-black transition-colors duration-200"
        >
          Save
        </button>
      </div>
    </main>
  );
};

export default SettingsPage;
