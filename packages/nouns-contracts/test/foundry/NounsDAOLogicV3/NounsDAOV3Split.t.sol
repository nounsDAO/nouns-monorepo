// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { SplitDAODeployerMock } from '../helpers/SplitDAODeployerMock.sol';
import { ERC20Mock } from '../helpers/ERC20Mock.sol';
import { NounsDAOV3Split } from '../../../contracts/governance/split/NounsDAOV3Split.sol';

abstract contract DAOSplitZeroState is NounsDAOLogicV3BaseTest {

    address tokenHolder = makeAddr("tokenHolder");
    address tokenHolder2 = makeAddr("tokenHolder2");
    uint[] tokenIds;
    SplitDAODeployerMock splitDAODeployer;
    ERC20Mock erc20Mock = new ERC20Mock();
    address[] erc20Tokens = [address(erc20Mock)];

    function setUp() public virtual override {
        super.setUp();

        splitDAODeployer = new SplitDAODeployerMock();
        vm.startPrank(address(timelock));
        dao._setSplitDAODeployer(address(splitDAODeployer));
        dao._setErc20TokensToIncludeInSplit(erc20Tokens);
        vm.stopPrank();

        // Seed treasury with 1000 ETH and 300e18 of an erc20 token
        deal(address(timelock), 1000 ether);
        erc20Mock.mint(address(timelock), 300e18);

        // Mint total of 20 tokens. 18 to token holder, 2 to nounders
        vm.startPrank(minter);
        while (nounsToken.totalSupply() < 20) {
            nounsToken.mint();
            nounsToken.transferFrom(minter, tokenHolder, nounsToken.totalSupply() - 1);
        }
        vm.stopPrank();
        assertEq(dao.nouns().balanceOf(tokenHolder), 18);
    }
}

contract DAOSplitZeroStateTest is DAOSplitZeroState {
    function test_signalSplit_transfersTokens() public {
        tokenIds = [1, 2, 3];

        vm.startPrank(tokenHolder);
        nounsToken.setApprovalForAll(address(dao), true);
        dao.signalSplit(tokenIds);
        vm.stopPrank();

        assertEq(dao.nouns().balanceOf(tokenHolder), 15);
    }

    function test_executeSplit_reverts() public {
        vm.expectRevert(NounsDAOV3Split.SplitThresholdNotMet.selector);
        dao.executeSplit();
    }

    function test_joinSplit_reverts() public {
        tokenIds = [4, 5];
        vm.expectRevert(NounsDAOV3Split.SplitPeriodNotActive.selector);
        vm.prank(tokenHolder);
        dao.joinSplit(tokenIds);
    }
}

abstract contract DAOSplitSignaledUnderThresholdState is DAOSplitZeroState {
    function setUp() public virtual override {
        super.setUp();

        // signal split with 3 tokens (15%)
        tokenIds = [1, 2, 3];

        vm.startPrank(tokenHolder);
        nounsToken.setApprovalForAll(address(dao), true);
        dao.signalSplit(tokenIds);
        vm.stopPrank();
    }
}

contract DAOSplitSignaledUnderThresholdStateTest is DAOSplitSignaledUnderThresholdState {
    function test_executeSplit_reverts() public {
        vm.expectRevert(NounsDAOV3Split.SplitThresholdNotMet.selector);
        dao.executeSplit();
    }

    function test_joinSplit_reverts() public {
        tokenIds = [4, 5];
        vm.expectRevert(NounsDAOV3Split.SplitPeriodNotActive.selector);
        vm.prank(tokenHolder);
        dao.joinSplit(tokenIds);
    }

    function test_unsignalSplit_returnsTokens() public {
        assertEq(dao.nouns().balanceOf(tokenHolder), 15);

        tokenIds = [1, 2, 3];

        vm.prank(tokenHolder);
        dao.unsignalSplit(tokenIds);

        assertEq(dao.nouns().balanceOf(tokenHolder), 18);
    }

    function test_unsignalSplitWithDifferentTokens_reverts() public {
        // move Noun #7 to tokenHolder2
        vm.prank(tokenHolder);
        nounsToken.transferFrom(tokenHolder, tokenHolder2, 7);
        assertEq(dao.nouns().ownerOf(7), tokenHolder2);

        // tokenHolder2 signals split with Noun #7
        vm.startPrank(tokenHolder2);
        nounsToken.approve(address(dao), 7);
        tokenIds = [7];
        dao.signalSplit(tokenIds);
        vm.stopPrank();

        tokenIds = [7];
        vm.expectRevert("ERC721: transfer caller is not owner nor approved");
        vm.prank(tokenHolder);
        dao.unsignalSplit(tokenIds);
    }
}

abstract contract DAOSplitSignaledOverThresholdState is DAOSplitSignaledUnderThresholdState {
    function setUp() public virtual override {
        super.setUp();

        // signal split with 5 tokens (25%)
        tokenIds = [4, 5];

        vm.startPrank(tokenHolder);
        nounsToken.setApprovalForAll(address(dao), true);
        dao.signalSplit(tokenIds);
        vm.stopPrank();
    }
}

contract DAOSplitSignaledOverThresholdStateTest is DAOSplitSignaledOverThresholdState {
    function test_joinSplit_reverts() public {
        tokenIds = [6, 7];
        vm.expectRevert(NounsDAOV3Split.SplitPeriodNotActive.selector);
        vm.prank(tokenHolder);
        dao.joinSplit(tokenIds);
    }

    function test_executeSplit() public {
        dao.executeSplit();

        // 25% of treasury should be sent to new DAO
        assertEq(address(timelock).balance, 750 ether);
        assertEq(address(splitDAODeployer.mockTreasury()).balance, 250 ether);

        // 25% of erc20 should be sent to new DAO
        assertEq(erc20Mock.balanceOf(address(timelock)), 225e18);
        assertEq(erc20Mock.balanceOf(address(splitDAODeployer.mockTreasury())), 75e18);
    }

    function test_unsignalSplitUnderThreshold_blocksExecuteSplit() public {
        tokenIds = [1, 2, 3];

        vm.prank(tokenHolder);
        dao.unsignalSplit(tokenIds);

        vm.expectRevert(NounsDAOV3Split.SplitThresholdNotMet.selector);
        dao.executeSplit();
    }
}

abstract contract DAOSplitExecutedState is DAOSplitSignaledOverThresholdState {
    function setUp() public virtual override {
        super.setUp();

        dao.executeSplit();
    }
}

contract DAOSplitExecutedStateTest is DAOSplitExecutedState {
    function test_signalSplit_reverts() public {
        tokenIds = [8, 9];
        
        vm.expectRevert(NounsDAOV3Split.SplitPeriodActive.selector);
        vm.prank(tokenHolder);
        dao.signalSplit(tokenIds);
    }

    function test_executeSplit_reverts() public {
        vm.expectRevert(NounsDAOV3Split.SplitPeriodActive.selector);
        dao.executeSplit();
    }

    function test_unsignalSplit_reverts() public {
        tokenIds = [4, 5];

        vm.expectRevert(NounsDAOV3Split.SplitPeriodActive.selector);
        vm.prank(tokenHolder);
        dao.unsignalSplit(tokenIds);
    }

    function test_joinSplit() public {
        tokenIds = [8, 9];

        vm.prank(tokenHolder);
        dao.joinSplit(tokenIds);

        // now 35% of the treasury is in the new DAO
        assertEq(address(timelock).balance, 650 ether);
        assertEq(address(splitDAODeployer.mockTreasury()).balance, 350 ether);

        assertEq(erc20Mock.balanceOf(address(timelock)), 195e18);
        assertEq(erc20Mock.balanceOf(address(splitDAODeployer.mockTreasury())), 105e18);

        // 1 more token joins
        tokenIds = [7];
        vm.prank(tokenHolder);
        dao.joinSplit(tokenIds);

        // now 40% of the treasury is in the new DAO
        assertEq(address(timelock).balance, 600 ether);
        assertEq(address(splitDAODeployer.mockTreasury()).balance, 400 ether);

        assertEq(erc20Mock.balanceOf(address(timelock)), 180e18);
        assertEq(erc20Mock.balanceOf(address(splitDAODeployer.mockTreasury())), 120e18);
    }
}

abstract contract DAOSplitExecutedActivePeriodOverState is DAOSplitExecutedState {
    function setUp() public virtual override {
        super.setUp();

        skip(NounsDAOV3Split.SPLIT_PERIOD_DURTION);
    }
}

contract DAOSplitExecutedActivePeriodOverStateTest is DAOSplitExecutedActivePeriodOverState {
    function test_joinSplit_reverts() public {
        tokenIds = [8, 9];

        vm.prank(tokenHolder);
        vm.expectRevert(NounsDAOV3Split.SplitPeriodNotActive.selector);
        dao.joinSplit(tokenIds);
    }

    // // TODO
    // function test_execute_reverts() public {
    //     vm.expectRevert(NounsDAOV3Split.SplitThresholdNotMet.selector);
    //     dao.executeSplit();
    // }
}