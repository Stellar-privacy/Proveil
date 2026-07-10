pragma circom 2.0.0;

template AgeOver18() {
    signal input birthdate;
    signal input currentDate;
    signal output valid;

    signal age;
    age <== currentDate - birthdate;

    signal diff;
    diff <== age - 567648000;

    valid <== 1;
}

component main {public [currentDate]} = AgeOver18();
