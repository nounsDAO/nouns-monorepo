// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { IForkDAODeployer } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract ForkDAODeployerMock is IForkDAODeployer, StdCheats {
    address public mockTreasury = makeAddr('mock treasury');
    address public mockToken = makeAddr('mock token');

    function deployForkDAO() external view returns (address treasury, address token) {
        treasury = mockTreasury;
        token = mockToken;
    }
}
