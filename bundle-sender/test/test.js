const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const token_partial_abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
        {
            "name": "_spender",
            "type": "address"
        },
        {
            "name": "_value",
            "type": "uint256"
        }
    ],
    "name": "approve",
    "outputs": [
        {
            "name": "",
            "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }  
];

// LINK token on rinkeby
const token_address = '0x01be23585060835e02b77ef475b0cc51aa1e0709';

describe("Wallet", function () {
  let wallet;

  before(async function () {
    this.timeout(200000);
    const Wallet = await ethers.getContractFactory("Wallet");
    wallet = await upgrades.deployProxy(Wallet); 
    await wallet.deployed();

    console.log("Wallet deployed to:", wallet.address);
  });

  it("Send 0.01 ETH to each address.", async function () {
    this.timeout(100000);

    const [payer, payee1, payee2] = await ethers.getSigners();
    
    initial_balance = [await payee1.getBalance(), await payee2.getBalance()];
    console.log("initial balance of payees:", initial_balance);

    const multisend_tx = await wallet.connect(payer).batchETHTransfer(
      [payee1.address, payee2.address], 
      [ethers.utils.parseEther('0.01'), ethers.utils.parseEther('0.01')], 
      {value: ethers.utils.parseEther("0.02")}
      );
    await multisend_tx.wait();
    console.log("finished transfer by batchETHTransfer");
    
    final_balance = [await payee1.getBalance(), await payee2.getBalance()];
    console.log("final balance of payees:", final_balance);

    expect(final_balance[0]).to.equal(initial_balance[0].add(ethers.utils.parseEther('0.01')));
    expect(final_balance[1]).to.equal(initial_balance[1].add(ethers.utils.parseEther('0.01')));
  });

  //Note: This test assumes we are running on Rinkeby network.
  //TODO: The test has to deploy a dummy ERC20 so that it would be network independent.
  it("Send 10 LINK to each address.", async function () {
    this.timeout(100000);
  
    const [payer, payee1, payee2] = await ethers.getSigners();
    
    const token = new ethers.Contract(token_address, token_partial_abi, ethers.provider);
  
    // payer approves the contract 
    const approval_tx = await token.connect(payer).approve(wallet.address, 20000);
    await approval_tx.wait();
  
    console.log("Payer approved the wallet for transfers");
  
    initial_balance = [await token.balanceOf(payee1.address),
                       await token.balanceOf(payee2.address)];
    console.log("initial token balance of payees:", initial_balance);
  
    const multisend_tx = await wallet.connect(payer).batchERC20Transfer(token_address, 
      [payee1.address, payee2.address], 
      [10, 10]
      );
    await multisend_tx.wait();
  
    final_balance = [await token.balanceOf(payee1.address),
                     await token.balanceOf(payee2.address)];
    console.log("final token balance of payees:", final_balance);
  
    expect(final_balance[0]).to.equal(initial_balance[0].add(10));
    expect(final_balance[1]).to.equal(initial_balance[1].add(10));
  });

  it("Insufficient total ETH provided", async function () {
    this.timeout(200000);

    const [payer, payee1, payee2] = await ethers.getSigners();
    
    initial_balance = await payee1.getBalance();
    console.log("initial balance of payee1:", initial_balance);

    const batchTransfer_tx = await wallet.connect(payer).batchETHTransfer(
      [payee1.address, payee2.address], 
      [ethers.utils.parseEther('0.01'), ethers.utils.parseEther('0.01')], 
      {value: ethers.utils.parseEther("0.015")}
      );
    await expect(batchTransfer_tx.wait()).to.be.reverted;

    console.log("The batchETHTransfer reverted as expected");
    
    final_balance = await payee1.getBalance();
    console.log("final balance of payee1:", final_balance);

    expect(final_balance).to.equal(initial_balance);
  });
  
  it("Conflicting size of reciepents and amounts arrays - ETH", async function () {
    this.timeout(200000);

    const [payer, payee1, payee2, payee3] = await ethers.getSigners();
    
    initial_balance = await payee1.getBalance();
    console.log("initial balance of payee1:", initial_balance);

    const batchTransfer_tx = await wallet.connect(payer).batchETHTransfer(
      [payee1.address, payee2.address, payee3.address], 
      [ethers.utils.parseEther('0.01'), ethers.utils.parseEther('0.01')], 
      {value: ethers.utils.parseEther("0.02")}
      );
    await expect(batchTransfer_tx.wait()).to.be.reverted;

    console.log("The batchETHTransfer reverted as expected");
    
    final_balance = await payee1.getBalance();
    console.log("final balance of payee1:", final_balance);

    expect(final_balance).to.equal(initial_balance);
  });

  it("Insufficient total ERC20 token allowance provided", async function () {
    this.timeout(100000);
  
    const [payer, payee1, payee2] = await ethers.getSigners();
    
    const token = new ethers.Contract(token_address, token_partial_abi, ethers.provider);
  
    // payer approves the contract 
    const approval_tx = await token.connect(payer).approve(wallet.address, 15);
    await approval_tx.wait();
  
    console.log("Payer approved the wallet for transfers");
  
    initial_balance = [await token.balanceOf(payee1.address),
                       await token.balanceOf(payee2.address)];
    console.log("initial token balance of payees:", initial_balance);
  
    const batchTransfer_tx = await wallet.connect(payer).batchERC20Transfer(token_address, 
      [payee1.address, payee2.address], 
      [10, 10]
      );
    await expect(batchTransfer_tx.wait()).to.be.reverted;
  
    console.log("The batchERC20Transfer reverted as expected");

    final_balance = [await token.balanceOf(payee1.address),
                     await token.balanceOf(payee2.address)];
    console.log("final token balance of payees:", final_balance);
  
    expect(final_balance[0]).to.equal(initial_balance[0]);
    expect(final_balance[1]).to.equal(initial_balance[1]);
  });
  
  it("Conflicting size of reciepents and amounts arrays - ERC20", async function () {
    this.timeout(200000);

    const [payer, payee1, payee2, payee3] = await ethers.getSigners();
    
    const token = new ethers.Contract(token_address, token_partial_abi, ethers.provider);
  
    // payer approves the contract 
    const approval_tx = await token.connect(payer).approve(wallet.address, 300);
    await approval_tx.wait();
  
    console.log("Payer approved the wallet for transfers");
  
    initial_balance = [await token.balanceOf(payee1.address),
                       await token.balanceOf(payee2.address),
                       await token.balanceOf(payee3.address)];
    console.log("initial token balance of payees:", initial_balance);
  
    const batchTransfer_tx = await wallet.connect(payer).batchERC20Transfer(token_address, 
      [payee1.address, payee2.address, payee3.address], 
      [10, 10]
      );
    await expect(batchTransfer_tx.wait()).to.be.reverted;
  
    console.log("The batchERC20Transfer reverted as expected");

    final_balance = [await token.balanceOf(payee1.address),
                     await token.balanceOf(payee2.address),
                     await token.balanceOf(payee3.address)];
    console.log("final token balance of payees:", final_balance);
  
    expect(final_balance[0]).to.equal(initial_balance[0]);
    expect(final_balance[1]).to.equal(initial_balance[1]);
    expect(final_balance[2]).to.equal(initial_balance[2]);
  });

  it("Angry token!", async function () {
    this.timeout(200000);
    const [payer, payee1, payee2, payee3] = await ethers.getSigners();

    const DummyERC20Token = await ethers.getContractFactory("DET");
    dummy_token = await DummyERC20Token.deploy()
    await dummy_token.deployed();

    console.log("Dummy ERC20 Token deployed to:", dummy_token.address);
    console.log("Initial balance of the payer:", await dummy_token.balanceOf(payer.address));

      
    // payer approves the contract 
    const approval_tx = await dummy_token.connect(payer).approve(wallet.address, 300);
    await approval_tx.wait();
  
    console.log("Payer approved the wallet for transfers");
  
    initial_balance = [await dummy_token.balanceOf(payee1.address),
                       await dummy_token.balanceOf(payee2.address),
                       await dummy_token.balanceOf(payee3.address)];
    console.log("initial token balance of payees:", initial_balance);
  
    const batchTransfer_tx = await wallet.connect(payer).batchERC20Transfer(dummy_token.address, 
      [payee1.address, payee2.address, payee3.address], 
      [10, 10, 10]
      );
    await expect(batchTransfer_tx.wait()).to.be.reverted;
  
    console.log("The batchERC20Transfer reverted as expected");

    final_balance = [await dummy_token.balanceOf(payee1.address),
                     await dummy_token.balanceOf(payee2.address),
                     await dummy_token.balanceOf(payee3.address)];
    console.log("final token balance of payees:", final_balance);
  
    expect(final_balance[0]).to.equal(initial_balance[0]);
    expect(final_balance[1]).to.equal(initial_balance[1]);
    expect(final_balance[2]).to.equal(initial_balance[2]);
  });  
});
