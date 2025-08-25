// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Pausable, Ownable, InvalidParameters} from "./Common.sol";
import {ChitGroup} from "./ChitGroup.sol";

contract ChitFundFactory is Pausable {
    struct GlobalSettings {
        uint256 minMembers;
        uint256 maxMembers;
        uint256 minContribution;
        uint256 maxOrganizerFeeBps; // e.g. 1000 = 10%
        address feeTreasury;
    }

    GlobalSettings public settings;
    address public reputationSystem; // optional global reputation system used by groups

    address[] public allGroups;
    mapping(address => bool) public isGroup;
    mapping(address => address[]) public organizerToGroups;

    event GroupCreated(address indexed organizer, address indexed group, address currency, uint256 membersMax);
    event SettingsUpdated(GlobalSettings settings);
    event ReputationSystemUpdated(address indexed reputationSystem);

    constructor() {
        settings = GlobalSettings({
            minMembers: 5,
            maxMembers: 100,
            minContribution: 1,
            maxOrganizerFeeBps: 1000,
            feeTreasury: msg.sender
        });
        emit SettingsUpdated(settings);
    }

    function setGlobalSettings(GlobalSettings calldata s) external onlyOwner {
        if (s.minMembers == 0 || s.maxMembers < s.minMembers) {
            revert InvalidParameters("members bounds");
        }
        if (s.maxOrganizerFeeBps > 2000) {
            // hard cap 20%
            revert InvalidParameters("fee too high");
        }
        if (s.feeTreasury == address(0)) revert InvalidParameters("treasury");
        settings = s;
        emit SettingsUpdated(s);
    }

    function setReputationSystem(address rep) external onlyOwner {
        reputationSystem = rep;
        emit ReputationSystemUpdated(rep);
    }

    function getActiveGroups() external view returns (address[] memory) {
        return allGroups;
    }

    function validateGroupParameters(ChitGroup.Config calldata cfg) public view {
        if (cfg.organizer == address(0)) revert InvalidParameters("organizer");
        if (cfg.membersMax < settings.minMembers || cfg.membersMax > settings.maxMembers) {
            revert InvalidParameters("members range");
        }
        if (cfg.contributionAmount < settings.minContribution) revert InvalidParameters("contribution");
        if (cfg.organizerFeeBps > settings.maxOrganizerFeeBps) revert InvalidParameters("fee bps");
        if (cfg.periodDuration < 1 hours) revert InvalidParameters("period too short");
        if (cfg.biddingCommitDuration < 5 minutes || cfg.biddingRevealDuration < 5 minutes) revert InvalidParameters("bidding windows");
    }

    function createChitGroup(ChitGroup.Config calldata cfg) external whenNotPaused returns (address group) {
        validateGroupParameters(cfg);
        if (cfg.organizer != msg.sender) revert InvalidParameters("only self organize");

        ChitGroup deployed = new ChitGroup(cfg, reputationSystem);
        group = address(deployed);

        isGroup[group] = true;
        allGroups.push(group);
        organizerToGroups[cfg.organizer].push(group);

        emit GroupCreated(cfg.organizer, group, cfg.currency, cfg.membersMax);
    }
} 