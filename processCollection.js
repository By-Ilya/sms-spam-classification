const natural = require('natural');
const { lemmatizer } = require('lemmatizer');

const wordTokenizer = new natural.WordTokenizer();

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
    const lemmas = tokens.map(token => {
        return lemmatizer(token.toLowerCase());
    });

    return lemmas;
}


module.exports = runProcessCollection;