// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "../base/ERC721.sol";

interface ICryptopunks {
    function transferPunk(address to, uint256 punkIndex) external;
}

contract Proxy {
    address immutable private _wrappedPunkContract;
    ICryptopunks immutable private _cryptoPunksContract;

    constructor(ICryptopunks cryptoPunksContract) {
        _wrappedPunkContract = msg.sender;
        _cryptoPunksContract = cryptoPunksContract;
    }

    function get(uint256 punkIndex) external {
        require(msg.sender == _wrappedPunkContract, "Proxy: invalid caller");
        _cryptoPunksContract.transferPunk(_wrappedPunkContract, punkIndex);
    }

}

contract WrappedPunkMock is ERC721 {
    event ProxyRegistered(address user, address proxy);

    mapping(address => Proxy) private _proxy;
    ICryptopunks immutable private _cryptoPunksContract;

    constructor(ICryptopunks cryptoPunksContract) ERC721("Wrapped Cryptopunks Mock", "WPUNKS") {
        _cryptoPunksContract = cryptoPunksContract;
    }

    function registerProxy() external {
        Proxy proxy = new Proxy(_cryptoPunksContract);
        _proxy[_msgSender()] = proxy;
        emit ProxyRegistered(_msgSender(), address(proxy));
    }

    function proxyInfo(address user) external view returns (address) {
        return address(_proxy[user]);
    }

    function mint(uint256 punkIndex) external {
        Proxy proxy = _proxy[_msgSender()];
        require(address(proxy) != address(0), "WrappedPunkMock: proxy not registered");
        proxy.get(punkIndex);
        _mint(address(this), _msgSender(), punkIndex);
    }

    /**
     * @dev Burns a specific wrapped punk
     */
    function burn(uint256 punkIndex) external {
        require(_isApprovedOrOwner(_msgSender(), punkIndex), "WrappedPunkMock: caller is not owner nor approved");
        _burn(punkIndex);
        _cryptoPunksContract.transferPunk(_msgSender(), punkIndex);
    }
}