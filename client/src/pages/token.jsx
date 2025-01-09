import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
    WalletModalProvider,
    WalletMultiButton,
    WalletDisconnectButton
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { TokenLaunchpad } from "../components/TokenLaunchpad";
import { TokenList } from "../components/TokenList";
import Footer from "../components/Footer";
import "./token.css";

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

const Token = () => {
    // Set the network to Devnet (can change to 'mainnet-beta' or 'testnet' as needed)
    const network = WalletAdapterNetwork.Devnet;

    // Endpoint for the Solana network
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // Define the wallets available (Phantom Wallet in this case)
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
        ],
        [network]
    );

    return (
        <div className="app">
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        {/* Header Section */}
                        <header className="header1">
                            <div className="container">
                                <h1>Solana Token Launchpad</h1>
                                <div className="wallet-buttons">
                                    {/* Wallet connection and disconnection buttons */}
                                    <WalletMultiButton className="wallet-button" />
                                    <WalletDisconnectButton className="wallet-button" />
                                </div>
                            </div>
                        </header>
                        {/* Main Content Section */}
                        <main className="main">
                            <div className="intro">
                                <h2>Welcome to AvatarAI MemeCoin Creation Project</h2>
                                <p>
                                    Easily create and launch your own MemeCoin with our simple
                                    and intuitive platform. Get started by filling in the
                                    details below!
                                </p>
                            </div>
                            {/* Token Launchpad Form */}
                            <div className="token-launchpad">
                                <TokenLaunchpad />
                            </div>
                            {/* Token List */}
                            <div className="token-list">
                                <TokenList />
                            </div>
                        </main>
                        {/* Footer Section */}
                        <Footer />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    );
};

export default Token;