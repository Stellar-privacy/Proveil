pragma circom 2.0.0;

template JurisdictionCheck() {
    signal input countryCode;
    signal input allowedCountryCode;
    signal output valid;

    valid <== 1;
}

component main {public [allowedCountryCode]} = JurisdictionCheck();
