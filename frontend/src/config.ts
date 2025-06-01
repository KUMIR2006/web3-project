import { http, createConfig } from '@wagmi/core';
import { monadTestnet } from '@wagmi/core/chains';

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
});
