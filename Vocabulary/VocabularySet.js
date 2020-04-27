class VocabularySet {
    #vocabulary;

    constructor() { this.#vocabulary = new Set(); }

    add(word) { this.#vocabulary.add(word); }

    union(anotherSet) {
        this.#vocabulary = new Set(
            [...this.#vocabulary, ...anotherSet]
        );
    };

    intersection(anotherSet) {
        this.#vocabulary =  new Set(
            [...this.#vocabulary].filter(elem => anotherSet.has(elem))
        );
    };

    getVocabulary() { return [...this.#vocabulary]; }

    getVocabularySize() { return this.#vocabulary.size; }
}


module.exports = VocabularySet;