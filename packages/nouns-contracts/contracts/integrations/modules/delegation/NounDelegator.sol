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
     * @notice Require that the sender is the factory.
     */
    modifier onlyFactory() {
        require(msg.sender == address(factory), 'Sender is not the factory');
        _;
    }

    /**
     * Initialize this contract by setting the factory address.
     * @dev This function can only be called once.
     */
    function initialize(address _owner) external override {
        factory = NounDelegatorFactoryModuleLike(msg.sender);

        __Ownable_init();

        transferOwnership(_owner);
    }

    /**
     * @notice Delegate votes from `msg.sender` to `delegatee`.
     * @param delegatee The address to delegate votes to.
     * @dev This function can only be called by the owner.
     */
    function delegate(address delegatee) external onlyOwner {
        factory.nouns().delegate(delegatee);
    }

    /**
     * Withdraw a single Noun from this contract to the Gnosis Safe.
     * @param nounId The ID of he noun with withdraw.
     * @dev This function can only be called by the owner.
     */
    function withdraw(uint256 nounId) external onlyOwner {
        factory.nouns().transferFrom(address(this), factory.avatar(), nounId);
    }

    /**
     * Withdraw all Nouns from this contract to the Gnosis Safe.
     * @dev This function can only be called by the owner.
     */
    function withdrawAll() external onlyOwner {
        _withdrawAll();
    }

    /**
     * Withdraw all Nouns from this contract to the Gnosis Safe.
     * @dev This function can only be called by the factory.
     */
    function emergencyWithdrawAll() external override onlyFactory {
        _withdrawAll();
    }

    /**
     * Withdraw all Nouns from this contract to the Gnosis Safe.
     */
    function _withdrawAll() internal {
        NounsTokenLike nouns = factory.nouns();
        address safe = factory.avatar();
        uint256 balance = nouns.balanceOf(address(this));

        for (uint256 i = 0; i < balance; i++) {
            nouns.transferFrom(address(this), safe, nouns.tokenOfOwnerByIndex(address(this), i));
        }
    }
}
