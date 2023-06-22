// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { ProposeDAOV3UpgradeMainnet } from '../../../script/ProposeDAOV3UpgradeMainnet.s.sol';
import { DeployDAOV3NewContractsMainnet } from '../../../script/DeployDAOV3NewContractsMainnet.s.sol';
import { ProposeTimelockMigrationCleanupMainnet } from '../../../script/ProposeTimelockMigrationCleanupMainnet.s.sol';
import { ProposeENSReverseLookupConfigMainnet } from '../../../script/ProposeENSReverseLookupConfigMainnet.s.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOProxy } from '../../../contracts/governance/NounsDAOProxy.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { INounsDAOExecutor, INounsDAOForkEscrow, IForkDAODeployer } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOForkEscrow } from '../../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ForkDAODeployer } from '../../../contracts/governance/fork/ForkDAODeployer.sol';
import { NounsDAOLogicV1Fork } from '../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { ERC20Transferer } from '../../../contracts/utils/ERC20Transferer.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { NounsAuctionHouse } from '../../../contracts/NounsAuctionHouse.sol';
import { ERC721Enumerable } from '../../../contracts/base/ERC721Enumerable.sol';
import { NounsTokenFork } from '../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsDAOLogicV1Fork } from '../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { ENSNamehash } from '../lib/ENSNamehash.sol';
import '../lib/ENSInterfaces.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IHasName {
    function NAME() external pure returns (string memory);
}

interface IOwnable {
    function owner() external view returns (address);
}

contract UpgradeToDAOV3ForkMainnetTest is Test {
    address public constant NOUNDERS = 0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5;
    NounsToken public nouns = NounsToken(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);
    uint256 proposalId;
    address proposerAddr = vm.addr(0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb);
    NounsDAOLogicV1 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV1(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    INounsDAOExecutor public constant NOUNS_TIMELOCK_V1_MAINNET =
        INounsDAOExecutor(0x0BC3807Ec262cB779b38D65b38158acC3bfedE10);
    address public constant AUCTION_HOUSE_PROXY_ADMIN_MAINNET = 0xC1C119932d78aB9080862C5fcb964029f086401e;
    address public constant DESCRIPTOR_MAINNET = 0x6229c811D04501523C6058bfAAc29c91bb586268;
    address public constant LILNOUNS_MAINNET = 0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B;
    address whaleAddr = 0xf6B6F07862A02C85628B3A9688beae07fEA9C863;
    uint256 public constant INITIAL_ETH_IN_TREASURY = 12919915363316446110962;
    uint256 public constant STETH_BALANCE = 14931432047776533741220;
    address public constant STETH_MAINNET = 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84;
    address public constant TOKEN_BUYER_MAINNET = 0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5;
    address public constant PAYER_MAINNET = 0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D;
    address public constant AUCTION_HOUSE_PROXY_MAINNET = 0x830BD73E4184ceF73443C15111a1DF14e495C706;

    NounsDAOExecutorV2 timelockV2;
    NounsDAOLogicV3 daoV3;

    uint256[] tokenIds;
    address[] targets;
    uint256[] values;
    string[] signatures;
    bytes[] calldatas;

    function setUp() public {
        vm.createSelectFork(vm.envString('RPC_MAINNET'), 17315040);

        assertEq(address(NOUNS_TIMELOCK_V1_MAINNET).balance, INITIAL_ETH_IN_TREASURY);

        // give ourselves voting power
        vm.prank(NOUNDERS);
        nouns.delegate(proposerAddr);

        vm.roll(block.number + 1);

        // deploy contracts

        vm.setEnv('DEPLOYER_PRIVATE_KEY', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

        (
            NounsDAOForkEscrow forkEscrow,
            ForkDAODeployer forkDeployer,
            NounsDAOLogicV3 daoV3Impl,
            NounsDAOExecutorV2 timelockV2_,
            ERC20Transferer erc20Transferer_
        ) = new DeployDAOV3NewContractsMainnet().run();

        timelockV2 = timelockV2_;

        // propose upgrade

        vm.setEnv('PROPOSER_KEY', '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

        vm.setEnv('DAO_V3_IMPL', Strings.toHexString(uint160(address(daoV3Impl)), 20));
        vm.setEnv('TIMELOCK_V2', Strings.toHexString(uint160(address(timelockV2)), 20));
        vm.setEnv('FORK_ESCROW', Strings.toHexString(uint160(address(forkEscrow)), 20));
        vm.setEnv('FORK_DEPLOYER', Strings.toHexString(uint160(address(forkDeployer)), 20));
        vm.setEnv('ERC20_TRANSFERER', Strings.toHexString(uint160(address(erc20Transferer_)), 20));
        vm.setEnv('PROPOSAL_DESCRIPTION_FILE', 'test/foundry/NounsDAOLogicV3/proposal-description.txt');

        proposalId = new ProposeDAOV3UpgradeMainnet().run();

        // simulate vote & proposal execution
        voteAndExecuteProposal();

        daoV3 = NounsDAOLogicV3(payable(address(NOUNS_DAO_PROXY_MAINNET)));
    }

    function voteAndExecuteProposal() internal {
        vm.roll(block.number + NOUNS_DAO_PROXY_MAINNET.votingDelay() + 1);
        vm.prank(proposerAddr);
        NOUNS_DAO_PROXY_MAINNET.castVote(proposalId, 1);
        vm.prank(whaleAddr);
        NOUNS_DAO_PROXY_MAINNET.castVote(proposalId, 1);

        vm.roll(block.number + NOUNS_DAO_PROXY_MAINNET.votingPeriod() + 1);
        NOUNS_DAO_PROXY_MAINNET.queue(proposalId);

        vm.warp(block.timestamp + NOUNS_TIMELOCK_V1_MAINNET.delay());
        NOUNS_DAO_PROXY_MAINNET.execute(proposalId);
    }

    function test_transfersETHToNewTimelock() public {
        assertEq(address(daoV3.timelockV1()).balance, INITIAL_ETH_IN_TREASURY - 10_000 ether);
        assertEq(address(daoV3.timelock()).balance, 10_000 ether);
    }

    function test_timelockV2adminIsDAO() public {
        assertEq(timelockV2.admin(), address(NOUNS_DAO_PROXY_MAINNET));
    }

    function test_timelockV2delayIsCopiedFromTimelockV1() public {
        assertEq(timelockV2.delay(), NOUNS_TIMELOCK_V1_MAINNET.delay());
    }

    function test_forkEscrowConstructorParamsAreCorrect() public {
        INounsDAOForkEscrow forkEscrow = daoV3.forkEscrow();
        assertEq(address(forkEscrow.dao()), address(NOUNS_DAO_PROXY_MAINNET));
        assertEq(address(forkEscrow.nounsToken()), address(nouns));
    }

    function test_forkDeployerSetsImplementationContracts() public {
        IForkDAODeployer forkDeployer = daoV3.forkDAODeployer();
        assertEq(IHasName(forkDeployer.tokenImpl()).NAME(), 'NounsTokenFork');
        assertEq(IHasName(forkDeployer.auctionImpl()).NAME(), 'NounsAuctionHouseFork');
        assertEq(NounsDAOLogicV1Fork(forkDeployer.governorImpl()).name(), 'Nouns DAO');
        assertEq(IHasName(forkDeployer.treasuryImpl()).NAME(), 'NounsDAOExecutorV2');
    }

    function test_forkParams() public {
        address[] memory erc20TokensToIncludeInFork = daoV3.erc20TokensToIncludeInFork();
        assertEq(erc20TokensToIncludeInFork.length, 1);
        assertEq(erc20TokensToIncludeInFork[0], STETH_MAINNET);

        assertEq(daoV3.forkPeriod(), 7 days);
        assertEq(daoV3.forkThresholdBPS(), 2000);
    }

    function test_setsTimelocksAndAdmin() public {
        assertEq(address(daoV3.timelock()), address(timelockV2));
        assertEq(address(daoV3.timelockV1()), address(NOUNS_TIMELOCK_V1_MAINNET));
        assertEq(NounsDAOProxy(payable(address(daoV3))).admin(), address(timelockV2));
    }

    function test_DAOV3Params() public {
        assertEq(daoV3.lastMinuteWindowInBlocks(), 0);
        assertEq(daoV3.objectionPeriodDurationInBlocks(), 0);
        assertEq(daoV3.proposalUpdatablePeriodInBlocks(), 0);

        assertEq(daoV3.voteSnapshotBlockSwitchProposalId(), 299);
    }

    function test_transfersAllstETH() public {
        assertEq(IERC20(STETH_MAINNET).balanceOf(address(NOUNS_TIMELOCK_V1_MAINNET)), 1);
        assertEq(IERC20(STETH_MAINNET).balanceOf(address(timelockV2)), STETH_BALANCE - 1);
    }

    function test_AuctionHouse_changedOwner() public {
        assertEq(IOwnable(AUCTION_HOUSE_PROXY_MAINNET).owner(), address(timelockV2));
    }

    function test_AuctionHouseRevenueGoesToNewTimelock() public {
        assertEq(address(daoV3.timelock()).balance, 10_000 ether);

        (, uint256 amount, , uint256 endTime, , ) = NounsAuctionHouse(AUCTION_HOUSE_PROXY_MAINNET).auction();
        vm.warp(endTime + 1);
        NounsAuctionHouse(AUCTION_HOUSE_PROXY_MAINNET).settleCurrentAndCreateNewAuction();

        assertEq(address(daoV3.timelock()).balance, 10_000 ether + amount);
    }

    function test_forkScenarioAfterUpgrade() public {
        uint256[] memory whaleTokens = _getAllNounsOf(whaleAddr);
        _escrowAllNouns(whaleAddr);
        _escrowAllNouns(NOUNDERS);
        _escrowAllNouns(0x5606B493c51316A9e65c9b2A00BbF7Ff92515A3E);
        _escrowAllNouns(0xd1d1D4e36117aB794ec5d4c78cBD3a8904E691D0);
        _escrowAllNouns(0x7dE92ca2D0768cDbA376Aac853234D4EEd8d8B5C);
        _escrowAllNouns(0xFa4FC4ec2F81A4897743C5b4f45907c02ce06199);

        (address forkTreasury, address forkToken) = daoV3.executeFork();

        vm.startPrank(whaleAddr);
        NounsTokenFork(forkToken).claimFromEscrow(whaleTokens);
        vm.roll(block.number + 1);

        NounsDAOLogicV1Fork forkDao = NounsDAOLogicV1Fork(NounsDAOExecutorV2(payable(forkTreasury)).admin());

        targets = [makeAddr('wallet')];
        values = [50 ether];
        signatures = [''];
        calldatas = [bytes('')];

        vm.expectRevert(NounsDAOLogicV1Fork.GovernanceBlockedDuringForkingPeriod.selector);
        forkDao.propose(targets, values, signatures, calldatas, 'new prop');

        vm.warp(block.timestamp + 7 days);
        vm.expectRevert(NounsDAOLogicV1Fork.WaitingForTokensToClaimOrExpiration.selector);
        forkDao.propose(targets, values, signatures, calldatas, 'new prop');

        vm.warp(forkDao.delayedGovernanceExpirationTimestamp() + 1);
        forkDao.propose(targets, values, signatures, calldatas, 'new prop');

        vm.roll(block.number + forkDao.votingDelay() + 1);
        forkDao.castVote(1, 1);

        vm.roll(block.number + forkDao.votingPeriod());
        forkDao.queue(1);

        vm.warp(block.timestamp + 2 days);
        forkDao.execute(1);

        assertEq(makeAddr('wallet').balance, 50 ether);

        // check new forked DAO has correct params
        assertEq(forkDao.votingDelay(), 36000);
        assertEq(forkDao.votingPeriod(), 36000);
        assertEq(forkDao.proposalThresholdBPS(), 25);
        assertEq(forkDao.quorumVotesBPS(), 1000);
    }

    function test_timelockV1CleanupProposal() public {
        uint256 timelockV1Balance = address(NOUNS_TIMELOCK_V1_MAINNET).balance;
        assertGt(timelockV1Balance, 2919 ether);
        uint256 expectedV2Balance = address(timelockV2).balance + timelockV1Balance;

        proposalId = new ProposeTimelockMigrationCleanupMainnet().run();
        voteAndExecuteProposal();

        assertEq(nouns.owner(), address(timelockV2));
        assertEq(Ownable(DESCRIPTOR_MAINNET).owner(), address(timelockV2));
        assertEq(Ownable(AUCTION_HOUSE_PROXY_ADMIN_MAINNET).owner(), address(timelockV2));
        assertEq(address(NOUNS_TIMELOCK_V1_MAINNET).balance, 0);
        assertEq(address(timelockV2).balance, expectedV2Balance);
        assertTrue(IERC721(LILNOUNS_MAINNET).isApprovedForAll(address(NOUNS_TIMELOCK_V1_MAINNET), address(timelockV2)));
        assertEq(nouns.balanceOf(address(NOUNS_TIMELOCK_V1_MAINNET)), 0);
        assertEq(nouns.ownerOf(687), address(timelockV2));
        assertEq(IOwnable(TOKEN_BUYER_MAINNET).owner(), address(timelockV2));
        assertEq(IOwnable(PAYER_MAINNET).owner(), address(timelockV2));
    }

    function test_ensChange_nounsDotETHResolvesBothWaysWithTimelockV2() public {
        ENS ens = ENS(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
        // 0xdc972a4db1aa8630a234db4202794eae94ad0e7a9e201e13667ac92aa887a02a
        bytes32 node = ENSNamehash.namehash('nouns.eth');
        Resolver resolver = Resolver(ens.resolver(node));

        // showing nouns.eth resolves to timelockv1
        assertEq(resolver.addr(node), address(NOUNS_TIMELOCK_V1_MAINNET));

        // this is a critical step that will need to happen outside DAO proposals
        // 0x88f9E324801320A3fC22C8d045A98Ad32a490d8E;
        vm.prank(ens.owner(node));
        resolver.setAddr(node, address(timelockV2));

        // showing nouns.eth resolves to timelockv2 after the setAddr change
        assertEq(resolver.addr(node), address(timelockV2));

        // Now tackling reverse lookup

        // the proposal calls (reverse.ens.eth).setName('nouns.eth') from timelock V2
        proposalId = new ProposeENSReverseLookupConfigMainnet().run();
        voteAndExecuteProposal();

        // reverse.ens.eth
        ReverseRegistrar reverse = ReverseRegistrar(0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb);
        bytes32 resolvedReverseNode = reverse.node(address(timelockV2)); // 0xb983f3b9362fbdfcdb9012cf09dce9ae0c0a377c167b14fdf5b3bd94a4dfdf81

        // showing that timelockV2's address resolves to nouns.eth
        assertEq(reverse.defaultResolver().name(resolvedReverseNode), 'nouns.eth');
    }

    function _escrowAllNouns(address owner) internal {
        vm.startPrank(owner);
        daoV3.nouns().setApprovalForAll(address(daoV3), true);
        daoV3.escrowToFork(_getAllNounsOf(owner), new uint256[](0), '');
        vm.stopPrank();
    }

    function _getAllNounsOf(address owner) internal view returns (uint256[] memory) {
        ERC721Enumerable nouns_ = ERC721Enumerable(address(daoV3.nouns()));
        uint256 numTokens = nouns_.balanceOf(owner);

        uint256[] memory tokens = new uint256[](numTokens);

        for (uint256 i; i < numTokens; i++) {
            tokens[i] = nouns_.tokenOfOwnerByIndex(owner, i);
        }

        return tokens;
    }
}
