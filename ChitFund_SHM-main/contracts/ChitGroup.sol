// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Pausable, ReentrancyGuard, InvalidParameters, AlreadyJoined, GroupFull, Unauthorized, IncorrectPhase, TooEarly} from "./Common.sol";
import {IReputationSystem, IERC20} from "./Common.sol";
import {BiddingSystem} from "./BiddingSystem.sol";
import {PaymentManager} from "./PaymentManager.sol";

contract ChitGroup is Pausable, ReentrancyGuard {
    struct Config {
        address organizer;
        address currency; // address(0) for native
        uint256 contributionAmount; // per period per member
        uint256 membersMax;
        uint256 durationPeriods; // number of periods
        uint256 startTime;
        uint256 organizerFeeBps; // 0-1000 (<=10%)
        uint256 securityDeposit; // per member deposit
        uint256 biddingCommitDuration; // seconds
        uint256 biddingRevealDuration; // seconds
        uint256 periodDuration; // seconds per cycle
    }

    enum CycleStatus { NotStarted, Commit, Reveal, Finalized }

    Config public cfg;
    address public reputationSystem;

    address[] public members;
    mapping(address => bool) public isMember;

    uint256 public currentCycle; // 0..duration-1
    mapping(uint256 => address) public cycleWinner;
    mapping(uint256 => BiddingSystem) public cycleBidding;

    PaymentManager public payments;

    event Joined(address indexed member);
    event CycleOpened(uint256 indexed cycle, address bidding);
    event ContributionMade(address indexed member, uint256 indexed cycle, uint256 amount);
    event WinnerSelected(uint256 indexed cycle, address indexed winner, uint256 winningAmount);
    event FundsDistributed(uint256 indexed cycle, address winner, uint256 amountToWinner);

    modifier onlyOrganizer() {
        if (msg.sender != cfg.organizer) revert Unauthorized();
        _;
    }

    modifier onlyMember() {
        if (!isMember[msg.sender]) revert Unauthorized();
        _;
    }

    constructor(Config memory c, address reputationSystem_) {
        if (c.organizer == address(0)) revert InvalidParameters("organizer");
        if (c.membersMax == 0 || c.durationPeriods == 0) revert InvalidParameters("bounds");
        cfg = c;
        reputationSystem = reputationSystem_;
        payments = new PaymentManager(c.currency, address(this));
    }

    function organizer() external view returns (address) { return cfg.organizer; }

    function getMembers() external view returns (address[] memory) { return members; }

    function currentPhase() public view returns (CycleStatus) {
        if (block.timestamp < cfg.startTime) return CycleStatus.NotStarted;
        uint256 cycleStart = cfg.startTime + currentCycle * cfg.periodDuration;
        uint256 commitEnd = cycleStart + cfg.biddingCommitDuration;
        uint256 revealEnd = commitEnd + cfg.biddingRevealDuration;
        if (block.timestamp <= commitEnd) return CycleStatus.Commit;
        if (block.timestamp <= revealEnd) return CycleStatus.Reveal;
        return CycleStatus.Finalized;
    }

    function joinGroup() external payable whenNotPaused {
        if (isMember[msg.sender]) revert AlreadyJoined();
        if (members.length >= cfg.membersMax) revert GroupFull();
        if (cfg.securityDeposit > 0) {
            if (cfg.currency == address(0)) {
                if (msg.value != cfg.securityDeposit) revert InvalidParameters("deposit native");
            } else {
                if (msg.value != 0) revert InvalidParameters("deposit erc20");
                bool ok = IERC20(cfg.currency).transferFrom(msg.sender, address(this), cfg.securityDeposit);
                if (!ok) revert InvalidParameters("deposit transfer");
            }
        }
        isMember[msg.sender] = true;
        members.push(msg.sender);
        emit Joined(msg.sender);
    }

    function openCycle(uint256 cycle) external onlyOrganizer whenNotPaused {
        if (cycle != currentCycle) revert InvalidParameters("cycle idx");
        if (block.timestamp < cfg.startTime + cycle * cfg.periodDuration) revert TooEarly();
        if (address(cycleBidding[cycle]) != address(0)) revert InvalidParameters("already opened");
        BiddingSystem bs = new BiddingSystem(cfg.biddingCommitDuration, cfg.biddingRevealDuration, address(this));
        cycleBidding[cycle] = bs;
        emit CycleOpened(cycle, address(bs));
    }

    function commitBid(bytes32 commitHash) external onlyMember {
        BiddingSystem bs = cycleBidding[currentCycle];
        if (address(bs) == address(0)) revert InvalidParameters("no cycle");
        bs.commitBid(commitHash);
    }

    function revealBid(uint256 amount, bytes32 salt) external onlyMember {
        BiddingSystem bs = cycleBidding[currentCycle];
        if (address(bs) == address(0)) revert InvalidParameters("no cycle");
        bs.revealBid(amount, salt);
    }

    function finalizeBidding() external onlyOrganizer {
        BiddingSystem bs = cycleBidding[currentCycle];
        if (address(bs) == address(0)) revert InvalidParameters("no cycle");
        (address win, uint256 winningAmount) = bs.finalize();
        cycleWinner[currentCycle] = win;
        if (reputationSystem != address(0) && win != address(0)) {
            IReputationSystem(reputationSystem).updateOnWinningBid(win, winningAmount);
        }
        emit WinnerSelected(currentCycle, win, winningAmount);
    }

    function makeContribution(uint256 amount) external payable onlyMember whenNotPaused {
        uint256 cycle = currentCycle;
        payments.contribute{value: msg.value}(cycle, amount);
        bool onTime = currentPhase() != CycleStatus.Finalized;
        if (reputationSystem != address(0)) {
            IReputationSystem(reputationSystem).updateOnContribution(msg.sender, amount, onTime);
        }
        emit ContributionMade(msg.sender, cycle, amount);
    }

    function distributeFunds() external onlyOrganizer nonReentrant {
        uint256 cycle = currentCycle;
        address win = cycleWinner[cycle];
        if (win == address(0)) revert InvalidParameters("no winner");
        uint256 total = payments.totalCollectedByCycle(cycle);
        uint256 fee = (total * cfg.organizerFeeBps) / 10_000;
        uint256 toWinner = total - fee;
        payments.payout(cycle, win, toWinner);
        if (fee > 0) {
            payments.payout(cycle, cfg.organizer, fee);
        }
        emit FundsDistributed(cycle, win, toWinner);
        currentCycle += 1;
    }
} 