require('dotenv').config();

const smsCollectionPath = process.env.SMS_COLLECTION_PATH || './sms-data/spam.csv';
const trainSize = parseFloat(process.env.TRAIN_SIZE) || 0.8
const countExperiments = parseInt(process.env.COUNT_EXPERIMENTS) || 10;

module.exports = {
    smsCollectionPath,
    trainSize,
    countExperiments
}