// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import { Clones } from '@openzeppelin/contracts/proxy/Clones.sol';
import { Module } from '@gnosis.pm/zodiac/contracts/core/Module.sol';
import { Enum } from '@gnosis.pm/safe-contracts/contracts/common/Enum.sol';
import { INounDelegator } from './interfaces/INounDelegator.sol';
import { NounsTokenLike } from './interfaces/NounsTokenLike.sol';

contract NounDelegatorFactoryModule is Module {
    event NounDelegatorFactoryModuleSetup(address indexed initiator, address indexed avatar);
    event DelegatorCreated(address delegator);

    // The ERC721 transfer function signature
    string constant TRANSFER_SIGNATURE = 'transferFrom(address,address,uint256)';

    // The Nouns token contract instance
    NounsTokenLike public immutable nouns;

    // The Noun delegator implementation
    address public immutable delegatorImplementation;

    // All existing Noun delegators
    address[] public delegators;

    constructor(
        address _owner,
        address _avatar,
        address _target,
        address _nouns,
        address _delegatorImplementation
    ) {
        nouns = NounsTokenLike(_nouns);
        delegatorImplementation = _delegatorImplementation;

        bytes memory initParams = abi.encode(_owner, _avatar, _target);
        setUp(initParams);
    }

    /**
     * Set up the module by setting the owner, avatar, target, nouns, and delegator
     * implementation contracts.
     * @param initParams Values required for contract setup
     */
    function setUp(bytes memory initParams) public override {
        (address _owner, address _avatar, address _target) = abi.decode(initParams, (address, address, address));
        __Ownable_init();

        avatar = _avatar;
        target = _target;

        transferOwnership(_owner);

        emit NounDelegatorFactoryModuleSetup(msg.sender, _avatar);
    }

    /**
     * Create a new Noun delegator contract and optionally transfers Nouns to it
     * @param owner The desired owner of the delegator contract
     * @param nounIds The IDs of the Nouns to transfer to the delegator
     */
    function createDelegator(address owner, uint256[] memory nounIds) external onlyOwner returns (address delegator) {
        delegator = Clones.clone(delegatorImplementation);

        INounDelegator(delegator).initialize(owner);

        for (uint256 i = 0; i < nounIds.length; i++) {
            bool success = exec(
                address(nouns),
                0,
                abi.encodeWithSignature(TRANSFER_SIGNATURE, avatar, delegator, nounIds[i]),
                Enum.Operation.Call
            );
            require(success, 'Failed to transfer Noun to delegator');
        }

        emit DelegatorCreated(delegator);
        return delegator;
    }
}
