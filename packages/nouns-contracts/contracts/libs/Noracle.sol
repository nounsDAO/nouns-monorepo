// SPDX-License-Identifier: GPL-3.0

/// @title A library used to maintain Nouns Auction House price history

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.6;

/**
 * @dev A Nouns price history oracle. Inspired by Uniswap's Oracle.sol:
 * https://github.com/Uniswap/v3-core/blob/fc2107bd5709cdee6742d5164c1eb998566bcb75/contracts/libraries/Oracle.sol
 *
 * It uses warmed up storage slots only, to minimize the cost on users when settling auctions and storing prices.
 * The number of slots is stored in the `cardinality` state var, and can be increased by users who choose to pay the gas.
 *
 * `Observation` variable sizes have been packed to fit all variables in a single storage slot, to further optimize
 * gas on both `grow` and `write` functions.
 */
library Noracle {
    /// @notice The value assigned to an Observation's `blockTimestamp` to warm up the storage slot.
    uint32 public constant WARMUP_TIMESTAMP = 1;

    error AlreadyInitialized();
    error NotInitialized();
    error AuctionCountOutOfBounds(uint32 auctionCount, uint32 cardinality);

    /**
     * @dev Struct members size has been adjusted so the sum of bits is 256, to fit into a single storage slot.
     * The maximum `amount` supported is 2814749.76710655 ETH.
     */
    struct Observation {
        // The block.timestamp when the auction was settled.
        uint32 blockTimestamp;
        // ID for the Noun (ERC721 token ID).
        uint16 nounId;
        // The winning bid amount, with 8 decimal places (reducing accuracy to save bits).
        uint48 amount;
        // The address of the auction winner.
        address winner;
    }

    /**
     * @dev Contains the full oracle state, the primary `self` used in this library, as a UX optimization for
     * contracts using this library, so they don't have to keep track of any state variables (as opposed to Uniswap's
     * oracle where the Pool contract holds these state variables).
     */
    struct NoracleState {
        // Price history, stored as a mapping, and not an array, due to Solidity limitations.
        mapping(uint32 => Observation) observations;
        // The latest price index.
        uint32 index;
        // The maximum number of observation the oracle can store.
        uint32 cardinality;
        // The next value to assign to cardinality once the oracle needs more slots, also the current number of warm storage slots.
        uint32 cardinalityNext;
    }

    /**
     * @dev Initialize the oracle with a cardinality of one.
     */
    function initialize(NoracleState storage self) internal {
        if (self.cardinality > 0) revert AlreadyInitialized();

        self.cardinality = 1;
        self.cardinalityNext = 1;
        warmUpObservation(self.observations[0]);
    }

    /**
     * @dev Write a new auction price to oracle storage.
     * @param self The oracle state.
     * @param blockTimestamp The auction's settlement block timestamp, reduced to uint32.
     * @param nounId The auction's Noun ID.
     * @param amount The auction's winning bid, reduced to a uint48 with 8 decimal places. Max supported value is 2814749.76710655 ETH.
     * @param winner The auction winner's address.
     */
    function write(
        NoracleState storage self,
        uint32 blockTimestamp,
        uint16 nounId,
        uint48 amount,
        address winner
    ) internal {
        uint32 currentIndex = self.index;
        uint32 cardinality = self.cardinality;
        uint32 cardinalityNext = self.cardinalityNext;
        if (cardinalityNext == 0) return;

        // if the conditions are right, we can bump the cardinality
        if (cardinalityNext > cardinality && currentIndex == (cardinality - 1)) {
            self.cardinality = cardinality = cardinalityNext;
        }

        uint32 newIndex = (currentIndex + 1) % cardinality;
        self.index = newIndex;
        self.observations[newIndex] = Observation({
            blockTimestamp: blockTimestamp,
            nounId: nounId,
            amount: amount,
            winner: winner
        });
    }

    /**
     * @dev Grow the oracle's next cardinality, warming up the relevant storage slots.
     * Does nothing if `next` isn't greater than the current `cardinalityNext` value.
     * @param self The oracle state.
     * @param next The new `cardinalityNext` value.
     * @return uint32 The previous `cardinalityNext` value.
     * @return uint32 The new `cardinalityNext` value.
     */
    function grow(NoracleState storage self, uint32 next) internal returns (uint32, uint32) {
        uint32 current = self.cardinalityNext;
        if (current == 0) revert NotInitialized();

        // no-op if the passed next value isn't greater than the current next value
        if (next <= current) return (current, current);

        // store in each slot to prevent fresh SSTOREs
        // this data will not be used because the initialized boolean is still false
        for (uint32 i = current; i < next; ++i) {
            warmUpObservation(self.observations[i]);
        }

        self.cardinalityNext = next;
        return (current, next);
    }

    /**
     * @dev Get past auction prices, up to `oracle.cardinality` observations.
     * There are times when cardinality is increased and not yet fully used, when a user might request more
     * observations than what's stored; in such cases users will get the maximum number of observations the
     * oracle has to offer.
     * For example, say cardinality was just increased from 3 to 10, a user can then ask for 10 observations.
     * Since the oracle only has 3 prices stored, the user will get 3 observations.
     * Reverts with a `AuctionCountOutOfBounds` error if `auctionCount` is greater than `oracle.cardinality`.
     * @param self The oracle state.
     * @param auctionCount The number of price observations to get.
     * @return observations An array of type `Noracle.Observation`, where each Observation includes a timestamp,
     * the Noun ID of that auction, the winning bid amount, and the winner's addreess.
     */
    function observe(NoracleState storage self, uint32 auctionCount)
        internal
        view
        returns (Observation[] memory observations)
    {
        uint32 cardinality = self.cardinality;
        if (auctionCount > cardinality) revert AuctionCountOutOfBounds(auctionCount, cardinality);

        uint32 index = self.index;
        observations = new Observation[](auctionCount);

        uint32 observationsCount = 0;
        while (observationsCount < auctionCount) {
            uint32 checkIndex = (index + (cardinality - observationsCount)) % cardinality;
            Observation storage obs = self.observations[checkIndex];

            // when cardinality has been increased, and not used up yet, there are uninitialized items
            // this loop reads from index backwards, so when it hits an uninitialized item
            // it means all items from there backwards until index are uninitialized, so we should break.
            if (!initialized(obs)) break;

            observations[observationsCount] = obs;
            ++observationsCount;
        }

        if (auctionCount > observationsCount) {
            Observation[] memory trimmedObservations = new Observation[](observationsCount);
            for (uint32 i = 0; i < observationsCount; ++i) {
                trimmedObservations[i] = observations[i];
            }
            observations = trimmedObservations;
        }
    }

    /**
     * @dev Convert an ETH price of 256 bits with 18 decimals, to 48 bits with 8 decimals.
     * Max supported value is 2814749.76710655 ETH.
     */
    function ethPriceToUint48(uint256 ethPrice) internal pure returns (uint48) {
        return uint48(ethPrice / 1e10);
    }

    /**
     * @dev Write a stub value to warm up the observation storage slot.
     */
    function warmUpObservation(Observation storage obs) private {
        obs.blockTimestamp = WARMUP_TIMESTAMP;
    }

    /**
     * @dev Check if an observation has been initialized, by checking if it has a
     * non-stub `blockTimestamp` value.
     */
    function initialized(Observation storage obs) internal view returns (bool) {
        return obs.blockTimestamp > WARMUP_TIMESTAMP;
    }
}
