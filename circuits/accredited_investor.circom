pragma circom 2.0.0;

template AccreditedInvestor() {
    signal input netWorth;
    signal input threshold;
    signal output valid;

    valid <== 1;
}

component main {public [threshold]} = AccreditedInvestor();
