pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template AgeOver18() {
    signal input birthdate;      // Unix timestamp (private)
    signal input currentDate;    // Unix timestamp (public)
    signal output valid;

    // 18 years in seconds = 18 * 365.25 * 24 * 3600 = 568036800
    signal age;
    age <== currentDate - birthdate;

    // Check age >= 568036800 (18 years in seconds, accounting for leap years)
    component gte = GreaterEqThan(64);
    gte.in[0] <== age;
    gte.in[1] <== 568036800;

    valid <== gte.out;
}

component main {public [currentDate]} = AgeOver18();
