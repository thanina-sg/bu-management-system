import { useEffect, useRef, useState } from "react";
import { ai, type FaqEntry } from "../lib/api";
import { auth } from "../lib/api";

interface Message {
  role: "user" | "bot";
  text: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  general: "Général",
  emprunts: "Emprunts",
  reservations: "Réservations",
  compte: "Compte",
  catalogue: "Catalogue",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [faqLoaded, setFaqLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load FAQ once when widget is first opened
  useEffect(() => {
    if (open && !faqLoaded) {
      ai.getFaq()
        .then((data) => {
          setFaqs(data);
          setFaqLoaded(true);
        })
        .catch(() => setFaqLoaded(true));

      // Welcome message
      setMessages([
        {
          role: "bot",
          text: "Bonjour ! Je suis l'assistant de la Bibliothèque UHA. Posez-moi une question ou choisissez un sujet ci-dessous.",
        },
      ]);
    }
  }, [open, faqLoaded]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const categories = faqLoaded
    ? ["all", ...Array.from(new Set(faqs.map((f) => f.categorie)))]
    : [];

  const visibleFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((f) => f.categorie === activeCategory);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    const trimmed = question.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setLoading(true);

    try {
      const user = auth.getStoredUser();
      const { answer } = await ai.query(trimmed, user?.id);
      setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Désolé, une erreur est survenue. Veuillez réessayer." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white shadow-card transition-transform hover:scale-105 hover:bg-brand-600 active:scale-95"
      >
        {open ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex w-[360px] max-w-[calc(100vw-2.5rem)] flex-col rounded-xl border border-ink-100 bg-white shadow-card">
          {/* Header */}
          <div className="flex items-center gap-2.5 rounded-t-xl bg-brand-700 px-4 py-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs text-white">
              📚
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Assistant BU</p>
              <p className="text-[10px] text-brand-100">Bibliothèque Universitaire UHA</p>
            </div>
          </div>

          {/* Category tabs */}
          {categories.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto border-b border-ink-100 px-3 py-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-brand-700 text-white"
                      : "bg-surface-100 text-ink-600 hover:bg-surface-200"
                  }`}
                >
                  {cat === "all" ? "Tous" : CATEGORY_LABELS[cat] ?? cat}
                </button>
              ))}
            </div>
          )}

          {/* FAQ quick questions */}
          {visibleFaqs.length > 0 && messages.length <= 1 && (
            <div className="border-b border-ink-100 px-3 py-2">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-500">
                Questions fréquentes
              </p>
              <div className="flex max-h-32 flex-col gap-1 overflow-y-auto">
                {visibleFaqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => send(faq.question)}
                    className="rounded-md px-2.5 py-1.5 text-left text-xs text-ink-700 transition-colors hover:bg-surface-100"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex max-h-64 flex-col gap-3 overflow-y-auto px-4 py-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-brand-700 text-white"
                      : "rounded-bl-sm bg-surface-100 text-ink-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl rounded-bl-sm bg-surface-100 px-3 py-2 text-xs text-ink-500">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>•</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-ink-100 px-3 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question…"
              disabled={loading}
              className="flex-1 rounded-lg border border-ink-100 bg-surface-50 px-3 py-1.5 text-xs text-ink-700 placeholder-ink-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-100 disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              aria-label="Envoyer"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-white transition-colors hover:bg-brand-600 disabled:opacity-40"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
