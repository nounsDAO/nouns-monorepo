// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOLogicV3 } from '../contracts/governance/NounsDAOLogicV3.sol';

/**
 * @notice A script that proposes additional ownership and funds transfers from treasury (executor) V1 to V2.
 * @dev We have to have this additional proposal because we're limited to 10 txs per proposal, and the main upgrade
 * proposal has hit that limit.
 */
contract ProposeTimelockMigrationCleanupMainnet is Script {
    NounsDAOLogicV3 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV3(payable(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d));
    address public constant NOUNS_TIMELOCK_V1_MAINNET = 0x0BC3807Ec262cB779b38D65b38158acC3bfedE10;
    address public constant NOUNS_TOKEN_MAINNET = 0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03;
    address public constant AUCTION_HOUSE_PROXY_ADMIN_MAINNET = 0xC1C119932d78aB9080862C5fcb964029f086401e;
    address public constant LILNOUNS_MAINNET = 0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B;
    address public constant TOKEN_BUYER_MAINNET = 0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5;
    address public constant PAYER_MAINNET = 0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D;

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
        address auctionHouseProxyAdmin,
        address lilNouns,
        string memory description
    ) internal returns (uint256 proposalId) {
        uint8 numTxs = 6;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        // Change auction house proxy admin owner
        uint256 i = 0;
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

        // Transfer DAO-owned Nouns to timelockV2
        i++;
        targets[i] = nounsToken;
        values[i] = 0;
        signatures[i] = 'transferFrom(address,address,uint256)';
        calldatas[i] = abi.encode(timelockV1, timelockV2, 687);

        // Transfer ownership of TokenBuyer
        i++;
        targets[i] = TOKEN_BUYER_MAINNET;
        values[i] = 0;
        signatures[i] = 'transferOwnership(address)';
        calldatas[i] = abi.encode(timelockV2);

        // Transfer ownership of Payer
        i++;
        targets[i] = PAYER_MAINNET;
        values[i] = 0;
        signatures[i] = 'transferOwnership(address)';
        calldatas[i] = abi.encode(timelockV2);

        proposalId = daoProxy.proposeOnTimelockV1(targets, values, signatures, calldatas, description);
    }
}
