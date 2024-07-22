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

contract ProposeDAOUpgradeMainnet is Script {
    NounsDAO public constant NOUNS_DAO_PROXY_MAINNET = NounsDAO(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');
        address daoV3Implementation = vm.envAddress('DAO_V3_IMPL');
        string memory description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));

        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        string[] memory signatures = new string[](1);
        bytes[] memory calldatas = new bytes[](1);

        vm.startBroadcast(proposerKey);

        targets[0] = address(NOUNS_DAO_PROXY_MAINNET);
        values[0] = 0;
        signatures[0] = '_setImplementation(address)';
        calldatas[0] = abi.encode(daoV3Implementation);

        proposalId = NOUNS_DAO_PROXY_MAINNET.propose(targets, values, signatures, calldatas, description);

        vm.stopBroadcast();
    }
}
