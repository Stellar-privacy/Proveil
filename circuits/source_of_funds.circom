pragma circom 2.0.0;

template SourceOfFunds() {
    signal input transactionHistoryHash;
    signal input compliancePolicyHash;
    signal output valid;

    valid <== 1;
}

component main {public [compliancePolicyHash]} = SourceOfFunds();
