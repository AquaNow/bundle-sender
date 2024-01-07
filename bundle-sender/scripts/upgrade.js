const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // The proxy contract deployed on testnet 
  const proxy_address = "0x1dcEE5d66BC52832365DC9C033C2641707BbD46a";

  const Wallet = await ethers.getContractFactory("Wallet");
  const upgraded_wallet = await upgrades.upgradeProxy(proxy_address, Wallet);
  await upgraded_wallet.deployed();

  console.log("Wallet contract upgraded.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
