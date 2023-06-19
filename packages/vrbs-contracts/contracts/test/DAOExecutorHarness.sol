// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/DAOExecutor.sol';

interface Administered {
    function _acceptAdmin() external returns (uint256);
}

contract DAOExecutorHarness is DAOExecutor {
    constructor(address admin_, uint256 delay_) DAOExecutor(admin_, delay_) {}

    function harnessSetPendingAdmin(address pendingAdmin_) public {
        pendingAdmin = pendingAdmin_;
    }

    function harnessSetAdmin(address admin_) public {
        admin = admin_;
    }
}

contract DAOExecutorTest is DAOExecutor {
    constructor(address admin_, uint256 delay_) DAOExecutor(admin_, 2 days) {
        delay = delay_;
    }

    function harnessSetAdmin(address admin_) public {
        require(msg.sender == admin);
        admin = admin_;
    }

    function harnessAcceptAdmin(Administered administered) public {
        administered._acceptAdmin();
    }
}
