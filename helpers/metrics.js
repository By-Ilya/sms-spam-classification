let calculateAccuracy = (positiveAnswers, allAnswers) => {
    return positiveAnswers / allAnswers;
}

let calculatePrecision = (TP, FP) => {
    return TP / (TP + FP);
}

let calculateRecall = (TP, FN) => {
    return TP / (TP + FN);
}

let calculateF1 = (precision, recall) => {
    return 2 * ((precision * recall) / (precision + recall));
}

let calculateMatthewsCorrelation = (TP, FP, TN, FN) => {
    return (TP * TN - FP * FN) /
        (Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN)));
}


module.exports = {
    calculateAccuracy,
    calculatePrecision,
    calculateRecall,
    calculateF1,
    calculateMatthewsCorrelation
};