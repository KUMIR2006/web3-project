import React from 'react';
import ConnectWallet from './ConnectWallet';

const Home: React.FC = () => {
  if (true) {
    return <ConnectWallet />;
  } else {
    return (
      <div className="flex-row h-full">
        <p>Home</p>
      </div>
    );
  }
};

export default Home;
