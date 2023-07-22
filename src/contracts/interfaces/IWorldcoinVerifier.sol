pragma solidity ^0.8.9;

interface IWorldcoinVerifier {
    function verifyProof(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external view returns (bool);
}