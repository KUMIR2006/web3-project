import React, { useEffect, useState } from 'react';
import ConnectWallet from './ConnectWallet';
import { Link } from 'react-router-dom';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { navigationProps } from './Header';
const Footer: React.FC<navigationProps> = ({ navId, setNavId, pages }) => {
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount();
  const [shortAddress, setShortAddress] = useState('');

  useEffect(() => {
    if (address != undefined) {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [address]);
  const { open, close } = useAppKit();

  return (
    <div className="flex md:hidden justify-center items-center w-full h-23 bg-[#070907]/50  p-[10px] pr-[50px] pl-[50px]">
      <ul className="flex justify-around w-full p-px gap-10 lg:gap-20">
        {pages.map((page, i) => (
          <Link
            key={i}
            to={page.path}
            onClick={() => setNavId(i)}
            className={`pt-[5px] pb-[6px] pl-[10px] pr-[10px] min-w-[75px] text-center ${
              navId === i ? 'border-t' : ''
            }`}>
            <li>{page.name}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
