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

    struct DelegatorInfo {
        address owner;
        uint256[] nounIds;
    }

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
     * @param initParams Values required for contract setup.
     * @dev This function can only be called once.
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
     * Emergency withdraw all Nouns from a single delegator.
     * @dev This function can only be called by the owner.
     */
    function emergencyWithdrawAll(address delegator) external onlyOwner {
        INounDelegator(delegator).emergencyWithdrawAll();
    }

    /**
     * Create a Noun delegator contract and optionally transfer Nouns to it.
     * @param info Information required to initialize the delegation contract.
     * @dev This function can only be called by the owner.
     */
    function createDelegator(DelegatorInfo memory info) external onlyOwner returns (address delegator) {
        return _createDelegator(info);
    }

    /**
     * Create many Noun delegator contracts and optionally transfer Nouns to them.
     * @param infos Information required to initialize the delegation contracts.
     * @dev This function can only be called by the owner.
     */
    function createDelegators(DelegatorInfo[] memory infos) external onlyOwner returns (address[] memory delegators) {
        for (uint256 i = 0; i < infos.length; i++) {
            delegators[i] = _createDelegator(infos[i]);
        }
    }

    /**
     * Create a Noun delegator contract and optionally transfer Nouns to it.
     * @param info Information required to initialize the delegation contract.
     */
    function _createDelegator(DelegatorInfo memory info) internal returns (address delegator) {
        delegator = Clones.clone(delegatorImplementation);

        INounDelegator(delegator).initialize(info.owner);

        uint256 nounCount = info.nounIds.length;
        for (uint256 i = 0; i < nounCount; i++) {
            bool success = exec(
                address(nouns),
                0,
                abi.encodeWithSignature(TRANSFER_SIGNATURE, avatar, delegator, info.nounIds[i]),
                Enum.Operation.Call
            );
            require(success, 'Failed to transfer Noun to delegator');
        }

        emit DelegatorCreated(delegator);
    }
}
