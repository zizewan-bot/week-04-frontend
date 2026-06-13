"use client";

import { FormEvent, useState } from "react";
import {
  AgentStep,
  AIMessage,
  chatWithAI,
  getBookRecommendations,
  runBookAgent,
} from "@/lib/api";

type ChatMode = "chat" | "recommend" | "agent";
type ChatMessage = AIMessage & {
  agentSteps?: AgentStep[];
};

const modes: { value: ChatMode; label: string }[] = [
  { value: "chat", label: "General Chat" },
  { value: "recommend", label: "Book Recommendations" },
  { value: "agent", label: "Agent" },
];

const starterText = {
  chat: "Ask about a book, author, genre, or reading habit.",
  recommend: "Based on my current reading history, what should I read next?",
  agent:
    "Try a multi-step task, like updating a book and then checking your reading list.",
};

export default function ChatPage() {
  const [mode, setMode] = useState<ChatMode>("chat");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleModeChange(nextMode: ChatMode) {
    setMode(nextMode);
    setMessage("");
    setHistory([]);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) {
      return;
    }

    const nextHistory: ChatMessage[] = [
      ...history,
      { role: "user", content: trimmedMessage },
    ];

    setHistory(nextHistory);
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      if (mode === "agent") {
        const response = await runBookAgent(trimmedMessage);
        setHistory([
          ...nextHistory,
          {
            role: "assistant",
            content: response.response,
            agentSteps: response.agent_steps,
          },
        ]);
      } else {
        const response =
          mode === "chat"
            ? await chatWithAI(trimmedMessage, history)
            : await getBookRecommendations(trimmedMessage, history);

        setHistory(response.updated_history);
      }
    } catch (chatError) {
      setHistory(nextHistory);
      setError(
        chatError instanceof Error
          ? chatError.message
          : "The AI assistant could not respond.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-5xl flex-col px-6 py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-4xl font-bold text-stone-950">
            Book Assistant
          </h1>
          <p className="mt-2 text-stone-700">
            Chat with Claude or ask for recommendations from your saved books.
          </p>
        </div>

        <div className="flex w-full rounded-md border border-stone-300 bg-white p-1 sm:w-fit">
          {modes.map((modeOption) => (
            <button
              key={modeOption.value}
              type="button"
              onClick={() => handleModeChange(modeOption.value)}
              className={`flex-1 rounded px-4 py-2 text-sm font-semibold transition sm:flex-none ${
                mode === modeOption.value
                  ? "bg-emerald-700 text-white"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {modeOption.label}
            </button>
          ))}
        </div>
      </div>

      <section className="flex min-h-[520px] flex-1 flex-col rounded-md border border-stone-200 bg-white shadow-sm">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {history.length === 0 ? (
            <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-5 text-stone-700">
              {starterText[mode]}
            </div>
          ) : null}

          {history.map((historyMessage, index) => (
            <div
              key={`${historyMessage.role}-${index}`}
              className={`flex ${
                historyMessage.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[82%] whitespace-pre-wrap rounded-md px-4 py-3 leading-7 ${
                  historyMessage.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-stone-100 text-stone-800"
                }`}
              >
                {historyMessage.content}
              </div>
            </div>
          ))}

          {history.map((historyMessage, index) =>
            historyMessage.role === "assistant" && historyMessage.agentSteps ? (
              <div key={`steps-${index}`} className="flex justify-start">
                <div className="w-full max-w-[82%] rounded-md border border-stone-200 bg-stone-50 p-3">
                  <details>
                    <summary className="cursor-pointer text-sm font-semibold text-stone-800">
                      Agent steps ({historyMessage.agentSteps.length})
                    </summary>
                    <div className="mt-3 space-y-3">
                      {historyMessage.agentSteps.map((step, stepIndex) => (
                        <details
                          key={`${step.tool}-${stepIndex}`}
                          className="rounded-md border border-stone-200 bg-white p-3"
                        >
                          <summary className="cursor-pointer text-sm font-semibold text-stone-800">
                            Step {stepIndex + 1}: {step.tool}
                          </summary>
                          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded bg-stone-100 p-3 text-xs leading-6 text-stone-800">
                            {JSON.stringify(
                              {
                                input: step.input,
                                result: step.result,
                              },
                              null,
                              2,
                            )}
                          </pre>
                        </details>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            ) : null,
          )}

          {isLoading ? (
            <div className="flex justify-start">
              <div className="rounded-md bg-stone-100 px-4 py-3 text-stone-700">
                Thinking...
              </div>
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="mx-4 mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-6">
            {error}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border-t border-stone-200 p-4 sm:flex-row sm:p-6"
        >
          <label className="sr-only" htmlFor="chat-message">
            Message
          </label>
          <textarea
            id="chat-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={starterText[mode]}
            rows={2}
            className="min-h-20 flex-1 resize-none rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            Send
          </button>
        </form>
      </section>
    </main>
  );
}
