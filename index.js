const fs = require('fs');
const csv = require('csv-parser');

const config = require('./config');
const {
    isFileExists
} = require('./helpers/filesHelper');

const runProcessCollection = require('./processCollection');
const shuffle = require('./helpers/shuffle');
const trainTestSplit = require('./helpers/trainTestSplit');
const {
    calculateAccuracy,
    calculatePrecision,
    calculateRecall,
    calculateF1,
    calculateMatthewsCorrelation
} = require('./helpers/metrics');

const BayesSpamClassifier = require('./NaiveBayes/BayesSpamClassifier');

let CSV_DATA = [];
let CONFUSION_MATRIX;
let EXPERIMENT_RESULTS = {
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1: 0,
    correlationMatthews: 0
};

run = async () => {
    if (!await isFileExists(config.smsCollectionPath)) {
        console.error(`File error: ${config.smsCollectionPath} doesn't exist`);
        process.exit(0);
    }

    fs.createReadStream(config.smsCollectionPath)
        .pipe(csv())
        .on('data', (data) => CSV_DATA.push(data))
        .on('end',  () => runProcessing());
}

runProcessing = async () => {
    const processedCollection = await runProcessCollection(CSV_DATA);

    for (let i = 0; i < config.countExperiments; i++) {
        console.log(`Experiment ${i + 1}/${config.countExperiments}`);
        runInitStage();

        const shuffledCollection = shuffle(processedCollection);
        const {train, test} = trainTestSplit(shuffledCollection);

        let bayesSpamClassifier = new BayesSpamClassifier();
        bayesSpamClassifier.fit(train);

        let positiveAnswers = 0;
        test.forEach(messageObj => {
            const {
                predictedLabel
            } = bayesSpamClassifier.predict(messageObj.message);
            if (messageObj.label === predictedLabel) {
                positiveAnswers++;
                if (BayesSpamClassifier.isSpamLabel(messageObj.label))
                    CONFUSION_MATRIX.TP++;
                if (BayesSpamClassifier.isHamLabel(messageObj.label))
                    CONFUSION_MATRIX.TN++;
            } else {
                if (BayesSpamClassifier.isHamLabel(messageObj.label))
                    CONFUSION_MATRIX.FP++;
                if (BayesSpamClassifier.isHamLabel(predictedLabel))
                    CONFUSION_MATRIX.FN++;
            }
        });

        EXPERIMENT_RESULTS.accuracy += calculateAccuracy(
            positiveAnswers,
            test.length
        );
        const precision = calculatePrecision(
            CONFUSION_MATRIX.TP,
            CONFUSION_MATRIX.FP
        );
        const recall = calculateRecall(
            CONFUSION_MATRIX.TP,
            CONFUSION_MATRIX.FN
        );
        EXPERIMENT_RESULTS.precision += precision;
        EXPERIMENT_RESULTS.recall += recall;
        EXPERIMENT_RESULTS.f1 += calculateF1(precision, recall);
        EXPERIMENT_RESULTS.correlationMatthews += calculateMatthewsCorrelation(
                CONFUSION_MATRIX.TP,
                CONFUSION_MATRIX.FP,
                CONFUSION_MATRIX.TN,
                CONFUSION_MATRIX.FN
        );
    }

    printResults();
}

runInitStage = () => {
    CONFUSION_MATRIX = {TP: 0, FP: 0, TN: 0, FN: 0};
}

printResults = () => {
    console.log(`RESULTS:\n` +
        ` - Count experiments: ${config.countExperiments}\n` +
        ` - Train set size: ${config.trainSize}\n` +
        ` - Avg accuracy: ${EXPERIMENT_RESULTS.accuracy / config.countExperiments}\n` +
        ` - Avg precision (spam): ${EXPERIMENT_RESULTS.precision / config.countExperiments}\n` +
        ` - Avg recall (spam): ${EXPERIMENT_RESULTS.recall / config.countExperiments}\n` +
        ` - Avg F1-score (spam): ${EXPERIMENT_RESULTS.f1 / config.countExperiments}\n` +
        ` - Matthews correlation: ${EXPERIMENT_RESULTS.correlationMatthews / config.countExperiments}`
    );
}

run();