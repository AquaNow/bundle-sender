pragma solidity ^0.8.0;
import "./SafeMath.sol";

abstract contract ERC20Basic {
    function totalSupply() external view virtual returns (uint256);

    function balanceOf(address who) external view virtual returns (uint256);

    function transfer(address to, uint256 value)
        external
        virtual
        returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
}

abstract contract ERC20 is ERC20Basic {
    function allowance(address owner, address spender)
        external
        view
        virtual
        returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external virtual returns (bool);

    function approve(address spender, uint256 value)
        external
        virtual
        returns (bool);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract WalletContract {
    using SafeMath for uint256;

    function deposit() public payable {}

    function batchTransferFromContract(
        address[] calldata recipients,
        uint256[] calldata values
    ) public {
        for (uint256 i = 0; i < recipients.length; i++) {
            require(address(this).balance >= values[i], "Insufficient funds");

            (bool success, ) = recipients[i].call{value: values[i]}("");
            require(success, "Call failed");
        }
    }

    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    function multisendEther(
        address payable[] calldata _contributors,
        uint256[] calldata _balances
    ) public payable {
        uint256 total = msg.value;
        uint256 i = 0;
        for (i; i < _contributors.length; i++) {
            require(total >= _balances[i]);
            total = total.sub(_balances[i]);
            _contributors[i].transfer(_balances[i]);
        }
    }

    function multisendToken(
        address token,
        address[] calldata _contributors,
        uint256[] calldata _balances
    ) public payable {
        uint256 total = 0;
        ERC20 erc20token = ERC20(token);
        uint8 i = 0;
        for (i; i < _contributors.length; i++) {
            erc20token.transferFrom(msg.sender, _contributors[i], _balances[i]);
            total += _balances[i];
        }
    }
}
