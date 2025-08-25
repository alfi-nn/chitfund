// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Common types, interfaces, and modifiers for the ChitFund protocol
/// @notice Shared definitions to be imported by all contracts in the system
library Roles {
    bytes32 internal constant ROLE_ORGANIZER = keccak256("ROLE_ORGANIZER");
    bytes32 internal constant ROLE_PARTICIPANT = keccak256("ROLE_PARTICIPANT");
    bytes32 internal constant ROLE_GUARANTOR = keccak256("ROLE_GUARANTOR");
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IReputationSystem {
    function getReputation(address user) external view returns (uint256);
    function updateOnContribution(address user, uint256 amount, bool onTime) external;
    function updateOnDefault(address user) external;
    function updateOnWinningBid(address user, uint256 discount) external;
}

interface IChitGroupLike {
    function organizer() external view returns (address);
}

/// @dev Custom errors
error Unauthorized();
error InvalidParameters(string reason);
error AlreadyExists();
error NotFound();
error NotActive();
error AlreadyJoined();
error GroupFull();
error IncorrectPhase();
error TransferFailed();
error NotEnoughStake();
error TooEarly();
error TooLate();

/// @dev Reentrancy guard (lightweight)
abstract contract ReentrancyGuard {
    uint256 private _locked;

    modifier nonReentrant() {
        if (_locked == 1) revert Unauthorized();
        _locked = 1;
        _;
        _locked = 0;
    }
}

/// @dev Access control with simple owner/admin
abstract contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidParameters("zero owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/// @dev Pausable circuit breaker
abstract contract Pausable is Ownable {
    bool public paused;
    event Paused(address indexed by);
    event Unpaused(address indexed by);

    modifier whenNotPaused() {
        if (paused) revert NotActive();
        _;
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }
} 