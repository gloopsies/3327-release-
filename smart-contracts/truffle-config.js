const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "ten collect junk opinion possible egg season devote school call cliff velvet"

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "0" // Match any network id
    },
    mainnet_fork: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4b02d92a57b24e22a7371229adb41aaf");
      },
      network_id: "4"
    },

    matic: {
      provider: () => new HDWalletProvider(mnemonic, "https://rpc-mumbai.maticvigil.com/"),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },
plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: "SWTTC3VAK5TG64SQ57ZZ39FXKMBD1B9KM1",
    polygonscan: "Q4XERIEWKDTE6UN1IM6HKSYIDTBIJ98A9J"
  }
};