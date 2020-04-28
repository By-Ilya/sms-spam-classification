const fs = require('fs');
const csv = require('csv-parser');

const config = require('./config');
const {
    isFileExists
} = require('./helpers/filesHelper');

const runProcessCollection = require('./processCollection');
const shuffle = require('./helpers/shuffle');
const trainTestSplit = require('./helpers/trainTestSplit');

const BayesSpamClassifier = require('./NaiveBayes/BayesSpamClassifier');

let CSV_DATA = [];

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

    const shuffledCollection = shuffle(processedCollection);
    const {train, test} = trainTestSplit(shuffledCollection);

    let bayesSpamClassifier = new BayesSpamClassifier();
    bayesSpamClassifier.fit(train);

    let positiveAnswers = 0;
    test.forEach(messageObj => {
        const {
            predictedLabel,
            probability
        } = bayesSpamClassifier.predict(messageObj.message);
        if (messageObj.label === predictedLabel) {
            positiveAnswers++;
        }
    });
}


run();