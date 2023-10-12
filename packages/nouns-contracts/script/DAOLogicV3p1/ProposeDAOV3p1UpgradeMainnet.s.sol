// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOLogicV1 } from '../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOForkEscrow } from '../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ForkDAODeployer } from '../../contracts/governance/fork/ForkDAODeployer.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract ProposeDAOV3p1UpgradeMainnet is Script {
    NounsDAOLogicV1 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV1(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');
        address newDAOImpl = vm.envAddress('DAO_V3p1_IMPL');
        string memory description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));

        vm.startBroadcast(proposerKey);

        uint8 numTxs = 1;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        uint256 i = 0;
        targets[i] = address(NOUNS_DAO_PROXY_MAINNET);
        values[i] = 0;
        signatures[i] = '_setImplementation(address)';
        calldatas[i] = abi.encode(newDAOImpl);

        proposalId = NOUNS_DAO_PROXY_MAINNET.propose(targets, values, signatures, calldatas, description);
        console.log('Proposed proposalId: %d', proposalId);

        vm.stopBroadcast();
    }
}
