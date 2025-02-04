// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MuffledTokenMinter is Ownable {
    IERC20 public muffledToken;
    address public feeReceiver;
    uint256 public constant PLAY_FEE = 0.5 ether; // 0.5 MON
    uint256 public constant TAX_PERCENT = 3; // 3% tax
    uint256 public lastWithdrawalTime;
    uint256 public constant WITHDRAWAL_DELAY = 1 days;

    mapping(address => uint256) public lastPlayBlock;

    event TokensMinted(address indexed user, uint256 amount);
    event GamePlayed(address indexed user, uint256 feePaid);
    event TokensDeposited(address indexed owner, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event TokensWithdrawn(address indexed owner, uint256 amount);

  constructor(address _muffledToken, address _feeReceiver) Ownable() {
    require(_muffledToken != address(0), "Invalid token address");
    require(_feeReceiver != address(0), "Invalid fee receiver");
    muffledToken = IERC20(_muffledToken);
    feeReceiver = _feeReceiver;
}

    // Deposit Muffled Tokens into the contract
    function depositTokens(uint256 amount) external onlyOwner {
        require(muffledToken.transferFrom(msg.sender, address(this), amount), "Deposit failed");
        emit TokensDeposited(msg.sender, amount);
    }

    // Mint Muffled Tokens from the contract with a 3% tax
    function mintTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        uint256 tax = (amount * TAX_PERCENT) / 100;
        uint256 finalAmount = amount - tax;

        require(muffledToken.balanceOf(address(this)) >= amount, "Not enough tokens in contract");

        // Transfer tax first to prevent issues
        require(muffledToken.transfer(feeReceiver, tax), "Tax transfer failed");
        // Transfer the remaining tokens to the user
        require(muffledToken.transfer(msg.sender, finalAmount), "Minting failed");

        emit TokensMinted(msg.sender, finalAmount);
    }

    // User must pay 0.5 MON to play
    function payToPlay() external payable {
        require(msg.value == PLAY_FEE, "Incorrect play fee");
        require(block.number > lastPlayBlock[msg.sender], "Only one play per block");

        lastPlayBlock[msg.sender] = block.number;
        payable(feeReceiver).transfer(msg.value);

        emit GamePlayed(msg.sender, msg.value);
    }

    // Withdraw collected MON from contract (Owner only) with cooldown
    function withdrawFunds() external onlyOwner {
        require(block.timestamp >= lastWithdrawalTime + WITHDRAWAL_DELAY, "Withdrawal cooldown active");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        payable(owner()).transfer(balance);
        lastWithdrawalTime = block.timestamp;

        emit FundsWithdrawn(owner(), balance);
    }

    // Withdraw unused Muffled Tokens (Owner only) with cooldown
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(block.timestamp >= lastWithdrawalTime + WITHDRAWAL_DELAY, "Withdrawal cooldown active");
        require(muffledToken.balanceOf(address(this)) >= amount, "Insufficient token balance");

        require(muffledToken.transfer(owner(), amount), "Withdrawal failed");
        lastWithdrawalTime = block.timestamp;

        emit TokensWithdrawn(owner(), amount);
    }

    // Fallback function to receive MON
    receive() external payable {}
}
