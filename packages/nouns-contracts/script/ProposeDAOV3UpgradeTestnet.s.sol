// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOLogicV1 } from '../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOForkEscrow } from '../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ForkDAODeployer } from '../contracts/governance/fork/ForkDAODeployer.sol';

abstract contract ProposeDAOV3UpgradeTestnet is Script {
    uint256 public constant ETH_TO_SEND_TO_NEW_TIMELOCK = 0.001 ether;
    uint256 public constant FORK_PERIOD = 1 hours;
    uint256 public constant FORK_THRESHOLD_BPS = 2000;

    NounsDAOLogicV1 public immutable daoProxyContract;
    address public immutable timelockV1;
    address public immutable auctionHouseProxy;
    address public immutable stETH;

    constructor(
        NounsDAOLogicV1 daoProxy_,
        address timelockV1_,
        address auctionHouseProxy_,
        address stETH_
    ) {
        daoProxyContract = daoProxy_;
        timelockV1 = timelockV1_;
        auctionHouseProxy = auctionHouseProxy_;
        stETH = stETH_;
    }

    function run() public returns (uint256 proposalId) {
        uint256 proposerKey = vm.envUint('PROPOSER_KEY');
        address daoV3Implementation = vm.envAddress('DAO_V3_IMPL');
        address timelockV2 = vm.envAddress('TIMELOCK_V2');
        address forkEscrow = vm.envAddress('FORK_ESCROW');
        address forkDeployer = vm.envAddress('FORK_DEPLOYER');
        address erc20Transferer = vm.envAddress('ERC20_TRANSFERER');

        string memory description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));

        address[] memory erc20TokensToIncludeInFork = new address[](1);
        erc20TokensToIncludeInFork[0] = stETH;

        vm.startBroadcast(proposerKey);

        proposalId = propose(
            daoProxyContract,
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
        uint8 numTxs = 8;
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
        targets[i] = auctionHouseProxy;
        values[i] = 0;
        signatures[i] = 'transferOwnership(address)';
        calldatas[i] = abi.encode(timelockV2);

        i++;
        targets[i] = stETH;
        values[i] = 0;
        signatures[i] = 'approve(address,uint256)';
        calldatas[i] = abi.encode(erc20Transferer, type(uint256).max);

        i++;
        targets[i] = erc20Transferer;
        values[i] = 0;
        signatures[i] = 'transferEntireBalance(address,address)';
        calldatas[i] = abi.encode(stETH, timelockV2);

        i++;
        targets[i] = address(daoProxy);
        values[i] = 0;
        signatures[i] = '_setTimelocksAndAdmin(address,address,address)';
        calldatas[i] = abi.encode(timelockV2, timelockV1, timelockV2);

        proposalId = daoProxy.propose(targets, values, signatures, calldatas, description);
    }
}

contract ProposeDAOV3UpgradeGoerli is ProposeDAOV3UpgradeTestnet {
    NounsDAOLogicV1 public constant NOUNS_DAO_PROXY_GOERLI =
        NounsDAOLogicV1(0x9e6D4B42b8Dc567AC4aeCAB369Eb9a3156dF095C);
    address public constant NOUNS_TIMELOCK_V1_GOERLI = 0xADa0F1A73D1df49477fa41C7F8476F9eA5aB115f;
    address public constant AUCTION_HOUSE_PROXY_GOERLI = 0x17e8512851Db9F04164Aa54A6e62f368acCF9D0c;
    address public constant STETH_GOERLI = 0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F;

    constructor()
        ProposeDAOV3UpgradeTestnet(
            NOUNS_DAO_PROXY_GOERLI,
            NOUNS_TIMELOCK_V1_GOERLI,
            AUCTION_HOUSE_PROXY_GOERLI,
            STETH_GOERLI
        )
    {}
}

contract ProposeDAOV3UpgradeSepolia is ProposeDAOV3UpgradeTestnet {
    NounsDAOLogicV1 public constant NOUNS_DAO_PROXY_SEPOLIA =
        NounsDAOLogicV1(0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57);
    address public constant NOUNS_TIMELOCK_V1_SEPOLIA = 0x332db58b51393f3a6b28d4DD8964234967e1aD33;
    address public constant AUCTION_HOUSE_PROXY_SEPOLIA = 0x488609b7113FCf3B761A05956300d605E8f6BcAf;
    address public constant STETH_SEPOLIA = 0xf16e3ab44cC450fCbe5E890322Ee715f3f7eAC29; // ERC20Mock

    constructor()
        ProposeDAOV3UpgradeTestnet(
            NOUNS_DAO_PROXY_SEPOLIA,
            NOUNS_TIMELOCK_V1_SEPOLIA,
            AUCTION_HOUSE_PROXY_SEPOLIA,
            STETH_SEPOLIA
        )
    {}
}
