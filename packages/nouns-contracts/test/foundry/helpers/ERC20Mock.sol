// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

interface IERC20Receiver {
    function onERC20Received(address from, uint256 amount) external;
}

contract ERC20Mock is ERC20 {
    bool public failNextTransfer;
    bool public callbackNextTransfer;
    bool public wasTransferCalled;

    constructor() ERC20('Mock', 'MOCK') {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        wasTransferCalled = true;
        super.transfer(recipient, amount);
        if (callbackNextTransfer) {
            callbackNextTransfer = false;
            IERC20Receiver(recipient).onERC20Received(msg.sender, amount);
        }
        if (failNextTransfer) {
            failNextTransfer = false;
            return false;
        }
        return true;
    }

    function setFailNextTransfer(bool failNextTransfer_) external {
        failNextTransfer = failNextTransfer_;
    }

    function setCallbackOnNextTransfer(bool callbackNextTransfer_) external {
        callbackNextTransfer = callbackNextTransfer_;
    }

    function setWasTransferCalled(bool wasTransferCalled_) external {
        wasTransferCalled = wasTransferCalled_;
    }
}

contract RocketETHMock is ERC20Mock {
    uint256 rate;

    constructor() ERC20Mock() {
        rate = 1;
    }

    function setRate(uint256 rate_) public {
        rate = rate_;
    }

    function getEthValue(uint256 _rethAmount) external view returns (uint256) {
        return _rethAmount * rate;
    }
}
