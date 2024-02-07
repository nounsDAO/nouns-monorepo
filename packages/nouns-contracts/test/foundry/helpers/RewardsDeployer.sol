// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { INounsDAOLogic } from '../../../contracts/interfaces/INounsDAOLogic.sol';
import { Rewards } from '../../../contracts/Rewards.sol';
import { RewardsProxy } from '../../../contracts/client-incentives/RewardsProxy.sol';

library RewardsDeployer {
    function deployRewards(
        INounsDAOLogic dao,
        address admin,
        address auctionHouse,
        address erc20,
        uint32 nextProposalIdToReward,
        uint256 nextAuctionIdToReward,
        uint96 nextProposalRewardFirstAuctionId,
        Rewards.RewardParams memory rewardParams
    ) internal returns (Rewards) {
        Rewards rewardsLogic = new Rewards(address(dao), auctionHouse);
        bytes memory initCallData = abi.encodeWithSignature(
            'initialize(address,address,address,uint32,uint32,uint32,(uint32,uint8,uint16,uint16,uint16,uint16,uint8),address)',
            address(dao.timelock()),
            admin,
            erc20,
            nextProposalIdToReward,
            nextAuctionIdToReward,
            nextProposalRewardFirstAuctionId,
            rewardParams,
            address(0) // descriptor
        );

        RewardsProxy proxy = new RewardsProxy(address(rewardsLogic), initCallData);
        return Rewards(address(proxy));
    }
}
