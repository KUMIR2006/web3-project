import { useAppKit } from '@reown/appkit/react';
function ConnectWallet() {
  const { open } = useAppKit();

  return (
    <>
      <button onClick={() => open()}>Open Connect Modal</button>
    </>
  );
}
export default ConnectWallet;
