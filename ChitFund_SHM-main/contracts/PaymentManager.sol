// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20, ReentrancyGuard, TransferFailed, InvalidParameters} from "./Common.sol";

contract PaymentManager is ReentrancyGuard {
    address public immutable group; // parent ChitGroup
    address public immutable currency; // 0 for native

    mapping(uint256 => mapping(address => uint256)) public paidAmountByCycle; // cycle => member => amount
    mapping(uint256 => uint256) public totalCollectedByCycle;

    event Contribution(address indexed payer, uint256 indexed cycle, uint256 amount);
    event Payout(address indexed to, uint256 indexed cycle, uint256 amount);

    modifier onlyGroup() {
        if (msg.sender != group) revert InvalidParameters("not group");
        _;
    }

    constructor(address currency_, address group_) {
        currency = currency_;
        group = group_;
    }

    function contribute(uint256 cycle, uint256 amount) external payable nonReentrant {
        if (currency == address(0)) {
            if (msg.value != amount) revert InvalidParameters("native amount");
        } else {
            if (msg.value != 0) revert InvalidParameters("erc20 not native");
            bool ok = IERC20(currency).transferFrom(msg.sender, address(this), amount);
            if (!ok) revert TransferFailed();
        }
        paidAmountByCycle[cycle][msg.sender] += amount;
        totalCollectedByCycle[cycle] += amount;
        emit Contribution(msg.sender, cycle, amount);
    }

    function payout(uint256 cycle, address to, uint256 amount) external onlyGroup nonReentrant {
        if (currency == address(0)) {
            (bool s, ) = to.call{value: amount}("");
            if (!s) revert TransferFailed();
        } else {
            bool ok = IERC20(currency).transfer(to, amount);
            if (!ok) revert TransferFailed();
        }
        emit Payout(to, cycle, amount);
    }

    function sweep(address to, uint256 amount) external onlyGroup nonReentrant {
        if (currency == address(0)) {
            (bool s, ) = to.call{value: amount}("");
            if (!s) revert TransferFailed();
        } else {
            bool ok = IERC20(currency).transfer(to, amount);
            if (!ok) revert TransferFailed();
        }
    }

    receive() external payable {}
} 