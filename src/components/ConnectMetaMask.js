'use client';

import { MetaMaskSDK } from '@metamask/sdk';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const options = {
  dappMetadata: {
        name: 'Griftonite'
      },
  injectProvider: false,
  checkInstallationImmediately: true,
  preferDesktop: false,
};



export default function ConnectMetaMask({account, setAccount}) {
  const [isLoading, setIsLoading] = useState(false);
  // const [isConnected, setIsConnected] = useState(false);
  // const [account, setAccount] = useState(null);
  const [ethereum, setEthereum] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const MMSDK = new MetaMaskSDK(options);
    // Get ethereum provider:
    const ethereum = window.ethereum;
    ethereum && setEthereum(ethereum);
  }, []);

  async function connectToMetaMask() {
    setIsLoading(true);
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      console.log(accounts);
      handleAccountsChanged(accounts);
    } catch (error) {
      setError(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      setAccount(null);
    } else if (accounts[0] !== account) {
      console.log(accounts)
      setAccount(accounts[0]);
    }
  }

  return (
    <div>

    <button
        onClick={connectToMetaMask}
        disabled={isLoading }
        style={{
          backgroundColor: '#000',
          color: '#fff',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Image src="/metamask_logo.svg" alt="MetaMask Logo" width={25} height={25} priority />
        <span style={{ marginLeft: '5px' }}>
          {isLoading ? 'Connecting...' : 'Connect'}
        </span>
      </button>
      {<p>Connected account: {JSON.stringify(account)}</p>}
      {/* {error && <p>Error: {error}</p>} */}
    </div>
  );
}

function requestPermissions() {
  ethereum
    .request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    })
    .then((permissions) => {
      const accountsPermission = permissions.find(
        (permission) => permission.parentCapability === 'eth_accounts'
      );
      if (accountsPermission) {
        console.log('eth_accounts permission successfully requested!');
      }
    })
    .catch((error) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Permissions needed to continue.');
      } else {
        console.error(error);
      }
    });
}
