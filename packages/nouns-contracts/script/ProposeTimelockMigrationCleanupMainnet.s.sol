// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOLogicV3 } from '../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOForkEscrow } from '../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ForkDAODeployer } from '../contracts/governance/fork/ForkDAODeployer.sol';

contract ProposeTimelockMigrationCleanupMainnet is Script {
    NounsDAOLogicV3 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV3(payable(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d));
    address public constant NOUNS_TIMELOCK_V1_MAINNET = 0x0BC3807Ec262cB779b38D65b38158acC3bfedE10;
    address public constant NOUNS_TOKEN_MAINNET = 0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03;
    address public constant AUCTION_HOUSE_PROXY_ADMIN_MAINNET = 0xC1C119932d78aB9080862C5fcb964029f086401e;
    address public constant DESCRIPTOR_MAINNET = 0x6229c811D04501523C6058bfAAc29c91bb586268;
    address public constant LILNOUNS_MAINNET = 0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B;

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');
        address timelockV2 = vm.envAddress('TIMELOCK_V2');
        string memory description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));

        vm.startBroadcast(proposerKey);

        proposalId = propose(
            NOUNS_DAO_PROXY_MAINNET,
            NOUNS_TIMELOCK_V1_MAINNET,
            timelockV2,
            NOUNS_TOKEN_MAINNET,
            DESCRIPTOR_MAINNET,
            AUCTION_HOUSE_PROXY_ADMIN_MAINNET,
            LILNOUNS_MAINNET,
            description
        );
        console.log('Proposed proposalId: %d', proposalId);

        vm.stopBroadcast();
    }

    function propose(
        NounsDAOLogicV3 daoProxy,
        address timelockV1,
        address timelockV2,
        address nounsToken,
        address descriptor,
        address auctionHouseProxyAdmin,
        address lilNouns,
        string memory description
    ) internal returns (uint256 proposalId) {
        uint8 numTxs = 5;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        // Change nouns token owner
        uint256 i = 0;
        targets[i] = nounsToken;
        values[i] = 0;
        signatures[i] = 'transferOwnership(address)';
        calldatas[i] = abi.encode(timelockV2);

        // Change descriptor owner
        i++;
        targets[i] = descriptor;
        values[i] = 0;
        signatures[i] = 'transferOwnership(address)';
        calldatas[i] = abi.encode(timelockV2);

        // Change auction house proxy admin owner
        i++;
        targets[i] = auctionHouseProxyAdmin;
        values[i] = 0;
        signatures[i] = 'transferOwnership(address)';
        calldatas[i] = abi.encode(timelockV2);

        // Move leftover ETH
        i++;
        targets[i] = timelockV2;
        values[i] = timelockV1.balance;
        signatures[i] = '';
        calldatas[i] = '';

        // Approve timelockV2 to move LilNouns for V1
        i++;
        targets[i] = lilNouns;
        values[i] = 0;
        signatures[i] = 'setApprovalForAll(address,bool)';
        calldatas[i] = abi.encode(timelockV2, true);

        proposalId = daoProxy.proposeOnTimelockV1(targets, values, signatures, calldatas, description);
    }
}
