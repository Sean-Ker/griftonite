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
}