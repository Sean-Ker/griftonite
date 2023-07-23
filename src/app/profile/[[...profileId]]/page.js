"use client"

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import {ethers} from 'ethers';

const Profile = () => {

  const { profileId } = useParams()

  useEffect(() => {
    async function getProfile() {
      // fetch all threads containing all posts

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const abi_json = await fetch('/PostTrackerV2.json');
      //const contractslistTemp = await (await fetch("/ContractLookup.json")).json();
      const contractslist = await (await fetch("/ContractLookup.json")).json();
      // just to test
      //const contractslist = [contractslistTemp["10200"]];
      const abi = (await abi_json.json()).abi;

      let accountaddr = profileId;
      // get the address of the profile we're querying:
      if (!profileId) {
        accountaddr = await (await provider.getSigner()).getAddress();
      }
      console.log(accountaddr);

      let masterlist = [];
      console.log(contractslist);
      for (const [key, contract_address] of Object.entries(contractslist)) {
        console.log(contract_address);
        // get the number of threads in the contract
        const trackercontract = new ethers.Contract(contract_address, abi, (await provider.getSigner()));
        try{
        const numThreads = (await trackercontract.getNumThreads(accountaddr)).toNumber();
        console.log("num threads: ", numThreads);
        // then get the posts in each thread
        for (var i =0; i < numThreads; ++i) {
          masterlist.push(await trackercontract.getPostsInThread(accountaddr, i));
        }
        } catch(error){
          console.error(error);
        }
        
      }
      // masterlist now has all the threads from all the blockchains
      masterlist.sort((thread1, thread2) => {
        if (thread1[0][1] < thread2[0][1]){
          return 1;
        } else {
          return -1;
        }
      });

      console.log(masterlist);
      return masterlist;
    }
    const profile = getProfile();
  }, []);

  return (
    <div>Profile ID: {profileId}</div>
  )
}

export default Profile;
