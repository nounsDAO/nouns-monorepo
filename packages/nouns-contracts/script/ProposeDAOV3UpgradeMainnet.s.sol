// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOLogicV1 } from '../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOForkEscrow } from '../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ForkDAODeployer } from '../contracts/governance/fork/ForkDAODeployer.sol';

contract ProposeDAOV3UpgradeMainnet is Script {
    NounsDAOLogicV1 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV1(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    address public constant NOUNS_TIMELOCK_V1_MAINNET = 0x0BC3807Ec262cB779b38D65b38158acC3bfedE10;

    uint256 public constant ETH_TO_SEND_TO_NEW_TIMELOCK = 10000 ether;
    uint256 public constant FORK_PERIOD = 7 days;
    uint256 public constant FORK_THRESHOLD_BPS = 2000;

    address public constant STETH_MAINNET = 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84;
    address public constant AUCTION_HOUSE_PROXY_MAINNET = 0x830BD73E4184ceF73443C15111a1DF14e495C706;
    address public constant NOUNS_TOKEN_MAINNET = 0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03;
    address public constant DESCRIPTOR_MAINNET = 0x6229c811D04501523C6058bfAAc29c91bb586268;

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');
        address daoV3Implementation = vm.envAddress('DAO_V3_IMPL');
        address timelockV2 = vm.envAddress('TIMELOCK_V2');
        address forkEscrow = vm.envAddress('FORK_ESCROW');
        address forkDeployer = vm.envAddress('FORK_DEPLOYER');
        address erc20Transferer = vm.envAddress('ERC20_TRANSFERER');

        string memory description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));

        address[] memory erc20TokensToIncludeInFork = new address[](1);
        erc20TokensToIncludeInFork[0] = STETH_MAINNET;

        vm.startBroadcast(proposerKey);

        proposalId = propose(
            NOUNS_DAO_PROXY_MAINNET,
            daoV3Implementation,
            timelockV2,
            ETH_TO_SEND_TO_NEW_TIMELOCK,
            erc20Transferer,
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
        uint256 ethToSendToNewTimelock,
        address erc20Transferer,
        address forkEscrow,
        address forkDeployer,
        address[] memory erc20TokensToIncludeInFork,
        string memory description
    ) internal returns (uint256 proposalId) {
        // We are limited to 10 txs per proposal, see `proposalMaxOperations` in NounsDAOV3Proposals.sol
        uint8 numTxs = 10;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        // Can't send the entire ETH balance because we can't reference self.balance
        // Would also be good to leave some ETH in case of queued proposals
        // For both reasons, we will first sent a chunk of ETH, and send the rest in a followup proposal
        uint256 i = 0;
        targets[i] = timelockV2;
        values[i] = ethToSendToNewTimelock;
        signatures[i] = '';
        calldatas[i] = '';

        // Upgrade to DAO V3
        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setImplementation(address)';
        calldatas[i] = abi.encode(daoV3Implementation);

        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setForkParams(address,address,address[],uint256,uint256)';
        calldatas[i] = abi.encode(
            forkEscrow,
            forkDeployer,
            erc20TokensToIncludeInFork,
            FORK_PERIOD,
            FORK_THRESHOLD_BPS
        );

        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setVoteSnapshotBlockSwitchProposalId()';
        calldatas[i] = '';

        i++;
        targets[i] = AUCTION_HOUSE_PROXY_MAINNET;
        values[i] = 0;
        signatures[i] = 'transferOwnership(address)';
        calldatas[i] = abi.encode(timelockV2);

        i++;
        targets[i] = STETH_MAINNET;
        values[i] = 0;
        signatures[i] = 'approve(address,uint256)';
        calldatas[i] = abi.encode(erc20Transferer, type(uint256).max);

        i++;
        targets[i] = erc20Transferer;
        values[i] = 0;
        signatures[i] = 'transferEntireBalance(address,address)';
        calldatas[i] = abi.encode(STETH_MAINNET, timelockV2);

        // Change nouns token owner
        i++;
        targets[i] = NOUNS_TOKEN_MAINNET;
        values[i] = 0;
        signatures[i] = 'transferOwnership(address)';
        calldatas[i] = abi.encode(timelockV2);

        // Change descriptor owner
        i++;
        targets[i] = DESCRIPTOR_MAINNET;
        values[i] = 0;
        signatures[i] = 'transferOwnership(address)';
        calldatas[i] = abi.encode(timelockV2);

        // This must be the last transaction, because starting now, execution will be from timelockV2
        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setTimelocksAndAdmin(address,address,address)';
        calldatas[i] = abi.encode(timelockV2, NOUNS_TIMELOCK_V1_MAINNET, timelockV2);

        proposalId = daoProxy.propose(targets, values, signatures, calldatas, description);
    }
}
