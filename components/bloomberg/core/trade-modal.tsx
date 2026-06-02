"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePortfolioStore } from "@/lib/store";
import { ArrowRightLeft, DollarSign } from "lucide-react";
import { useState } from "react";
import { BloombergButton } from "./bloomberg-button";

type TradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  asset: { symbol: string; price: number } | null;
  isDarkMode: boolean;
};

export function TradeModal({ isOpen, onClose, asset, isDarkMode }: TradeModalProps) {
  const { uSDCR, assets, addAsset, setUSDCR } = usePortfolioStore();
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");

  if (!asset) return null;

  const currentHolding = assets.find((a) => a.symbol === asset.symbol);
  const holdingAmount = currentHolding ? currentHolding.amount : 0;

  const parsedAmount = Number.parseFloat(amount) || 0;
  const cost = parsedAmount * asset.price;

  const isValidTrade = () => {
    if (parsedAmount <= 0) return false;
    if (tradeType === "buy") {
      return cost <= uSDCR;
    } else {
      return parsedAmount <= holdingAmount;
    }
  };

  const handleTrade = () => {
    if (!isValidTrade()) return;

    if (tradeType === "buy") {
      setUSDCR(uSDCR - cost);
      addAsset(asset.symbol, parsedAmount, asset.price);
    } else {
      setUSDCR(uSDCR + cost);
      addAsset(asset.symbol, -parsedAmount, asset.price); // negative amount for selling
    }
    onClose();
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[425px] ${isDarkMode ? "bg-[#0a0a0a] border-[#222]" : "bg-white border-gray-200"}`}
      >
        <DialogHeader>
          <DialogTitle
            className={`flex items-center gap-2 ${isDarkMode ? "text-white" : "text-black"}`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Trade {asset.symbol}
          </DialogTitle>
          <DialogDescription className={isDarkMode ? "text-[#888]" : "text-gray-500"}>
            Execute manual trade via OBSIDIAN protocol.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex gap-2 p-1 bg-[#111] rounded-lg border border-[#333]">
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded ${tradeType === "buy" ? "bg-emerald-900/40 text-emerald-500" : "text-[#888] hover:text-white"}`}
              onClick={() => setTradeType("buy")}
            >
              BUY
            </button>
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded ${tradeType === "sell" ? "bg-red-900/40 text-red-500" : "text-[#888] hover:text-white"}`}
              onClick={() => setTradeType("sell")}
            >
              SELL
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#111] border border-[#333] rounded-lg">
              <p className="text-[10px] text-[#888] uppercase tracking-wider mb-1">Current Price</p>
              <p className="text-sm text-white font-mono">
                $
                {asset.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="p-3 bg-[#111] border border-[#333] rounded-lg">
              <p className="text-[10px] text-[#888] uppercase tracking-wider mb-1">Your Holding</p>
              <p className="text-sm text-white font-mono">
                {holdingAmount.toLocaleString()} {asset.symbol}
              </p>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#888] uppercase tracking-wider mb-1 block">
              Amount ({asset.symbol})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#111] border border-[#333] rounded-lg p-3 text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex justify-between items-center p-3 bg-[#111] border border-[#333] rounded-lg">
            <span className="text-xs text-[#888] uppercase tracking-wider">Estimated Value</span>
            <span className="text-sm text-white font-mono flex items-center">
              <DollarSign className="h-3 w-3 text-emerald-500 mr-0.5" />
              {cost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-[#888]">
              Available: $
              {uSDCR.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <BloombergButton
              color={tradeType === "buy" ? "green" : "red"}
              className="px-6 py-2 tracking-widest font-bold"
              onClick={handleTrade}
              disabled={!isValidTrade()}
            >
              {tradeType === "buy" ? "EXECUTE BUY" : "EXECUTE SELL"}
            </BloombergButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
