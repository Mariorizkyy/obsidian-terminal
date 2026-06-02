"use client";

import { usePortfolioStore } from "@/lib/store";
import { ArrowLeft, Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BloombergButton } from "../core/bloomberg-button";

interface AiChatViewProps {
  isDarkMode: boolean;
  onBack: () => void;
}

export default function AiChatView({ isDarkMode, onBack }: AiChatViewProps) {
  const { aiPersonality } = usePortfolioStore();
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    {
      role: "ai",
      content: `OBSIDIAN Agent (${aiPersonality || "System"}) Initialized. Awaiting market queries...`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response based on personality and Ritual precompile latency
    setTimeout(() => {
      let aiResponse = "";
      if (aiPersonality === "conservative") {
        aiResponse =
          "[Radiant-AI] Based on risk-adjusted models, maintaining current Blue Chip allocation is recommended in this macro environment.";
      } else if (aiPersonality === "aggressive") {
        aiResponse =
          "[Ritualist-AI] Momentum detected in AI sector. Recommending a 5% shift from Blue Chips to AI Assets to capture immediate alpha.";
      } else if (aiPersonality === "degen") {
        aiResponse = "[Ritty-AI] LFG! Social sentiment spiking on new memes. APE IN immediately!";
      } else {
        aiResponse = "[System] Market analysis complete. No action recommended.";
      }

      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[85vh] bg-[#050505]">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[#222] p-4 bg-[#0A0A0A]">
        <BloombergButton
          color="default"
          onClick={onBack}
          className="bg-[#111] border-[#333] hover:text-white px-3 py-1.5 rounded"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> BACK
        </BloombergButton>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-emerald-500" />
          <h2 className="text-white font-semibold uppercase tracking-wider text-sm">
            OBSIDIAN AI Agent terminal
          </h2>
        </div>
        <div className="ml-auto px-2 py-1 bg-emerald-950/30 text-emerald-500 text-xs font-bold rounded border border-emerald-900/50 uppercase">
          {aiPersonality} Mode
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-xl p-4 flex gap-3 ${
                msg.role === "user"
                  ? "bg-blue-950/30 border border-blue-900/50 text-blue-100"
                  : "bg-[#111] border border-[#333] text-emerald-100"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              ) : (
                <Bot className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <div className="text-sm leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#111] border border-[#333] rounded-xl p-4 flex gap-3 text-emerald-500">
              <Bot className="h-5 w-5 shrink-0" />
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                <div
                  className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-[#222] bg-[#0A0A0A]">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Query market data or request trade analysis..."
            className="flex-1 bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <BloombergButton
            color="accent"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6 rounded-lg bg-emerald-950/50 text-emerald-500 border border-emerald-900 hover:bg-emerald-900/50 flex items-center gap-2 font-bold"
          >
            SEND <Send className="h-4 w-4" />
          </BloombergButton>
        </div>
      </div>
    </div>
  );
}
