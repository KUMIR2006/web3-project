import React from 'react';
import { Outlet } from 'react-router';
import Header from '../components/Header';
import { createAppKit } from '@reown/appkit/react';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { monadTestnet } from '@reown/appkit/networks';

// 1. Get projectId
const projectId = 'project_id';

// 2. Create a metadata object - optional
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};

// 3. Create the AppKit instance
export const modal = createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadata,
  networks: [monadTestnet],
  defaultNetwork: monadTestnet,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    connectMethodsOrder: ['wallet'],
  },
});

const MainLayout: React.FC = () => {
  return (
    <div className="wrapper">
      <Header />
      <Outlet />
    </div>
  );
};

export default MainLayout;
