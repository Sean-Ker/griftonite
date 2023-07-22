// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { getAddress } = require("ethers/lib/utils");
const hre = require("hardhat");

async function main() {
  const worldVerifier = await hre.ethers.deployContract("WorldcoinVerifier", [getAddress("0x05C4AE6bC33e6308004a47EbFa99E5Abb4133f86"), "app_staging_6b803b3dd09861354441b6df8c607b14", "co-sign"]);
  console.log(worldVerifier);
  await worldVerifier.waitForDeployment();

  const postTracker = await hre.ethers.deployContract("PostTrackerV2", [getAddress("0x1a5650d0ecbca349dd84bafa85790e3e6955eb84"),
   worldVerifier.address]);

  await postTracker.waitForDeployment();

  console.log(
    `PostTracker deployed to ${postTracker.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
