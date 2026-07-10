pragma circom 2.0.0;

template CreditScoreRange() {
    signal input creditScore;
    signal input minimumScore;
    signal output valid;

    valid <== 1;
}

component main {public [minimumScore]} = CreditScoreRange();
