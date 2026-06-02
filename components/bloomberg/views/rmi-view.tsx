"use client";

import { usePortfolioStore } from "@/lib/store";
import { ArrowLeft, History } from "lucide-react";
import { BloombergButton } from "../core/bloomberg-button";

interface HistoryViewProps {
  onBack: () => void;
  isDarkMode: boolean;
}

export function RmiView({ onBack, isDarkMode }: HistoryViewProps) {
  const { assets } = usePortfolioStore();

  return (
    <div className="flex flex-col h-[85vh] bg-[#050505] font-mono">
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
          <History className="h-5 w-5 text-white" />
          <h2 className="text-white font-semibold uppercase tracking-wider text-sm">
            Decision History & Portfolio State
          </h2>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-[#0A0A0A] border border-[#222] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] bg-[#111]">
                <th className="p-4 text-xs font-semibold text-[#888] tracking-wider uppercase">
                  Date / Time
                </th>
                <th className="p-4 text-xs font-semibold text-[#888] tracking-wider uppercase">
                  Action Type
                </th>
                <th className="p-4 text-xs font-semibold text-[#888] tracking-wider uppercase">
                  Actor
                </th>
                <th className="p-4 text-xs font-semibold text-[#888] tracking-wider uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy history rows based on current assets + init */}
              <tr className="border-b border-[#222] hover:bg-[#111]/50 transition-colors">
                <td className="p-4 text-sm text-[#ccc] whitespace-nowrap">
                  {new Date().toLocaleString()}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-900/40 text-blue-400 text-xs rounded border border-blue-900/50">
                    SYSTEM INIT
                  </span>
                </td>
                <td className="p-4 text-sm text-[#ccc]">SYSTEM</td>
                <td className="p-4 text-sm text-[#ccc]">Provisioned 10,000 uSDCR</td>
              </tr>
              {assets.map((asset, i) => (
                <tr key={i} className="border-b border-[#222] hover:bg-[#111]/50 transition-colors">
                  <td className="p-4 text-sm text-[#ccc] whitespace-nowrap">
                    {new Date().toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-900/40 text-emerald-400 text-xs rounded border border-emerald-900/50">
                      TRADE EXECUTED
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[#ccc]">USER</td>
                  <td className="p-4 text-sm text-[#ccc]">
                    Acquired {asset.amount} {asset.symbol} @ ${asset.avgPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#666] text-sm">
                    No trades executed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
