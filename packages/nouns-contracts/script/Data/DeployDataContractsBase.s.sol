// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { NounsDAOData } from '../../contracts/governance/data/NounsDAOData.sol';
import { NounsDAODataProxy } from '../../contracts/governance/data/NounsDAODataProxy.sol';

interface NounsDAO {
    function nouns() external view returns (address);
}

contract DeployDataContractsBase is Script {
    NounsDAO public immutable daoProxy;

    constructor(address _daoProxy) {
        daoProxy = NounsDAO(_daoProxy);
    }

    function run() public returns (NounsDAOData dataLogic) {
        vm.startBroadcast(vm.envUint('DEPLOYER_PRIVATE_KEY'));

        dataLogic = new NounsDAOData(daoProxy.nouns(), address(daoProxy));

        vm.stopBroadcast();
    }
}
