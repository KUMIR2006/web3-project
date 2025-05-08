import React, { useEffect, useState } from 'react';
import ConnectWallet from './ConnectWallet';
import { Link } from 'react-router-dom';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { ethers } from 'ethers';

export type navigationProps = {
  navId: number;
  setNavId: (id: number) => void;
  pages: { name: string; path: string }[];
};

const Header: React.FC<navigationProps> = ({ navId, setNavId, pages }) => {
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount();
  const [shortAddress, setShortAddress] = useState('');

  useEffect(() => {
    if (address != undefined) {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [address]);
  const { open, close } = useAppKit();

  return (
    <div className="flex justify-between items-center w-full h-23 bg-[#070907]/50  p-[10px] pr-[20px] pl-[20px]">
      <Link
        to={'/'}
        onClick={() => setNavId(-1)}
        className="flex  items-center text-[22px] min-w-[150px] lg:min-w-[200px]">
        <p>Affiliate.</p>
      </Link>

      <ul className="hidden md:flex  p-px gap-10 lg:gap-20">
        {pages.map((page, i) => (
          <Link
            key={i}
            to={page.path}
            onClick={() => setNavId(i)}
            className={`pt-[5px] pb-[6px] pl-[10px] pr-[10px] min-w-[75px] text-center ${
              navId === i ? 'border-b' : ''
            }`}>
            <li>{page.name}</li>
          </Link>
        ))}
      </ul>
      {isConnected ? (
        <div
          className="connectWallet p-[10px] min-w-[150px] lg:min-w-[200px] h-[50px] justify-center items-center text-center rounded-md cursor-pointer"
          onClick={() => open()}>
          {shortAddress}
        </div>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
};

export default Header;
