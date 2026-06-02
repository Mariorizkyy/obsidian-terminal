"use client";

import { usePortfolioStore } from "@/lib/store";
import { ArrowDownRight, ArrowUpRight, Bot, PieChart, Wallet } from "lucide-react";
import { useMarketDataQuery } from "../hooks";

export function PortfolioPanel() {
  const { uSDCR, assets, aiPersonality } = usePortfolioStore();
  const { marketData } = useMarketDataQuery();

  // Calculate total portfolio value
  let totalAssetValue = 0;

  if (marketData) {
    const allMarketItems = [
      ...(marketData.blueChips || []),
      ...(marketData.aiAssets || []),
      ...(marketData.memes || []),
    ];

    assets.forEach((asset) => {
      const currentMarketItem = allMarketItems.find((item) => item.id === asset.symbol);
      const currentPrice = currentMarketItem ? currentMarketItem.value : asset.avgPrice;
      totalAssetValue += asset.amount * currentPrice;
    });
  } else {
    // Fallback to avg price if market data isn't loaded
    totalAssetValue = assets.reduce((sum, asset) => sum + asset.amount * asset.avgPrice, 0);
  }

  const totalValue = uSDCR + totalAssetValue;
  const initialValue = 100000;
  const pnl = totalValue - initialValue;
  const pnlPercent = (pnl / initialValue) * 100;

  return (
    <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#222] shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-semibold flex items-center gap-2 text-[#888] uppercase tracking-wider">
          <Wallet className="h-4 w-4" />
          Portfolio Overview
        </h3>
        {aiPersonality && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#111] border border-[#333]">
            <Bot className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] text-white font-medium capitalize">
              {aiPersonality} AI
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] text-[#666] uppercase font-semibold mb-1">Total Value</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span
              className={`flex items-center text-xs font-medium ${pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}
            >
              {pnl >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {Math.abs(pnlPercent).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#111] border border-[#333] rounded-lg">
            <p className="text-[10px] text-[#888] font-medium mb-1 tracking-wider uppercase">
              Liquid uSDCR
            </p>
            <p className="text-sm text-white font-semibold">
              $
              {uSDCR.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="p-3 bg-[#111] border border-[#333] rounded-lg">
            <p className="text-[10px] text-[#888] font-medium mb-1 tracking-wider uppercase">
              Asset Value
            </p>
            <p className="text-sm text-white font-semibold flex items-center gap-1.5">
              <PieChart className="h-3 w-3 text-blue-500" />$
              {totalAssetValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
