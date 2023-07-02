// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

interface IRepTokens is IAccessControl, IERC1155
{
    function MINTER_ROLE() external view returns(bytes32);
    function DISTRIBUTOR_ROLE() external view returns(bytes32);
    function BURNER_ROLE() external view returns(bytes32);
    function TOKEN_MIGRATOR_ROLE() external view returns(bytes32);

    function mint(
        address to,
        uint256 amount,
        bytes memory data
    ) external;

    function maxMintAmountPerTx() external view returns(uint256);

    function setMaxMintAmount(
        uint256 value
    ) external;

    function setDestinationWallet(address destination) external;

    //from : distributor
    //to : address
    function distribute(
        address from,
        address to,
        uint256 amount,
        bytes memory data
    ) external;

    //this needs to be called beforehand by address that wants to transfer its soulbound tokens:
    //setApprovalForAll(TOKEN_MIGRATOR_ROLE, true)
    function migrateOwnershipOfTokens(
        address from,
        address to
    ) external;


    function getOwnersOfTokenID(
        uint256 tokenID
    ) external view returns (address[] memory);

    function getOwnersOfTokenIDLength(
        uint256 tokenID
    ) external view returns (uint256);

    function togglePause() external;
}
