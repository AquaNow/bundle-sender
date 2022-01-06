require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-waffle");

// Rinkeby testnet endpoint and accounts
const {ALCHEMY_API_KEY, RINKEBY_PRIVATE_KEY, RINKEBY_DUMMY_KEYS} = require('./.secrets');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`].concat(RINKEBY_DUMMY_KEYS),
   	  gas: 2100000,
	}
  },
};
