pragma solidity ^0.8.13;

contract TestContract {
    uint256 public value;

    constructor() {
        value = 42;
    }

    function setValue(uint256 _value) public {
        value = _value;
    }
}
