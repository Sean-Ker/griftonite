pragma solidity ^0.8.9;

import {IWorldID} from "./interfaces/IWorldID.sol";
import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldcoinVerifier} from "./interfaces/IWorldcoinVerifier.sol";

// want to separate the worldcoin stuff from everything else in order to deploy on chains without Worldcoin without the ism
contract WorldcoinVerifier is IWorldcoinVerifier {
    using ByteHasher for bytes;

    error InvalidNullifier();
    
    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    // WorldCoin stuff
    IWorldID worldId;
    uint256 internal immutable externalNullifier;

    constructor(IWorldID _worldId, string memory _appId, string memory _actionId) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    function verifyProof(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public view returns (bool) {
        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        return true;
    }
}