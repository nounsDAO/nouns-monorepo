// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV2 } from '../../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOProxy } from '../../../contracts/governance/NounsDAOProxy.sol';
import { NounsDAOProxyV2 } from '../../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDescriptorV2 } from '../../../contracts/NounsDescriptorV2.sol';
import { DeployUtilsFork } from './DeployUtilsFork.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsSeeder } from '../../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDAOExecutor } from '../../../contracts/governance/NounsDAOExecutor.sol';
import { INounsTokenForkLike } from '../../../contracts/governance/fork/newdao/governance/INounsTokenForkLike.sol';
import { Utils } from './Utils.sol';

abstract contract NounsDAOLogicSharedBaseTest is Test, DeployUtilsFork {
    NounsDAOLogicV1 daoProxy;
    NounsToken nounsToken;
    NounsDAOExecutor timelock = new NounsDAOExecutor(address(1), TIMELOCK_DELAY);
    address vetoer = address(0x3);
    address admin = address(0x4);
    address noundersDAO = address(0x5);
    address minter = address(0x6);
    address proposer = address(0x7);
    uint256 votingPeriod = 7200;
    uint256 votingDelay = 1;
    uint256 proposalThresholdBPS = 200;
    Utils utils;

    function setUp() public virtual {
        NounsDescriptorV2 descriptor = _deployAndPopulateV2();
        nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), IProxyRegistry(address(0)));

        daoProxy = deployDAOProxy(address(timelock), address(nounsToken), vetoer);

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(daoProxy));
        vm.prank(address(daoProxy));
        timelock.acceptAdmin();

        utils = new Utils();
    }

    function deployDAOProxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal virtual returns (NounsDAOLogicV1);

    function daoVersion() internal virtual returns (uint256) {
        return 0; // override to specify version
    }

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
            uint256 tokenId = nounsToken.mint();
            nounsToken.transferFrom(minter, to, tokenId);
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

    function daoProxyAsV2() internal view returns (NounsDAOLogicV2) {
        return NounsDAOLogicV2(payable(address(daoProxy)));
    }

    function deployForkDAOProxy() internal returns (NounsDAOLogicV1) {
        (address treasuryAddress, address tokenAddress, address daoAddress) = _deployForkDAO();
        timelock = NounsDAOExecutor(payable(treasuryAddress));
        nounsToken = NounsToken(tokenAddress);
        minter = nounsToken.minter();

        NounsDAOLogicV1 dao = NounsDAOLogicV1(daoAddress);

        vm.startPrank(address(dao.timelock()));
        dao._setVotingPeriod(votingPeriod);
        dao._setVotingDelay(votingDelay);
        dao._setProposalThresholdBPS(proposalThresholdBPS);
        dao._setQuorumVotesBPS(1000);
        vm.stopPrank();

        vm.warp(INounsTokenForkLike(tokenAddress).forkingPeriodEndTimestamp());

        return NounsDAOLogicV1(daoAddress);
    }
}
