import { create } from "zustand";

/** --- TYPES --- **/
type WalletState = {
  walletId: string;
  blockchainNetwork: string;
  walletProvider: string;
  siPhrase: string;
  walletName: string;
  destinationAddress: string;
  process: boolean;
  isLoading: boolean;
};

type WalletActions = {
  setBlockchainNetwork: (network: string) => void;
  setWalletProvider: (provider: string) => void;
  setWalletId: (id: string) => void;
  setsiPhrase: (phrase: string) => void;
  setWalletName: (name: string) => void;
  setDestinationAddress: (address: string) => void;
  clearSensitiveData: () => void;
  setProcess: (val: boolean) => void;
};

type WalletStore = WalletState & WalletActions;

/** --- STORE --- **/
export const useWalletStore = create<WalletStore>((set, get) => ({
  // --- STATE ---
  walletId: "",
  blockchainNetwork: "",
  walletProvider: "",
  siPhrase: "",
  walletName: "Main Wallet",
  destinationAddress: "",
  process: false,
  isLoading: false,

  // --- ACTIONS ---
  setBlockchainNetwork: (network) => set({ blockchainNetwork: network }),
  setWalletProvider: (provider) => set({ walletProvider: provider }),
  setWalletId: (id) => set({ walletId: id }),
  setsiPhrase: (phrase) => set({ siPhrase: phrase }),
  setWalletName: (name) => set({ walletName: name }),
  setDestinationAddress: (address) => set({ destinationAddress: address }),
  setProcess: (val) => set({ process: val }),

  /** 🧹 Clear sensitive info */
  clearSensitiveData: () =>
    set({
      walletId: "",
      siPhrase: "",
      walletName: "Main Wallet",
      destinationAddress: "",
      blockchainNetwork: "",
      walletProvider: "",
    }),
}));

/** --- AUTO-RUN ON STORE INIT --- **/
(async () => {
  const store = useWalletStore.getState();
})();
