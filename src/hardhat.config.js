require('dotenv').config({path: __dirname+'/./../.env'});
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      accounts: [
        process.env.ETH_PRIVATE_KEY
      ]
    }
  }
};
