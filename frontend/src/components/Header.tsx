import React from 'react';
import ConnectWallet from './ConnectWallet';

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-center w-full h-20 p-5 bg-[#070907]/50 ">
      <p>Header</p>
      <ConnectWallet />
    </div>
  );
};

export default Header;
