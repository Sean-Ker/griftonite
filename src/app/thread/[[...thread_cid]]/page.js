'use client';

import { Card } from '@tremor/react';
import MDEditor from '@uiw/react-md-editor';
import { Button, Space, Typography } from 'antd';
import { ethers } from 'ethers';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { File, Web3Storage } from 'web3.storage';
import BlogPost from './blog_post';

const { Text, Title } = Typography;

const filename =
  'thread_post_' + Math.floor(Math.random() * 89999999 + 10000000) + '.md';

let ipfs_secret = process.env.IPFS_SECRET;
const client = new Web3Storage({ token: ipfs_secret });
// console.log("ipfs_secret: ", ipfs_secret);

async function storeFiles(client, files) {
  console.log('storing files: ' + files);
  const cid = await client.put(files);
  console.log('stored files with cid:', cid);
  return cid;
}

async function contract_post(cid) {
  // const infura_project_id = process.env.INFURA_PROJECT_ID;
  // const provider = new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${infura_project_id}`);
  // const provider = new Web3.providers.HttpProvider(
  //   `https://linea-goerli.infura.io/v3/${infura_project_id}`
  // );
  // const web3 = new Web3(provider);

  //var personal = new Personal(Personal.givenProvider);
  //Personal.unlockAccount(web3.eth.defaultAccount);
  //web3.eth.defaultAccount = web3.eth.accounts[0];
  //web3.eth.personal.unlockAccount(web3.eth.defaultAccount);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const abi_json = await fetch('/PostTrackerV2.json');
  const contractslist = await (await fetch('/ContractLookup.json')).json();
  const abi = (await abi_json.json()).abi;
  console.log('abi_json: ', abi);
  // const contract_address = window.ethereum.selectedAddress;
  // const contract_address =
  //   '0x9725fa645dd5ce7480981237042df8718fd105e437abf3528924c2a3e555f358';
  // const contract_address =
  //   '0xa36edC2b87f0277c9c678475416452Cf0c7f280a';
  //const contract_address = '0x82ffc25dd541989790d147a4cf3f26daaa16c809';
  const contract_address =
    contractslist[(await provider.getNetwork()).chainId.toString()];
  console.log(contract_address);
  //Contract.setProvider()
  //web3.eth.Contract.defaultAccount = web3.eth.defaultAccount;
  // const contract = new web3.eth.Contract(abi, contract_address);
  //const contract = new web3.eth.Contract(abi, contract_address);
  // const contract = web3.eth.Contract(abi).at(contract_address);
  const contract = new ethers.Contract(contract_address, abi, signer);

  const signerAddr = await signer.getAddress();
  console.log(signerAddr);
  console.log('content ID: ', cid);
  //contract.newPost(cid, signerAddr);
  // just to test, I'm using the
  contract.newPost(cid, signerAddr, { gasLimit: 10000000 });

  //console.log('contract: ', JSON.stringify(contract));
  return contract;
}

const NewPost = () => {
  const { push } = useRouter();
  const { thread_cid } = useParams();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [btnCount, setBtnCount] = useState(0);
  const [cid, setCid] = useState(thread_cid ? thread_cid : null);

  useEffect(() => {
    async function post() {
      const blob = new Blob([content], { type: 'text/markdown' });
      const files = [new File([blob], filename)];
      const cid = await storeFiles(client, files);
      console.log('cid: ', cid);
      await contract_post(cid);
      push(`/thread/${cid}`);
      return cid;
    }
    if (btnCount > 0) {
      const cid = post();
      cid && setCid(cid);
    }
  }, [btnCount]);

  if (thread_cid) {
    return <BlogPost cid={thread_cid} client={client} />;
  }

  return (
    <>
      <Card className="mt-6 p-4 md:p-10 mx-auto flex  flex-col justify-left inset-0 max-w-5xl bg-gradient-to-b from-gray-100 to-gray-200 shadow-lg">
        <div className="">
          <Title level={1}>New Post</Title>
        </div>

        {/* New Blog Post */}
        <MDEditor
          value={content}
          onChange={setContent}
          height={500}

        />

        <Space />
        <Button
          className="bg-gray-50 mt-2"
          type="primary"
          onClick={() => setBtnCount(btnCount + 1)}
        >
          Post
        </Button>
      </Card>
    </>
  );
};

export default NewPost;

{
  /* {cid && <p>IPFS CID: {cid}</p>} */
}
{
  /* {cid && <button onClick={() => contract_post(cid)} />} */
}
{
  /* {<p>Btn Count: {btnCount}</p>} */
}
