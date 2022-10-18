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

library Noracle {
    struct Observation {
        // The block.timestamp when the auction was settled
        uint32 blockTimestamp;
        // ID for the Noun (ERC721 token ID)
        uint16 nounId;
        // The winning bid amount, with 8 decimal places (reducing accuracy to save bits)
        uint40 amount;
        // The address of the auction winner
        address winner;
        // whether or not the observation is initialized
        bool initialized;
    }

    struct NoracleState {
        mapping(uint32 => Observation) observations;
        uint32 index;
        uint32 cardinality;
        uint32 cardinalityNext;
    }

    function initialize(NoracleState storage self) internal {
        if (self.cardinality > 0) return;

        self.cardinality = 1;
        self.cardinalityNext = 1;
        warmUpObservation(self.observations[0]);
    }

    function write(
        NoracleState storage self,
        uint32 blockTimestamp,
        uint16 nounId,
        uint40 amount,
        address winner
    ) internal {
        // if the conditions are right, we can bump the cardinality
        uint32 cardinalityNext = self.cardinalityNext;
        uint32 currentIndex = self.index;
        if (cardinalityNext > self.cardinality && currentIndex == (self.cardinality - 1)) {
            self.cardinality = cardinalityNext;
        }

        uint32 newIndex = (currentIndex + 1) % self.cardinality;
        self.index = newIndex;
        self.observations[newIndex] = Observation({
            initialized: true,
            blockTimestamp: blockTimestamp,
            nounId: nounId,
            amount: amount,
            winner: winner
        });
    }

    function grow(NoracleState storage self, uint32 next) internal returns (uint32) {
        uint32 current = self.cardinalityNext;

        // no-op if the passed next value isn't greater than the current next value
        if (next <= current) return current;

        // store in each slot to prevent fresh SSTOREs
        // this data will not be used because the initialized boolean is still false
        for (uint32 i = current; i < next; i++) {
            warmUpObservation(self.observations[i]);
        }

        return self.cardinalityNext = next;
    }

    function observe(NoracleState storage self, uint32 fromAuctionsAgo)
        internal
        view
        returns (Observation[] memory observations)
    {
        uint32 cardinality = self.cardinality;
        require(fromAuctionsAgo <= cardinality, 'too many auctions ago');

        uint32 index = self.index;
        observations = new Observation[](fromAuctionsAgo);
        uint32 initializedObservationsFound = 0;
        uint32 checkedIndexesCount = 0;
        while (initializedObservationsFound < fromAuctionsAgo && checkedIndexesCount < cardinality) {
            uint32 checkIndex = (index + (cardinality - checkedIndexesCount)) % cardinality;
            checkedIndexesCount++;

            Observation storage obs = self.observations[checkIndex];
            if (obs.initialized) {
                observations[initializedObservationsFound] = obs;
                initializedObservationsFound++;
            }
        }
    }

    function ethPriceToUint40(uint256 ethPrice) internal pure returns (uint40) {
        return uint40(ethPrice / 1e10);
    }

    function warmUpObservation(Observation storage obs) private {
        obs.blockTimestamp = 1;
    }
}
