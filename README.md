# Transaction Batching in Ethereum

## Project Overview

Institutions often make hundreds if not thousands of transactions in a day and often a single transaction for only 1 transfer, for instance, address A to address B with this much ETH or ERC20 token. These transactions are costly, time consuming, and prone to error. One standard ETH transfer costs 21000 gas, however this does not have to be the case if transfers are batched. Below is the plot for gas consumption against number of transfers and it can be observed that there is a significant difference on gas consumption if transfers were batched.

Our solution involves a smart contract that can be invoke to perform ETH and ERC20 toke batch transfer. The contract has functions such as batchEtherTransfer and batchERC20transfer that can be invoked externally to transfer assets. This contract does not store any balances and relies in the fact that only the person who have the rightful private keys can invoke batch transfer. With this, institutions can use any wallet they desire as long as it supports smart contract interaction transactions. With this smart contract, institutions does not necessarily have to create transaction for every single transfer which save them time and costs. 

## Interaction

The Batching Utility Smart Contract have two functions: one for batching ETH transfers (batchETHTransfers) and the other for ERC20 batch transfers (batchERC20Transfers).

Our testnet deployment (Rinkeby) is in address: "0x1dcEE5d66BC52832365DC9C033C2641707BbD46a"

We have prepared a sample script that can be run using Node.js under the folder sample_interaction. To run, change variables at the top of the file and install dependencies via npm:

```
npm i
```

and run sample interaction with:

```
node sampleBatchTxn.js 
```

## To deploy Smart Contract:



## Disclaimer

We are not liable for any lost or stolen assets. Private key security is solely the responsible of the user. The Batching Utility Smart Contract will not store any assets and will only be used for utility purposes.

## License
