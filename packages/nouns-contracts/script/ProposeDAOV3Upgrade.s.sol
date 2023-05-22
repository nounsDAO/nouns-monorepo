// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOLogicV1 } from '../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOForkEscrow } from '../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ForkDAODeployer } from '../contracts/governance/fork/ForkDAODeployer.sol';

contract ProposeDAOV3UpgradeScript is Script {
    NounsDAOLogicV1 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV1(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    address public constant NOUNS_TIMELOCK_V1_MAINNET = 0x0BC3807Ec262cB779b38D65b38158acC3bfedE10;

    uint256 public constant ETH_TO_SEND_TO_NEW_TIMELOCK = 10000 ether;

    address public constant STETH_MAINNET = 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84;

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');
        address daoV3Implementation = vm.envAddress('DAO_V3_IMPL');
        address timelockV2 = vm.envAddress('TIMELOCK_V2');
        address forkEscrow = vm.envAddress('FORK_ESCROW');
        address forkDeployer = vm.envAddress('FORK_DEPLOYER');

        string memory description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));

        address[] memory erc20TokensToIncludeInFork = new address[](1);
        erc20TokensToIncludeInFork[0] = STETH_MAINNET;

        vm.startBroadcast(proposerKey);

        proposalId = propose(
            NOUNS_DAO_PROXY_MAINNET,
            daoV3Implementation,
            timelockV2,
            NOUNS_TIMELOCK_V1_MAINNET,
            ETH_TO_SEND_TO_NEW_TIMELOCK,
            forkEscrow,
            forkDeployer,
            erc20TokensToIncludeInFork,
            description
        );
        console.log('Proposed proposalId: %d', proposalId);

        vm.stopBroadcast();
    }

    function propose(
        NounsDAOLogicV1 daoProxy,
        address daoV3Implementation,
        address timelockV2,
        address timelockV1,
        uint256 ethToSendToNewTimelock,
        address forkEscrow,
        address forkDeployer,
        address[] memory erc20TokensToIncludeInFork,
        string memory description
    ) internal returns (uint256 proposalId) {
        address[] memory targets = new address[](4);
        uint256[] memory values = new uint256[](4);
        string[] memory signatures = new string[](4);
        bytes[] memory calldatas = new bytes[](4);

        uint256 i = 0;
        targets[i] = timelockV2;
        values[i] = ethToSendToNewTimelock;
        signatures[i] = '';
        calldatas[i] = '';

        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setImplementation(address)';
        calldatas[i] = abi.encode(daoV3Implementation);

        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setForkParams(address,address,address[],uint256,uint256)';
        calldatas[i] = abi.encode(forkEscrow, forkDeployer, erc20TokensToIncludeInFork, 7 days, 2_000);

        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setTimelocksAndAdmin(address,address,address)';
        calldatas[i] = abi.encode(timelockV2, timelockV1, timelockV2);

        proposalId = daoProxy.propose(targets, values, signatures, calldatas, description);
    }
}
