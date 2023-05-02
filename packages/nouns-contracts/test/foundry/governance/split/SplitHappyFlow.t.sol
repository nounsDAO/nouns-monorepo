// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { DeployUtils } from '../../helpers/DeployUtils.sol';
import { NounsDAOLogicV3 } from '../../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsToken } from '../../../../contracts/NounsToken.sol';
import { NounsTokenFork } from '../../../../contracts/governance/split/newdao/token/NounsTokenFork.sol';
import { NounsDAOExecutorV2 } from '../../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOLogicV1Fork } from '../../../../contracts/governance/split/newdao/governance/NounsDAOLogicV1Fork.sol';

contract SplitHappyFlowTest is DeployUtils {
    address minter;
    NounsDAOLogicV3 daoV3;
    NounsToken ogToken;
    NounsTokenFork forkToken;
    NounsDAOExecutorV2 forkTreasury;
    NounsDAOLogicV1Fork forkDAO;

    address nounerInEscrow1 = makeAddr('nouner in escrow 1');
    address nounerInEscrow2 = makeAddr('nouner in escrow 2');
    address nounerSplitJoiner1 = makeAddr('nouner split joiner 1');
    address nounerSplitJoiner2 = makeAddr('nouner split joiner 2');
    address nounerNoSplit1 = makeAddr('nouner no split 1');
    address nounerNoSplit2 = makeAddr('nouner no split 2');

    function test_splitHappyFlow() public {
        daoV3 = _deployDAOV3();
        ogToken = NounsToken(address(daoV3.nouns()));
        minter = ogToken.minter();
        dealNouns();
        vm.deal(address(daoV3.timelock()), 24 ether);

        uint256[] memory tokensInEscrow1 = getOwnedTokens(nounerInEscrow1);
        uint256[] memory tokensInEscrow2 = getOwnedTokens(nounerInEscrow2);

        signalSplit(nounerInEscrow1);
        signalSplit(nounerInEscrow2);

        (address forkTreasuryAddress, address forkTokenAddress) = daoV3.executeSplit();
        forkTreasury = NounsDAOExecutorV2(payable(forkTreasuryAddress));
        forkToken = NounsTokenFork(forkTokenAddress);
        forkDAO = NounsDAOLogicV1Fork(forkTreasury.admin());

        assertEqUint(forkTreasuryAddress.balance, 8 ether);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOLogicV1Fork.WaitingForTokensToClaimOrExpiration.selector));
        proposeToFork(makeAddr('target'), 0, 'signature', 'data');

        joinSplit(nounerSplitJoiner1);
        joinSplit(nounerSplitJoiner2);

        assertEqUint(forkTreasuryAddress.balance, 16 ether);

        assertEqUint(nounerInEscrow1.balance, 0);

        vm.prank(nounerInEscrow1);
        forkToken.claimFromEscrow(tokensInEscrow1);
        vm.prank(nounerInEscrow2);
        forkToken.claimFromEscrow(tokensInEscrow2);
        vm.roll(block.number + 1);

        vm.startPrank(nounerInEscrow1);
        proposeToFork(makeAddr('target'), 0, 'signature', 'data');

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
        ogToken.transferFrom(minter, nounerSplitJoiner1, 4);
        ogToken.transferFrom(minter, nounerSplitJoiner1, 5);
        ogToken.transferFrom(minter, nounerSplitJoiner2, 6);
        ogToken.transferFrom(minter, nounerSplitJoiner2, 7);
        ogToken.transferFrom(minter, nounerNoSplit1, 8);
        ogToken.transferFrom(minter, nounerNoSplit1, 9);

        changePrank(nounders);
        ogToken.transferFrom(nounders, nounerNoSplit2, 10);

        changePrank(minter);
        ogToken.transferFrom(minter, nounerNoSplit2, 11);

        vm.stopPrank();
    }

    function signalSplit(address nouner) internal {
        vm.startPrank(nouner);
        ogToken.setApprovalForAll(address(daoV3), true);
        daoV3.signalSplit(getOwnedTokens(nouner));
        vm.stopPrank();
    }

    function joinSplit(address nouner) internal {
        vm.startPrank(nouner);
        ogToken.setApprovalForAll(address(daoV3), true);
        daoV3.joinSplit(getOwnedTokens(nouner));
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
