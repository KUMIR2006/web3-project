import React from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';

import PixelCard from '../blocks/Components/PixelCard/PixelCard';

const storageSC = '0x04Df2332aC00089a3638ADbdFa1617d23Cf7777B';

const storageABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'needed', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'enum NFT.Rarity', name: 'rarity', type: 'uint8' },
    ],
    name: 'NFTMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'rarity', type: 'uint256' },
    ],
    name: 'UpgradeStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'newRarity', type: 'uint256' },
    ],
    name: 'UpgradeCompleted',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'currentRarity', type: 'uint256' }],
    name: 'finishUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'enum NFT.Rarity', name: 'rarity', type: 'uint8' }],
    name: 'getTokenIdsByRarity',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'lastMintTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintDaily',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'currentRarity', type: 'uint256' }],
    name: 'startUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'upgradeRequests',
    outputs: [
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
      { internalType: 'bool', name: 'isCreated', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const Nft: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { writeContract, isPending, data: txHash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleMint = async () => {
    if (!isConnected) return alert('Connect wallet first');

    await writeContract({
      address: storageSC,
      abi: storageABI,
      functionName: 'mintHundred',
    });
  };

  // checking status of transaction
  React.useEffect(() => {
    if (isConfirmed) {
      alert('Transaction confirmed!');
      if (txHash) console.log(`Tx hash: ${txHash}`);
    }
  }, [isConfirmed]);

  return (
    <div className="flex flex-col justify-between  self-center items-center  min-w-180  min-h-190 h-23 bg-[#070907]/40  p-[40px] rounded-3xl text-sm md:text-lg ">
      {/* MINT AND UPGRADE NFT */}
      <div className="flex justify-center gap-[100px]">
        <div className="">
          <div className="text-center text-[22px]">Mint new NFT</div>
          <div className="flex h-[390px] items-center justify-center">
            <PixelCard
              variant="pink"
              className="cursor-pointer max-h-[250px] max-w-[250px]"
              colors="#94459b, #3346d6, #415C90"
              noFocus={true}>
              <div className="absolute text-[30px] select-none font-semibold mix-blend-difference text-[rgb(166,166,166)] text-center">
                MINT NFT
                <p className="text-[14px]">available every 24 hours</p>
              </div>
            </PixelCard>
          </div>
        </div>
        <div className="flex flex-col  gap-[20px]">
          <div className=" text-center text-[22px]">
            <h1>Upgrade NFT</h1>
          </div>
          <div>
            <div className="flex gap-[10px]">
              <PixelCard
                variant="pink"
                className={`cursor-pointer max-h-[175px] max-w-[150px] border-[#6b5325]`}
                colors="#ad7806, #a38c4c, #332910">
                <div className="absolute text-[24px] select-none font-semibold mix-blend-difference text-[#604a20] text-center">
                  Burn 3 Common
                </div>
              </PixelCard>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 rounded-full bg-[rgba(166,166,166,0.2)]"></div>

                <div className="h-[3px] w-[250px] bg-gradient-to-r from-[rgba(166,166,166,0.2)] to-[#4f4f9e] text-center ">
                  earn to burn
                </div>

                <div className="w-4 h-4 rounded-full bg-[#4f4f9e]"></div>
              </div>
              <PixelCard
                variant="pink"
                className={`cursor-pointer max-h-[175px] max-w-[150px] border-[#4f4f9e]`}
                colors="#254196, #2f5fce, #7474e8">
                <div className="absolute text-[24px] select-none font-semibold mix-blend-difference text-[#4f4fad] text-center">
                  Get 1 Mythical
                </div>
              </PixelCard>
            </div>
          </div>
          <div>
            <div className="flex gap-[10px]">
              <PixelCard
                variant="pink"
                className={`cursor-pointer max-h-[175px] max-w-[150px] border-[#4f4f9e]`}
                colors="#254196, #2f5fce, #7474e8">
                <div className="absolute text-[24px] select-none font-semibold mix-blend-difference text-[#4f4f9e] text-center">
                  Burn 3 Mythical
                </div>
              </PixelCard>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 rounded-full bg-[#4f4f9e]"></div>

                <div className="h-[3px] w-[250px] bg-gradient-to-r from-[#4f4f9e] to-[rgba(166,166,166,0.2)]  text-center">
                  burn to earn
                </div>

                <div className="w-4 h-4 rounded-full bg-[rgba(166,166,166,0.2)]"></div>
              </div>
              <PixelCard
                variant="pink"
                className={`cursor-pointer max-h-[175px] max-w-[150px] border-[#94459b]`}
                colors="#94459b, #3346d6, #415C90">
                <div
                  className={`absolute text-[24px] select-none font-semibold mix-blend-difference text-[#7f4484] text-center`}>
                  Get 1 Legendary
                </div>
              </PixelCard>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-t-1 ">
        <div className="mt-[20px] text-center">Your collection:</div>
        <div className="flex justify-between mt-[20px]">
          <PixelCard
            variant="pink"
            className={`cursor-pointer max-h-[150px] max-w-[150px] border-[#6b5325]`}
            colors="#ad7806, #a38c4c, #332910">
            <div className="absolute text-[24px] select-none font-semibold mix-blend-difference text-[#604a20] text-center">
              Burn 3 Common
            </div>
          </PixelCard>
          <PixelCard
            variant="pink"
            className={`cursor-pointer max-h-[150px] max-w-[150px] border-[#6b5325]`}
            colors="#ad7806, #a38c4c, #332910">
            <div className="absolute text-[24px] select-none font-semibold mix-blend-difference text-[#604a20] text-center">
              Burn 3 Common
            </div>
          </PixelCard>
          <PixelCard
            variant="pink"
            className={`cursor-pointer max-h-[150px] max-w-[150px] border-[#6b5325]`}
            colors="#ad7806, #a38c4c, #332910">
            <div className="absolute text-[24px] select-none font-semibold mix-blend-difference text-[#604a20] text-center">
              Burn 3 Common
            </div>
          </PixelCard>
          <PixelCard
            variant="pink"
            className={`cursor-pointer max-h-[150px] max-w-[150px] border-[#6b5325]`}
            colors="#ad7806, #a38c4c, #332910">
            <div className="absolute text-[24px] select-none font-semibold mix-blend-difference text-[#604a20] text-center">
              Burn 3 Common
            </div>
          </PixelCard>
          <PixelCard
            variant="pink"
            className={`cursor-pointer max-h-[150px] max-w-[150px] border-[#6b5325]`}
            colors="#ad7806, #a38c4c, #332910">
            <div className="absolute text-[24px] select-none font-semibold mix-blend-difference text-[#604a20] text-center">
              Burn 3 Common
            </div>
          </PixelCard>
          <PixelCard
            variant="pink"
            className={`cursor-pointer max-h-[150px] max-w-[150px] border-[#6b5325]`}
            colors="#ad7806, #a38c4c, #332910">
            <div className="absolute text-[24px] select-none font-semibold mix-blend-difference text-[#604a20] text-center">
              Burn 3 Common
            </div>
          </PixelCard>
        </div>
      </div>
    </div>
  );
};

export default Nft;
