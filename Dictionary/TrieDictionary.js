class Node {
    constructor () {
        this.keys = new Map();
        this.count = 0;
        this.end = false;
    }

    isEnd() { return this.end; }

    addOneToCount() { this.count++; }

    setEnd() {
        this.end = true;
        this.addOneToCount();
    }

    getCount() { return this.count; }
}

class TrieDictionary {
    #root;
    #countWords;

    #add;

    constructor () {
        this.#root = new Node();
        this.#countWords = 0;

        this.#add = (word, node = this.#root) => {
            if (word.length === 0) {
                node.setEnd();
                return;
            }
            if (!node.keys.has(word[0])) {
                node.keys.set(word[0], new Node());
            }

            return this.#add(word.substr(1), node.keys.get(word[0]));
        }
    }


    addWord(word) {
        this.#add(word);
        this.#countWords++;
    }

    isWord(input) {
        let node = this.#root;
        while (input.length > 1) {
            if (!node.keys.has(input[0]))
                return false;

            node = node.keys.get(input[0]);
            input = input.substr(1);
        }

        return (node.keys.has(input) && node.keys.get(input).isEnd());
    }

    getWordCount(input) {
        let node = this.#root;
        while (input.length > 1) {
            if (!node.keys.has(input[0]))
                return false;

            node = node.keys.get(input[0]);
            input = input.substr(1);
        }

        if (node.keys.has(input) && node.keys.get(input).isEnd()) {
            return node.keys.get(input).getCount();
        } else return 0;
    }

    print() {
        let words = [];

        let search = (node, string) => {
            if (node.keys.size !== 0) {
                for (let letter of node.keys.keys()) {
                    search(node.keys.get(letter), string.concat(letter));
                }
                if (node.isEnd())
                    words.push({word: string, count: node.getCount()});
            } else {
                string.length > 0
                    ? words.push({word: string, count: node.getCount()})
                    : undefined;
            }
        }

        search(this.#root, String());
        return words.length > 0 ? words : undefined;
    };

    getDictionarySize() {
        return this.#countWords;
    }
}


module.exports = TrieDictionary;