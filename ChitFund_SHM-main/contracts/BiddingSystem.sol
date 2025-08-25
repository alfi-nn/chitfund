// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard, IncorrectPhase, TooEarly, TooLate, InvalidParameters} from "./Common.sol";

/// @title Commit-reveal lowest-bid auction for discount bidding
contract BiddingSystem is ReentrancyGuard {
    enum Phase { Commit, Reveal, Finished }

    struct Bid {
        bytes32 commitHash; // keccak256(abi.encode(amount, salt))
        uint256 revealedAmount;
        bool revealed;
    }

    uint256 public commitEnd;
    uint256 public revealEnd;
    address public immutable group; // parent ChitGroup

    mapping(address => Bid) public bids;
    address[] public bidders;

    address public winner;
    uint256 public winningAmount; // lowest revealed valid bid

    event BidCommitted(address indexed bidder);
    event BidRevealed(address indexed bidder, uint256 amount);
    event WinnerSelected(address indexed winner, uint256 amount);

    modifier onlyGroup() {
        if (msg.sender != group) revert InvalidParameters("not group");
        _;
    }

    constructor(uint256 commitDuration, uint256 revealDuration, address groupAddress) {
        if (commitDuration == 0 || revealDuration == 0) revert InvalidParameters("dur");
        commitEnd = block.timestamp + commitDuration;
        revealEnd = commitEnd + revealDuration;
        group = groupAddress;
    }

    function phase() public view returns (Phase) {
        if (block.timestamp <= commitEnd) return Phase.Commit;
        if (block.timestamp <= revealEnd) return Phase.Reveal;
        return Phase.Finished;
    }

    function commitBid(bytes32 commitHash) external {
        if (phase() != Phase.Commit) revert IncorrectPhase();
        Bid storage b = bids[msg.sender];
        if (b.commitHash != bytes32(0)) revert InvalidParameters("already committed");
        b.commitHash = commitHash;
        bidders.push(msg.sender);
        emit BidCommitted(msg.sender);
    }

    function revealBid(uint256 amount, bytes32 salt) external {
        if (phase() != Phase.Reveal) revert IncorrectPhase();
        Bid storage b = bids[msg.sender];
        if (b.commitHash == bytes32(0)) revert InvalidParameters("no commit");
        if (b.revealed) revert InvalidParameters("already revealed");
        if (keccak256(abi.encode(amount, salt)) != b.commitHash) revert InvalidParameters("hash mismatch");
        b.revealed = true;
        b.revealedAmount = amount;
        if (winner == address(0) || amount < winningAmount) {
            winner = msg.sender;
            winningAmount = amount;
        }
        emit BidRevealed(msg.sender, amount);
    }

    function finalize() external onlyGroup returns (address, uint256) {
        if (phase() != Phase.Finished) revert TooEarly();
        emit WinnerSelected(winner, winningAmount);
        return (winner, winningAmount);
    }
} 