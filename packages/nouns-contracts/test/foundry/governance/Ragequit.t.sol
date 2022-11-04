// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicSharedBaseTest } from '../helpers/NounsDAOLogicSharedBase.t.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOProxyV2 } from '../../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOStorageV2 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { Utils } from '../helpers/Utils.sol';
import { ERC20Mock } from '../mocks/ERC20Mock.sol';

contract RagequitTest is NounsDAOLogicSharedBaseTest, Utils {
    address user1;
    address user2;
    NounsDAOExecutorV2 timelockV2 = new NounsDAOExecutorV2(address(1), TIMELOCK_DELAY);
    ERC20Mock token1 = new ERC20Mock();
    ERC20Mock token2 = new ERC20Mock();

    function deployDAOProxy() internal override returns (NounsDAOLogicV1) {
        NounsDAOLogicV3 daoLogic = new NounsDAOLogicV3();

        return
            NounsDAOLogicV1(
                payable(
                    new NounsDAOProxyV2(
                        address(timelockV2),
                        address(nounsToken),
                        vetoer,
                        admin,
                        address(daoLogic),
                        votingPeriod,
                        votingDelay,
                        proposalThresholdBPS,
                        NounsDAOStorageV2.DynamicQuorumParams({
                            minQuorumVotesBPS: 1000,
                            maxQuorumVotesBPS: 2000,
                            quorumCoefficient: 10000
                        })
                    )
                )
            );
    }

    function daoVersion() internal pure override returns (uint256) {
        return 3;
    }

    function daoProxyV3() internal view returns (NounsDAOLogicV3) {
        return NounsDAOLogicV3(payable(address(daoProxy)));
    }

    function setUp() public virtual override {
        super.setUp();

        user1 = getAndLabelAddress('user1');
        user2 = getAndLabelAddress('user2');

        vm.deal(address(daoProxyV3().timelock()), 100 ether);
    }

    function test_redeemsEthWithZeroPenalty() public {
        mint(user1, 9);
        mint(user2, 27);
        assertEq(nounsToken.totalSupply(), 40);

        vm.startPrank(user1);
        nounsToken.setApprovalForAll(address(daoProxyV3()), true);
        uint256[] memory ids = new uint256[](4);
        ids[0] = 1;
        ids[1] = 2;
        ids[2] = 3;
        ids[3] = 4;
        daoProxyV3().ragequit(ids);
        vm.stopPrank();

        assertEq(user1.balance, 10 ether);
    }

    function test_redeemsEthWithPenalty() public {
        vm.prank(admin);
        daoProxyV3()._setRagequitPenaltyBPs(2000); // 20%

        mint(user1, 9);
        mint(user2, 27);
        assertEq(nounsToken.totalSupply(), 40);

        vm.startPrank(user1);
        nounsToken.setApprovalForAll(address(daoProxyV3()), true);
        uint256[] memory ids = new uint256[](4);
        ids[0] = 1;
        ids[1] = 2;
        ids[2] = 3;
        ids[3] = 4;
        daoProxyV3().ragequit(ids);
        vm.stopPrank();

        assertEq(user1.balance, 8 ether);
    }

    function test_redeemsERC20TokensWithPenalty() public {
        token1.mint(address(daoProxyV3().timelock()), 1_000);
        token2.mint(address(daoProxyV3().timelock()), 1_000_000e18);

        vm.startPrank(admin);
        daoProxyV3()._setRagequitPenaltyBPs(2000); // 20%
        daoProxyV3()._addRedeemableAsset(address(token1));
        daoProxyV3()._addRedeemableAsset(address(token2));
        vm.stopPrank();

        vm.startPrank(address(daoProxyV3().timelock()));
        token1.approve(address(daoProxyV3()), type(uint256).max);
        token2.approve(address(daoProxyV3()), type(uint256).max);
        vm.stopPrank();

        mint(user1, 9);
        mint(user2, 27);
        assertEq(nounsToken.totalSupply(), 40);

        vm.startPrank(user1);
        nounsToken.setApprovalForAll(address(daoProxyV3()), true);
        uint256[] memory ids = new uint256[](4);
        ids[0] = 1;
        ids[1] = 2;
        ids[2] = 3;
        ids[3] = 4;
        daoProxyV3().ragequit(ids);
        vm.stopPrank();

        assertEq(token1.balanceOf(user1), 80);
        assertEq(token2.balanceOf(user1), 80_000e18);
    }
}