const WalletContract = artifacts.require("WalletContract");

module.exports = async function (deployer, network, accounts) {
  // deployer.deploy(WalletContract);
  const walletContract = await WalletContract.new();
  const balance = await walletContract.balance();
  const result = await walletContract.multisendEther(
    [
      "0xeE0Fb95A15faF128d0B7C5cF532AfC562E6af453",
      "0x02650178Db673F279FfBcEE22222C240cFE62C5b",
      "0x138C373495DCf9a759F985379934924069f90926",
      "0x3Caf636fA0618Bf2B8EBcBcF349f03301C4377e2",
      "0xA699438CC017e5752ce6E461DDC3e1e28C944d27",
      "0xE439D43865ac1Ac309E1F2d5D2532Cbe1f399BD4",
      "0x9Dc3C5D20B62694828eaE1fd24c98249F5F32fCB",
      "0xE1Ffcce1a657e24aB0D46B4b3048916aC5e732D3",
      "0xA02ca5489e64F7488c54000ADAA8ffeD31C60378",
      "0x3cebC534E99a731143Ca7c344aa7a7a9Ff93ae92",
      "0x82ecC8B3d9223E37f82Cc9eaadE27Cf0fDb27f8b",
      "0xeE0Fb95A15faF128d0B7C5cF532AfC562E6af453",
      "0x6931064d9521c521C0d28789c2CA162C4A5701B7",
      "0xD84657783a4b9f5b09960D53518eAb25F5A0F7ed",
      "0xB58ee46868934E6EEBE863E0a3F03dDe4F131415",
      "0x02650178Db673F279FfBcEE22222C240cFE62C5b",
    ],
    [
      100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
      200,
    ],
    { from: accounts[1], value: 1700 }
  );
  console.log(`result`, result);
};
