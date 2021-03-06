const TrieDictionary = require('../Dictionary/TrieDictionary');
const VocabularySet = require('../Vocabulary/VocabularySet');

class BayesSpamClassifier {
    #documentsCount;
    #hamDictionary;
    #spamDictionary;
    #uniqueVocabulary;
    #lnProbSpam;
    #lnProbHam;

    #setTrainProbabilities;
    #getSpamPosteriorMax;
    #getHamPosteriorMax;

    static isSpamLabel(label) {
        return label.toLowerCase() === 'spam';
    }

    static isHamLabel(label) {
        return label.toLowerCase() === 'ham';
    }

    constructor () {
        this.#documentsCount = { spam: 0, ham: 0 };
        this.#hamDictionary = new TrieDictionary();
        this.#spamDictionary = new TrieDictionary();
        this.#uniqueVocabulary = new VocabularySet();

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
            const allWords =
                this.#uniqueVocabulary.getVocabularySize() +
                this.#spamDictionary.getDictionarySize();
            return message.reduce((accum, elem) => {
                return accum + Math.log(
                    (this.#spamDictionary.getWordCount(elem) + 1) / allWords
                );
            }, this.#lnProbSpam);
        }

        this.#getHamPosteriorMax = (message) => {
            const allWords =
                this.#uniqueVocabulary.getVocabularySize() +
                this.#hamDictionary.getDictionarySize();
            return message.reduce((accum, elem) => {
                return accum + Math.log(
                    (this.#hamDictionary.getWordCount(elem) + 1) / allWords
                );
            }, this.#lnProbHam);
        }
    }

    fit(trainSet) {
        trainSet.forEach(messageObj => {
            if (BayesSpamClassifier.isSpamLabel(messageObj.label)) {
                this.#documentsCount.spam++;
                messageObj.message.forEach(lemma => {
                    this.#spamDictionary.addWord(lemma);
                    this.#uniqueVocabulary.add(lemma);
                });
            }
            if (BayesSpamClassifier.isHamLabel(messageObj.label)) {
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
}


module.exports = BayesSpamClassifier;