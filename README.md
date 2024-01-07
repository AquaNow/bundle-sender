# Transaction Batching in Ethereum

## Project Overview

Institutions often make hundreds if not thousands of transactions in a day and often a single transaction for only one transfer, for instance, address A to address B with this much ETH or ERC20 token. These transactions are costly, time-consuming, and prone to error. One standard ETH transfer costs 21000 gas; however, this does not have to be the case if transfers are batched.

Our solution involves a smart contract that can be invoked to perform ETH and ERC20 token batch transfers. The contract has functions such as batchETHTransfer and batchERC20Transfer that can be invoked externally to transfer assets. This contract does not store any balances and relies on the fact that only the person with the rightful private keys can invoke batch transfers. With this, institutions can use any wallet they desire if it supports smart contract interaction transactions. With this smart contract, institutions do not necessarily have to create transactions for every transfer, saving time and costs. 

## Interaction

The Bundle Sender Smart Contract has two functions: batching ETH transfers (batchETHTransfer) and ERC20 batch transfers (batchERC20Transfer).

Our testnet deployment (Rinkeby) is in address: "0x1aADd8A69b19cBef4D6F7D81FbDA28fcDC149Ba3"

We have prepared a sample script that can be run using Node.js under the folder sample_interaction. To run, change variables at the top of the file and install dependencies via npm:

```
npm i --save-dev
```

and run sample interaction with:

```
node sampleBatchTxn.js 
```

## To deploy Smart Contract:

First, you have to specify the corresponding network in `hardhat.config.js` file. In the following we use `rinkeby` network. To deploy the contract for the first time, use the following command. 

```
npx hardhat run scripts/deploy.js --network rinkeby
```

*Remark: Node 17.x uses an updated version of openssl by default, which is incompatible with hardhat as of now. Use the following command to fix the incompatibility.*

```
export NODE_OPTIONS=--openssl-legacy-provider
```

We use OpenZeppelin upgradability toolkit. It allows us to deploy the contract with a standard proxy pattern, thus enabling us to upgrade it without changing the effective address. You can upgrade the contract with the following command.

```
npx hardhat run scripts/upgrade.js --network rinkeby
```


## Disclaimer

We are not liable for any lost or stolen assets. Private key security is solely the responsibility of the user. The Bundle Sender Smart Contract will not store any assets and will only be used for utility purposes.

## License
MIT License Copyright (c) 2022 Aquanow
