"use client";

import { usePortfolioStore } from "@/lib/store";
import { Activity, Cpu, Network, ShieldAlert, Zap } from "lucide-react";
import { useState } from "react";
import { BloombergButton } from "../core/bloomberg-button";
import { bloombergColors } from "../lib/theme-config";

type OnboardingViewProps = {
  isDarkMode: boolean;
};

export function OnboardingView({ isDarkMode }: OnboardingViewProps) {
  const { initializePortfolio, setAIPersonality, aiPersonality } = usePortfolioStore();
  const [step, setStep] = useState<1 | 2>(1);
  const colors = isDarkMode ? bloombergColors.dark : bloombergColors.light;

  const handleClaim = () => {
    setStep(2);
  };

  const handleStart = () => {
    if (aiPersonality) {
      initializePortfolio();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-8">
      <div className="max-w-2xl w-full bg-[#0A0A0A] border border-[#222] rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <Activity className="h-16 w-16 text-white mb-6" />
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">OBSIDIAN</h1>
          <p className="text-[#888] text-sm uppercase tracking-widest mb-8">
            Virtual Capital. Real Market Data. Autonomous AI Agents.
          </p>

          {step === 1 ? (
            <div className="w-full space-y-6">
              <div className="p-6 bg-[#111] border border-[#333] rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-2">Protocol Initialization</h2>
                <p className="text-[#888] text-sm mb-6">
                  Obsidian is an institutional-grade investment simulation. You will be provisioned
                  with 10,000 uSDCR (Virtual USD) to deploy into live cryptocurrency markets
                  alongside an autonomous AI agent running on the Ritual network.
                </p>
                <div className="flex justify-center">
                  <BloombergButton
                    color="green"
                    className="px-8 py-3 text-sm font-bold tracking-widest"
                    onClick={handleClaim}
                  >
                    CLAIM 10,000 uSDCR
                  </BloombergButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold text-white mb-2">Select Autonomous Agent</h2>
              <p className="text-[#888] text-sm mb-6">
                Your portfolio will be co-managed by an AI agent operating via Ritual precompiles.
                Select a personality profile for your agent.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  className={`p-4 rounded-lg border text-left transition-all ${
                    aiPersonality === "conservative"
                      ? "bg-blue-900/20 border-blue-500"
                      : "bg-[#111] border-[#333] hover:border-[#555]"
                  }`}
                  onClick={() => setAIPersonality("conservative")}
                >
                  <ShieldAlert
                    className={`h-6 w-6 mb-3 ${aiPersonality === "conservative" ? "text-blue-400" : "text-[#666]"}`}
                  />
                  <h3 className="text-white font-semibold mb-1">Radiant (Conservative)</h3>
                  <p className="text-[#888] text-xs">
                    Prioritizes capital preservation, focuses on Blue Chips, and avoids
                    high-volatility meme assets.
                  </p>
                </button>

                <button
                  className={`p-4 rounded-lg border text-left transition-all ${
                    aiPersonality === "aggressive"
                      ? "bg-emerald-900/20 border-emerald-500"
                      : "bg-[#111] border-[#333] hover:border-[#555]"
                  }`}
                  onClick={() => setAIPersonality("aggressive")}
                >
                  <Cpu
                    className={`h-6 w-6 mb-3 ${aiPersonality === "aggressive" ? "text-emerald-400" : "text-[#666]"}`}
                  />
                  <h3 className="text-white font-semibold mb-1">Ritualist (Aggressive)</h3>
                  <p className="text-[#888] text-xs">
                    Momentum-driven AI that actively trades narrative sectors (AI, DePIN) for
                    maximum alpha.
                  </p>
                </button>

                <button
                  className={`p-4 rounded-lg border text-left transition-all ${
                    aiPersonality === "degen"
                      ? "bg-amber-900/20 border-amber-500"
                      : "bg-[#111] border-[#333] hover:border-[#555]"
                  }`}
                  onClick={() => setAIPersonality("degen")}
                >
                  <Zap
                    className={`h-6 w-6 mb-3 ${aiPersonality === "degen" ? "text-amber-400" : "text-[#666]"}`}
                  />
                  <h3 className="text-white font-semibold mb-1">Ritty (Degen)</h3>
                  <p className="text-[#888] text-xs">
                    High-risk algorithm focused exclusively on meme coins, extreme volatility, and
                    social sentiment.
                  </p>
                </button>
              </div>

              <div className="flex justify-center mt-8">
                <BloombergButton
                  color="accent"
                  className={`px-8 py-3 text-sm font-bold tracking-widest ${!aiPersonality ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleStart}
                  disabled={!aiPersonality}
                >
                  INITIALIZE SYSTEM
                </BloombergButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
