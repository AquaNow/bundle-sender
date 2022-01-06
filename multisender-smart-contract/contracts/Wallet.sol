//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract Wallet {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    function batchETHTransfer(
        address payable[] calldata _recipients,
        uint256[] calldata _amounts
    ) public payable {
        // equal lengths of contributers and balances
        require(
            _recipients.length == _amounts.length, 
            "The length of reciepents and amounts arrays do not match!"
            );

        uint256 total = msg.value;
        uint256 i = 0;
        for (i; i < _recipients.length; i++) {
            require(
                total >= _amounts[i],
                "Insufficient total amount provided."
            );
            total = total - _amounts[i];

            // check whether transfer went through
            (bool success, ) = _recipients[i].call{value: _amounts[i]}("");
            require(success, "Transfer failed.");
        }
        // total == 0 at the very end
        require(total == 0, "total fund transfered is more than sum of amounts!");
    }

    // The wallet has to be approved by the owner a priori
    // this smart contract is allowed to transfer for a user's behalf
    function batchERC20Transfer(
        address token_address,
        address[] calldata _recipients,
        uint256[] calldata _amounts
    ) public {
        // equal lengths of contributers and balances
        require(
            _recipients.length == _amounts.length, 
            "The length of reciepents and amounts arrays do not match!"
            );

        IERC20Upgradeable token = IERC20Upgradeable(token_address);

        // min allowance of wallet and the balance of sender
        uint256 total = token.allowance(msg.sender, address(this));
        if (token.balanceOf(msg.sender) < total) {
            total = token.balanceOf(msg.sender);
        }
        uint256 i = 0;
        for (i; i < _recipients.length; i++) {
            require(
                total >= _amounts[i],
                "Insufficient total amount provided."
            );
            total = total - _amounts[i];

            // using OpenZeppelin safeTransferFrom to force revert in case of a failure.
            token.safeTransferFrom(msg.sender, _recipients[i], _amounts[i]);
        }
    }
}
