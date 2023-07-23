'use client';

import { ethers } from 'ethers';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const Profile = () => {
  const {profileId } = useParams();

  useEffect(() => {
    async function getProfile() {
      // fetch all threads containing all posts

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const abi_json = await fetch('/PostTrackerV2.json');
      //const contractslistTemp = await (await fetch("/ContractLookup.json")).json();
      const contractslist = await (await fetch('/ContractLookup.json')).json();
      // just to test
      //const contractslist = [contractslistTemp["10200"]];
      const abi = (await abi_json.json()).abi;
      console.log('ABI: ', abi);

      let accountaddr = profileId;
      // get the address of the profile we're querying:
      if (!profileId) {
        accountaddr = await (await provider.getSigner()).getAddress();
      }
      console.log('Account address: ', accountaddr);

      let masterlist = [];
      console.log(contractslist);
      for (let [key, contract_address] of Object.entries(contractslist)) {
        console.log(contract_address);
        // get the number of threads in the contract
        const signer = await provider.getSigner();
        console.log('Signer: ', signer);
        const trackercontract = new ethers.Contract(
          contract_address,
          abi,
          signer
        );
        console.log('trackercontract: ', trackercontract);
        let n = 0
        try {
          n = await trackercontract.getNumThreads(accountaddr);
        }
        catch (error) {
          console.error(error);
          continue;
        }

        const numThreads = n.toNumber();
        console.log('num threads: ', numThreads);
        // then get the posts in each thread
        for (let i = 0; i < numThreads; i++) {
          try {
            masterlist.push(
              await trackercontract.getPostsInThread(accountaddr, i)
            );
          } catch (error) {
            console.error(error);
          }
        }
      }
      // masterlist now has all the threads from all the blockchains
      masterlist.sort((thread1, thread2) => {
        if (thread1[0][1] < thread2[0][1]) {
          return 1;
        } else {
          return -1;
        }
      });

      console.log(masterlist);
      return masterlist;
    }
    const profile = getProfile();
  }, [profileId]);

  return <div>Profile ID: {profileId}</div>;
};

export default Profile;
