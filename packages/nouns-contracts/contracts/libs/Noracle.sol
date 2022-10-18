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
        mapping(uint16 => Observation) observations;
        uint16 index;
        uint16 cardinality;
        uint16 cardinalityNext;
    }

    function initialize(NoracleState storage self) internal {
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
        if (self.cardinalityNext > self.cardinality && self.index == (self.cardinality - 1)) {
            self.cardinality = self.cardinalityNext;
        }

        self.index = (self.index + 1) % self.cardinality;
        self.observations[self.index] = Observation({
            initialized: true,
            blockTimestamp: blockTimestamp,
            nounId: nounId,
            amount: amount,
            winner: winner
        });
    }

    function grow(NoracleState storage self, uint16 next) internal returns (uint16) {
        uint16 current = self.cardinalityNext;

        // no-op if the passed next value isn't greater than the current next value
        if (next <= current) return current;

        // store in each slot to prevent fresh SSTOREs in swaps
        // this data will not be used because the initialized boolean is still false
        for (uint16 i = current; i < next; i++) {
            warmUpObservation(self.observations[i]);
        }

        return self.cardinalityNext = next;
    }

    function observe(NoracleState storage self, uint16 fromAuctionsAgo)
        internal
        view
        returns (Observation[] memory observations)
    {
        uint16 cardinality = self.cardinality;
        require(fromAuctionsAgo <= cardinality, 'too many auctions ago');

        observations = new Observation[](fromAuctionsAgo);
        uint16 initializedObservationsFound = 0;
        uint16 checkedIndexesCount = 0;
        while (initializedObservationsFound < fromAuctionsAgo && checkedIndexesCount < cardinality) {
            uint16 checkIndex = (self.index + (cardinality - checkedIndexesCount)) % cardinality;
            Observation storage obs = self.observations[checkIndex];
            if (obs.initialized) {
                observations[initializedObservationsFound] = obs;
                initializedObservationsFound++;
            }
            checkedIndexesCount++;
        }
    }

    function warmUpObservation(Observation storage obs) private {
        obs.blockTimestamp = 1;
    }
}
