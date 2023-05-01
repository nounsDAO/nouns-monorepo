// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { ISplitDAODeployer } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract SplitDAODeployerMock is ISplitDAODeployer, StdCheats {
    address public mockTreasury = makeAddr('mock treasury');

    function deploySplitDAO(address) external view returns (address treasury) {
        treasury = mockTreasury;
    }
}
