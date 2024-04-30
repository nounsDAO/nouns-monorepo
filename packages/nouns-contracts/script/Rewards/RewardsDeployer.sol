// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { INounsDAOLogic } from '../../contracts/interfaces/INounsDAOLogic.sol';
import { Rewards } from '../../contracts/client-incentives/Rewards.sol';
import { RewardsProxy } from '../../contracts/client-incentives/RewardsProxy.sol';

library RewardsDeployer {
    function deployRewards(
        INounsDAOLogic dao,
        address admin,
        address auctionHouse,
        address erc20,
        address descriptor
    ) internal returns (Rewards) {
        Rewards rewardsLogic = new Rewards(address(dao), auctionHouse);
        bytes memory initCallData = abi.encodeWithSignature(
            'initialize(address,address,address,address)',
            address(dao.timelock()),
            admin,
            erc20,
            descriptor
        );

        RewardsProxy proxy = new RewardsProxy(address(rewardsLogic), initCallData);
        return Rewards(address(proxy));
    }
}
