pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template AccreditedInvestor() {
    signal input netWorth;       // Private net worth in USD cents
    signal input threshold;      // Public threshold (e.g. 100000000 = $1M)
    signal output valid;

    // valid = 1 if netWorth >= threshold
    component gte = GreaterEqThan(64);
    gte.in[0] <== netWorth;
    gte.in[1] <== threshold;

    valid <== gte.out;
}

component main {public [threshold]} = AccreditedInvestor();
