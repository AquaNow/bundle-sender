const Web3 = require("web3");

const proxyContractAddress = "0x1aADd8A69b19cBef4D6F7D81FbDA28fcDC149Ba3";

const user_address_test = "0xEthereumAddress";
const private_key_test = "private_key of user_address_test";

const erc20TokenAddress = "0xc778417e063141139fce010982780140aa0cd5ab"; // WETH

const web3Provider = "https://rinkeby.infura.io/v3/<API Secret Key>";

const listOfAddresses = [
  "0xEthereumAddress1",
  "0xEthereumAddress2",
  "0xEthereumAddress3",
];

const listOfAmounts = ["100000000000000", "200000000000000", "300000000000000"];

const totalAmounts = "600000000000000";

const web3 = new Web3(web3Provider);

async function testBatchEthTransferCall() {
  const batchSender = new web3.eth.Contract(
    require("./batchSmartContractABI.json"),
    proxyContractAddress
  );

  const obj = batchSender.methods
    .batchETHTransfer(listOfAddresses, listOfAmounts)
    .encodeABI();

  const txData = {
    to: proxyContractAddress,
    from: user_address_test,
    value: totalAmounts, // sum of the list of amounts above
    data: obj,
  };

  const res = await sendETH(txData);
  console.log(`res`, res);
}

// This Smart contract needs ERC20 approval
async function testBatchERC20TransferCall() {
  const batchSender = new web3.eth.Contract(
    require("./batchSmartContractABI.json"),
    proxyContractAddress
  );

  const erc20 = new web3.eth.Contract(
    require("./erc20ABI.json"),
    erc20TokenAddress
  );

  // Contract transfer approval
  // const approveTransferObj = await erc20.methods
  //   .approve(proxyContractAddress, "100000000000000000000")
  //   .encodeABI();

  // const txData = {
  //   to: erc20TokenAddress,
  //   from: user_address_test,
  //   data: approveTransferObj,
  // };

  const obj = batchSender.methods
    .batchERC20Transfer(erc20TokenAddress, listOfAddresses, listOfAmounts)
    .encodeABI();

  const txData = {
    to: proxyContractAddress,
    from: user_address_test,
    data: obj,
  };
  const res = await sendETH(txData);
  console.log(`res`, res);
}

async function sendETH(txData) {
  try {
    const nonce = await web3.eth.getTransactionCount(txData.from);
    const gasLimit = await estimateGasLimit(txData);
    const maxPriorityFeePerGas = await getMaxPriorityFeePerGas();
    const signedTx = await signTx({
      ...txData,
      nonce,
      gas: gasLimit,
      maxPriorityFeePerGas,
    });
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  } catch (error) {
    console.log(`error`, error);
    throw new Error("Unable to send transaction");
  }
}

async function signTx(txData) {
  try {
    return await web3.eth.accounts.signTransaction(txData, private_key_test);
  } catch (error) {
    console.log(`error`, error);
    throw new Error("Unable to sign transaction");
  }
}

async function estimateGasLimit(transaction) {
  try {
    const gasLimit = await web3.eth.estimateGas(transaction);
    return web3.utils.toHex(gasLimit);
  } catch (error) {
    console.log(`error`, error);
    throw new Error("Unable to estimate price and limit");
  }
}
async function getMaxPriorityFeePerGas() {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(blockNumber);
    const gasPrice = await web3.eth.getGasPrice();
    const maxPriorityFeePerGas = gasPrice - parseInt(block.baseFeePerGas, 10);
    return web3.utils.toHex(maxPriorityFeePerGas);
  } catch (error) {
    console.log(`error in getBaseFee`, error);
    throw new Error("Unable to get baseFee");
  }
}

// testBatchEthTransferCall();
testBatchERC20TransferCall();
