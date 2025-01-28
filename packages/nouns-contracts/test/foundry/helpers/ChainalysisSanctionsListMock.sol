// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { IChainalysisSanctionsList } from '../../../contracts/external/chainalysis/IChainalysisSanctionsList.sol';

contract ChainalysisSanctionsListMock is IChainalysisSanctionsList {
    mapping(address => bool) public sanctioned;

    function isSanctioned(address addr) external view returns (bool) {
        return sanctioned[addr];
    }

    function setSanctioned(address addr, bool value) public {
        sanctioned[addr] = value;
    }
}
