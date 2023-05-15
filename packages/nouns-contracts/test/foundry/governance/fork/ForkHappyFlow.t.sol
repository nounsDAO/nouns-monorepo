// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { DeployUtilsV3 } from '../../helpers/DeployUtilsV3.sol';
import { NounsDAOLogicV3 } from '../../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsToken } from '../../../../contracts/NounsToken.sol';
import { NounsTokenFork } from '../../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsDAOExecutorV2 } from '../../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOLogicV1Fork } from '../../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';

contract ForkHappyFlowTest is DeployUtilsV3 {
    address minter;
    NounsDAOLogicV3 daoV3;
    NounsToken ogToken;
    NounsTokenFork forkToken;
    NounsDAOExecutorV2 forkTreasury;
    NounsDAOLogicV1Fork forkDAO;

    address nounerInEscrow1 = makeAddr('nouner in escrow 1');
    address nounerInEscrow2 = makeAddr('nouner in escrow 2');
    address nounerForkJoiner1 = makeAddr('nouner fork joiner 1');
    address nounerForkJoiner2 = makeAddr('nouner fork joiner 2');
    address nounerNoFork1 = makeAddr('nouner no fork 1');
    address nounerNoFork2 = makeAddr('nouner no fork 2');

    function test_forkHappyFlow() public {
        daoV3 = _deployDAOV3();
        ogToken = NounsToken(address(daoV3.nouns()));
        minter = ogToken.minter();
        dealNouns();
        // Sending the DAO ETH that will be sent to the fork treasury and a key assertion for this test.
        vm.deal(address(daoV3.timelock()), 24 ether);

        uint256[] memory tokensInEscrow1 = getOwnedTokens(nounerInEscrow1);
        uint256[] memory tokensInEscrow2 = getOwnedTokens(nounerInEscrow2);

        // Two Nouner accounts sigaling they want to fork. Their combined tokens meet the forking threshold.
        escrowToFork(nounerInEscrow1);
        escrowToFork(nounerInEscrow2);

        // Execute the fork and get contract addresses for DAO, treasury and token.
        (address forkTreasuryAddress, address forkTokenAddress) = daoV3.executeFork();
        forkTreasury = NounsDAOExecutorV2(payable(forkTreasuryAddress));
        forkToken = NounsTokenFork(forkTokenAddress);
        forkDAO = NounsDAOLogicV1Fork(forkTreasury.admin());

        // Assert the fork treasury has the expected balance, which is the pro rata ETH of the two Nouner accounts that
        // escrowed above. They have 4 Nouns out of a total supply of 12, so a third. DAO balance was 24 ETH, a third
        // of that is 8 ETH.
        assertEqUint(forkTreasuryAddress.balance, 8 ether);

        // Asserting that delayed governance is working - no one should be able to propose until all fork tokens have
        // been claimed, or until the delay period expires.
        // Later in this test we make sure we CAN propose once all tokens have been claimed.
        vm.expectRevert(abi.encodeWithSelector(NounsDAOLogicV1Fork.WaitingForTokensToClaimOrExpiration.selector));
        proposeToFork(makeAddr('target'), 0, 'signature', 'data');

        // Two additional Nouners join the fork during the forking period.
        // This should grow the ETH balance sent from OG DAO to fork DAO.
        joinFork(nounerForkJoiner1);
        joinFork(nounerForkJoiner2);

        // Asserting the expected ETH amount was sent. We're now at two thirds of OG Nouns forking, so we expect
        // two thirds of the ETH to be sent, which is 16 out of the original 24.
        assertEqUint(forkTreasuryAddress.balance, 16 ether);

        // This Nouner is going to vanilla-ragequit soon, so making it explicit their ETH balance is zero before
        // so the next balance assertion is clearly new ETH they received from quitting the fork DAO.
        assertEqUint(nounerInEscrow1.balance, 0);

        // The Nouners that originally escrowed their Nouns, now claiming their new fork tokens.
        vm.prank(nounerInEscrow1);
        forkToken.claimFromEscrow(tokensInEscrow1);
        vm.prank(nounerInEscrow2);
        forkToken.claimFromEscrow(tokensInEscrow2);
        vm.roll(block.number + 1);

        // Demonstrating we're able to submit a proposal now that all claimable tokens have been claimed.
        vm.startPrank(nounerInEscrow1);
        proposeToFork(makeAddr('target'), 0, 'signature', 'data');

        // This Nouner executes quit, and we assert they received the expected ETH; it's a quarter of the fork
        // DAO balance (4 Nouners with equal token balances, 1 quits), so 4 ETH of the 16 ETH balance.
        forkToken.setApprovalForAll(address(forkDAO), true);
        forkDAO.quit(tokensInEscrow1);
        assertEqUint(nounerInEscrow1.balance, 4 ether);
    }

    function dealNouns() internal {
        address nounders = ogToken.noundersDAO();
        vm.startPrank(minter);
        for (uint256 i = 0; i < 10; i++) {
            ogToken.mint();
        }

        changePrank(nounders);
        ogToken.transferFrom(nounders, nounerInEscrow1, 0);

        changePrank(minter);
        ogToken.transferFrom(minter, nounerInEscrow1, 1);
        ogToken.transferFrom(minter, nounerInEscrow2, 2);
        ogToken.transferFrom(minter, nounerInEscrow2, 3);
        ogToken.transferFrom(minter, nounerForkJoiner1, 4);
        ogToken.transferFrom(minter, nounerForkJoiner1, 5);
        ogToken.transferFrom(minter, nounerForkJoiner2, 6);
        ogToken.transferFrom(minter, nounerForkJoiner2, 7);
        ogToken.transferFrom(minter, nounerNoFork1, 8);
        ogToken.transferFrom(minter, nounerNoFork1, 9);

        changePrank(nounders);
        ogToken.transferFrom(nounders, nounerNoFork2, 10);

        changePrank(minter);
        ogToken.transferFrom(minter, nounerNoFork2, 11);

        vm.stopPrank();
    }

    function escrowToFork(address nouner) internal {
        vm.startPrank(nouner);
        ogToken.setApprovalForAll(address(daoV3), true);
        daoV3.escrowToFork(getOwnedTokens(nouner), new uint256[](0), '');
        vm.stopPrank();
    }

    function joinFork(address nouner) internal {
        vm.startPrank(nouner);
        ogToken.setApprovalForAll(address(daoV3), true);
        daoV3.joinFork(getOwnedTokens(nouner));
        vm.stopPrank();
    }

    function getOwnedTokens(address nouner) internal view returns (uint256[] memory tokenIds) {
        uint256 balance = ogToken.balanceOf(nouner);
        tokenIds = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = ogToken.tokenOfOwnerByIndex(nouner, i);
        }
    }

    function proposeToFork(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal returns (uint256 proposalId) {
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        proposalId = forkDAO.propose(targets, values, signatures, calldatas, 'my proposal');
    }
}
