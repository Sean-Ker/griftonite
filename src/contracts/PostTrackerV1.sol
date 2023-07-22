pragma solidity ^0.8.9;

// EAS plan: maybe create an EAS attestation if the contracts are available, otherwise not?
// i.e. have a constructor for the singleton that receives a contract address for the EAS contract,
// and if that's null then no EAS attestation is created

// Plan: one singleton contract that handles all grifter addresses
contract PostTrackerV1{
    // the struct that will be replaced by attestations in the future
    enum Type {post, cosign}
    struct Post {
        string cid;
        uint blockstamp;
        string uid;
    }

    struct Chain {
        uint32 destinationDomain;
        address target;
    }

    Chain[] chains;
    address interchainQueryRouter;

    // retarded solution: thread heads will just be handled in a mapping from uint => string (which retrieves Post)
    // and then to go through all threads we just iterate until the first post UID is 0

    // tells you how many threads are associated with this user
    mapping (address => uint) numThreadsUnderAddr;

    // index as [address][threadnum] = number of posts in that thread of that user
    mapping (address => mapping (uint => uint)) numPostsInThread;

    // associates a particular serialized post to the actual post struct
    // index as [address][threadnum][postnum] = Post reference
    mapping (address => mapping (uint => mapping (uint => Post))) postObj;

    // need a head for the upper list
    // and each element of that list will point to a head of a different list

    function newPost(string calldata _cid, address _account) public returns (Post memory) {
        Post storage newPostObj = postObj[_account][numThreadsUnderAddr[_account]][0];
        newPostObj.cid = _cid;
        ++numPostsInThread[_account][numThreadsUnderAddr[_account]];
        ++numThreadsUnderAddr[_account];
        return newPostObj;
    }

    function newPost(string calldata _cid, address _account, uint threadNum) public returns (Post memory){
        Post storage newPostObj = postObj[_account][threadNum][numPostsInThread[_account][threadNum]];
        newPostObj.cid = _cid;
        ++numPostsInThread[_account][threadNum];
        return newPostObj;
    }

    function getNumThreads(address _account) public view returns (uint){
        return numThreadsUnderAddr[_account];
    }

    function getPostsInThread(address _account, uint _thread) public view returns (string[] memory) {
        string[] memory posts = new string[](numPostsInThread[_account][_thread]);
        for(uint postnum=0; postnum < numPostsInThread[_account][_thread]; postnum++) {
            posts[postnum] = postObj[_account][_thread][postnum].cid;
        }
        return posts;
    }
    // TODO: new function that uses EAS
    // TODO: constructor. Used to set owner, and list of chains that will be queried
    // TODO: add function to add and remove other chains to query. Query the other chains with hyperlane.

    // logic: in constructor, pass InterchainQueryRouter address
    // if this address is 0, then don't do anything extra beyond what's already written
    // if this address is not zero, then for each entry in the list of targets make the same query and add to results
    // note that we can no longer simply index as before when adding posts, because then we end up with two posts on different chains
    // with the same serial number. 
    // TO SOLVE ABOVE: in both newPost functions, first get the numPostsInThread and numThreads from all chains and take the largest one.
    // ALSO, when running getPostsInThread and getNumThreads we'll need to query the other chains via Hyperlane
    /*constructor(address _interchainQueryRouter, Chain[] memory _chains){
        // throws error of "Copying of type struct PostTrackerV1.Chain memory[] memory to storage not yet supported."
        //chains = new Chain[](_chains.length);
        for (uint chainInd=0; chainInd < _chains.length; ++chainInd){
            // this works instead, but about as far from elegant as it could be.
            chains.push();
            chains[chainInd].destinationDomain = _chains[chainInd].destinationDomain;
        }
        interchainQueryRouter = _interchainQueryRouter;
    }
    */

   // today I realized we don't actually need to do any crazy cross-chain stuff to just qualify for all the blockchains (only Celo).
   // Therefore I'm just creating a constructor that takes in a schema to implement the EAS stuff
   // actually not even that because I can't figure out how to make attestations from contracts; the docs are simply for the javascript SDK
}