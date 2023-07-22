require('dotenv').config({path: __dirname+'/./../.env'});
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      accounts: [
        process.env.SEPOLIA_PRIVATE_KEY
      ],
      url: "https://sepolia.infura.io/v3/"+process.env.INFURA_SECRET
    },
    chiado: {
      accounts: [
        process.env.CHIADO_PRIVATE_KEY
      ],
      url: "https://rpc.chiadochain.net",
    }
  }
};
