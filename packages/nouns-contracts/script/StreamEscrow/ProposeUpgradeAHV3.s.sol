// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

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

contract ProposeAHv3UpgradeSepolia is Script {
    NounsDAO public constant NOUNS_DAO_PROXY_SEPOLIA = NounsDAO(0x15873cb1B67b0E68c97B9113713F8F2051A1c01a);
    address public constant AUCTION_HOUSE_PROXY_ADMIN_SEPOLIA = 0xF9106F8A20BA2d4255F52b890EE2D3e15964Bb9f;
    address public constant AUCTION_HOUSE_PROXY_SEPOLIA = 0x949dBCcc3EE35f11014DB0E48f21900E245564Ad;
    address public constant AUCTION_HOUSE_V3_LOGIC_SEPOLIA = 0x3FCf3681e519FbD1398cdaa1E555a4fA80619b43;
    address public constant STREAM_ESCROW_SEPOLIA = 0x02790aAD77A9528A8f6D9e611F1Ca51745034277;

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');

        vm.startBroadcast(proposerKey);

        // Propose upgrade
        uint256 txCount = 2;
        address[] memory targets = new address[](txCount);
        uint256[] memory values = new uint256[](txCount);
        string[] memory signatures = new string[](txCount);
        bytes[] memory calldatas = new bytes[](txCount);

        // proxyAdmin.upgrade(proxy, address(newLogic));
        targets[0] = AUCTION_HOUSE_PROXY_ADMIN_SEPOLIA;
        signatures[0] = 'upgrade(address,address)';
        calldatas[0] = abi.encode(AUCTION_HOUSE_PROXY_SEPOLIA, AUCTION_HOUSE_V3_LOGIC_SEPOLIA);
        // auctionHouse.setStreamEscrowParams(streamEscrow, immediateTreasuryBps, streamLengthInAuctions));
        targets[1] = AUCTION_HOUSE_PROXY_SEPOLIA;
        signatures[1] = 'setStreamEscrowParams(address,uint16,uint16)';
        calldatas[1] = abi.encode(STREAM_ESCROW_SEPOLIA, 2000, 1500);

        proposalId = NOUNS_DAO_PROXY_SEPOLIA.propose(
            targets,
            values,
            signatures,
            calldatas,
            '# Upgrade to AuctionHouseV3'
        );

        vm.stopBroadcast();
    }
}
