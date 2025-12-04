// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RewardToken.sol";

contract SimpleBank {
    mapping(address => uint256) private balances;
    RewardToken public rewardToken;
    uint256 public tokenPerEthUnit;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor(address rewardTokenAddress, uint256 _tokenPerEthUnit) {
        rewardToken = RewardToken(rewardTokenAddress);
        tokenPerEthUnit = _tokenPerEthUnit;
    }

    function deposit() external payable {
        require(msg.value > 0, "Must send ETH to deposit");
        balances[msg.sender] += msg.value;
        uint256 tokens = (msg.value * tokenPerEthUnit) / 1e18;
        if (tokens > 0) {
            rewardToken.mint(msg.sender, tokens);
        }
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount > 0 required");
        uint256 bal = balances[msg.sender];
        require(bal >= amount, "Insufficient balance");
        balances[msg.sender] = bal - amount;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
        emit Withdraw(msg.sender, amount);
    }

    function withdrawAll() external {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "No balance");
        balances[msg.sender] = 0;
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
        emit Withdraw(msg.sender, bal);
    }

    function getMyBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
