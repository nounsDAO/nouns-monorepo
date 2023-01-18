// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { N00unsDAOLogicV1 } from '../../../contracts/governance/N00unsDAOLogicV1.sol';
import { N00unsDAOLogicV2 } from '../../../contracts/governance/N00unsDAOLogicV2.sol';
import { N00unsDAOProxy } from '../../../contracts/governance/N00unsDAOProxy.sol';
import { N00unsDAOProxyV2 } from '../../../contracts/governance/N00unsDAOProxyV2.sol';
import { N00unsDescriptorV2 } from '../../../contracts/N00unsDescriptorV2.sol';
import { DeployUtils } from './DeployUtils.sol';
import { N00unsToken } from '../../../contracts/N00unsToken.sol';
import { N00unsSeeder } from '../../../contracts/N00unsSeeder.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { N00unsDAOExecutor } from '../../../contracts/governance/N00unsDAOExecutor.sol';
import { Utils } from './Utils.sol';

abstract contract N00unsDAOLogicSharedBaseTest is Test, DeployUtils {
    N00unsDAOLogicV1 daoProxy;
    N00unsToken n00unsToken;
    N00unsDAOExecutor timelock = new N00unsDAOExecutor(address(1), TIMELOCK_DELAY);
    address vetoer = address(0x3);
    address admin = address(0x4);
    address n00undersDAO = address(0x5);
    address minter = address(0x6);
    address proposer = address(0x7);
    uint256 votingPeriod = 6000;
    uint256 votingDelay = 1;
    uint256 proposalThresholdBPS = 200;
    Utils utils;

    function setUp() public virtual {
        N00unsDescriptorV2 descriptor = _deployAndPopulateV2();
        n00unsToken = new N00unsToken(n00undersDAO, minter, descriptor, new N00unsSeeder(), IProxyRegistry(address(0)));

        daoProxy = deployDAOProxy();

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(daoProxy));
        vm.prank(address(daoProxy));
        timelock.acceptAdmin();

        utils = new Utils();
    }

    function deployDAOProxy() internal virtual returns (N00unsDAOLogicV1);

    function daoVersion() internal virtual returns (uint256);

    function propose(
        address _proposer,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal returns (uint256 proposalId) {
        vm.prank(_proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        proposalId = daoProxy.propose(targets, values, signatures, calldatas, 'my proposal');
    }

    function propose(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal returns (uint256 proposalId) {
        return propose(proposer, target, value, signature, data);
    }

    function mint(address to, uint256 amount) internal {
        vm.startPrank(minter);
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = n00unsToken.mint();
            n00unsToken.transferFrom(minter, to, tokenId);
        }
        vm.stopPrank();
        vm.roll(block.number + 1);
    }

    function startVotingPeriod() internal {
        vm.roll(block.number + daoProxy.votingDelay() + 1);
    }

    function endVotingPeriod() internal {
        vm.roll(block.number + daoProxy.votingDelay() + daoProxy.votingPeriod() + 1);
    }

    function vote(
        address voter,
        uint256 proposalId,
        uint8 support
    ) internal {
        vm.prank(voter);
        daoProxy.castVote(proposalId, support);
    }

    function daoProxyAsV2() internal view returns (N00unsDAOLogicV2) {
        return N00unsDAOLogicV2(payable(address(daoProxy)));
    }
}
