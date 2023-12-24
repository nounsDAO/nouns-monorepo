// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';

interface NounsDAO {
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);
}

contract ProposeAuctionHouseV3UpgradeMainnet is Script {
    NounsDAO public constant NOUNS_DAO_PROXY_MAINNET = NounsDAO(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    address public constant AUCTION_HOUSE_PROXY_MAINNET = 0x830BD73E4184ceF73443C15111a1DF14e495C706;
    address public constant AUCTION_HOUSE_PROXY_ADMIN_MAINNET = 0xC1C119932d78aB9080862C5fcb964029f086401e;

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');

        address auctionHouseV2Implementation = vm.envAddress('AUCTION_HOUSE_V2_IMPL');
        string memory description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));

        vm.startBroadcast(proposerKey);

        proposalId = proposeAuctionHouseUpgrade(
            NOUNS_DAO_PROXY_MAINNET,
            auctionHouseV2Implementation,
            description 
        );
        
        console.log('Proposed proposalId: %d', proposalId);

        vm.stopBroadcast();
    }

    function proposeAuctionHouseUpgrade(
        NounsDAO daoProxy,
        address auctionHouseV2Implementation,
        string memory description
    ) internal returns (uint256 proposalId) {
        // We are limited to 10 txs per proposal, see `proposalMaxOperations` in NounsDAOV3Proposals.sol
        uint8 numTxs = 1;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        // Upgrade to Auction House V2
        // upgrade: tells the AuctionHouse proxy contract to point to a new AuctionHouse.sol contract.
        targets[0] = AUCTION_HOUSE_PROXY_ADMIN_MAINNET;
        values[0] = 0;
        signatures[0] = 'upgrade(address)';
        calldatas[0] = abi.encode(auctionHouseV2Implementation);

        proposalId = daoProxy.propose(targets, values, signatures, calldatas, description);
        console.log('Proposed Auction House V2 Upgrade proposalId: %d', proposalId);
    }
}