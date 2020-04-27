const TrieDictionary = require('../Dictionary/TrieDictionary');
const VocabularySet = require('../Vocabulary/VocabularySet');

class BayesSpamClassifier {
    #documentsCount;
    #hamDictionary;
    #spamDictionary;
    #uniqueVocabulary;
    #lnProbSpam;
    #lnProbHam;

    #isSpamLabel;
    #setTrainProbabilities;
    #getSpamPosteriorMax;
    #getHamPosteriorMax;

    constructor () {
        this.#documentsCount = { spam: 0, ham: 0 };
        this.#hamDictionary = new TrieDictionary();
        this.#spamDictionary = new TrieDictionary();
        this.#uniqueVocabulary = new VocabularySet();

        this.#isSpamLabel = (label) => label.toLowerCase() === 'spam';

        this.#setTrainProbabilities = () => {
            const allDocumentsCount = this.#documentsCount.spam + this.#documentsCount.ham;
            this.#lnProbSpam = Math.log(
                this.#documentsCount.spam / allDocumentsCount
            );
            this.#lnProbHam = Math.log(
                this.#documentsCount.ham / allDocumentsCount
            );
        }

        this.#getSpamPosteriorMax = (message) => {
            const vocabularySize = this.#uniqueVocabulary.getVocabularySize();
            return message.reduce((accum, elem) => {
                return accum + Math.log(
                    (this.#spamDictionary.getWordCount(elem) + 1) / vocabularySize
                );
            }, this.#lnProbSpam);
        }

        this.#getHamPosteriorMax = (message) => {
            const vocabularySize = this.#uniqueVocabulary.getVocabularySize();
            return message.reduce((accum, elem) => {
                return accum + Math.log(
                    (this.#hamDictionary.getWordCount(elem) + 1) / vocabularySize
                );
            }, this.#lnProbHam);
        }
    }

    fit(trainSet) {
        trainSet.forEach(messageObj => {
            if (this.#isSpamLabel(messageObj.label)) {
                this.#documentsCount.spam++;
                messageObj.message.forEach(lemma => {
                    this.#spamDictionary.addWord(lemma);
                    this.#uniqueVocabulary.add(lemma);
                });
            } else {
                this.#documentsCount.ham++;
                messageObj.message.forEach(lemma => {
                    this.#hamDictionary.addWord(lemma);
                    this.#uniqueVocabulary.add(lemma);
                });
            }
        });

        this.#setTrainProbabilities();
    }

    calculateSpamProbability(message) {
        const spamPosteriorMax = this.#getSpamPosteriorMax(message);
        const hamPosteriorMax = this.#getHamPosteriorMax(message);

        return (1 / (1 + Math.exp(hamPosteriorMax - spamPosteriorMax)));
    }

    calculateHamProbability(message) {
        const spamPosteriorMax = this.#getSpamPosteriorMax(message);
        const hamPosteriorMax = this.#getHamPosteriorMax(message);

        return (1 / (1 + Math.exp(spamPosteriorMax - hamPosteriorMax)));
    }

    predict(message) {
        const spamProb = this.calculateSpamProbability(message);
        const hamProb = this.calculateHamProbability(message);

        return spamProb > hamProb
            ? {predictedLabel: 'spam', probability: spamProb}
            : {predictedLabel: 'ham', probability: hamProb}
    }

    isCorrectProbabilities(spamProb, hamProb) {
        return spamProb + hamProb === 1;
    }
}


module.exports = BayesSpamClassifier;