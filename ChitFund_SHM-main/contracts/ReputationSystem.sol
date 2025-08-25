// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable, InvalidParameters} from "./Common.sol";

contract ReputationSystem is Ownable {
    mapping(address => uint256) private _scores; // 0..100
    mapping(address => bool) public authorizedUpdater; // ChitGroup addresses

    event UpdaterSet(address updater, bool allowed);
    event ReputationUpdated(address indexed user, uint256 newScore, string reason);

    modifier onlyUpdater() {
        if (!authorizedUpdater[msg.sender]) revert InvalidParameters("not updater");
        _;
    }

    function setUpdater(address updater, bool allowed) external onlyOwner {
        authorizedUpdater[updater] = allowed;
        emit UpdaterSet(updater, allowed);
    }

    function getReputation(address user) external view returns (uint256) {
        return _scores[user];
    }

    function updateOnContribution(address user, uint256 /*amount*/, bool onTime) external onlyUpdater {
        uint256 s = _scores[user];
        if (onTime) {
            s = s + 2;
        } else {
            s = s > 1 ? s - 1 : 0;
        }
        _scores[user] = _capScore(s);
        emit ReputationUpdated(user, _scores[user], onTime ? "onTime" : "late");
    }

    function updateOnDefault(address user) external onlyUpdater {
        uint256 s = _scores[user];
        s = s > 5 ? s - 5 : 0;
        _scores[user] = _capScore(s);
        emit ReputationUpdated(user, _scores[user], "default");
    }

    function updateOnWinningBid(address user, uint256 /*discount*/) external onlyUpdater {
        uint256 s = _scores[user] + 1;
        _scores[user] = _capScore(s);
        emit ReputationUpdated(user, _scores[user], "win");
    }

    function _capScore(uint256 s) internal pure returns (uint256) {
        if (s > 100) return 100;
        return s;
    }
} 