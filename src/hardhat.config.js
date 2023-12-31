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
    },
    lineatest: {
      accounts: [
        process.env.SEPOLIA_PRIVATE_KEY
      ],
      url: "https://linea-goerli.infura.io/v3/"+process.env.INFURA_SECRET
    },
    neondevnet: {
      accounts: [
        process.env.SEPOLIA_PRIVATE_KEY
      ],
      url: "https://devnet.neonevm.org",
      chainId: 245022926
    },
    zkevmtest: {
      accounts: [
        process.env.SEPOLIA_PRIVATE_KEY
      ],
      url: "https://rpc.public.zkevm-test.net"
    },
    goerli: {
      accounts: [
        process.env.SEPOLIA_PRIVATE_KEY
      ],
      url: "https://goerli.blockpi.network/v1/rpc/public"
    }
  }
};
