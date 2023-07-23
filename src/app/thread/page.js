"use client";

import { Card } from '@tremor/react';
import { Button, Typography } from "antd";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { File, Web3Storage } from "web3.storage";

const {Text, Title} = Typography;


const filename = "blog_" + Math.floor(Math.random() * 89999999 + 10000000) + ".md"
const sample_md = `
# Sample blog post

## Each post also has a subtitle

<span class="post-meta">Posted on February 28, 2020</span> <span class="reader-time post-meta"><span class="d-none d-md-inline middot">·</span> < 1 minute read</span></div>

</div>

</div>

</div>

</div>

</header>

<div class="container-md">

<div class="row">

<div class="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">

<div id="header-gh-btns"><iframe src="https://ghbtns.com/github-btn.html?user=daattali&amp;repo=beautiful-jekyll&amp;type=star&amp;count=true" frameborder="0" scrolling="0" width="120px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=daattali&amp;repo=beautiful-jekyll&amp;type=fork&amp;count=true" frameborder="0" scrolling="0" width="120px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=daattali&amp;type=follow&amp;count=true" frameborder="0" scrolling="0" width="220px" height="20px"></iframe></div>

<article role="main" class="blog-post">

This is a demo post to show you how to write blog posts with markdown. I strongly encourage you to [take 5 minutes to learn how to write in markdown](https://markdowntutorial.com/) - it’ll teach you how to transform regular text into bold/italics/headings/tables/etc.

**Here is some bold text**

## Here is a secondary heading

Here’s a useless table:

<table>

<thead>

<tr>

<th style="text-align: left">Number</th>

<th style="text-align: left">Next number</th>

<th style="text-align: left">Previous number</th>

</tr>

</thead>

<tbody>

<tr>

<td style="text-align: left">Five</td>

<td style="text-align: left">Six</td>

<td style="text-align: left">Four</td>

</tr>

<tr>

<td style="text-align: left">Ten</td>

<td style="text-align: left">Eleven</td>

<td style="text-align: left">Nine</td>

</tr>

<tr>

<td style="text-align: left">Seven</td>

<td style="text-align: left">Eight</td>

<td style="text-align: left">Six</td>

</tr>

<tr>

<td style="text-align: left">Two</td>

<td style="text-align: left">Three</td>

<td style="text-align: left">One</td>

</tr>

</tbody>

</table>

How about a yummy crepe?

![Crepe](https://s3-media3.fl.yelpcdn.com/bphoto/cQ1Yoa75m2yUFFbY2xwuqw/348s.jpg)

It can also be centered!

![Crepe](https://s3-media3.fl.yelpcdn.com/bphoto/cQ1Yoa75m2yUFFbY2xwuqw/348s.jpg)

Here’s a code chunk:



"""javascript

    var foo = function(x) {
      return(x + 5);
    }
    foo(3)
"""



And here is the same code with syntax highlighting:

<div class="language-javascript highlighter-rouge">

<div class="highlight">

    var foo = function(x) {
      return(x + 5);
    }
    foo(3)

</div>

</div>
`;
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
  const contractslist = await (await fetch("/ContractLookup.json")).json()
  const abi = (await abi_json.json()).abi;
  console.log('abi_json: ', abi);
  // const contract_address = window.ethereum.selectedAddress;
  // const contract_address =
  //   '0x9725fa645dd5ce7480981237042df8718fd105e437abf3528924c2a3e555f358';
  // const contract_address =
  //   '0xa36edC2b87f0277c9c678475416452Cf0c7f280a';
  //const contract_address = '0x82ffc25dd541989790d147a4cf3f26daaa16c809';
  const contract_address = contractslist[(((await provider.getNetwork()).chainId).toString())];
  console.log(contract_address)
  //Contract.setProvider()
  //web3.eth.Contract.defaultAccount = web3.eth.defaultAccount;
  // const contract = new web3.eth.Contract(abi, contract_address);
  //const contract = new web3.eth.Contract(abi, contract_address);
  // const contract = web3.eth.Contract(abi).at(contract_address);
  const contract = new ethers.Contract(contract_address, abi, signer);

  const signerAddr = await signer.getAddress();
  console.log(signerAddr);
  console.log("content ID: ", cid);
  //contract.newPost(cid, signerAddr);
  // just to test, I'm using the
  contract.newPost(cid, signerAddr, {gasLimit: 10000000});

  //console.log('contract: ', JSON.stringify(contract));
  return contract;
}

const NewPost = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(sample_md);
  const [btnCount, setBtnCount] = useState(0);
  const [cid, setCid] = useState(null);

  useEffect(() => {
    async function post() {
      const blob = new Blob([content], { type: 'text/markdown' });
      const files = [new File([blob], 'blog_post.md')];
      const cid = await storeFiles(client, files);
      await contract_post(cid);
      return cid;
    }
    if (btnCount > 0) {
      const cid = post();
      cid && setCid(cid);
    }
  }, [btnCount]);

  return (
    <Card className="mt-6 p-4 md:p-10 mx-auto flex justify-left inset-0 max-w-5xl bg-gradient-to-b from-gray-100 to-gray-200 shadow-lg">
      <div className="flex flex-col justify-center items-left">
        <Title level={1}>New Post</Title>

      </div>
      {/* {cid && <p>IPFS CID: {cid}</p>} */}
        {/* {cid && <button onClick={() => contract_post(cid)} />} */}
        {/* {<p>Btn Count: {btnCount}</p>} */}
        <Button
          type="primary"
          className="border-2"
          onClick={() => setBtnCount(btnCount + 1)}
        >
          Post
        </Button>
    </Card>
  );
}

export default NewPost
