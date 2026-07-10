pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template CreditScoreRange() {
    signal input creditScore;    // Private credit score (300-850)
    signal input minimumScore;   // Public minimum required score
    signal output valid;

    // Ensure score is in valid range 300-850
    component gteMin = GreaterEqThan(64);
    gteMin.in[0] <== creditScore;
    gteMin.in[1] <== 300;

    component lteMax = LessEqThan(64);
    lteMax.in[0] <== creditScore;
    lteMax.in[1] <== 850;

    // Constrain minimumScore to the valid credit-score range.
    // Without this, a public minimumScore > 2^16 would wrap in a 16-bit
    // comparator and produce a false-accept proof.
    component minGte300 = GreaterEqThan(64);
    minGte300.in[0] <== minimumScore;
    minGte300.in[1] <== 300;

    component minLte850 = LessEqThan(64);
    minLte850.in[0] <== minimumScore;
    minLte850.in[1] <== 850;

    // Ensure score >= minimumScore
    component gteThreshold = GreaterEqThan(64);
    gteThreshold.in[0] <== creditScore;
    gteThreshold.in[1] <== minimumScore;

    // All conditions must hold
    signal rangeValid;
    rangeValid <== gteMin.out * lteMax.out;
    signal minValid;
    minValid <== minGte300.out * minLte850.out;
    signal step1;
    step1 <== rangeValid * gteThreshold.out;
    valid <== step1 * minValid;
}

component main {public [minimumScore]} = CreditScoreRange();
