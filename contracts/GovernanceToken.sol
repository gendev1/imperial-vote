// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract GovernanceToken is ERC20, Ownable {
    // set the initial supply to 100,000,000 tokens

    constructor() ERC20("GovernanceToken", "GTK") {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }

    // mint new tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // burn tokens
    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
