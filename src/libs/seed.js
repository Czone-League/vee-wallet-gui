"use strict";
// Derived from waves-api
//
// Object.defineProperty(exports, "__esModule", { value: true });
var base58_1 = require("./base58");
var crypto_1 = require("../utils/crypto");
var logger_1 = require("../utils/logger");
var seedDictionary_1 = require("./seedDictionary");
var constant = require('../constants');
var DEFAULT_MIN_SEED_LENGTH = 25;
function generateNewSeed(length) {
    var random = crypto_1.default.generateRandomUint32Array(length);
    var wordCount = seedDictionary_1.default.length;
    var phrase = [];
    for (var i = 0; i < length; i++) {
        var wordIndex = random[i] % wordCount;
        phrase.push(seedDictionary_1.default[wordIndex]);
    }
    random.set(new Uint8Array(random.length));
    return phrase.join(' ');
}
function encryptSeedPhrase(seedPhrase, password, encryptionRounds) {
    if (encryptionRounds === void 0) { encryptionRounds = 5000; }
    if (password && password.length < 8) {
        logger_1.default.warn('Your password may be too weak');
    }
    if (encryptionRounds < 1000) {
        logger_1.default.warn('Encryption rounds may be too few');
    }
    if (seedPhrase.length < DEFAULT_MIN_SEED_LENGTH) {
        throw new Error('The seed phrase you are trying to encrypt is too short');
    }
    return crypto_1.default.encryptSeed(seedPhrase, password, encryptionRounds);
}
function decryptSeedPhrase(encryptedSeedPhrase, password, encryptionRounds) {
    if (encryptionRounds === void 0) { encryptionRounds = 5000; }
    var wrongPasswordMessage = 'The password is wrong';
    var phrase;
    try {
        phrase = crypto_1.default.decryptSeed(encryptedSeedPhrase, password, encryptionRounds);
    }
    catch (e) {
        throw new Error(wrongPasswordMessage);
    }
    if (phrase === '' || phrase.length < DEFAULT_MIN_SEED_LENGTH) {
        throw new Error(wrongPasswordMessage);
    }
    return phrase;
}
var Seed = /** @class */ (function () {
    function Seed(phrase, nonce) {
        this.phrase = phrase;
        this.nonce = nonce || constant.INITIAL_NONCE;
        var keys = crypto_1.default.buildKeyPair(phrase, this.nonce)
        this.address = crypto_1.default.buildRawAddress(keys.publicKey)
        this.keyPair = {
            privateKey: base58_1.default.encode(keys.privateKey),
            publicKey: base58_1.default.encode(keys.publicKey)
        };
        Object.freeze(this);
        Object.freeze(this.keyPair);
    }
    Seed.prototype.encrypt = function (password, encryptionRounds) {
        return encryptSeedPhrase(this.phrase, password, encryptionRounds);
    };
    return Seed;
}());
export default {
    create: function (words, nonce) {
        if (words === void 0 || typeof words === 'number') { words = 18; }
        var phrase = generateNewSeed(words);
        var minimumSeedLength = DEFAULT_MIN_SEED_LENGTH;
        if (phrase.length < minimumSeedLength) {
            // If you see that error you should increase the number of words in the generated seed
            throw new Error("The resulted seed length is less than the minimum length (" + minimumSeedLength + ")");
        }
        return new Seed(phrase, nonce);
    },
    fromExistingPhrase: function (phrase) {
        if (phrase.length < DEFAULT_MIN_SEED_LENGTH) {
            throw new Error('Your seed length is less than allowed in config');
        }
        return new Seed(phrase);
    },
    fromExistingPhrasesWithIndex: function (phrase, nonce) {
        return new Seed(phrase, nonce)
    },
    encryptSeedPhrase: encryptSeedPhrase,
    decryptSeedPhrase: decryptSeedPhrase
};
//# sourceMappingURL=Seed.js.map
