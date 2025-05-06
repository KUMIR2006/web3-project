import { useAppKit } from '@reown/appkit/react';
function ConnectWallet() {
  const { open } = useAppKit();

  return (
    <button
      className="connectWallet p-[10px] min-w-[200px] h-[50px]  text-center rounded-md cursor-pointer"
      onClick={() => open()}>
      Connect Wallet
    </button>
  );
}
export default ConnectWallet;
