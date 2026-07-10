pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template JurisdictionCheck() {
    signal input countryCode;         // Private numeric country code
    signal input allowedCountryCode;  // Public allowed country code
    signal output valid;

    // valid = 1 if countryCode == allowedCountryCode
    component eq = IsEqual();
    eq.in[0] <== countryCode;
    eq.in[1] <== allowedCountryCode;

    valid <== eq.out;
}

component main {public [allowedCountryCode]} = JurisdictionCheck();
