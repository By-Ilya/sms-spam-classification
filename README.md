# sms-spam-classification
SMS spam classification data from
__Kaggle__ (https://www.kaggle.com/uciml/sms-spam-collection-dataset)
using naive bayesian model.

## Description
This algorithm performs the following steps:
1. Load and read `.csv` file with __SMS Spam Collection Dataset | Kaggle__
data from disk.
2. Parse this file and extract `v1` value as _label_ (spam or ham)
and `v2` value as _message_.
3. Transform messages to tokens and then to lemmas, replace all numbers with
constant token `__NUMBER__`.
4. Shuffle all messages.
5. Split messages into train and test sets.
6. Fit bayesian model with train set.
7. Predict labels on test set.
8. Calculate the following metrics:
- accuracy,
- precision,
- recall,
- F1-score,
- Matthews correlation.

## Requirements
1. `Node JS` library and `NPM` package manager.
2. Libraries installed from `package.json` file.

## Install and configure
1. Go to the project root directory.
2. Run `npm i` or `npm install` command. This command installs necessary libraries.
3. Open `.env` file and configure the following parameters:

- `SMS_COLLECTION_PATH`: `string` value, that specifies `.csv` file path to the 
__SMS Spam collection data__ from __Kaggle__ (absolute or relative path).
- `TRAIN_SIZE`: `float` value, that specifies the size of train set.
- `COUNT_EXPERIMENTS`: `integer` value, that specifies the number of experiments.

## Running command
In the project root directory execute `npm start` command.

## Output example
RESULTS:
 - Count experiments: 100
 - Train set size: 0.8
 - Avg accuracy: 0.9768671454219029
 - Avg precision (spam): 0.8840480938416516
 - Avg recall (spam): 0.9494494826142801
 - Avg F1-score (spam): 0.9153065782697162
 - Matthews correlation: 0.9028739302029823

## Used `Node JS` libraries
- `csv-parser` (version `2.3.2`) is used for _parsing_ `.csv` files.
- `natural` (version `0.6.3`) is used for _tokenizing_ input texts from corpus to words.
- `lemmatizer` (version `0.0.1`) is used for _creating lemmas_ from words.
