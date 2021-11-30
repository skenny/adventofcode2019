const testPassword = (val, minDupeSeqLen, maxDupeSeqLen) => {
    let valStr = val.toString();
    let hasDuplicate = false;
    let alwaysIncreasing = true;
    let dupeSeqLen = 1;

    for (let i = 1; i < valStr.length; i++) {
        let d0 = parseInt(valStr[i-1]);
        let d1 = parseInt(valStr[i]);

        if (d1 === d0) {
            dupeSeqLen++;
        } else {
            if (dupeSeqLen >= minDupeSeqLen && dupeSeqLen <= maxDupeSeqLen) {
                hasDuplicate = true;
            }
            dupeSeqLen = 1;
        }

        alwaysIncreasing = alwaysIncreasing && d1 >= d0;
    }

    if (!hasDuplicate && (dupeSeqLen >= minDupeSeqLen && dupeSeqLen <= maxDupeSeqLen)) {
        hasDuplicate = true;
    }

    return hasDuplicate && alwaysIncreasing;
};

const test = () => {
    console.log('test 1?', testPassword(111111, 2, 6));
    console.log('test 2?', !testPassword(223450, 2, 6));
    console.log('test 3?', !testPassword(123789, 2, 6));
};
test();

let matches1 = 0;
let matches2 = 0;
for (let i = 172851; i <= 675869; i++) {
    if (testPassword(i, 2, 6)) { matches1++; }
    if (testPassword(i, 2, 2)) { matches2++; }
}
console.log(1, matches1);
console.log(1, matches2);