pragma solidity ^0.8.9;

// EAS plan: maybe create an EAS attestation if the contracts are available, otherwise not?
// i.e. have a constructor for the singleton that receives a contract address for the EAS contract,
// and if that's null then no EAS attestation is created

import {IEAS} from "./IEAS.sol";
import {Attestation} from "./Common.sol";

// Plan: one singleton contract that handles all grifter addresses
contract PostTrackerV2{
    // the struct that will be replaced by attestations in the future
    enum Type {post, reply, review, cosign}
    struct Post {
        string cid;
        uint timestamp;
        address poster;
        // removed the UID since I don't think we'll ever need it
        // instead, adding a type
        //string uid;
        Type postType;
    }

    address easAddr;

    address owner;

    //address worldId

    // tells you how many threads are associated with this user
    mapping (address => uint) numThreadsUnderAddr;

    // index as [address][threadnum] = number of posts in that thread of that user
    mapping (address => mapping (uint => uint)) numPostsInThread;

    // associates a particular serialized post to the actual post struct
    // index as [address][threadnum][postnum] = Post reference
    mapping (address => mapping (uint => mapping (uint => Post))) postObj;

    // need a head for the upper list
    // and each element of that list will point to a head of a different list

    modifier ownerOnly {
        require(msg.sender == owner, "action must be performed by the address that deployed");
        _;
    }

    modifier attestationRecipient(address _caller, address _attester, bytes32 _attestationUID) {
        require(easAddr != address(0), "cannot perform action with unset EAS address");
        require(IEAS(easAddr).isAttestationValid(_attestationUID), "attestation must be valid");
        Attestation memory attestation = IEAS(easAddr).getAttestation(_attestationUID);
        require(attestation.recipient == _caller, "caller must be recipient of the attestation");
        require(attestation.attester == _attester, "attester of the attestation must match the expected");
        _;
    }

    function newPost(string calldata _cid, address _account) public returns (Post memory) {
        Post storage newPostObj = postObj[_account][numThreadsUnderAddr[_account]][0];
        newPostObj.cid = _cid;
        newPostObj.timestamp = block.timestamp;
        newPostObj.poster = msg.sender;
        newPostObj.postType = Type.post;
        ++numPostsInThread[_account][numThreadsUnderAddr[_account]];
        ++numThreadsUnderAddr[_account];
        return newPostObj;
    }

    function newReply(string calldata _cid, address _account, uint threadNum) public returns (Post memory){
        Post storage newPostObj = postObj[_account][threadNum][numPostsInThread[_account][threadNum]];
        newPostObj.cid = _cid;
        newPostObj.timestamp = block.timestamp;
        newPostObj.poster = msg.sender;
        newPostObj.postType = Type.reply;
        ++numPostsInThread[_account][threadNum];
        return newPostObj;
    }

    function newReview(string calldata _cid, address _account, uint threadNum, bytes32 _attestationUID) 
    public attestationRecipient(msg.sender, _account, _attestationUID) returns (Post memory){
        Post storage newPostObj = postObj[_account][threadNum][numPostsInThread[_account][threadNum]];
        newPostObj.cid = _cid;
        newPostObj.timestamp = block.timestamp;
        newPostObj.poster = msg.sender;
        newPostObj.postType = Type.review;
        ++numPostsInThread[_account][threadNum];
        return newPostObj;
    }


    function getNumThreads(address _account) public view returns (uint){
        return numThreadsUnderAddr[_account];
    }

    function getPostsInThread(address _account, uint _thread) public view returns (Post[] memory) {
        Post[] memory posts = new Post[](numPostsInThread[_account][_thread]);
        for(uint postnum=0; postnum < numPostsInThread[_account][_thread]; postnum++) {
            posts[postnum] = postObj[_account][_thread][postnum];
        }
        return posts;
    }
    // TODO: new function that uses EAS
    constructor(address _easAddr) {
        easAddr = _easAddr;
    }

    function updateEAS(address newEasAddr) public ownerOnly {
        easAddr = newEasAddr;
    }
}