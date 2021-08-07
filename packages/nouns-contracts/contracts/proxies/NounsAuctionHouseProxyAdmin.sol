// SPDX-License-Identifier: Unlicense

/// @title The Nouns DAO auction house proxy admin

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒░░░ *
 * ░░░░░░▒▒░░░▒▒▒▒░░▒▒░░░▒▒▒▒░░░ *
 * ░░▒▒▒▒▒▒░░░▒▒▒▒▒▒▒▒░░░▒▒▒▒░░░ *
 * ░░▒▒░░▒▒░░░▒▒▒▒░░▒▒░░░▒▒▒▒░░░ *
 * ░░▒▒░░▒▒░░░▒▒▒▒░░▒▒░░░▒▒▒▒░░░ *
 * ░░░░░░▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
*********************************/

pragma solidity ^0.8.6;

import { ProxyAdmin } from '@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol';

// prettier-ignore
contract NounsAuctionHouseProxyAdmin is ProxyAdmin {}
