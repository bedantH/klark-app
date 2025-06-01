import { Check, Copy, Loader2, X } from "lucide-react";
import Input from "../components/form/Input";
import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { sendPrompt } from "../services/ollama";
import { listen } from "@tauri-apps/api/event";
import ReactMarkdown from "react-markdown";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

const MainLayout = () => {
  const [height, setHeight] = useState<number>(250);
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [response, setResponse] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const handleResize = () => {
    if (ref.current && ref.current.clientHeight !== height) {
      setHeight(ref.current.clientHeight);
      invoke("resize_window", {
        height: ref.current.clientHeight + 24,
        width: 350,
      });
    }
  };

  useEffect(() => {
    const unlisten = listen("app-reset", () => {
      console.log("Reset event received");

      setResponse("");
      setValue("");
      setLoading(false);
      handleResize();

      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [height]);

  const handlePromptSubmit = async (value: string) => {
    setLoading(true);
    setResponse("");

    try {
      await sendPrompt(value, (chunk) => {
        setResponse((prev) => prev + chunk);
        handleResize();

        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    } catch (err) {
      console.error(err);
      setResponse((err as Error).toString());
    } finally {
      setLoading(false);
      handleResize();
      setValue("");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-start my-3">
      <div ref={ref} className="w-[90vw] mx-auto">
        <div className="flex relative items-center">
          <Input
            placeholder="Ask anything"
            value={value}
            onChange={(val: string) => {
              setValue(val);
            }}
            handleKeyDown={(value: string) => {
              handlePromptSubmit(value);
            }}
          />
          {/* <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-gray-100 p-2 cursor-pointer"
            onClick={() => {}}
          >
            <Mic size={18} />
          </button> */}
        </div>

        {loading && (
          <div className="flex gap-2 mt-3 bg-gray-100 w-fit px-3 py-1 rounded-full">
            <Loader2 size={18} className="animate-spin text-gray-400" />
            <p className="text-sm text-gray-500">Thinking...</p>
          </div>
        )}

        {response && (
          <>
            <div
              ref={scrollRef}
              className={`border-none rounded-xl p-3 mt-4 text-sm bg-white h-fit max-h-[500px] overflow-y-auto no-scroll`}
            >
              <div
                className="flex flex-col max-w-[300px] gap-2 text-gray-800 whitespace-pre-line leading-relaxed prose prose-sm
              prose-p:my-0 prose-p:leading-relaxed
              prose-ul:my-0 prose-ul:leading-relaxed prose-ul:pl-4
              prose-ol:my-0 prose-ol:leading-relaxed prose-ol:pl-4
              prose-li:my-0 prose-li:py-0 prose-li:leading-relaxed prose-li:ml-0
              prose-pre:my-0 prose-pre:py-0 prose-pre:leading-relaxed
              prose-blockquote:my-0 prose-blockquote:py-0 prose-blockquote:leading-relaxed
              prose-h1:my-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-h5:my-0 prose-h6:my-0
              prose-headings:mt-0 prose-headings:mb-0 prose-p:mt-0 prose-a:text-blue-600"
              >
                <ReactMarkdown
                  components={{
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 space-y-1">{children}</ul>
                    ),
                    li: ({ children }) => <li>{children}</li>,
                    p: ({ children }) => <p className="my-0">{children}</p>,
                  }}
                >
                  {/* remove <think></think> from the repsonse */}
                  {response
                    .replace(/<think>/g, "")
                    .replace(/<\/think>/g, "")
                    .replace(/<think\/>/g, "")
                    .replace(/<br\s*\/?>/g, "\n")}
                </ReactMarkdown>
              </div>
            </div>
            {!loading && (
              <div className="flex justify-end mt-2 gap-2">
                <button
                  className="bg-white p-2 rounded-md cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setResponse("");
                    handleResize();
                    setValue("");
                  }}
                >
                  <X size={13} />
                </button>
                <button
                  className={`p-2 rounded-md cursor-pointer ${
                    copied
                      ? "bg-green-700 text-white"
                      : "hover:bg-gray-100 text-black bg-white"
                  }`}
                  onClick={async () => {
                    console.log("Copy button clicked");
                    await writeText(response);
                    setCopied(true);

                    setTimeout(() => {
                      setCopied(false);
                    }, 1000);
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
