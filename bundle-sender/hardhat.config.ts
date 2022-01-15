import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";

import { subtask } from "hardhat/config";
import { glob } from "hardhat/internal/util/glob";
import path from "path";

// Rinkeby testnet endpoint and accounts
const {ALCHEMY_API_KEY, RINKEBY_PRIVATE_KEY, RINKEBY_DUMMY_KEYS} = require('./.secrets');


// custom compile subtask to include contracts in './test/contracts/' in sources
subtask(
  "compile:solidity:get-source-paths",
  async (_, { config }): Promise<string[]> => {
    let paths = await glob(path.join(config.paths.sources, "**/*.sol"));
    let test_paths = await glob(path.join(config.paths.tests, "contracts", "**/*.sol"));

    return paths.concat(test_paths);
  }
);


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
