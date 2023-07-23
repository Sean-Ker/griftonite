'use client';

import { useEffect, useState } from 'react';
import ConnectMetaMask from '../components/ConnectMetaMask';

// This component checks if MetaMask is installed and prompts the user to install it if not.
const CheckMetaMask = ({ children }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMetaMaskInstalled(typeof window.ethereum !== 'undefined');
    }
  }, []);

  // if (!isMetaMaskInstalled) {
  //   return (
  //     <div>
  //       <p>MetaMask is not installed. Please install it to continue.</p>
  //       <button
  //         className="btn btn-primary border-black border-2 bg-black text-white rounded-md p-2"
  //         onClick={() =>
  //           window.open('https://metamask.io/download.html', '_blank')
  //         }
  //       >
  //         Install MetaMask
  //       </button>

  //     </div>
  //   );
  // }

  return children;
};

// The MetaMask component now only handles the connection to MetaMask.
export default function MetaMask() {
const [account, setAccount] = useState(null);

  return (
    <CheckMetaMask>
      <ConnectMetaMask account={account} setAccount={setAccount} />
    </CheckMetaMask>
  );
}
