// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHousePreV2Migration } from '../../contracts/NounsAuctionHousePreV2Migration.sol';
import { DeployAuctionHouseV2Mainnet } from '../../script/AuctionHouseV2/DeployAuctionHouseV2Mainnet.s.sol';
import { DeployExecutorV3AndExcessETHBurnerMainnet } from '../../script/executorV3AndExcessETHBurner/DeployExecutorV3AndExcessETHBurnerMainnet.s.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { INounsDAOExecutor } from '../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOExecutorV3 } from '../../contracts/governance/NounsDAOExecutorV3.sol';
import { ExcessETHBurner } from '../../contracts/governance/ExcessETHBurner.sol';

interface INounsDAOLogicV3 {
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);

    function votingDelay() external view returns (uint256);

    function castVote(uint256 proposalId, uint8 support) external;

    function votingPeriod() external view returns (uint256);

    function proposalUpdatablePeriodInBlocks() external view returns (uint256);

    function queue(uint256 proposalId) external;

    function execute(uint256 proposalId) external;

    function adjustedTotalSupply() external view returns (uint256);
}

contract BurnUpgradeForkMainnetTest is Test {
    address public constant NOUNDERS = 0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5;
    INounsDAOLogicV3 public constant NOUNS_DAO_PROXY_MAINNET =
        INounsDAOLogicV3(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    address public constant auctionHouseProxyAdmin = 0xC1C119932d78aB9080862C5fcb964029f086401e;
    address public constant auctionHouseProxy = 0x830BD73E4184ceF73443C15111a1DF14e495C706;
    NounsToken public constant nouns = NounsToken(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);
    INounsDAOExecutor public constant NOUNS_TIMELOCK_V2_MAINNET =
        INounsDAOExecutor(0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71);

    NounsAuctionHouseV2 newAuctionHouseLogic;
    NounsDAOExecutorV3 executorV3Logic;
    ExcessETHBurner burner;

    function setUp() public {
        vm.createSelectFork(vm.envString('RPC_MAINNET'), 18291531);
        vm.setEnv('DEPLOYER_PRIVATE_KEY', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

        // 1. Deploy all new contracts
        (
            NounsAuctionHouseV2 newAuctionHouseLogic_,
            NounsAuctionHousePreV2Migration migrationLogic
        ) = new DeployAuctionHouseV2Mainnet().run();
        (NounsDAOExecutorV3 executorV3_, ExcessETHBurner burner_) = new DeployExecutorV3AndExcessETHBurnerMainnet()
            .run();
        newAuctionHouseLogic = newAuctionHouseLogic_;
        executorV3Logic = executorV3_;
        burner = burner_;

        // 2. Upgrade Auction House & Timelock
        upgradeAuctionHouseAndTimelock(
            address(newAuctionHouseLogic_),
            address(migrationLogic),
            address(executorV3_),
            address(burner_)
        );
    }

    function upgradeAuctionHouseAndTimelock(
        address newAuctionHouseLogic_,
        address migrationLogic_,
        address executorV3Logic_,
        address ethBurner_
    ) internal {
        // give ourselves voting power
        vm.prank(NOUNDERS);
        nouns.delegate(address(this));
        vm.roll(block.number + 1);

        uint256 proposalId = proposeAuctionHouseV2AndTimelockUpgrade(
            newAuctionHouseLogic_,
            migrationLogic_,
            executorV3Logic_,
            ethBurner_
        );

        // simulate vote & proposal execution
        voteAndExecuteProposal(proposalId);
    }

    function get1967Implementation(address proxy) internal returns (address) {
        bytes32 slot = bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1);
        return address(uint160(uint256(vm.load(proxy, slot))));
    }

    function proposeAuctionHouseV2AndTimelockUpgrade(
        address newLogic,
        address migrationLogic,
        address executorV3Logic,
        address ethBurner
    ) internal returns (uint256 proposalId) {
        uint8 numTxs = 5;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        // Upgrade to migration logic
        uint256 i = 0;
        targets[i] = auctionHouseProxyAdmin;
        values[i] = 0;
        signatures[i] = 'upgrade(address,address)';
        calldatas[i] = abi.encode(auctionHouseProxy, migrationLogic);

        // Run migration logic
        i = 1;
        targets[i] = auctionHouseProxy;
        values[i] = 0;
        signatures[i] = 'migrate()';
        calldatas[i] = '';

        // Upgrade to V2 logic
        i = 2;
        targets[i] = auctionHouseProxyAdmin;
        values[i] = 0;
        signatures[i] = 'upgrade(address,address)';
        calldatas[i] = abi.encode(auctionHouseProxy, newLogic);

        // Upgrade timelock to V3
        i = 3;
        targets[i] = address(NOUNS_TIMELOCK_V2_MAINNET);
        values[i] = 0;
        signatures[i] = 'upgradeTo(address)';
        calldatas[i] = abi.encode(executorV3Logic);

        // Set Burner
        i = 4;
        targets[i] = address(NOUNS_TIMELOCK_V2_MAINNET);
        values[i] = 0;
        signatures[i] = 'setExcessETHBurner(address)';
        calldatas[i] = abi.encode(ethBurner);

        proposalId = NOUNS_DAO_PROXY_MAINNET.propose(
            targets,
            values,
            signatures,
            calldatas,
            'Upgrade to Auction House V2 & timelock V3'
        );
        console.log('Proposed proposalId: %d', proposalId);
    }

    function voteAndExecuteProposal(uint256 proposalId) internal {
        vm.roll(
            block.number +
                NOUNS_DAO_PROXY_MAINNET.votingDelay() +
                NOUNS_DAO_PROXY_MAINNET.proposalUpdatablePeriodInBlocks() +
                1
        );
        NOUNS_DAO_PROXY_MAINNET.castVote(proposalId, 1);

        vm.roll(block.number + NOUNS_DAO_PROXY_MAINNET.votingPeriod() + 1);
        NOUNS_DAO_PROXY_MAINNET.queue(proposalId);

        vm.warp(block.timestamp + NOUNS_TIMELOCK_V2_MAINNET.delay());
        NOUNS_DAO_PROXY_MAINNET.execute(proposalId);
    }

    function test_proxiesWereUpgraded() public {
        assertEq(get1967Implementation(auctionHouseProxy), address(newAuctionHouseLogic), 'upgrade failed');
        assertEq(
            get1967Implementation(address(NOUNS_TIMELOCK_V2_MAINNET)),
            address(executorV3Logic),
            'timelock upgrade failed'
        );
    }

    function test_burnerIsOffAtFirst() public {
        // initial id is very high, i.e. noun minting won't reach it any time soon
        assertGt(burner.initialBurnNounId(), 1000000);

        vm.expectRevert(ExcessETHBurner.NotTimeToBurnYet.selector);
        burner.burnExcessETH();
    }

    function test_burn() public {
        uint256 proposalId = proposeToTurnOnBurn(880, 10, 4, 20);
        voteAndExecuteProposal(proposalId);

        assertEq(burner.initialBurnNounId(), 880);
        assertEq(burner.nounIdsBetweenBurns(), 10);
        assertEq(burner.burnWindowSize(), 4);
        assertEq(burner.numberOfPastAuctionsForMeanPrice(), 20);

        NounsAuctionHouseV2 ah = NounsAuctionHouseV2(auctionHouseProxy);
        vm.warp(ah.auction().endTime + 1);
        ah.settleCurrentAndCreateNewAuction();

        for (uint256 i; i < 10; i++) {
            ah.createBid{ value: 20 ether }(ah.auction().nounId);
            vm.warp(ah.auction().endTime + 1);
            ah.settleCurrentAndCreateNewAuction();
        }

        vm.expectRevert(ExcessETHBurner.NotEnoughAuctionHistory.selector);
        burner.burnExcessETH();

        for (uint256 i; i < 10; i++) {
            ah.createBid{ value: 30 ether }(ah.auction().nounId);
            vm.warp(ah.auction().endTime + 1);
            ah.settleCurrentAndCreateNewAuction();
        }

        assertEq(burner.meanAuctionPrice(), 25 ether);
        assertEq(NOUNS_DAO_PROXY_MAINNET.adjustedTotalSupply(), 422);
        assertEq(burner.expectedTreasuryValueInETH(), 10550 ether);
        assertEq(burner.treasuryValueInETH(), 13899.047817579079479237 ether);

        // treasury has less ETH than 13899 - 25 * 422, therefore, only the available ETH in the treasury will be burned
        assertEq(address(NOUNS_TIMELOCK_V2_MAINNET).balance, 2813.062865210366418892 ether);

        burner.burnExcessETH();

        assertEq(address(NOUNS_TIMELOCK_V2_MAINNET).balance, 0);
    }

    function proposeToTurnOnBurn(
        uint64 initialBurnNounId,
        uint64 nounIdsBetweenBurns,
        uint16 burnWindowSize,
        uint16 numberOfPastAuctionsForMeanPrice
    ) internal returns (uint256 proposalId) {
        uint8 numTxs = 4;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        uint256 i = 0;
        targets[i] = address(burner);
        values[i] = 0;
        signatures[i] = 'setInitialBurnNounId(uint64)';
        calldatas[i] = abi.encode(initialBurnNounId);

        i = 1;
        targets[i] = address(burner);
        values[i] = 0;
        signatures[i] = 'setNounIdsBetweenBurns(uint64)';
        calldatas[i] = abi.encode(nounIdsBetweenBurns);

        i = 2;
        targets[i] = address(burner);
        values[i] = 0;
        signatures[i] = 'setBurnWindowSize(uint16)';
        calldatas[i] = abi.encode(burnWindowSize);

        i = 3;
        targets[i] = address(burner);
        values[i] = 0;
        signatures[i] = 'setNumberOfPastAuctionsForMeanPrice(uint16)';
        calldatas[i] = abi.encode(numberOfPastAuctionsForMeanPrice);

        proposalId = NOUNS_DAO_PROXY_MAINNET.propose(targets, values, signatures, calldatas, 'Turn on burn');
        console.log('Proposed proposalId: %d', proposalId);
    }
}
