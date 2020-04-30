const natural = require('natural');
const { lemmatizer } = require('lemmatizer');

const wordTokenizer = new natural.WordTokenizer();

const NUMBER_REG_EXP = /\d+/g;
const NUMBER_TOKEN = '__NUMBER__';

const runProcessCollection = async (collection) => {
    return collection.map(elem => {
        const label = elem['v1'];
        const message = elem['v2'];

        const normalizedMessage = normalizeMessage(message);

        return {
            message: normalizedMessage,
            label
        };
    })
}

normalizeMessage = (message) => {
    const tokens = wordTokenizer.tokenize(message);
    return tokens.map(token => {
        if (token.match(NUMBER_REG_EXP)) {
            return NUMBER_TOKEN;
        }
        return lemmatizer(token.toLowerCase());
    });
}


module.exports = runProcessCollection;