// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { INounsDAOLogic } from '../contracts/interfaces/INounsDAOLogic.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * @notice A script that proposes additional ownership and funds transfers from treasury (executor) V1 to V2.
 * @dev We have to have this additional proposal because we're limited to 10 txs per proposal, and the main upgrade
 * proposal has hit that limit.
 */
contract ProposeTimelockMigrationCleanupMainnet is Script {
    INounsDAOLogic public constant NOUNS_DAO_PROXY_MAINNET =
        INounsDAOLogic(payable(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d));
    address public constant NOUNS_TIMELOCK_V1_MAINNET = 0x0BC3807Ec262cB779b38D65b38158acC3bfedE10;
    address public constant LILNOUNS_MAINNET = 0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B;
    address public constant TOKEN_BUYER_MAINNET = 0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5;
    address public constant PAYER_MAINNET = 0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D;
    address public constant STETH_MAINNET = 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84;
    address public constant WSTETH_MAINNET = 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0;
    address public constant RETH_MAINNET = 0xae78736Cd615f374D3085123A210448E74Fc6393;
    address public constant USDC_MAINNET = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');
        address timelockV2 = vm.envAddress('TIMELOCK_V2');
        address erc20Transferer = vm.envAddress('ERC20_TRANSFERER');
        string memory description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));

        vm.startBroadcast(proposerKey);

        proposalId = propose(
            NOUNS_DAO_PROXY_MAINNET,
            NOUNS_TIMELOCK_V1_MAINNET,
            timelockV2,
            erc20Transferer,
            LILNOUNS_MAINNET,
            description
        );
        console.log('Proposed proposalId: %d', proposalId);

        vm.stopBroadcast();
    }

    function propose(
        INounsDAOLogic daoProxy,
        address timelockV1,
        address timelockV2,
        address erc20Transferer,
        address lilNouns,
        string memory description
    ) internal returns (uint256 proposalId) {
        uint8 numTxs = 9;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        // Move leftover ETH
        uint256 i = 0;
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

        // Transfer remaining stETH to timelockV2
        // 1/2 approve erc20Transferer
        i++;
        targets[i] = STETH_MAINNET;
        values[i] = 0;
        signatures[i] = 'approve(address,uint256)';
        calldatas[i] = abi.encode(erc20Transferer, type(uint256).max);

        // 2/2 use erc20Transferer to transfer the remaining balance
        i++;
        targets[i] = erc20Transferer;
        values[i] = 0;
        signatures[i] = 'transferEntireBalance(address,address)';
        calldatas[i] = abi.encode(STETH_MAINNET, timelockV2);

        // Transfer wstETH to timelockV2
        i++;
        targets[i] = WSTETH_MAINNET;
        values[i] = 0;
        signatures[i] = 'transfer(address,uint256)';
        calldatas[i] = abi.encode(timelockV2, IERC20(WSTETH_MAINNET).balanceOf(timelockV1));

        // Transfer rETH to timelockV2
        i++;
        targets[i] = RETH_MAINNET;
        values[i] = 0;
        signatures[i] = 'transfer(address,uint256)';
        calldatas[i] = abi.encode(timelockV2, IERC20(RETH_MAINNET).balanceOf(timelockV1));

        // Transfer USDC to timelockV2
        i++;
        targets[i] = USDC_MAINNET;
        values[i] = 0;
        signatures[i] = 'transfer(address,uint256)';
        calldatas[i] = abi.encode(timelockV2, IERC20(USDC_MAINNET).balanceOf(timelockV1));

        proposalId = daoProxy.proposeOnTimelockV1(targets, values, signatures, calldatas, description);
    }
}
