// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { NounDelegatorFactoryModuleLike } from './interfaces/NounDelegatorFactoryModuleLike.sol';
import { INounDelegator } from './interfaces/INounDelegator.sol';
import { NounsTokenLike } from './interfaces/NounsTokenLike.sol';

contract NounDelegator is OwnableUpgradeable, INounDelegator {
    // The Noun delegator factory module instance
    NounDelegatorFactoryModuleLike public factory;

    /**
     * Initialize this contract by setting the factory address
     */
    function initialize(address _owner) external override {
        require(address(factory) == address(0), 'Already initialized');
        factory = NounDelegatorFactoryModuleLike(msg.sender);

        __Ownable_init();

        transferOwnership(_owner);
    }

    /**
     * @notice Delegate votes from `msg.sender` to `delegatee`
     * @param delegatee The address to delegate votes to
     */
    function delegate(address delegatee) external onlyOwner {
        factory.nouns().delegate(delegatee);
    }

    /**
     * Withdraw a single Noun from this contract to the Gnosis Safe
     * @param nounId The ID of he noun with withdraw
     */
    function withdraw(uint256 nounId) external onlyOwner {
        factory.nouns().transferFrom(address(this), factory.avatar(), nounId);
    }

    /**
     * Withdraw all Nouns from this contract to the Gnosis Safe
     */
    function withdrawAll() external onlyOwner {
        NounsTokenLike nouns = factory.nouns();
        address avatar = factory.avatar();
        uint256 balance = nouns.balanceOf(address(this));

        for (uint256 i = 0; i < balance; i++) {
            nouns.transferFrom(address(this), avatar, nouns.tokenOfOwnerByIndex(address(this), i));
        }
    }
}
