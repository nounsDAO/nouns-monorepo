// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { IForkDAODeployer, INounsDAOForkEscrow } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract ForkDAOTokenMock {
    function claimDuringForkPeriod(address to, uint256[] calldata tokenIds) external {}
}

contract ForkDAODeployerMock is IForkDAODeployer, StdCheats {
    address public mockTreasury = makeAddr('mock treasury');
    address public mockToken = address(new ForkDAOTokenMock());

    function deployForkDAO(uint256, INounsDAOForkEscrow) external view returns (address treasury, address token) {
        treasury = mockTreasury;
        token = mockToken;
    }

    function setTreasury(address treasury) public {
        mockTreasury = treasury;
    }

    function tokenImpl() external pure returns (address) {
        return address(0);
    }

    function auctionImpl() external pure returns (address) {
        return address(0);
    }

    function governorImpl() external pure returns (address) {
        return address(0);
    }

    function treasuryImpl() external pure returns (address) {
        return address(0);
    }
}
