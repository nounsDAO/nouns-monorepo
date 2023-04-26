// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { SplitDAODeployerMock } from '../helpers/SplitDAODeployerMock.sol';
import { ERC20Mock } from '../helpers/ERC20Mock.sol';

contract DAOSplitTest is NounsDAOLogicV3BaseTest {

    address tokenHolder = makeAddr("tokenHolder");
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
    }

    function test_split_happyFlow() public {
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

        // signal split with 4 tokens (20%)
        // approve tokens to DAO
        tokenIds = [1, 2, 3 ,4];

        vm.startPrank(tokenHolder);
        nounsToken.setApprovalForAll(address(dao), true);
        dao.signalSplit(tokenIds);
        vm.stopPrank();

        assertEq(dao.nouns().balanceOf(tokenHolder), 14);

        // execute split
        dao.executeSplit();

        // 200 ETH is sent to the new DAO
        assertEq(address(timelock).balance, 800 ether);
        assertEq(address(splitDAODeployer.mockTreasury()).balance, 200 ether);

        // 60e18 of the erc20 token is sent to the new DAO
        assertEq(erc20Mock.balanceOf(address(timelock)), 240e18);
        assertEq(erc20Mock.balanceOf(address(splitDAODeployer.mockTreasury())), 60e18);

        // 2 more tokens join the split
        tokenIds = [5, 6];
        vm.prank(tokenHolder);
        dao.joinSplit(tokenIds);

        assertEq(dao.nouns().balanceOf(tokenHolder), 12);
        
        // 100 ETH more is sent to the new DAO
        assertEq(address(timelock).balance, 700 ether);
        assertEq(address(splitDAODeployer.mockTreasury()).balance, 300 ether);

        // 30e18 more of the erc20 token is sent to the new DAO
        assertEq(erc20Mock.balanceOf(address(timelock)), 210e18);
        assertEq(erc20Mock.balanceOf(address(splitDAODeployer.mockTreasury())), 90e18);

        // 3 more tokens join the split
        tokenIds = [7, 8 ,9];
        vm.prank(tokenHolder);
        dao.joinSplit(tokenIds);

        assertEq(dao.nouns().balanceOf(tokenHolder), 9);

        // 150 ETH more is sent to the new DAO
        assertEq(address(timelock).balance, 550 ether);
        assertEq(address(splitDAODeployer.mockTreasury()).balance, 450 ether);

        // 45e18 more of the erc20 token is sent to the new DAO
        assertEq(erc20Mock.balanceOf(address(timelock)), 165e18);
        assertEq(erc20Mock.balanceOf(address(splitDAODeployer.mockTreasury())), 135e18);
    }
}