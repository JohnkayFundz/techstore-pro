import { useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/ai-assistant.css";

const quickPrompts = [
  "Best laptop for coding",
  "Gaming setup on a budget",
  "Good headphones for music",
];

function AIShoppingAssistant() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I can help you find the right TechStore Pro products. Tell me what you need, your budget, or how you plan to use it.",
    },
  ]);

  const sendMessage = async (preset = null) => {
    const text = String(preset ?? input).trim();

    if (!text || loading) return;

    setMessages((current) => [
      ...current,
      { role: "user", text },
    ]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/products/ai/assistant", {
        message: text,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            data?.message ||
            "Here are a few products that may fit your needs.",
          recommendations: Array.isArray(data?.recommendations)
            ? data.recommendations
            : [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error?.response?.data?.message ||
            "I couldn't reach the shopping assistant right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        type="button"
        className={`ai-assistant-launcher ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close shopping assistant" : "Open AI shopping assistant"}
        title="AI Shopping Assistant"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {open && (
        <section
          className="ai-assistant-panel"
          aria-label="AI Shopping Assistant"
        >
          <header className="ai-assistant-header">
            <div className="ai-assistant-title">
              <span className="ai-assistant-icon">
                <Sparkles size={17} />
              </span>
              <div>
                <strong>Shopping Assistant</strong>
                <span>Powered by AI</span>
              </div>
            </div>

            <button
              type="button"
              className="ai-assistant-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </header>

          <div className="ai-assistant-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`ai-assistant-message ${message.role}`}
              >
                <p>{message.text}</p>

                {message.recommendations?.length > 0 && (
                  <div className="ai-recommendations">
                    {message.recommendations.map((product) => (
                      <article
                        className="ai-recommendation"
                        key={product.productId}
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="ai-recommendation-placeholder">
                            <Sparkles size={18} />
                          </div>
                        )}

                        <div className="ai-recommendation-body">
                          <strong>{product.name}</strong>
                          <span className="ai-recommendation-price">
                            {`${product.currency || "USD"} ${Number(product.price || 0).toLocaleString()}`}
                          </span>
                          <small>{product.reason}</small>
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(false);
                              navigate(`/products/${product.productId}`);
                            }}
                          >
                            View product <span aria-hidden="true">→</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="ai-assistant-message assistant">
                <div className="ai-typing" aria-label="Assistant is thinking">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="ai-quick-prompts">
              {quickPrompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="ai-assistant-input-wrap">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What are you looking for?"
              rows={1}
              maxLength={1200}
              disabled={loading}
              aria-label="Shopping assistant message"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </section>
      )}
    </>
  );
}

export default AIShoppingAssistant;
