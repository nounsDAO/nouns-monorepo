// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOLogicV1 } from '../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOData } from '../contracts/governance/data/NounsDAOData.sol';
import { NounsDAODataProxy } from '../contracts/governance/data/NounsDAODataProxy.sol';

contract DeployDAOV3DataContractsBase is Script {
    uint256 public constant CREATE_CANDIDATE_COST = 0.01 ether;

    NounsDAOLogicV1 public immutable daoProxy;
    address public immutable timelockV2Proxy;

    constructor(address _daoProxy, address _timelockV2Proxy) {
        daoProxy = NounsDAOLogicV1(payable(_daoProxy));
        timelockV2Proxy = _timelockV2Proxy;
    }

    function run() public returns (NounsDAODataProxy dataProxy) {
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

        vm.startBroadcast(deployerKey);

        NounsDAOData dataLogic = new NounsDAOData(address(daoProxy.nouns()), address(daoProxy));

        bytes memory initCallData = abi.encodeWithSignature(
            'initialize(address,uint256,uint256)',
            timelockV2Proxy,
            CREATE_CANDIDATE_COST,
            0
        );
        dataProxy = new NounsDAODataProxy(address(dataLogic), initCallData);

        vm.stopBroadcast();
    }
}
