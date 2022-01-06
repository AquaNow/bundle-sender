//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DET is ERC20 {
    // Dummy ERC20 Token
    constructor() ERC20("Dummy ERC20 Token", "DET") {
        _mint(msg.sender, 1000);
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public override pure returns (bool) {
        revert("no transferFrom allowed!");
    }
}
