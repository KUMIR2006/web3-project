import React from 'react';
import ConnectWallet from './ConnectWallet';

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center w-full min-h-20 p-5 bg-orange-600">
      <p>Header</p>
      <ConnectWallet />
    </div>
  );
};

export default Header;
