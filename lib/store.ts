import { create } from "zustand";

interface Asset {
  symbol: string;
  amount: number;
  avgPrice: number;
}

interface PortfolioState {
  uSDCR: number; // Virtual USD on Ritual
  assets: Asset[];
  autopilotEnabled: boolean;
  aiPersonality: "conservative" | "aggressive" | "degen" | null;
  isInitialized: boolean;
  setUSDCR: (amount: number) => void;
  initializePortfolio: () => void;
  addAsset: (symbol: string, amount: number, price: number) => void;
  toggleAutopilot: (enabled: boolean) => void;
  setAIPersonality: (personality: "conservative" | "aggressive" | "degen" | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  uSDCR: 100000, // Start with 100k virtual capital
  assets: [],
  autopilotEnabled: false,
  aiPersonality: null,
  isInitialized: false,

  setUSDCR: (amount) => set({ uSDCR: amount }),
  initializePortfolio: () => set({ isInitialized: true }),

  addAsset: (symbol, amount, price) =>
    set((state) => {
      const existing = state.assets.find((a) => a.symbol === symbol);
      if (existing) {
        // Calculate new average price
        const totalValue = existing.amount * existing.avgPrice + amount * price;
        const newAmount = existing.amount + amount;

        return {
          assets: state.assets.map((a) =>
            a.symbol === symbol ? { ...a, amount: newAmount, avgPrice: totalValue / newAmount } : a
          ),
        };
      }
      return { assets: [...state.assets, { symbol, amount, avgPrice: price }] };
    }),

  toggleAutopilot: (enabled) => set({ autopilotEnabled: enabled }),
  setAIPersonality: (personality) => set({ aiPersonality: personality }),
}));
