// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOLogicV3 } from '../contracts/governance/NounsDAOLogicV3.sol';

/**
 * @notice Submits a proposal to configure the ENS reverse lookup for nouns.eth.
 * @dev Must run after the upgrade to DAO V3 and Executor V2, since it's the new treasury (executor) that needs to be
 * the msg.sender to ENS.
 */
contract ProposeENSReverseLookupConfigMainnet is Script {
    NounsDAOLogicV3 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV3(payable(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d));
    address public constant ENS_REVERSE_REGISTRAR_MAINNET = 0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb;

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');
        string memory description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));

        vm.startBroadcast(proposerKey);

        proposalId = propose(NOUNS_DAO_PROXY_MAINNET, ENS_REVERSE_REGISTRAR_MAINNET, description);
        console.log('Proposed proposalId: %d', proposalId);

        vm.stopBroadcast();
    }

    function propose(
        NounsDAOLogicV3 daoProxy,
        address reverseRegistrar,
        string memory description
    ) internal returns (uint256 proposalId) {
        uint8 numTxs = 1;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        uint256 i = 0;
        targets[i] = reverseRegistrar;
        values[i] = 0;
        signatures[i] = 'setName(string)';
        calldatas[i] = abi.encode('nouns.eth');

        proposalId = daoProxy.propose(targets, values, signatures, calldatas, description);
    }
}
