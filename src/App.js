import logo from './logo.svg';
import './App.css';
import { CandyMachine } from './component/candy_machine';
import { CandyMachineP } from './component/candy_machine phantom';
import { useMemo, useState } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { MetaplexProvider } from './provider/metaplex/MetaplexProvider';

function App() {
    const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
        ],
        [network]
    );

    const handleChange = (event) => {
        switch (event.target.value) {
            case "devnet":
                setNetwork(WalletAdapterNetwork.Devnet);
                break;
            case "mainnet":
                setNetwork(WalletAdapterNetwork.Mainnet);
                break;
            case "testnet":
                setNetwork(WalletAdapterNetwork.Testnet);
                break;
            default:
                setNetwork(WalletAdapterNetwork.Devnet);
                break;
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="container">
                    <ConnectionProvider endpoint={endpoint}>
                        <WalletProvider wallets={wallets} autoConnect>
                            <WalletModalProvider>
                                <MetaplexProvider>
                                    <CandyMachine />
                                    <CandyMachineP />
                                </MetaplexProvider>
                            </WalletModalProvider>
                        </WalletProvider>
                    </ConnectionProvider>
                </div>
            </header>
        </div>
    );
}

export default App;
