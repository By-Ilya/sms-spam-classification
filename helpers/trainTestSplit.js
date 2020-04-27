const config = require('../config');


const trainTestSplit = (dataArray) => {
    const slicedIndex = Math.ceil(dataArray.length * config.trainSize);
    return {
        train: dataArray.slice(0, slicedIndex),
        test: dataArray.slice(slicedIndex)
    }
}


module.exports = trainTestSplit;