import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { monadTestnet } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { useAppKitAccount } from '@reown/appkit/react';

import ConnectWallet from '../components/ConnectWallet';
import Header from '../components/Header';
import Footer from '../components/Footer';

const queryClient = new QueryClient();
const projectId = 'db0718fdf3c48ecf018eb950a222de3c';

// 2. Create a metadata object - optional
const metadata = {
  name: 'My Affiliate token',
  description: 'Burn and mint token',
  url: 'http://localhost:5173',
  icons: [
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.interfax.ru%2Fphoto%2F5809&psig=AOvVaw09d4gtFZEjucPy3gf_uT_P&ust=1746740587037000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPC2sPapko0DFQAAAAAdAAAAABAE',
  ],
};

const networks = [monadTestnet];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});
// 3. Create the AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  metadata: metadata,
  networks: [monadTestnet],
  defaultNetwork: monadTestnet,
  defaultAccountTypes: { eip155: 'eoa' },
  projectId,

  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    connectMethodsOrder: ['wallet'],
    swaps: false,
  },
});

const pages = [
  { name: 'Token', path: '/token' },
  { name: 'NFT', path: '/nft' },
];
const MainLayout: React.FC = () => {
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount();
  const [navigationId, setNavigationId] = useState(-1);
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="wrapper">
          <div className="background" />
          <div className="fixed flex flex-col top-0 left-0 w-full h-full text-white">
            <Header navId={navigationId} setNavId={setNavigationId} pages={pages} />
            <div className="flex justify-center w-full h-full">
              {isConnected ? (
                <Outlet />
              ) : (
                <div className="flex items-center">
                  <ConnectWallet />
                </div>
              )}
            </div>
            <Footer navId={navigationId} setNavId={setNavigationId} pages={pages} />
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default MainLayout;
