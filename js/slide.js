
'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var slide = {};

var cryptoJs = { exports: {} };

function commonjsRequire(path) {
    throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var core = { exports: {} };

var hasRequiredCore;

function requireCore() {
    if (hasRequiredCore) return core.exports;
    hasRequiredCore = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory();
            }
        }(commonjsGlobal, function () {

            /*globals window, global, require*/

            /**
             * CryptoJS core components.
             */
            var CryptoJS = CryptoJS || (function (Math, undefined$1) {

                var crypto;

                // Native crypto from window (Browser)
                if (typeof window !== 'undefined' && window.crypto) {
                    crypto = window.crypto;
                }

                // Native crypto in web worker (Browser)
                if (typeof self !== 'undefined' && self.crypto) {
                    crypto = self.crypto;
                }

                // Native crypto from worker
                if (typeof globalThis !== 'undefined' && globalThis.crypto) {
                    crypto = globalThis.crypto;
                }

                // Native (experimental IE 11) crypto from window (Browser)
                if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
                    crypto = window.msCrypto;
                }

                // Native crypto from global (NodeJS)
                if (!crypto && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
                    crypto = commonjsGlobal.crypto;
                }

                // Native crypto import via require (NodeJS)
                if (!crypto && typeof commonjsRequire === 'function') {
                    try {
                        crypto = require('crypto');
                    } catch (err) { }
                }

                /*
				 * Cryptographically secure pseudorandom number generator
				 *
				 * As Math.random() is cryptographically not safe to use
				 */
                var cryptoSecureRandomInt = function () {
                    if (crypto) {
                        // Use getRandomValues method (Browser)
                        if (typeof crypto.getRandomValues === 'function') {
                            try {
                                return crypto.getRandomValues(new Uint32Array(1))[0];
                            } catch (err) { }
                        }

                        // Use randomBytes method (NodeJS)
                        if (typeof crypto.randomBytes === 'function') {
                            try {
                                return crypto.randomBytes(4).readInt32LE();
                            } catch (err) { }
                        }
                    }

                    throw new Error('Native crypto module could not be used to get secure random number.');
                };

                /*
				 * Local polyfill of Object.create

				 */
                var create = Object.create || (function () {
                    function F() { }

                    return function (obj) {
                        var subtype;

                        F.prototype = obj;

                        subtype = new F();

                        F.prototype = null;

                        return subtype;
                    };
                }());

                /**
                 * CryptoJS namespace.
                 */
                var C = {};

                /**
                 * Library namespace.
                 */
                var C_lib = C.lib = {};

                /**
                 * Base object for prototypal inheritance.
                 */
                var Base = C_lib.Base = (function () {


                    return {
                        /**
                         * Creates a new object that inherits from this object.
                         *
                         * @param {Object} overrides Properties to copy into the new object.
                         *
                         * @return {Object} The new object.
                         *
                         * @static
                         *
                         * @example
                         *
                         *     var MyType = CryptoJS.lib.Base.extend({
                         *         field: 'value',
                         *
                         *         method: function () {
                         *         }
                         *     });
                         */
                        extend: function (overrides) {
                            // Spawn
                            var subtype = create(this);

                            // Augment
                            if (overrides) {
                                subtype.mixIn(overrides);
                            }

                            // Create default initializer
                            if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                                subtype.init = function () {
                                    subtype.$super.init.apply(this, arguments);
                                };
                            }

                            // Initializer's prototype is the subtype object
                            subtype.init.prototype = subtype;

                            // Reference supertype
                            subtype.$super = this;

                            return subtype;
                        },

                        /**
                         * Extends this object and runs the init method.
                         * Arguments to create() will be passed to init().
                         *
                         * @return {Object} The new object.
                         *
                         * @static
                         *
                         * @example
                         *
                         *     var instance = MyType.create();
                         */
                        create: function () {
                            var instance = this.extend();
                            instance.init.apply(instance, arguments);

                            return instance;
                        },

                        /**
                         * Initializes a newly created object.
                         * Override this method to add some logic when your objects are created.
                         *
                         * @example
                         *
                         *     var MyType = CryptoJS.lib.Base.extend({
                         *         init: function () {
                         *             // ...
                         *         }
                         *     });
                         */
                        init: function () {
                        },

                        /**
                         * Copies properties into this object.
                         *
                         * @param {Object} properties The properties to mix in.
                         *
                         * @example
                         *
                         *     MyType.mixIn({
                         *         field: 'value'
                         *     });
                         */
                        mixIn: function (properties) {
                            for (var propertyName in properties) {
                                if (properties.hasOwnProperty(propertyName)) {
                                    this[propertyName] = properties[propertyName];
                                }
                            }

                            // IE won't copy toString using the loop above
                            if (properties.hasOwnProperty('toString')) {
                                this.toString = properties.toString;
                            }
                        },

                        /**
                         * Creates a copy of this object.
                         *
                         * @return {Object} The clone.
                         *
                         * @example
                         *
                         *     var clone = instance.clone();
                         */
                        clone: function () {
                            return this.init.prototype.extend(this);
                        }
                    };
                }());

                /**
                 * An array of 32-bit words.
                 *
                 * @property {Array} words The array of 32-bit words.
                 * @property {number} sigBytes The number of significant bytes in this word array.
                 */
                var WordArray = C_lib.WordArray = Base.extend({
                    /**
                     * Initializes a newly created word array.
                     *
                     * @param {Array} words (Optional) An array of 32-bit words.
                     * @param {number} sigBytes (Optional) The number of significant bytes in the words.
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.lib.WordArray.create();
                     *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
                     *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
                     */
                    init: function (words, sigBytes) {
                        words = this.words = words || [];

                        if (sigBytes != undefined$1) {
                            this.sigBytes = sigBytes;
                        } else {
                            this.sigBytes = words.length * 4;
                        }
                    },

                    /**
                     * Converts this word array to a string.
                     *
                     * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
                     *
                     * @return {string} The stringified word array.
                     *
                     * @example
                     *
                     *     var string = wordArray + '';
                     *     var string = wordArray.toString();
                     *     var string = wordArray.toString(CryptoJS.enc.Utf8);
                     */
                    toString: function (encoder) {
                        return (encoder || Hex).stringify(this);
                    },

                    /**
                     * Concatenates a word array to this word array.
                     *
                     * @param {WordArray} wordArray The word array to append.
                     *
                     * @return {WordArray} This word array.
                     *
                     * @example
                     *
                     *     wordArray1.concat(wordArray2);
                     */
                    concat: function (wordArray) {
                        // Shortcuts
                        var thisWords = this.words;
                        var thatWords = wordArray.words;
                        var thisSigBytes = this.sigBytes;
                        var thatSigBytes = wordArray.sigBytes;

                        // Clamp excess bits
                        this.clamp();

                        // Concat
                        if (thisSigBytes % 4) {
                            // Copy one byte at a time
                            for (var i = 0; i < thatSigBytes; i++) {
                                var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                                thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                            }
                        } else {
                            // Copy one word at a time
                            for (var j = 0; j < thatSigBytes; j += 4) {
                                thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
                            }
                        }
                        this.sigBytes += thatSigBytes;

                        // Chainable
                        return this;
                    },

                    /**
                     * Removes insignificant bits.
                     *
                     * @example
                     *
                     *     wordArray.clamp();
                     */
                    clamp: function () {
                        // Shortcuts
                        var words = this.words;
                        var sigBytes = this.sigBytes;

                        // Clamp
                        words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
                        words.length = Math.ceil(sigBytes / 4);
                    },

                    /**
                     * Creates a copy of this word array.
                     *
                     * @return {WordArray} The clone.
                     *
                     * @example
                     *
                     *     var clone = wordArray.clone();
                     */
                    clone: function () {
                        var clone = Base.clone.call(this);
                        clone.words = this.words.slice(0);

                        return clone;
                    },

                    /**
                     * Creates a word array filled with random bytes.
                     *
                     * @param {number} nBytes The number of random bytes to generate.
                     *
                     * @return {WordArray} The random word array.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.lib.WordArray.random(16);
                     */
                    random: function (nBytes) {
                        var words = [];

                        for (var i = 0; i < nBytes; i += 4) {
                            words.push(cryptoSecureRandomInt());
                        }

                        return new WordArray.init(words, nBytes);
                    }
                });

                /**
                 * Encoder namespace.
                 */
                var C_enc = C.enc = {};

                /**
                 * Hex encoding strategy.
                 */
                var Hex = C_enc.Hex = {
                    /**
                     * Converts a word array to a hex string.
                     *
                     * @param {WordArray} wordArray The word array.
                     *
                     * @return {string} The hex string.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
                     */
                    stringify: function (wordArray) {
                        // Shortcuts
                        var words = wordArray.words;
                        var sigBytes = wordArray.sigBytes;

                        // Convert
                        var hexChars = [];
                        for (var i = 0; i < sigBytes; i++) {
                            var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                            hexChars.push((bite >>> 4).toString(16));
                            hexChars.push((bite & 0x0f).toString(16));
                        }

                        return hexChars.join('');
                    },

                    /**
                     * Converts a hex string to a word array.
                     *
                     * @param {string} hexStr The hex string.
                     *
                     * @return {WordArray} The word array.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
                     */
                    parse: function (hexStr) {
                        // Shortcut
                        var hexStrLength = hexStr.length;

                        // Convert
                        var words = [];
                        for (var i = 0; i < hexStrLength; i += 2) {
                            words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
                        }

                        return new WordArray.init(words, hexStrLength / 2);
                    }
                };

                /**
                 * Latin1 encoding strategy.
                 */
                var Latin1 = C_enc.Latin1 = {
                    /**
                     * Converts a word array to a Latin1 string.
                     *
                     * @param {WordArray} wordArray The word array.
                     *
                     * @return {string} The Latin1 string.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
                     */
                    stringify: function (wordArray) {
                        // Shortcuts
                        var words = wordArray.words;
                        var sigBytes = wordArray.sigBytes;

                        // Convert
                        var latin1Chars = [];
                        for (var i = 0; i < sigBytes; i++) {
                            var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                            latin1Chars.push(String.fromCharCode(bite));
                        }

                        return latin1Chars.join('');
                    },

                    /**
                     * Converts a Latin1 string to a word array.
                     *
                     * @param {string} latin1Str The Latin1 string.
                     *
                     * @return {WordArray} The word array.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
                     */
                    parse: function (latin1Str) {
                        // Shortcut
                        var latin1StrLength = latin1Str.length;

                        // Convert
                        var words = [];
                        for (var i = 0; i < latin1StrLength; i++) {
                            words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
                        }

                        return new WordArray.init(words, latin1StrLength);
                    }
                };

                /**
                 * UTF-8 encoding strategy.
                 */
                var Utf8 = C_enc.Utf8 = {
                    /**
                     * Converts a word array to a UTF-8 string.
                     *
                     * @param {WordArray} wordArray The word array.
                     *
                     * @return {string} The UTF-8 string.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
                     */
                    stringify: function (wordArray) {
                        try {
                            return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                        } catch (e) {
                            throw new Error('Malformed UTF-8 data');
                        }
                    },

                    /**
                     * Converts a UTF-8 string to a word array.
                     *
                     * @param {string} utf8Str The UTF-8 string.
                     *
                     * @return {WordArray} The word array.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
                     */
                    parse: function (utf8Str) {
                        return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
                    }
                };

                /**
                 * Abstract buffered block algorithm template.
                 *
                 * The property blockSize must be implemented in a concrete subtype.
                 *
                 * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
                 */
                var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
                    /**
                     * Resets this block algorithm's data buffer to its initial state.
                     *
                     * @example
                     *
                     *     bufferedBlockAlgorithm.reset();
                     */
                    reset: function () {
                        // Initial values
                        this._data = new WordArray.init();
                        this._nDataBytes = 0;
                    },

                    /**
                     * Adds new data to this block algorithm's buffer.
                     *
                     * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
                     *
                     * @example
                     *
                     *     bufferedBlockAlgorithm._append('data');
                     *     bufferedBlockAlgorithm._append(wordArray);
                     */
                    _append: function (data) {
                        // Convert string to WordArray, else assume WordArray already
                        if (typeof data == 'string') {
                            data = Utf8.parse(data);
                        }

                        // Append
                        this._data.concat(data);
                        this._nDataBytes += data.sigBytes;
                    },

                    /**
                     * Processes available data blocks.
                     *
                     * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
                     *
                     * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
                     *
                     * @return {WordArray} The processed data.
                     *
                     * @example
                     *
                     *     var processedData = bufferedBlockAlgorithm._process();
                     *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
                     */
                    _process: function (doFlush) {
                        var processedWords;

                        // Shortcuts
                        var data = this._data;
                        var dataWords = data.words;
                        var dataSigBytes = data.sigBytes;
                        var blockSize = this.blockSize;
                        var blockSizeBytes = blockSize * 4;

                        // Count blocks ready
                        var nBlocksReady = dataSigBytes / blockSizeBytes;
                        if (doFlush) {
                            // Round up to include partial blocks
                            nBlocksReady = Math.ceil(nBlocksReady);
                        } else {
                            // Round down to include only full blocks,
                            // less the number of blocks that must remain in the buffer
                            nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
                        }

                        // Count words ready
                        var nWordsReady = nBlocksReady * blockSize;

                        // Count bytes ready
                        var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

                        // Process blocks
                        if (nWordsReady) {
                            for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                                // Perform concrete-algorithm logic
                                this._doProcessBlock(dataWords, offset);
                            }

                            // Remove processed words
                            processedWords = dataWords.splice(0, nWordsReady);
                            data.sigBytes -= nBytesReady;
                        }

                        // Return processed words
                        return new WordArray.init(processedWords, nBytesReady);
                    },

                    /**
                     * Creates a copy of this object.
                     *
                     * @return {Object} The clone.
                     *
                     * @example
                     *
                     *     var clone = bufferedBlockAlgorithm.clone();
                     */
                    clone: function () {
                        var clone = Base.clone.call(this);
                        clone._data = this._data.clone();

                        return clone;
                    },

                    _minBufferSize: 0
                });

                /**
                 * Abstract hasher template.
                 *
                 * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
                 */
                C_lib.Hasher = BufferedBlockAlgorithm.extend({
                    /**
                     * Configuration options.
                     */
                    cfg: Base.extend(),

                    /**
                     * Initializes a newly created hasher.
                     *
                     * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
                     *
                     * @example
                     *
                     *     var hasher = CryptoJS.algo.SHA256.create();
                     */
                    init: function (cfg) {
                        // Apply config defaults
                        this.cfg = this.cfg.extend(cfg);

                        // Set initial values
                        this.reset();
                    },

                    /**
                     * Resets this hasher to its initial state.
                     *
                     * @example
                     *
                     *     hasher.reset();
                     */
                    reset: function () {
                        // Reset data buffer
                        BufferedBlockAlgorithm.reset.call(this);

                        // Perform concrete-hasher logic
                        this._doReset();
                    },

                    /**
                     * Updates this hasher with a message.
                     *
                     * @param {WordArray|string} messageUpdate The message to append.
                     *
                     * @return {Hasher} This hasher.
                     *
                     * @example
                     *
                     *     hasher.update('message');
                     *     hasher.update(wordArray);
                     */
                    update: function (messageUpdate) {
                        // Append
                        this._append(messageUpdate);

                        // Update the hash
                        this._process();

                        // Chainable
                        return this;
                    },

                    /**
                     * Finalizes the hash computation.
                     * Note that the finalize operation is effectively a destructive, read-once operation.
                     *
                     * @param {WordArray|string} messageUpdate (Optional) A final message update.
                     *
                     * @return {WordArray} The hash.
                     *
                     * @example
                     *
                     *     var hash = hasher.finalize();
                     *     var hash = hasher.finalize('message');
                     *     var hash = hasher.finalize(wordArray);
                     */
                    finalize: function (messageUpdate) {
                        // Final message update
                        if (messageUpdate) {
                            this._append(messageUpdate);
                        }

                        // Perform concrete-hasher logic
                        var hash = this._doFinalize();

                        return hash;
                    },

                    blockSize: 512 / 32,

                    /**
                     * Creates a shortcut function to a hasher's object interface.
                     *
                     * @param {Hasher} hasher The hasher to create a helper for.
                     *
                     * @return {Function} The shortcut function.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
                     */
                    _createHelper: function (hasher) {
                        return function (message, cfg) {
                            return new hasher.init(cfg).finalize(message);
                        };
                    },

                    /**
                     * Creates a shortcut function to the HMAC's object interface.
                     *
                     * @param {Hasher} hasher The hasher to use in this HMAC helper.
                     *
                     * @return {Function} The shortcut function.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
                     */
                    _createHmacHelper: function (hasher) {
                        return function (message, key) {
                            return new C_algo.HMAC.init(hasher, key).finalize(message);
                        };
                    }
                });

                /**
                 * Algorithm namespace.
                 */
                var C_algo = C.algo = {};

                return C;
            }(Math));


            return CryptoJS;

        }));
    }(core));
    return core.exports;
}

var x64Core = { exports: {} };

var hasRequiredX64Core;

function requireX64Core() {
    if (hasRequiredX64Core) return x64Core.exports;
    hasRequiredX64Core = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function (undefined$1) {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var Base = C_lib.Base;
                var X32WordArray = C_lib.WordArray;

                /**
                 * x64 namespace.
                 */
                var C_x64 = C.x64 = {};

                /**
                 * A 64-bit word.
                 */
                C_x64.Word = Base.extend({
                    /**
                     * Initializes a newly created 64-bit word.
                     *
                     * @param {number} high The high 32 bits.
                     * @param {number} low The low 32 bits.
                     *
                     * @example
                     *
                     *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
                     */
                    init: function (high, low) {
                        this.high = high;
                        this.low = low;
                    }

                    /**
                     * Bitwise NOTs this word.
                     *
                     * @return {X64Word} A new x64-Word object after negating.
                     *
                     * @example
                     *
                     *     var negated = x64Word.not();
                     */
                    // not: function () {
                    // var high = ~this.high;
                    // var low = ~this.low;

                    // return X64Word.create(high, low);
                    // },

                    /**
                     * Bitwise ANDs this word with the passed word.
                     *
                     * @param {X64Word} word The x64-Word to AND with this word.
                     *
                     * @return {X64Word} A new x64-Word object after ANDing.
                     *
                     * @example
                     *
                     *     var anded = x64Word.and(anotherX64Word);
                     */
                    // and: function (word) {
                    // var high = this.high & word.high;
                    // var low = this.low & word.low;

                    // return X64Word.create(high, low);
                    // },

                    /**
                     * Bitwise ORs this word with the passed word.
                     *
                     * @param {X64Word} word The x64-Word to OR with this word.
                     *
                     * @return {X64Word} A new x64-Word object after ORing.
                     *
                     * @example
                     *
                     *     var ored = x64Word.or(anotherX64Word);
                     */
                    // or: function (word) {
                    // var high = this.high | word.high;
                    // var low = this.low | word.low;

                    // return X64Word.create(high, low);
                    // },

                    /**
                     * Bitwise XORs this word with the passed word.
                     *
                     * @param {X64Word} word The x64-Word to XOR with this word.
                     *
                     * @return {X64Word} A new x64-Word object after XORing.
                     *
                     * @example
                     *
                     *     var xored = x64Word.xor(anotherX64Word);
                     */
                    // xor: function (word) {
                    // var high = this.high ^ word.high;
                    // var low = this.low ^ word.low;

                    // return X64Word.create(high, low);
                    // },

                    /**
                     * Shifts this word n bits to the left.
                     *
                     * @param {number} n The number of bits to shift.
                     *
                     * @return {X64Word} A new x64-Word object after shifting.
                     *
                     * @example
                     *
                     *     var shifted = x64Word.shiftL(25);
                     */
                    // shiftL: function (n) {
                    // if (n < 32) {
                    // var high = (this.high << n) | (this.low >>> (32 - n));
                    // var low = this.low << n;
                    // } else {
                    // var high = this.low << (n - 32);
                    // var low = 0;
                    // }

                    // return X64Word.create(high, low);
                    // },

                    /**
                     * Shifts this word n bits to the right.
                     *
                     * @param {number} n The number of bits to shift.
                     *
                     * @return {X64Word} A new x64-Word object after shifting.
                     *
                     * @example
                     *
                     *     var shifted = x64Word.shiftR(7);
                     */
                    // shiftR: function (n) {
                    // if (n < 32) {
                    // var low = (this.low >>> n) | (this.high << (32 - n));
                    // var high = this.high >>> n;
                    // } else {
                    // var low = this.high >>> (n - 32);
                    // var high = 0;
                    // }

                    // return X64Word.create(high, low);
                    // },

                    /**
                     * Rotates this word n bits to the left.
                     *
                     * @param {number} n The number of bits to rotate.
                     *
                     * @return {X64Word} A new x64-Word object after rotating.
                     *
                     * @example
                     *
                     *     var rotated = x64Word.rotL(25);
                     */
                    // rotL: function (n) {
                    // return this.shiftL(n).or(this.shiftR(64 - n));
                    // },

                    /**
                     * Rotates this word n bits to the right.
                     *
                     * @param {number} n The number of bits to rotate.
                     *
                     * @return {X64Word} A new x64-Word object after rotating.
                     *
                     * @example
                     *
                     *     var rotated = x64Word.rotR(7);
                     */
                    // rotR: function (n) {
                    // return this.shiftR(n).or(this.shiftL(64 - n));
                    // },

                    /**
                     * Adds this word with the passed word.
                     *
                     * @param {X64Word} word The x64-Word to add with this word.
                     *
                     * @return {X64Word} A new x64-Word object after adding.
                     *
                     * @example
                     *
                     *     var added = x64Word.add(anotherX64Word);
                     */
                    // add: function (word) {
                    // var low = (this.low + word.low) | 0;
                    // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
                    // var high = (this.high + word.high + carry) | 0;

                    // return X64Word.create(high, low);
                    // }
                });

                /**
                 * An array of 64-bit words.
                 *
                 * @property {Array} words The array of CryptoJS.x64.Word objects.
                 * @property {number} sigBytes The number of significant bytes in this word array.
                 */
                C_x64.WordArray = Base.extend({
                    /**
                     * Initializes a newly created word array.
                     *
                     * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
                     * @param {number} sigBytes (Optional) The number of significant bytes in the words.
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.x64.WordArray.create();
                     *
                     *     var wordArray = CryptoJS.x64.WordArray.create([
                     *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
                     *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
                     *     ]);
                     *
                     *     var wordArray = CryptoJS.x64.WordArray.create([
                     *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
                     *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
                     *     ], 10);
                     */
                    init: function (words, sigBytes) {
                        words = this.words = words || [];

                        if (sigBytes != undefined$1) {
                            this.sigBytes = sigBytes;
                        } else {
                            this.sigBytes = words.length * 8;
                        }
                    },

                    /**
                     * Converts this 64-bit word array to a 32-bit word array.
                     *
                     * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
                     *
                     * @example
                     *
                     *     var x32WordArray = x64WordArray.toX32();
                     */
                    toX32: function () {
                        // Shortcuts
                        var x64Words = this.words;
                        var x64WordsLength = x64Words.length;

                        // Convert
                        var x32Words = [];
                        for (var i = 0; i < x64WordsLength; i++) {
                            var x64Word = x64Words[i];
                            x32Words.push(x64Word.high);
                            x32Words.push(x64Word.low);
                        }

                        return X32WordArray.create(x32Words, this.sigBytes);
                    },

                    /**
                     * Creates a copy of this word array.
                     *
                     * @return {X64WordArray} The clone.
                     *
                     * @example
                     *
                     *     var clone = x64WordArray.clone();
                     */
                    clone: function () {
                        var clone = Base.clone.call(this);

                        // Clone "words" array
                        var words = clone.words = this.words.slice(0);

                        // Clone each X64Word object
                        var wordsLength = words.length;
                        for (var i = 0; i < wordsLength; i++) {
                            words[i] = words[i].clone();
                        }

                        return clone;
                    }
                });
            }());


            return CryptoJS;

        }));
    }(x64Core));
    return x64Core.exports;
}

var libTypedarrays = { exports: {} };

var hasRequiredLibTypedarrays;

function requireLibTypedarrays() {
    if (hasRequiredLibTypedarrays) return libTypedarrays.exports;
    hasRequiredLibTypedarrays = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Check if typed arrays are supported
                if (typeof ArrayBuffer != 'function') {
                    return;
                }

                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;

                // Reference original init
                var superInit = WordArray.init;

                // Augment WordArray.init to handle typed arrays
                var subInit = WordArray.init = function (typedArray) {
                    // Convert buffers to uint8
                    if (typedArray instanceof ArrayBuffer) {
                        typedArray = new Uint8Array(typedArray);
                    }

                    // Convert other array views to uint8
                    if (
                        typedArray instanceof Int8Array ||
                        (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
                        typedArray instanceof Int16Array ||
                        typedArray instanceof Uint16Array ||
                        typedArray instanceof Int32Array ||
                        typedArray instanceof Uint32Array ||
                        typedArray instanceof Float32Array ||
                        typedArray instanceof Float64Array
                    ) {
                        typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
                    }

                    // Handle Uint8Array
                    if (typedArray instanceof Uint8Array) {
                        // Shortcut
                        var typedArrayByteLength = typedArray.byteLength;

                        // Extract bytes
                        var words = [];
                        for (var i = 0; i < typedArrayByteLength; i++) {
                            words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
                        }

                        // Initialize this word array
                        superInit.call(this, words, typedArrayByteLength);
                    } else {
                        // Else call normal init
                        superInit.apply(this, arguments);
                    }
                };

                subInit.prototype = WordArray;
            }());


            return CryptoJS.lib.WordArray;

        }));
    }(libTypedarrays));
    return libTypedarrays.exports;
}

var encUtf16 = { exports: {} };

var hasRequiredEncUtf16;

function requireEncUtf16() {
    if (hasRequiredEncUtf16) return encUtf16.exports;
    hasRequiredEncUtf16 = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var C_enc = C.enc;

                /**
                 * UTF-16 BE encoding strategy.
                 */
                C_enc.Utf16 = C_enc.Utf16BE = {
                    /**
                     * Converts a word array to a UTF-16 BE string.
                     *
                     * @param {WordArray} wordArray The word array.
                     *
                     * @return {string} The UTF-16 BE string.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
                     */
                    stringify: function (wordArray) {
                        // Shortcuts
                        var words = wordArray.words;
                        var sigBytes = wordArray.sigBytes;

                        // Convert
                        var utf16Chars = [];
                        for (var i = 0; i < sigBytes; i += 2) {
                            var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
                            utf16Chars.push(String.fromCharCode(codePoint));
                        }

                        return utf16Chars.join('');
                    },

                    /**
                     * Converts a UTF-16 BE string to a word array.
                     *
                     * @param {string} utf16Str The UTF-16 BE string.
                     *
                     * @return {WordArray} The word array.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
                     */
                    parse: function (utf16Str) {
                        // Shortcut
                        var utf16StrLength = utf16Str.length;

                        // Convert
                        var words = [];
                        for (var i = 0; i < utf16StrLength; i++) {
                            words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
                        }

                        return WordArray.create(words, utf16StrLength * 2);
                    }
                };

                /**
                 * UTF-16 LE encoding strategy.
                 */
                C_enc.Utf16LE = {
                    /**
                     * Converts a word array to a UTF-16 LE string.
                     *
                     * @param {WordArray} wordArray The word array.
                     *
                     * @return {string} The UTF-16 LE string.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
                     */
                    stringify: function (wordArray) {
                        // Shortcuts
                        var words = wordArray.words;
                        var sigBytes = wordArray.sigBytes;

                        // Convert
                        var utf16Chars = [];
                        for (var i = 0; i < sigBytes; i += 2) {
                            var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
                            utf16Chars.push(String.fromCharCode(codePoint));
                        }

                        return utf16Chars.join('');
                    },

                    /**
                     * Converts a UTF-16 LE string to a word array.
                     *
                     * @param {string} utf16Str The UTF-16 LE string.
                     *
                     * @return {WordArray} The word array.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
                     */
                    parse: function (utf16Str) {
                        // Shortcut
                        var utf16StrLength = utf16Str.length;

                        // Convert
                        var words = [];
                        for (var i = 0; i < utf16StrLength; i++) {
                            words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
                        }

                        return WordArray.create(words, utf16StrLength * 2);
                    }
                };

                function swapEndian(word) {
                    return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
                }
            }());


            return CryptoJS.enc.Utf16;

        }));
    }(encUtf16));
    return encUtf16.exports;
}

var encBase64 = { exports: {} };

var hasRequiredEncBase64;

function requireEncBase64() {
    if (hasRequiredEncBase64) return encBase64.exports;
    hasRequiredEncBase64 = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var C_enc = C.enc;

                /**
                 * Base64 encoding strategy.
                 */
                C_enc.Base64 = {
                    /**
                     * Converts a word array to a Base64 string.
                     *
                     * @param {WordArray} wordArray The word array.
                     *
                     * @return {string} The Base64 string.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
                     */
                    stringify: function (wordArray) {
                        // Shortcuts
                        var words = wordArray.words;
                        var sigBytes = wordArray.sigBytes;
                        var map = this._map;

                        // Clamp excess bits
                        wordArray.clamp();

                        // Convert
                        var base64Chars = [];
                        for (var i = 0; i < sigBytes; i += 3) {
                            var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                            var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                            var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                            var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                            for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                                base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                            }
                        }

                        // Add padding
                        var paddingChar = map.charAt(64);
                        if (paddingChar) {
                            while (base64Chars.length % 4) {
                                base64Chars.push(paddingChar);
                            }
                        }

                        return base64Chars.join('');
                    },

                    /**
                     * Converts a Base64 string to a word array.
                     *
                     * @param {string} base64Str The Base64 string.
                     *
                     * @return {WordArray} The word array.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
                     */
                    parse: function (base64Str) {
                        // Shortcuts
                        var base64StrLength = base64Str.length;
                        var map = this._map;
                        var reverseMap = this._reverseMap;

                        if (!reverseMap) {
                            reverseMap = this._reverseMap = [];
                            for (var j = 0; j < map.length; j++) {
                                reverseMap[map.charCodeAt(j)] = j;
                            }
                        }

                        // Ignore padding
                        var paddingChar = map.charAt(64);
                        if (paddingChar) {
                            var paddingIndex = base64Str.indexOf(paddingChar);
                            if (paddingIndex !== -1) {
                                base64StrLength = paddingIndex;
                            }
                        }

                        // Convert
                        return parseLoop(base64Str, base64StrLength, reverseMap);

                    },

                    _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
                };

                function parseLoop(base64Str, base64StrLength, reverseMap) {
                    var words = [];
                    var nBytes = 0;
                    for (var i = 0; i < base64StrLength; i++) {
                        if (i % 4) {
                            var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
                            var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
                            var bitsCombined = bits1 | bits2;
                            words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
                            nBytes++;
                        }
                    }
                    return WordArray.create(words, nBytes);
                }
            }());


            return CryptoJS.enc.Base64;

        }));
    }(encBase64));
    return encBase64.exports;
}

var encBase64url = { exports: {} };

var hasRequiredEncBase64url;

function requireEncBase64url() {
    if (hasRequiredEncBase64url) return encBase64url.exports;
    hasRequiredEncBase64url = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var C_enc = C.enc;

                /**
                 * Base64url encoding strategy.
                 */
                C_enc.Base64url = {
                    /**
                     * Converts a word array to a Base64url string.
                     *
                     * @param {WordArray} wordArray The word array.
                     *
                     * @param {boolean} urlSafe Whether to use url safe
                     *
                     * @return {string} The Base64url string.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
                     */
                    stringify: function (wordArray, urlSafe) {
                        if (urlSafe === undefined) {
                            urlSafe = true;
                        }
                        // Shortcuts
                        var words = wordArray.words;
                        var sigBytes = wordArray.sigBytes;
                        var map = urlSafe ? this._safe_map : this._map;

                        // Clamp excess bits
                        wordArray.clamp();

                        // Convert
                        var base64Chars = [];
                        for (var i = 0; i < sigBytes; i += 3) {
                            var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                            var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                            var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                            var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                            for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                                base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                            }
                        }

                        // Add padding
                        var paddingChar = map.charAt(64);
                        if (paddingChar) {
                            while (base64Chars.length % 4) {
                                base64Chars.push(paddingChar);
                            }
                        }

                        return base64Chars.join('');
                    },

                    /**
                     * Converts a Base64url string to a word array.
                     *
                     * @param {string} base64Str The Base64url string.
                     *
                     * @param {boolean} urlSafe Whether to use url safe
                     *
                     * @return {WordArray} The word array.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
                     */
                    parse: function (base64Str, urlSafe) {
                        if (urlSafe === undefined) {
                            urlSafe = true;
                        }

                        // Shortcuts
                        var base64StrLength = base64Str.length;
                        var map = urlSafe ? this._safe_map : this._map;
                        var reverseMap = this._reverseMap;

                        if (!reverseMap) {
                            reverseMap = this._reverseMap = [];
                            for (var j = 0; j < map.length; j++) {
                                reverseMap[map.charCodeAt(j)] = j;
                            }
                        }

                        // Ignore padding
                        var paddingChar = map.charAt(64);
                        if (paddingChar) {
                            var paddingIndex = base64Str.indexOf(paddingChar);
                            if (paddingIndex !== -1) {
                                base64StrLength = paddingIndex;
                            }
                        }

                        // Convert
                        return parseLoop(base64Str, base64StrLength, reverseMap);

                    },

                    _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
                    _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
                };

                function parseLoop(base64Str, base64StrLength, reverseMap) {
                    var words = [];
                    var nBytes = 0;
                    for (var i = 0; i < base64StrLength; i++) {
                        if (i % 4) {
                            var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
                            var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
                            var bitsCombined = bits1 | bits2;
                            words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
                            nBytes++;
                        }
                    }
                    return WordArray.create(words, nBytes);
                }
            }());


            return CryptoJS.enc.Base64url;

        }));
    }(encBase64url));
    return encBase64url.exports;
}

var md5 = { exports: {} };

var hasRequiredMd5;

function requireMd5() {
    if (hasRequiredMd5) return md5.exports;
    hasRequiredMd5 = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function (Math) {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var Hasher = C_lib.Hasher;
                var C_algo = C.algo;

                // Constants table
                var T = [];

                // Compute constants
                (function () {
                    for (var i = 0; i < 64; i++) {
                        T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
                    }
                }());

                /**
                 * MD5 hash algorithm.
                 */
                var MD5 = C_algo.MD5 = Hasher.extend({
                    _doReset: function () {
                        this._hash = new WordArray.init([
                            0x67452301, 0xefcdab89,
                            0x98badcfe, 0x10325476
                        ]);
                    },

                    _doProcessBlock: function (M, offset) {
                        // Swap endian
                        for (var i = 0; i < 16; i++) {
                            // Shortcuts
                            var offset_i = offset + i;
                            var M_offset_i = M[offset_i];

                            M[offset_i] = (
                                (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                                (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
                            );
                        }

                        // Shortcuts
                        var H = this._hash.words;

                        var M_offset_0 = M[offset + 0];
                        var M_offset_1 = M[offset + 1];
                        var M_offset_2 = M[offset + 2];
                        var M_offset_3 = M[offset + 3];
                        var M_offset_4 = M[offset + 4];
                        var M_offset_5 = M[offset + 5];
                        var M_offset_6 = M[offset + 6];
                        var M_offset_7 = M[offset + 7];
                        var M_offset_8 = M[offset + 8];
                        var M_offset_9 = M[offset + 9];
                        var M_offset_10 = M[offset + 10];
                        var M_offset_11 = M[offset + 11];
                        var M_offset_12 = M[offset + 12];
                        var M_offset_13 = M[offset + 13];
                        var M_offset_14 = M[offset + 14];
                        var M_offset_15 = M[offset + 15];

                        // Working variables
                        var a = H[0];
                        var b = H[1];
                        var c = H[2];
                        var d = H[3];

                        // Computation
                        a = FF(a, b, c, d, M_offset_0, 7, T[0]);
                        d = FF(d, a, b, c, M_offset_1, 12, T[1]);
                        c = FF(c, d, a, b, M_offset_2, 17, T[2]);
                        b = FF(b, c, d, a, M_offset_3, 22, T[3]);
                        a = FF(a, b, c, d, M_offset_4, 7, T[4]);
                        d = FF(d, a, b, c, M_offset_5, 12, T[5]);
                        c = FF(c, d, a, b, M_offset_6, 17, T[6]);
                        b = FF(b, c, d, a, M_offset_7, 22, T[7]);
                        a = FF(a, b, c, d, M_offset_8, 7, T[8]);
                        d = FF(d, a, b, c, M_offset_9, 12, T[9]);
                        c = FF(c, d, a, b, M_offset_10, 17, T[10]);
                        b = FF(b, c, d, a, M_offset_11, 22, T[11]);
                        a = FF(a, b, c, d, M_offset_12, 7, T[12]);
                        d = FF(d, a, b, c, M_offset_13, 12, T[13]);
                        c = FF(c, d, a, b, M_offset_14, 17, T[14]);
                        b = FF(b, c, d, a, M_offset_15, 22, T[15]);

                        a = GG(a, b, c, d, M_offset_1, 5, T[16]);
                        d = GG(d, a, b, c, M_offset_6, 9, T[17]);
                        c = GG(c, d, a, b, M_offset_11, 14, T[18]);
                        b = GG(b, c, d, a, M_offset_0, 20, T[19]);
                        a = GG(a, b, c, d, M_offset_5, 5, T[20]);
                        d = GG(d, a, b, c, M_offset_10, 9, T[21]);
                        c = GG(c, d, a, b, M_offset_15, 14, T[22]);
                        b = GG(b, c, d, a, M_offset_4, 20, T[23]);
                        a = GG(a, b, c, d, M_offset_9, 5, T[24]);
                        d = GG(d, a, b, c, M_offset_14, 9, T[25]);
                        c = GG(c, d, a, b, M_offset_3, 14, T[26]);
                        b = GG(b, c, d, a, M_offset_8, 20, T[27]);
                        a = GG(a, b, c, d, M_offset_13, 5, T[28]);
                        d = GG(d, a, b, c, M_offset_2, 9, T[29]);
                        c = GG(c, d, a, b, M_offset_7, 14, T[30]);
                        b = GG(b, c, d, a, M_offset_12, 20, T[31]);

                        a = HH(a, b, c, d, M_offset_5, 4, T[32]);
                        d = HH(d, a, b, c, M_offset_8, 11, T[33]);
                        c = HH(c, d, a, b, M_offset_11, 16, T[34]);
                        b = HH(b, c, d, a, M_offset_14, 23, T[35]);
                        a = HH(a, b, c, d, M_offset_1, 4, T[36]);
                        d = HH(d, a, b, c, M_offset_4, 11, T[37]);
                        c = HH(c, d, a, b, M_offset_7, 16, T[38]);
                        b = HH(b, c, d, a, M_offset_10, 23, T[39]);
                        a = HH(a, b, c, d, M_offset_13, 4, T[40]);
                        d = HH(d, a, b, c, M_offset_0, 11, T[41]);
                        c = HH(c, d, a, b, M_offset_3, 16, T[42]);
                        b = HH(b, c, d, a, M_offset_6, 23, T[43]);
                        a = HH(a, b, c, d, M_offset_9, 4, T[44]);
                        d = HH(d, a, b, c, M_offset_12, 11, T[45]);
                        c = HH(c, d, a, b, M_offset_15, 16, T[46]);
                        b = HH(b, c, d, a, M_offset_2, 23, T[47]);

                        a = II(a, b, c, d, M_offset_0, 6, T[48]);
                        d = II(d, a, b, c, M_offset_7, 10, T[49]);
                        c = II(c, d, a, b, M_offset_14, 15, T[50]);
                        b = II(b, c, d, a, M_offset_5, 21, T[51]);
                        a = II(a, b, c, d, M_offset_12, 6, T[52]);
                        d = II(d, a, b, c, M_offset_3, 10, T[53]);
                        c = II(c, d, a, b, M_offset_10, 15, T[54]);
                        b = II(b, c, d, a, M_offset_1, 21, T[55]);
                        a = II(a, b, c, d, M_offset_8, 6, T[56]);
                        d = II(d, a, b, c, M_offset_15, 10, T[57]);
                        c = II(c, d, a, b, M_offset_6, 15, T[58]);
                        b = II(b, c, d, a, M_offset_13, 21, T[59]);
                        a = II(a, b, c, d, M_offset_4, 6, T[60]);
                        d = II(d, a, b, c, M_offset_11, 10, T[61]);
                        c = II(c, d, a, b, M_offset_2, 15, T[62]);
                        b = II(b, c, d, a, M_offset_9, 21, T[63]);

                        // Intermediate hash value
                        H[0] = (H[0] + a) | 0;
                        H[1] = (H[1] + b) | 0;
                        H[2] = (H[2] + c) | 0;
                        H[3] = (H[3] + d) | 0;
                    },

                    _doFinalize: function () {
                        // Shortcuts
                        var data = this._data;
                        var dataWords = data.words;

                        var nBitsTotal = this._nDataBytes * 8;
                        var nBitsLeft = data.sigBytes * 8;

                        // Add padding
                        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

                        var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
                        var nBitsTotalL = nBitsTotal;
                        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                            (((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                            (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00)
                        );
                        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                            (((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                            (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00)
                        );

                        data.sigBytes = (dataWords.length + 1) * 4;

                        // Hash final blocks
                        this._process();

                        // Shortcuts
                        var hash = this._hash;
                        var H = hash.words;

                        // Swap endian
                        for (var i = 0; i < 4; i++) {
                            // Shortcut
                            var H_i = H[i];

                            H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                                (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
                        }

                        // Return final computed hash
                        return hash;
                    },

                    clone: function () {
                        var clone = Hasher.clone.call(this);
                        clone._hash = this._hash.clone();

                        return clone;
                    }
                });

                function FF(a, b, c, d, x, s, t) {
                    var n = a + ((b & c) | (~b & d)) + x + t;
                    return ((n << s) | (n >>> (32 - s))) + b;
                }

                function GG(a, b, c, d, x, s, t) {
                    var n = a + ((b & d) | (c & ~d)) + x + t;
                    return ((n << s) | (n >>> (32 - s))) + b;
                }

                function HH(a, b, c, d, x, s, t) {
                    var n = a + (b ^ c ^ d) + x + t;
                    return ((n << s) | (n >>> (32 - s))) + b;
                }

                function II(a, b, c, d, x, s, t) {
                    var n = a + (c ^ (b | ~d)) + x + t;
                    return ((n << s) | (n >>> (32 - s))) + b;
                }

                /**
                 * Shortcut function to the hasher's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hash = CryptoJS.MD5('message');
                 *     var hash = CryptoJS.MD5(wordArray);
                 */
                C.MD5 = Hasher._createHelper(MD5);

                /**
                 * Shortcut function to the HMAC's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 * @param {WordArray|string} key The secret key.
                 *
                 * @return {WordArray} The HMAC.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hmac = CryptoJS.HmacMD5(message, key);
                 */
                C.HmacMD5 = Hasher._createHmacHelper(MD5);
            }(Math));


            return CryptoJS.MD5;

        }));
    }(md5));
    return md5.exports;
}

var sha1 = { exports: {} };

var hasRequiredSha1;

function requireSha1() {
    if (hasRequiredSha1) return sha1.exports;
    hasRequiredSha1 = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var Hasher = C_lib.Hasher;
                var C_algo = C.algo;

                // Reusable object
                var W = [];

                /**
                 * SHA-1 hash algorithm.
                 */
                var SHA1 = C_algo.SHA1 = Hasher.extend({
                    _doReset: function () {
                        this._hash = new WordArray.init([
                            0x67452301, 0xefcdab89,
                            0x98badcfe, 0x10325476,
                            0xc3d2e1f0
                        ]);
                    },

                    _doProcessBlock: function (M, offset) {
                        // Shortcut
                        var H = this._hash.words;

                        // Working variables
                        var a = H[0];
                        var b = H[1];
                        var c = H[2];
                        var d = H[3];
                        var e = H[4];

                        // Computation
                        for (var i = 0; i < 80; i++) {
                            if (i < 16) {
                                W[i] = M[offset + i] | 0;
                            } else {
                                var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                                W[i] = (n << 1) | (n >>> 31);
                            }

                            var t = ((a << 5) | (a >>> 27)) + e + W[i];
                            if (i < 20) {
                                t += ((b & c) | (~b & d)) + 0x5a827999;
                            } else if (i < 40) {
                                t += (b ^ c ^ d) + 0x6ed9eba1;
                            } else if (i < 60) {
                                t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
                            } else /* if (i < 80) */ {
                                t += (b ^ c ^ d) - 0x359d3e2a;
                            }

                            e = d;
                            d = c;
                            c = (b << 30) | (b >>> 2);
                            b = a;
                            a = t;
                        }

                        // Intermediate hash value
                        H[0] = (H[0] + a) | 0;
                        H[1] = (H[1] + b) | 0;
                        H[2] = (H[2] + c) | 0;
                        H[3] = (H[3] + d) | 0;
                        H[4] = (H[4] + e) | 0;
                    },

                    _doFinalize: function () {
                        // Shortcuts
                        var data = this._data;
                        var dataWords = data.words;

                        var nBitsTotal = this._nDataBytes * 8;
                        var nBitsLeft = data.sigBytes * 8;

                        // Add padding
                        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
                        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
                        data.sigBytes = dataWords.length * 4;

                        // Hash final blocks
                        this._process();

                        // Return final computed hash
                        return this._hash;
                    },

                    clone: function () {
                        var clone = Hasher.clone.call(this);
                        clone._hash = this._hash.clone();

                        return clone;
                    }
                });

                /**
                 * Shortcut function to the hasher's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hash = CryptoJS.SHA1('message');
                 *     var hash = CryptoJS.SHA1(wordArray);
                 */
                C.SHA1 = Hasher._createHelper(SHA1);

                /**
                 * Shortcut function to the HMAC's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 * @param {WordArray|string} key The secret key.
                 *
                 * @return {WordArray} The HMAC.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hmac = CryptoJS.HmacSHA1(message, key);
                 */
                C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
            }());


            return CryptoJS.SHA1;

        }));
    }(sha1));
    return sha1.exports;
}

var sha256 = { exports: {} };

var hasRequiredSha256;

function requireSha256() {
    if (hasRequiredSha256) return sha256.exports;
    hasRequiredSha256 = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function (Math) {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var Hasher = C_lib.Hasher;
                var C_algo = C.algo;

                // Initialization and round constants tables
                var H = [];
                var K = [];

                // Compute constants
                (function () {
                    function isPrime(n) {
                        var sqrtN = Math.sqrt(n);
                        for (var factor = 2; factor <= sqrtN; factor++) {
                            if (!(n % factor)) {
                                return false;
                            }
                        }

                        return true;
                    }

                    function getFractionalBits(n) {
                        return ((n - (n | 0)) * 0x100000000) | 0;
                    }

                    var n = 2;
                    var nPrime = 0;
                    while (nPrime < 64) {
                        if (isPrime(n)) {
                            if (nPrime < 8) {
                                H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                            }
                            K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                            nPrime++;
                        }

                        n++;
                    }
                }());

                // Reusable object
                var W = [];

                /**
                 * SHA-256 hash algorithm.
                 */
                var SHA256 = C_algo.SHA256 = Hasher.extend({
                    _doReset: function () {
                        this._hash = new WordArray.init(H.slice(0));
                    },

                    _doProcessBlock: function (M, offset) {
                        // Shortcut
                        var H = this._hash.words;

                        // Working variables
                        var a = H[0];
                        var b = H[1];
                        var c = H[2];
                        var d = H[3];
                        var e = H[4];
                        var f = H[5];
                        var g = H[6];
                        var h = H[7];

                        // Computation
                        for (var i = 0; i < 64; i++) {
                            if (i < 16) {
                                W[i] = M[offset + i] | 0;
                            } else {
                                var gamma0x = W[i - 15];
                                var gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^
                                    ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                    (gamma0x >>> 3);

                                var gamma1x = W[i - 2];
                                var gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                                    ((gamma1x << 13) | (gamma1x >>> 19)) ^
                                    (gamma1x >>> 10);

                                W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                            }

                            var ch = (e & f) ^ (~e & g);
                            var maj = (a & b) ^ (a & c) ^ (b & c);

                            var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                            var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25));

                            var t1 = h + sigma1 + ch + K[i] + W[i];
                            var t2 = sigma0 + maj;

                            h = g;
                            g = f;
                            f = e;
                            e = (d + t1) | 0;
                            d = c;
                            c = b;
                            b = a;
                            a = (t1 + t2) | 0;
                        }

                        // Intermediate hash value
                        H[0] = (H[0] + a) | 0;
                        H[1] = (H[1] + b) | 0;
                        H[2] = (H[2] + c) | 0;
                        H[3] = (H[3] + d) | 0;
                        H[4] = (H[4] + e) | 0;
                        H[5] = (H[5] + f) | 0;
                        H[6] = (H[6] + g) | 0;
                        H[7] = (H[7] + h) | 0;
                    },

                    _doFinalize: function () {
                        // Shortcuts
                        var data = this._data;
                        var dataWords = data.words;

                        var nBitsTotal = this._nDataBytes * 8;
                        var nBitsLeft = data.sigBytes * 8;

                        // Add padding
                        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
                        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
                        data.sigBytes = dataWords.length * 4;

                        // Hash final blocks
                        this._process();

                        // Return final computed hash
                        return this._hash;
                    },

                    clone: function () {
                        var clone = Hasher.clone.call(this);
                        clone._hash = this._hash.clone();

                        return clone;
                    }
                });

                /**
                 * Shortcut function to the hasher's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hash = CryptoJS.SHA256('message');
                 *     var hash = CryptoJS.SHA256(wordArray);
                 */
                C.SHA256 = Hasher._createHelper(SHA256);

                /**
                 * Shortcut function to the HMAC's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 * @param {WordArray|string} key The secret key.
                 *
                 * @return {WordArray} The HMAC.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hmac = CryptoJS.HmacSHA256(message, key);
                 */
                C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
            }(Math));


            return CryptoJS.SHA256;

        }));
    }(sha256));
    return sha256.exports;
}

var sha224 = { exports: {} };

var hasRequiredSha224;

function requireSha224() {
    if (hasRequiredSha224) return sha224.exports;
    hasRequiredSha224 = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireSha256());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var C_algo = C.algo;
                var SHA256 = C_algo.SHA256;

                /**
                 * SHA-224 hash algorithm.
                 */
                var SHA224 = C_algo.SHA224 = SHA256.extend({
                    _doReset: function () {
                        this._hash = new WordArray.init([
                            0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
                            0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
                        ]);
                    },

                    _doFinalize: function () {
                        var hash = SHA256._doFinalize.call(this);

                        hash.sigBytes -= 4;

                        return hash;
                    }
                });

                /**
                 * Shortcut function to the hasher's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hash = CryptoJS.SHA224('message');
                 *     var hash = CryptoJS.SHA224(wordArray);
                 */
                C.SHA224 = SHA256._createHelper(SHA224);

                /**
                 * Shortcut function to the HMAC's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 * @param {WordArray|string} key The secret key.
                 *
                 * @return {WordArray} The HMAC.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hmac = CryptoJS.HmacSHA224(message, key);
                 */
                C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
            }());


            return CryptoJS.SHA224;

        }));
    }(sha224));
    return sha224.exports;
}

var sha512 = { exports: {} };

var hasRequiredSha512;

function requireSha512() {
    if (hasRequiredSha512) return sha512.exports;
    hasRequiredSha512 = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireX64Core());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var Hasher = C_lib.Hasher;
                var C_x64 = C.x64;
                var X64Word = C_x64.Word;
                var X64WordArray = C_x64.WordArray;
                var C_algo = C.algo;

                function X64Word_create() {
                    return X64Word.create.apply(X64Word, arguments);
                }

                // Constants
                var K = [
                    X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
                    X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
                    X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
                    X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
                    X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
                    X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
                    X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
                    X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
                    X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
                    X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
                    X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
                    X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
                    X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
                    X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
                    X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
                    X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
                    X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
                    X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
                    X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
                    X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
                    X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
                    X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
                    X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
                    X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
                    X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
                    X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
                    X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
                    X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
                    X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
                    X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
                    X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
                    X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
                    X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
                    X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
                    X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
                    X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
                    X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
                    X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
                    X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
                    X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
                ];

                // Reusable objects
                var W = [];
                (function () {
                    for (var i = 0; i < 80; i++) {
                        W[i] = X64Word_create();
                    }
                }());

                /**
                 * SHA-512 hash algorithm.
                 */
                var SHA512 = C_algo.SHA512 = Hasher.extend({
                    _doReset: function () {
                        this._hash = new X64WordArray.init([
                            new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
                            new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
                            new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
                            new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
                        ]);
                    },

                    _doProcessBlock: function (M, offset) {
                        // Shortcuts
                        var H = this._hash.words;

                        var H0 = H[0];
                        var H1 = H[1];
                        var H2 = H[2];
                        var H3 = H[3];
                        var H4 = H[4];
                        var H5 = H[5];
                        var H6 = H[6];
                        var H7 = H[7];

                        var H0h = H0.high;
                        var H0l = H0.low;
                        var H1h = H1.high;
                        var H1l = H1.low;
                        var H2h = H2.high;
                        var H2l = H2.low;
                        var H3h = H3.high;
                        var H3l = H3.low;
                        var H4h = H4.high;
                        var H4l = H4.low;
                        var H5h = H5.high;
                        var H5l = H5.low;
                        var H6h = H6.high;
                        var H6l = H6.low;
                        var H7h = H7.high;
                        var H7l = H7.low;

                        // Working variables
                        var ah = H0h;
                        var al = H0l;
                        var bh = H1h;
                        var bl = H1l;
                        var ch = H2h;
                        var cl = H2l;
                        var dh = H3h;
                        var dl = H3l;
                        var eh = H4h;
                        var el = H4l;
                        var fh = H5h;
                        var fl = H5l;
                        var gh = H6h;
                        var gl = H6l;
                        var hh = H7h;
                        var hl = H7l;

                        // Rounds
                        for (var i = 0; i < 80; i++) {
                            var Wil;
                            var Wih;

                            // Shortcut
                            var Wi = W[i];

                            // Extend message
                            if (i < 16) {
                                Wih = Wi.high = M[offset + i * 2] | 0;
                                Wil = Wi.low = M[offset + i * 2 + 1] | 0;
                            } else {
                                // Gamma0
                                var gamma0x = W[i - 15];
                                var gamma0xh = gamma0x.high;
                                var gamma0xl = gamma0x.low;
                                var gamma0h = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
                                var gamma0l = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

                                // Gamma1
                                var gamma1x = W[i - 2];
                                var gamma1xh = gamma1x.high;
                                var gamma1xl = gamma1x.low;
                                var gamma1h = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
                                var gamma1l = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

                                // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
                                var Wi7 = W[i - 7];
                                var Wi7h = Wi7.high;
                                var Wi7l = Wi7.low;

                                var Wi16 = W[i - 16];
                                var Wi16h = Wi16.high;
                                var Wi16l = Wi16.low;

                                Wil = gamma0l + Wi7l;
                                Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
                                Wil = Wil + gamma1l;
                                Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
                                Wil = Wil + Wi16l;
                                Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

                                Wi.high = Wih;
                                Wi.low = Wil;
                            }

                            var chh = (eh & fh) ^ (~eh & gh);
                            var chl = (el & fl) ^ (~el & gl);
                            var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
                            var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

                            var sigma0h = ((ah >>> 28) | (al << 4)) ^ ((ah << 30) | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
                            var sigma0l = ((al >>> 28) | (ah << 4)) ^ ((al << 30) | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
                            var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
                            var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

                            // t1 = h + sigma1 + ch + K[i] + W[i]
                            var Ki = K[i];
                            var Kih = Ki.high;
                            var Kil = Ki.low;

                            var t1l = hl + sigma1l;
                            var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
                            var t1l = t1l + chl;
                            var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
                            var t1l = t1l + Kil;
                            var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
                            var t1l = t1l + Wil;
                            var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

                            // t2 = sigma0 + maj
                            var t2l = sigma0l + majl;
                            var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

                            // Update working variables
                            hh = gh;
                            hl = gl;
                            gh = fh;
                            gl = fl;
                            fh = eh;
                            fl = el;
                            el = (dl + t1l) | 0;
                            eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
                            dh = ch;
                            dl = cl;
                            ch = bh;
                            cl = bl;
                            bh = ah;
                            bl = al;
                            al = (t1l + t2l) | 0;
                            ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
                        }

                        // Intermediate hash value
                        H0l = H0.low = (H0l + al);
                        H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
                        H1l = H1.low = (H1l + bl);
                        H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
                        H2l = H2.low = (H2l + cl);
                        H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
                        H3l = H3.low = (H3l + dl);
                        H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
                        H4l = H4.low = (H4l + el);
                        H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
                        H5l = H5.low = (H5l + fl);
                        H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
                        H6l = H6.low = (H6l + gl);
                        H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
                        H7l = H7.low = (H7l + hl);
                        H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
                    },

                    _doFinalize: function () {
                        // Shortcuts
                        var data = this._data;
                        var dataWords = data.words;

                        var nBitsTotal = this._nDataBytes * 8;
                        var nBitsLeft = data.sigBytes * 8;

                        // Add padding
                        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                        dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
                        dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
                        data.sigBytes = dataWords.length * 4;

                        // Hash final blocks
                        this._process();

                        // Convert hash to 32-bit word array before returning
                        var hash = this._hash.toX32();

                        // Return final computed hash
                        return hash;
                    },

                    clone: function () {
                        var clone = Hasher.clone.call(this);
                        clone._hash = this._hash.clone();

                        return clone;
                    },

                    blockSize: 1024 / 32
                });

                /**
                 * Shortcut function to the hasher's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hash = CryptoJS.SHA512('message');
                 *     var hash = CryptoJS.SHA512(wordArray);
                 */
                C.SHA512 = Hasher._createHelper(SHA512);

                /**
                 * Shortcut function to the HMAC's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 * @param {WordArray|string} key The secret key.
                 *
                 * @return {WordArray} The HMAC.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hmac = CryptoJS.HmacSHA512(message, key);
                 */
                C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
            }());


            return CryptoJS.SHA512;

        }));
    }(sha512));
    return sha512.exports;
}

var sha384 = { exports: {} };

var hasRequiredSha384;

function requireSha384() {
    if (hasRequiredSha384) return sha384.exports;
    hasRequiredSha384 = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireX64Core(), requireSha512());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_x64 = C.x64;
                var X64Word = C_x64.Word;
                var X64WordArray = C_x64.WordArray;
                var C_algo = C.algo;
                var SHA512 = C_algo.SHA512;

                /**
                 * SHA-384 hash algorithm.
                 */
                var SHA384 = C_algo.SHA384 = SHA512.extend({
                    _doReset: function () {
                        this._hash = new X64WordArray.init([
                            new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
                            new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
                            new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
                            new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
                        ]);
                    },

                    _doFinalize: function () {
                        var hash = SHA512._doFinalize.call(this);

                        hash.sigBytes -= 16;

                        return hash;
                    }
                });

                /**
                 * Shortcut function to the hasher's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hash = CryptoJS.SHA384('message');
                 *     var hash = CryptoJS.SHA384(wordArray);
                 */
                C.SHA384 = SHA512._createHelper(SHA384);

                /**
                 * Shortcut function to the HMAC's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 * @param {WordArray|string} key The secret key.
                 *
                 * @return {WordArray} The HMAC.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hmac = CryptoJS.HmacSHA384(message, key);
                 */
                C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
            }());


            return CryptoJS.SHA384;

        }));
    }(sha384));
    return sha384.exports;
}

var sha3 = { exports: {} };

var hasRequiredSha3;

function requireSha3() {
    if (hasRequiredSha3) return sha3.exports;
    hasRequiredSha3 = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireX64Core());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function (Math) {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var Hasher = C_lib.Hasher;
                var C_x64 = C.x64;
                var X64Word = C_x64.Word;
                var C_algo = C.algo;

                // Constants tables
                var RHO_OFFSETS = [];
                var PI_INDEXES = [];
                var ROUND_CONSTANTS = [];

                // Compute Constants
                (function () {
                    // Compute rho offset constants
                    var x = 1, y = 0;
                    for (var t = 0; t < 24; t++) {
                        RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

                        var newX = y % 5;
                        var newY = (2 * x + 3 * y) % 5;
                        x = newX;
                        y = newY;
                    }

                    // Compute pi index constants
                    for (var x = 0; x < 5; x++) {
                        for (var y = 0; y < 5; y++) {
                            PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
                        }
                    }

                    // Compute round constants
                    var LFSR = 0x01;
                    for (var i = 0; i < 24; i++) {
                        var roundConstantMsw = 0;
                        var roundConstantLsw = 0;

                        for (var j = 0; j < 7; j++) {
                            if (LFSR & 0x01) {
                                var bitPosition = (1 << j) - 1;
                                if (bitPosition < 32) {
                                    roundConstantLsw ^= 1 << bitPosition;
                                } else /* if (bitPosition >= 32) */ {
                                    roundConstantMsw ^= 1 << (bitPosition - 32);
                                }
                            }

                            // Compute next LFSR
                            if (LFSR & 0x80) {
                                // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
                                LFSR = (LFSR << 1) ^ 0x71;
                            } else {
                                LFSR <<= 1;
                            }
                        }

                        ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
                    }
                }());

                // Reusable objects for temporary values
                var T = [];
                (function () {
                    for (var i = 0; i < 25; i++) {
                        T[i] = X64Word.create();
                    }
                }());

                /**
                 * SHA-3 hash algorithm.
                 */
                var SHA3 = C_algo.SHA3 = Hasher.extend({
                    /**
                     * Configuration options.
                     *
                     * @property {number} outputLength
                     *   The desired number of bits in the output hash.
                     *   Only values permitted are: 224, 256, 384, 512.
                     *   Default: 512
                     */
                    cfg: Hasher.cfg.extend({
                        outputLength: 512
                    }),

                    _doReset: function () {
                        var state = this._state = [];
                        for (var i = 0; i < 25; i++) {
                            state[i] = new X64Word.init();
                        }

                        this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
                    },

                    _doProcessBlock: function (M, offset) {
                        // Shortcuts
                        var state = this._state;
                        var nBlockSizeLanes = this.blockSize / 2;

                        // Absorb
                        for (var i = 0; i < nBlockSizeLanes; i++) {
                            // Shortcuts
                            var M2i = M[offset + 2 * i];
                            var M2i1 = M[offset + 2 * i + 1];

                            // Swap endian
                            M2i = (
                                (((M2i << 8) | (M2i >>> 24)) & 0x00ff00ff) |
                                (((M2i << 24) | (M2i >>> 8)) & 0xff00ff00)
                            );
                            M2i1 = (
                                (((M2i1 << 8) | (M2i1 >>> 24)) & 0x00ff00ff) |
                                (((M2i1 << 24) | (M2i1 >>> 8)) & 0xff00ff00)
                            );

                            // Absorb message into state
                            var lane = state[i];
                            lane.high ^= M2i1;
                            lane.low ^= M2i;
                        }

                        // Rounds
                        for (var round = 0; round < 24; round++) {
                            // Theta
                            for (var x = 0; x < 5; x++) {
                                // Mix column lanes
                                var tMsw = 0, tLsw = 0;
                                for (var y = 0; y < 5; y++) {
                                    var lane = state[x + 5 * y];
                                    tMsw ^= lane.high;
                                    tLsw ^= lane.low;
                                }

                                // Temporary values
                                var Tx = T[x];
                                Tx.high = tMsw;
                                Tx.low = tLsw;
                            }
                            for (var x = 0; x < 5; x++) {
                                // Shortcuts
                                var Tx4 = T[(x + 4) % 5];
                                var Tx1 = T[(x + 1) % 5];
                                var Tx1Msw = Tx1.high;
                                var Tx1Lsw = Tx1.low;

                                // Mix surrounding columns
                                var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
                                var tLsw = Tx4.low ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
                                for (var y = 0; y < 5; y++) {
                                    var lane = state[x + 5 * y];
                                    lane.high ^= tMsw;
                                    lane.low ^= tLsw;
                                }
                            }

                            // Rho Pi
                            for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                                var tMsw;
                                var tLsw;

                                // Shortcuts
                                var lane = state[laneIndex];
                                var laneMsw = lane.high;
                                var laneLsw = lane.low;
                                var rhoOffset = RHO_OFFSETS[laneIndex];

                                // Rotate lanes
                                if (rhoOffset < 32) {
                                    tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
                                    tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
                                } else /* if (rhoOffset >= 32) */ {
                                    tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
                                    tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
                                }

                                // Transpose lanes
                                var TPiLane = T[PI_INDEXES[laneIndex]];
                                TPiLane.high = tMsw;
                                TPiLane.low = tLsw;
                            }

                            // Rho pi at x = y = 0
                            var T0 = T[0];
                            var state0 = state[0];
                            T0.high = state0.high;
                            T0.low = state0.low;

                            // Chi
                            for (var x = 0; x < 5; x++) {
                                for (var y = 0; y < 5; y++) {
                                    // Shortcuts
                                    var laneIndex = x + 5 * y;
                                    var lane = state[laneIndex];
                                    var TLane = T[laneIndex];
                                    var Tx1Lane = T[((x + 1) % 5) + 5 * y];
                                    var Tx2Lane = T[((x + 2) % 5) + 5 * y];

                                    // Mix rows
                                    lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
                                    lane.low = TLane.low ^ (~Tx1Lane.low & Tx2Lane.low);
                                }
                            }

                            // Iota
                            var lane = state[0];
                            var roundConstant = ROUND_CONSTANTS[round];
                            lane.high ^= roundConstant.high;
                            lane.low ^= roundConstant.low;
                        }
                    },

                    _doFinalize: function () {
                        // Shortcuts
                        var data = this._data;
                        var dataWords = data.words;
                        this._nDataBytes * 8;
                        var nBitsLeft = data.sigBytes * 8;
                        var blockSizeBits = this.blockSize * 32;

                        // Add padding
                        dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
                        dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
                        data.sigBytes = dataWords.length * 4;

                        // Hash final blocks
                        this._process();

                        // Shortcuts
                        var state = this._state;
                        var outputLengthBytes = this.cfg.outputLength / 8;
                        var outputLengthLanes = outputLengthBytes / 8;

                        // Squeeze
                        var hashWords = [];
                        for (var i = 0; i < outputLengthLanes; i++) {
                            // Shortcuts
                            var lane = state[i];
                            var laneMsw = lane.high;
                            var laneLsw = lane.low;

                            // Swap endian
                            laneMsw = (
                                (((laneMsw << 8) | (laneMsw >>> 24)) & 0x00ff00ff) |
                                (((laneMsw << 24) | (laneMsw >>> 8)) & 0xff00ff00)
                            );
                            laneLsw = (
                                (((laneLsw << 8) | (laneLsw >>> 24)) & 0x00ff00ff) |
                                (((laneLsw << 24) | (laneLsw >>> 8)) & 0xff00ff00)
                            );

                            // Squeeze state to retrieve hash
                            hashWords.push(laneLsw);
                            hashWords.push(laneMsw);
                        }

                        // Return final computed hash
                        return new WordArray.init(hashWords, outputLengthBytes);
                    },

                    clone: function () {
                        var clone = Hasher.clone.call(this);

                        var state = clone._state = this._state.slice(0);
                        for (var i = 0; i < 25; i++) {
                            state[i] = state[i].clone();
                        }

                        return clone;
                    }
                });

                /**
                 * Shortcut function to the hasher's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hash = CryptoJS.SHA3('message');
                 *     var hash = CryptoJS.SHA3(wordArray);
                 */
                C.SHA3 = Hasher._createHelper(SHA3);

                /**
                 * Shortcut function to the HMAC's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 * @param {WordArray|string} key The secret key.
                 *
                 * @return {WordArray} The HMAC.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hmac = CryptoJS.HmacSHA3(message, key);
                 */
                C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
            }(Math));


            return CryptoJS.SHA3;

        }));
    }(sha3));
    return sha3.exports;
}

var ripemd160 = { exports: {} };

var hasRequiredRipemd160;

function requireRipemd160() {
    if (hasRequiredRipemd160) return ripemd160.exports;
    hasRequiredRipemd160 = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /** @preserve
             (c) 2012 by Cédric Mesnil. All rights reserved.

             Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

             - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
             - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

             THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
             */

            (function (Math) {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var Hasher = C_lib.Hasher;
                var C_algo = C.algo;

                // Constants table
                var _zl = WordArray.create([
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                    7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
                    3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
                    1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
                    4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]);
                var _zr = WordArray.create([
                    5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
                    6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
                    15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
                    8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
                    12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]);
                var _sl = WordArray.create([
                    11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
                    7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
                    11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
                    11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
                    9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]);
                var _sr = WordArray.create([
                    8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
                    9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
                    9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
                    15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
                    8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]);

                var _hl = WordArray.create([0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
                var _hr = WordArray.create([0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

                /**
                 * RIPEMD160 hash algorithm.
                 */
                var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
                    _doReset: function () {
                        this._hash = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
                    },

                    _doProcessBlock: function (M, offset) {

                        // Swap endian
                        for (var i = 0; i < 16; i++) {
                            // Shortcuts
                            var offset_i = offset + i;
                            var M_offset_i = M[offset_i];

                            // Swap
                            M[offset_i] = (
                                (((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                                (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00)
                            );
                        }
                        // Shortcut
                        var H = this._hash.words;
                        var hl = _hl.words;
                        var hr = _hr.words;
                        var zl = _zl.words;
                        var zr = _zr.words;
                        var sl = _sl.words;
                        var sr = _sr.words;

                        // Working variables
                        var al, bl, cl, dl, el;
                        var ar, br, cr, dr, er;

                        ar = al = H[0];
                        br = bl = H[1];
                        cr = cl = H[2];
                        dr = dl = H[3];
                        er = el = H[4];
                        // Computation
                        var t;
                        for (var i = 0; i < 80; i += 1) {
                            t = (al + M[offset + zl[i]]) | 0;
                            if (i < 16) {
                                t += f1(bl, cl, dl) + hl[0];
                            } else if (i < 32) {
                                t += f2(bl, cl, dl) + hl[1];
                            } else if (i < 48) {
                                t += f3(bl, cl, dl) + hl[2];
                            } else if (i < 64) {
                                t += f4(bl, cl, dl) + hl[3];
                            } else {// if (i<80) {
                                t += f5(bl, cl, dl) + hl[4];
                            }
                            t = t | 0;
                            t = rotl(t, sl[i]);
                            t = (t + el) | 0;
                            al = el;
                            el = dl;
                            dl = rotl(cl, 10);
                            cl = bl;
                            bl = t;

                            t = (ar + M[offset + zr[i]]) | 0;
                            if (i < 16) {
                                t += f5(br, cr, dr) + hr[0];
                            } else if (i < 32) {
                                t += f4(br, cr, dr) + hr[1];
                            } else if (i < 48) {
                                t += f3(br, cr, dr) + hr[2];
                            } else if (i < 64) {
                                t += f2(br, cr, dr) + hr[3];
                            } else {// if (i<80) {
                                t += f1(br, cr, dr) + hr[4];
                            }
                            t = t | 0;
                            t = rotl(t, sr[i]);
                            t = (t + er) | 0;
                            ar = er;
                            er = dr;
                            dr = rotl(cr, 10);
                            cr = br;
                            br = t;
                        }
                        // Intermediate hash value
                        t = (H[1] + cl + dr) | 0;
                        H[1] = (H[2] + dl + er) | 0;
                        H[2] = (H[3] + el + ar) | 0;
                        H[3] = (H[4] + al + br) | 0;
                        H[4] = (H[0] + bl + cr) | 0;
                        H[0] = t;
                    },

                    _doFinalize: function () {
                        // Shortcuts
                        var data = this._data;
                        var dataWords = data.words;

                        var nBitsTotal = this._nDataBytes * 8;
                        var nBitsLeft = data.sigBytes * 8;

                        // Add padding
                        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                            (((nBitsTotal << 8) | (nBitsTotal >>> 24)) & 0x00ff00ff) |
                            (((nBitsTotal << 24) | (nBitsTotal >>> 8)) & 0xff00ff00)
                        );
                        data.sigBytes = (dataWords.length + 1) * 4;

                        // Hash final blocks
                        this._process();

                        // Shortcuts
                        var hash = this._hash;
                        var H = hash.words;

                        // Swap endian
                        for (var i = 0; i < 5; i++) {
                            // Shortcut
                            var H_i = H[i];

                            // Swap
                            H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                                (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
                        }

                        // Return final computed hash
                        return hash;
                    },

                    clone: function () {
                        var clone = Hasher.clone.call(this);
                        clone._hash = this._hash.clone();

                        return clone;
                    }
                });


                function f1(x, y, z) {
                    return ((x) ^ (y) ^ (z));

                }

                function f2(x, y, z) {
                    return (((x) & (y)) | ((~x) & (z)));
                }

                function f3(x, y, z) {
                    return (((x) | (~(y))) ^ (z));
                }

                function f4(x, y, z) {
                    return (((x) & (z)) | ((y) & (~(z))));
                }

                function f5(x, y, z) {
                    return ((x) ^ ((y) | (~(z))));

                }

                function rotl(x, n) {
                    return (x << n) | (x >>> (32 - n));
                }


                /**
                 * Shortcut function to the hasher's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hash = CryptoJS.RIPEMD160('message');
                 *     var hash = CryptoJS.RIPEMD160(wordArray);
                 */
                C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

                /**
                 * Shortcut function to the HMAC's object interface.
                 *
                 * @param {WordArray|string} message The message to hash.
                 * @param {WordArray|string} key The secret key.
                 *
                 * @return {WordArray} The HMAC.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
                 */
                C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
            }());


            return CryptoJS.RIPEMD160;

        }));
    }(ripemd160));
    return ripemd160.exports;
}

var hmac = { exports: {} };

var hasRequiredHmac;

function requireHmac() {
    if (hasRequiredHmac) return hmac.exports;
    hasRequiredHmac = 1;
    (function (module, exports) {
        (function (root, factory) {
            {
                // CommonJS
                module.exports = factory(requireCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var Base = C_lib.Base;
                var C_enc = C.enc;
                var Utf8 = C_enc.Utf8;
                var C_algo = C.algo;

                /**
                 * HMAC algorithm.
                 */
                C_algo.HMAC = Base.extend({
                    /**
                     * Initializes a newly created HMAC.
                     *
                     * @param {Hasher} hasher The hash algorithm to use.
                     * @param {WordArray|string} key The secret key.
                     *
                     * @example
                     *
                     *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
                     */
                    init: function (hasher, key) {
                        // Init hasher
                        hasher = this._hasher = new hasher.init();

                        // Convert string to WordArray, else assume WordArray already
                        if (typeof key == 'string') {
                            key = Utf8.parse(key);
                        }

                        // Shortcuts
                        var hasherBlockSize = hasher.blockSize;
                        var hasherBlockSizeBytes = hasherBlockSize * 4;

                        // Allow arbitrary length keys
                        if (key.sigBytes > hasherBlockSizeBytes) {
                            key = hasher.finalize(key);
                        }

                        // Clamp excess bits
                        key.clamp();

                        // Clone key for inner and outer pads
                        var oKey = this._oKey = key.clone();
                        var iKey = this._iKey = key.clone();

                        // Shortcuts
                        var oKeyWords = oKey.words;
                        var iKeyWords = iKey.words;

                        // XOR keys with pad constants
                        for (var i = 0; i < hasherBlockSize; i++) {
                            oKeyWords[i] ^= 0x5c5c5c5c;
                            iKeyWords[i] ^= 0x36363636;
                        }
                        oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

                        // Set initial values
                        this.reset();
                    },

                    /**
                     * Resets this HMAC to its initial state.
                     *
                     * @example
                     *
                     *     hmacHasher.reset();
                     */
                    reset: function () {
                        // Shortcut
                        var hasher = this._hasher;

                        // Reset
                        hasher.reset();
                        hasher.update(this._iKey);
                    },

                    /**
                     * Updates this HMAC with a message.
                     *
                     * @param {WordArray|string} messageUpdate The message to append.
                     *
                     * @return {HMAC} This HMAC instance.
                     *
                     * @example
                     *
                     *     hmacHasher.update('message');
                     *     hmacHasher.update(wordArray);
                     */
                    update: function (messageUpdate) {
                        this._hasher.update(messageUpdate);

                        // Chainable
                        return this;
                    },

                    /**
                     * Finalizes the HMAC computation.
                     * Note that the finalize operation is effectively a destructive, read-once operation.
                     *
                     * @param {WordArray|string} messageUpdate (Optional) A final message update.
                     *
                     * @return {WordArray} The HMAC.
                     *
                     * @example
                     *
                     *     var hmac = hmacHasher.finalize();
                     *     var hmac = hmacHasher.finalize('message');
                     *     var hmac = hmacHasher.finalize(wordArray);
                     */
                    finalize: function (messageUpdate) {
                        // Shortcut
                        var hasher = this._hasher;

                        // Compute HMAC
                        var innerHash = hasher.finalize(messageUpdate);
                        hasher.reset();
                        var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

                        return hmac;
                    }
                });
            }());


        }));
    }(hmac));
    return hmac.exports;
}

var pbkdf2 = { exports: {} };

var hasRequiredPbkdf2;

function requirePbkdf2() {
    if (hasRequiredPbkdf2) return pbkdf2.exports;
    hasRequiredPbkdf2 = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireSha256(), requireHmac());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var Base = C_lib.Base;
                var WordArray = C_lib.WordArray;
                var C_algo = C.algo;
                var SHA256 = C_algo.SHA256;
                var HMAC = C_algo.HMAC;

                /**
                 * Password-Based Key Derivation Function 2 algorithm.
                 */
                var PBKDF2 = C_algo.PBKDF2 = Base.extend({
                    /**
                     * Configuration options.
                     *
                     * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
                     * @property {Hasher} hasher The hasher to use. Default: SHA256
                     * @property {number} iterations The number of iterations to perform. Default: 250000
                     */
                    cfg: Base.extend({
                        keySize: 128 / 32,
                        hasher: SHA256,
                        iterations: 250000
                    }),

                    /**
                     * Initializes a newly created key derivation function.
                     *
                     * @param {Object} cfg (Optional) The configuration options to use for the derivation.
                     *
                     * @example
                     *
                     *     var kdf = CryptoJS.algo.PBKDF2.create();
                     *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
                     *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
                     */
                    init: function (cfg) {
                        this.cfg = this.cfg.extend(cfg);
                    },

                    /**
                     * Computes the Password-Based Key Derivation Function 2.
                     *
                     * @param {WordArray|string} password The password.
                     * @param {WordArray|string} salt A salt.
                     *
                     * @return {WordArray} The derived key.
                     *
                     * @example
                     *
                     *     var key = kdf.compute(password, salt);
                     */
                    compute: function (password, salt) {
                        // Shortcut
                        var cfg = this.cfg;

                        // Init HMAC
                        var hmac = HMAC.create(cfg.hasher, password);

                        // Initial values
                        var derivedKey = WordArray.create();
                        var blockIndex = WordArray.create([0x00000001]);

                        // Shortcuts
                        var derivedKeyWords = derivedKey.words;
                        var blockIndexWords = blockIndex.words;
                        var keySize = cfg.keySize;
                        var iterations = cfg.iterations;

                        // Generate key
                        while (derivedKeyWords.length < keySize) {
                            var block = hmac.update(salt).finalize(blockIndex);
                            hmac.reset();

                            // Shortcuts
                            var blockWords = block.words;
                            var blockWordsLength = blockWords.length;

                            // Iterations
                            var intermediate = block;
                            for (var i = 1; i < iterations; i++) {
                                intermediate = hmac.finalize(intermediate);
                                hmac.reset();

                                // Shortcut
                                var intermediateWords = intermediate.words;

                                // XOR intermediate with block
                                for (var j = 0; j < blockWordsLength; j++) {
                                    blockWords[j] ^= intermediateWords[j];
                                }
                            }

                            derivedKey.concat(block);
                            blockIndexWords[0]++;
                        }
                        derivedKey.sigBytes = keySize * 4;

                        return derivedKey;
                    }
                });

                /**
                 * Computes the Password-Based Key Derivation Function 2.
                 *
                 * @param {WordArray|string} password The password.
                 * @param {WordArray|string} salt A salt.
                 * @param {Object} cfg (Optional) The configuration options to use for this computation.
                 *
                 * @return {WordArray} The derived key.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var key = CryptoJS.PBKDF2(password, salt);
                 *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
                 *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
                 */
                C.PBKDF2 = function (password, salt, cfg) {
                    return PBKDF2.create(cfg).compute(password, salt);
                };
            }());


            return CryptoJS.PBKDF2;

        }));
    }(pbkdf2));
    return pbkdf2.exports;
}

var evpkdf = { exports: {} };

var hasRequiredEvpkdf;

function requireEvpkdf() {
    if (hasRequiredEvpkdf) return evpkdf.exports;
    hasRequiredEvpkdf = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireSha1(), requireHmac());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var Base = C_lib.Base;
                var WordArray = C_lib.WordArray;
                var C_algo = C.algo;
                var MD5 = C_algo.MD5;

                /**
                 * This key derivation function is meant to conform with EVP_BytesToKey.
                 * www.openssl.org/docs/crypto/EVP_BytesToKey.html
                 */
                var EvpKDF = C_algo.EvpKDF = Base.extend({
                    /**
                     * Configuration options.
                     *
                     * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
                     * @property {Hasher} hasher The hash algorithm to use. Default: MD5
                     * @property {number} iterations The number of iterations to perform. Default: 1
                     */
                    cfg: Base.extend({
                        keySize: 128 / 32,
                        hasher: MD5,
                        iterations: 1
                    }),

                    /**
                     * Initializes a newly created key derivation function.
                     *
                     * @param {Object} cfg (Optional) The configuration options to use for the derivation.
                     *
                     * @example
                     *
                     *     var kdf = CryptoJS.algo.EvpKDF.create();
                     *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
                     *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
                     */
                    init: function (cfg) {
                        this.cfg = this.cfg.extend(cfg);
                    },

                    /**
                     * Derives a key from a password.
                     *
                     * @param {WordArray|string} password The password.
                     * @param {WordArray|string} salt A salt.
                     *
                     * @return {WordArray} The derived key.
                     *
                     * @example
                     *
                     *     var key = kdf.compute(password, salt);
                     */
                    compute: function (password, salt) {
                        var block;

                        // Shortcut
                        var cfg = this.cfg;

                        // Init hasher
                        var hasher = cfg.hasher.create();

                        // Initial values
                        var derivedKey = WordArray.create();

                        // Shortcuts
                        var derivedKeyWords = derivedKey.words;
                        var keySize = cfg.keySize;
                        var iterations = cfg.iterations;

                        // Generate key
                        while (derivedKeyWords.length < keySize) {
                            if (block) {
                                hasher.update(block);
                            }
                            block = hasher.update(password).finalize(salt);
                            hasher.reset();

                            // Iterations
                            for (var i = 1; i < iterations; i++) {
                                block = hasher.finalize(block);
                                hasher.reset();
                            }

                            derivedKey.concat(block);
                        }
                        derivedKey.sigBytes = keySize * 4;

                        return derivedKey;
                    }
                });

                /**
                 * Derives a key from a password.
                 *
                 * @param {WordArray|string} password The password.
                 * @param {WordArray|string} salt A salt.
                 * @param {Object} cfg (Optional) The configuration options to use for this computation.
                 *
                 * @return {WordArray} The derived key.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var key = CryptoJS.EvpKDF(password, salt);
                 *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
                 *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
                 */
                C.EvpKDF = function (password, salt, cfg) {
                    return EvpKDF.create(cfg).compute(password, salt);
                };
            }());


            return CryptoJS.EvpKDF;

        }));
    }(evpkdf));
    return evpkdf.exports;
}

var cipherCore = { exports: {} };

var hasRequiredCipherCore;

function requireCipherCore() {
    if (hasRequiredCipherCore) return cipherCore.exports;
    hasRequiredCipherCore = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireEvpkdf());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * Cipher core components.
             */
            CryptoJS.lib.Cipher || (function (undefined$1) {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var Base = C_lib.Base;
                var WordArray = C_lib.WordArray;
                var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
                var C_enc = C.enc;
                C_enc.Utf8;
                var Base64 = C_enc.Base64;
                var C_algo = C.algo;
                var EvpKDF = C_algo.EvpKDF;

                /**
                 * Abstract base cipher template.
                 *
                 * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
                 * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
                 * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
                 * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
                 */
                var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
                    /**
                     * Configuration options.
                     *
                     * @property {WordArray} iv The IV to use for this operation.
                     */
                    cfg: Base.extend(),

                    /**
                     * Creates this cipher in encryption mode.
                     *
                     * @param {WordArray} key The key.
                     * @param {Object} cfg (Optional) The configuration options to use for this operation.
                     *
                     * @return {Cipher} A cipher instance.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
                     */
                    createEncryptor: function (key, cfg) {
                        return this.create(this._ENC_XFORM_MODE, key, cfg);
                    },

                    /**
                     * Creates this cipher in decryption mode.
                     *
                     * @param {WordArray} key The key.
                     * @param {Object} cfg (Optional) The configuration options to use for this operation.
                     *
                     * @return {Cipher} A cipher instance.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
                     */
                    createDecryptor: function (key, cfg) {
                        return this.create(this._DEC_XFORM_MODE, key, cfg);
                    },

                    /**
                     * Initializes a newly created cipher.
                     *
                     * @param {number} xformMode Either the encryption or decryption transormation mode constant.
                     * @param {WordArray} key The key.
                     * @param {Object} cfg (Optional) The configuration options to use for this operation.
                     *
                     * @example
                     *
                     *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
                     */
                    init: function (xformMode, key, cfg) {
                        // Apply config defaults
                        this.cfg = this.cfg.extend(cfg);

                        // Store transform mode and key
                        this._xformMode = xformMode;
                        this._key = key;

                        // Set initial values
                        this.reset();
                    },

                    /**
                     * Resets this cipher to its initial state.
                     *
                     * @example
                     *
                     *     cipher.reset();
                     */
                    reset: function () {
                        // Reset data buffer
                        BufferedBlockAlgorithm.reset.call(this);

                        // Perform concrete-cipher logic
                        this._doReset();
                    },

                    /**
                     * Adds data to be encrypted or decrypted.
                     *
                     * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
                     *
                     * @return {WordArray} The data after processing.
                     *
                     * @example
                     *
                     *     var encrypted = cipher.process('data');
                     *     var encrypted = cipher.process(wordArray);
                     */
                    process: function (dataUpdate) {
                        // Append
                        this._append(dataUpdate);

                        // Process available blocks
                        return this._process();
                    },

                    /**
                     * Finalizes the encryption or decryption process.
                     * Note that the finalize operation is effectively a destructive, read-once operation.
                     *
                     * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
                     *
                     * @return {WordArray} The data after final processing.
                     *
                     * @example
                     *
                     *     var encrypted = cipher.finalize();
                     *     var encrypted = cipher.finalize('data');
                     *     var encrypted = cipher.finalize(wordArray);
                     */
                    finalize: function (dataUpdate) {
                        // Final data update
                        if (dataUpdate) {
                            this._append(dataUpdate);
                        }

                        // Perform concrete-cipher logic
                        var finalProcessedData = this._doFinalize();

                        return finalProcessedData;
                    },

                    keySize: 128 / 32,

                    ivSize: 128 / 32,

                    _ENC_XFORM_MODE: 1,

                    _DEC_XFORM_MODE: 2,

                    /**
                     * Creates shortcut functions to a cipher's object interface.
                     *
                     * @param {Cipher} cipher The cipher to create a helper for.
                     *
                     * @return {Object} An object with encrypt and decrypt shortcut functions.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
                     */
                    _createHelper: (function () {
                        function selectCipherStrategy(key) {
                            if (typeof key == 'string') {
                                return PasswordBasedCipher;
                            } else {
                                return SerializableCipher;
                            }
                        }

                        return function (cipher) {
                            return {
                                encrypt: function (message, key, cfg) {
                                    return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                                },

                                decrypt: function (ciphertext, key, cfg) {
                                    return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                                }
                            };
                        };
                    }())
                });

                /**
                 * Abstract base stream cipher template.
                 *
                 * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
                 */
                C_lib.StreamCipher = Cipher.extend({
                    _doFinalize: function () {
                        // Process partial blocks
                        var finalProcessedBlocks = this._process(!!'flush');

                        return finalProcessedBlocks;
                    },

                    blockSize: 1
                });

                /**
                 * Mode namespace.
                 */
                var C_mode = C.mode = {};

                /**
                 * Abstract base block cipher mode template.
                 */
                var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
                    /**
                     * Creates this mode for encryption.
                     *
                     * @param {Cipher} cipher A block cipher instance.
                     * @param {Array} iv The IV words.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
                     */
                    createEncryptor: function (cipher, iv) {
                        return this.Encryptor.create(cipher, iv);
                    },

                    /**
                     * Creates this mode for decryption.
                     *
                     * @param {Cipher} cipher A block cipher instance.
                     * @param {Array} iv The IV words.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
                     */
                    createDecryptor: function (cipher, iv) {
                        return this.Decryptor.create(cipher, iv);
                    },

                    /**
                     * Initializes a newly created mode.
                     *
                     * @param {Cipher} cipher A block cipher instance.
                     * @param {Array} iv The IV words.
                     *
                     * @example
                     *
                     *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
                     */
                    init: function (cipher, iv) {
                        this._cipher = cipher;
                        this._iv = iv;
                    }
                });

                /**
                 * Cipher Block Chaining mode.
                 */
                var CBC = C_mode.CBC = (function () {
                    /**
                     * Abstract base CBC mode.
                     */
                    var CBC = BlockCipherMode.extend();

                    /**
                     * CBC encryptor.
                     */
                    CBC.Encryptor = CBC.extend({
                        /**
                         * Processes the data block at offset.
                         *
                         * @param {Array} words The data words to operate on.
                         * @param {number} offset The offset where the block starts.
                         *
                         * @example
                         *
                         *     mode.processBlock(data.words, offset);
                         */
                        processBlock: function (words, offset) {
                            // Shortcuts
                            var cipher = this._cipher;
                            var blockSize = cipher.blockSize;

                            // XOR and encrypt
                            xorBlock.call(this, words, offset, blockSize);
                            cipher.encryptBlock(words, offset);

                            // Remember this block to use with next block
                            this._prevBlock = words.slice(offset, offset + blockSize);
                        }
                    });

                    /**
                     * CBC decryptor.
                     */
                    CBC.Decryptor = CBC.extend({
                        /**
                         * Processes the data block at offset.
                         *
                         * @param {Array} words The data words to operate on.
                         * @param {number} offset The offset where the block starts.
                         *
                         * @example
                         *
                         *     mode.processBlock(data.words, offset);
                         */
                        processBlock: function (words, offset) {
                            // Shortcuts
                            var cipher = this._cipher;
                            var blockSize = cipher.blockSize;

                            // Remember this block to use with next block
                            var thisBlock = words.slice(offset, offset + blockSize);

                            // Decrypt and XOR
                            cipher.decryptBlock(words, offset);
                            xorBlock.call(this, words, offset, blockSize);

                            // This block becomes the previous block
                            this._prevBlock = thisBlock;
                        }
                    });

                    function xorBlock(words, offset, blockSize) {
                        var block;

                        // Shortcut
                        var iv = this._iv;

                        // Choose mixing block
                        if (iv) {
                            block = iv;

                            // Remove IV for subsequent blocks
                            this._iv = undefined$1;
                        } else {
                            block = this._prevBlock;
                        }

                        // XOR blocks
                        for (var i = 0; i < blockSize; i++) {
                            words[offset + i] ^= block[i];
                        }
                    }

                    return CBC;
                }());

                /**
                 * Padding namespace.
                 */
                var C_pad = C.pad = {};

                /**
                 * PKCS #5/7 padding strategy.
                 */
                var Pkcs7 = C_pad.Pkcs7 = {
                    /**
                     * Pads data using the algorithm defined in PKCS #5/7.
                     *
                     * @param {WordArray} data The data to pad.
                     * @param {number} blockSize The multiple that the data should be padded to.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
                     */
                    pad: function (data, blockSize) {
                        // Shortcut
                        var blockSizeBytes = blockSize * 4;

                        // Count padding bytes
                        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

                        // Create padding word
                        var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

                        // Create padding
                        var paddingWords = [];
                        for (var i = 0; i < nPaddingBytes; i += 4) {
                            paddingWords.push(paddingWord);
                        }
                        var padding = WordArray.create(paddingWords, nPaddingBytes);

                        // Add padding
                        data.concat(padding);
                    },

                    /**
                     * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
                     *
                     * @param {WordArray} data The data to unpad.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     CryptoJS.pad.Pkcs7.unpad(wordArray);
                     */
                    unpad: function (data) {
                        // Get number of padding bytes from last byte
                        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

                        // Remove padding
                        data.sigBytes -= nPaddingBytes;
                    }
                };

                /**
                 * Abstract base block cipher template.
                 *
                 * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
                 */
                C_lib.BlockCipher = Cipher.extend({
                    /**
                     * Configuration options.
                     *
                     * @property {Mode} mode The block mode to use. Default: CBC
                     * @property {Padding} padding The padding strategy to use. Default: Pkcs7
                     */
                    cfg: Cipher.cfg.extend({
                        mode: CBC,
                        padding: Pkcs7
                    }),

                    reset: function () {
                        var modeCreator;

                        // Reset cipher
                        Cipher.reset.call(this);

                        // Shortcuts
                        var cfg = this.cfg;
                        var iv = cfg.iv;
                        var mode = cfg.mode;

                        // Reset block mode
                        if (this._xformMode == this._ENC_XFORM_MODE) {
                            modeCreator = mode.createEncryptor;
                        } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                            modeCreator = mode.createDecryptor;
                            // Keep at least one block in the buffer for unpadding
                            this._minBufferSize = 1;
                        }

                        if (this._mode && this._mode.__creator == modeCreator) {
                            this._mode.init(this, iv && iv.words);
                        } else {
                            this._mode = modeCreator.call(mode, this, iv && iv.words);
                            this._mode.__creator = modeCreator;
                        }
                    },

                    _doProcessBlock: function (words, offset) {
                        this._mode.processBlock(words, offset);
                    },

                    _doFinalize: function () {
                        var finalProcessedBlocks;

                        // Shortcut
                        var padding = this.cfg.padding;

                        // Finalize
                        if (this._xformMode == this._ENC_XFORM_MODE) {
                            // Pad data
                            padding.pad(this._data, this.blockSize);

                            // Process final blocks
                            finalProcessedBlocks = this._process(!!'flush');
                        } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                            // Process final blocks
                            finalProcessedBlocks = this._process(!!'flush');

                            // Unpad data
                            padding.unpad(finalProcessedBlocks);
                        }

                        return finalProcessedBlocks;
                    },

                    blockSize: 128 / 32
                });

                /**
                 * A collection of cipher parameters.
                 *
                 * @property {WordArray} ciphertext The raw ciphertext.
                 * @property {WordArray} key The key to this ciphertext.
                 * @property {WordArray} iv The IV used in the ciphering operation.
                 * @property {WordArray} salt The salt used with a key derivation function.
                 * @property {Cipher} algorithm The cipher algorithm.
                 * @property {Mode} mode The block mode used in the ciphering operation.
                 * @property {Padding} padding The padding scheme used in the ciphering operation.
                 * @property {number} blockSize The block size of the cipher.
                 * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
                 */
                var CipherParams = C_lib.CipherParams = Base.extend({
                    /**
                     * Initializes a newly created cipher params object.
                     *
                     * @param {Object} cipherParams An object with any of the possible cipher parameters.
                     *
                     * @example
                     *
                     *     var cipherParams = CryptoJS.lib.CipherParams.create({
                     *         ciphertext: ciphertextWordArray,
                     *         key: keyWordArray,
                     *         iv: ivWordArray,
                     *         salt: saltWordArray,
                     *         algorithm: CryptoJS.algo.AES,
                     *         mode: CryptoJS.mode.CBC,
                     *         padding: CryptoJS.pad.PKCS7,
                     *         blockSize: 4,
                     *         formatter: CryptoJS.format.OpenSSL
                     *     });
                     */
                    init: function (cipherParams) {
                        this.mixIn(cipherParams);
                    },

                    /**
                     * Converts this cipher params object to a string.
                     *
                     * @param {Format} formatter (Optional) The formatting strategy to use.
                     *
                     * @return {string} The stringified cipher params.
                     *
                     * @throws Error If neither the formatter nor the default formatter is set.
                     *
                     * @example
                     *
                     *     var string = cipherParams + '';
                     *     var string = cipherParams.toString();
                     *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
                     */
                    toString: function (formatter) {
                        return (formatter || this.formatter).stringify(this);
                    }
                });

                /**
                 * Format namespace.
                 */
                var C_format = C.format = {};

                /**
                 * OpenSSL formatting strategy.
                 */
                var OpenSSLFormatter = C_format.OpenSSL = {
                    /**
                     * Converts a cipher params object to an OpenSSL-compatible string.
                     *
                     * @param {CipherParams} cipherParams The cipher params object.
                     *
                     * @return {string} The OpenSSL-compatible string.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
                     */
                    stringify: function (cipherParams) {
                        var wordArray;

                        // Shortcuts
                        var ciphertext = cipherParams.ciphertext;
                        var salt = cipherParams.salt;

                        // Format
                        if (salt) {
                            wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
                        } else {
                            wordArray = ciphertext;
                        }

                        return wordArray.toString(Base64);
                    },

                    /**
                     * Converts an OpenSSL-compatible string to a cipher params object.
                     *
                     * @param {string} openSSLStr The OpenSSL-compatible string.
                     *
                     * @return {CipherParams} The cipher params object.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
                     */
                    parse: function (openSSLStr) {
                        var salt;

                        // Parse base64
                        var ciphertext = Base64.parse(openSSLStr);

                        // Shortcut
                        var ciphertextWords = ciphertext.words;

                        // Test for salt
                        if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                            // Extract salt
                            salt = WordArray.create(ciphertextWords.slice(2, 4));

                            // Remove salt from ciphertext
                            ciphertextWords.splice(0, 4);
                            ciphertext.sigBytes -= 16;
                        }

                        return CipherParams.create({ ciphertext: ciphertext, salt: salt });
                    }
                };

                /**
                 * A cipher wrapper that returns ciphertext as a serializable cipher params object.
                 */
                var SerializableCipher = C_lib.SerializableCipher = Base.extend({
                    /**
                     * Configuration options.
                     *
                     * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
                     */
                    cfg: Base.extend({
                        format: OpenSSLFormatter
                    }),

                    /**
                     * Encrypts a message.
                     *
                     * @param {Cipher} cipher The cipher algorithm to use.
                     * @param {WordArray|string} message The message to encrypt.
                     * @param {WordArray} key The key.
                     * @param {Object} cfg (Optional) The configuration options to use for this operation.
                     *
                     * @return {CipherParams} A cipher params object.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
                     *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
                     *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
                     */
                    encrypt: function (cipher, message, key, cfg) {
                        // Apply config defaults
                        cfg = this.cfg.extend(cfg);

                        // Encrypt
                        var encryptor = cipher.createEncryptor(key, cfg);
                        var ciphertext = encryptor.finalize(message);

                        // Shortcut
                        var cipherCfg = encryptor.cfg;

                        // Create and return serializable cipher params
                        return CipherParams.create({
                            ciphertext: ciphertext,
                            key: key,
                            iv: cipherCfg.iv,
                            algorithm: cipher,
                            mode: cipherCfg.mode,
                            padding: cipherCfg.padding,
                            blockSize: cipher.blockSize,
                            formatter: cfg.format
                        });
                    },

                    /**
                     * Decrypts serialized ciphertext.
                     *
                     * @param {Cipher} cipher The cipher algorithm to use.
                     * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
                     * @param {WordArray} key The key.
                     * @param {Object} cfg (Optional) The configuration options to use for this operation.
                     *
                     * @return {WordArray} The plaintext.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
                     *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
                     */
                    decrypt: function (cipher, ciphertext, key, cfg) {
                        // Apply config defaults
                        cfg = this.cfg.extend(cfg);

                        // Convert string to CipherParams
                        ciphertext = this._parse(ciphertext, cfg.format);

                        // Decrypt
                        var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

                        return plaintext;
                    },

                    /**
                     * Converts serialized ciphertext to CipherParams,
                     * else assumed CipherParams already and returns ciphertext unchanged.
                     *
                     * @param {CipherParams|string} ciphertext The ciphertext.
                     * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
                     *
                     * @return {CipherParams} The unserialized ciphertext.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
                     */
                    _parse: function (ciphertext, format) {
                        if (typeof ciphertext == 'string') {
                            return format.parse(ciphertext, this);
                        } else {
                            return ciphertext;
                        }
                    }
                });

                /**
                 * Key derivation function namespace.
                 */
                var C_kdf = C.kdf = {};

                /**
                 * OpenSSL key derivation function.
                 */
                var OpenSSLKdf = C_kdf.OpenSSL = {
                    /**
                     * Derives a key and IV from a password.
                     *
                     * @param {string} password The password to derive from.
                     * @param {number} keySize The size in words of the key to generate.
                     * @param {number} ivSize The size in words of the IV to generate.
                     * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
                     *
                     * @return {CipherParams} A cipher params object with the key, IV, and salt.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
                     *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
                     */
                    execute: function (password, keySize, ivSize, salt, hasher) {
                        // Generate random salt
                        if (!salt) {
                            salt = WordArray.random(64 / 8);
                        }

                        // Derive key and IV
                        if (!hasher) {
                            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
                        } else {
                            var key = EvpKDF.create({ keySize: keySize + ivSize, hasher: hasher }).compute(password, salt);
                        }


                        // Separate key and IV
                        var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
                        key.sigBytes = keySize * 4;

                        // Return params
                        return CipherParams.create({ key: key, iv: iv, salt: salt });
                    }
                };

                /**
                 * A serializable cipher wrapper that derives the key from a password,
                 * and returns ciphertext as a serializable cipher params object.
                 */
                var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
                    /**
                     * Configuration options.
                     *
                     * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
                     */
                    cfg: SerializableCipher.cfg.extend({
                        kdf: OpenSSLKdf
                    }),

                    /**
                     * Encrypts a message using a password.
                     *
                     * @param {Cipher} cipher The cipher algorithm to use.
                     * @param {WordArray|string} message The message to encrypt.
                     * @param {string} password The password.
                     * @param {Object} cfg (Optional) The configuration options to use for this operation.
                     *
                     * @return {CipherParams} A cipher params object.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
                     *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
                     */
                    encrypt: function (cipher, message, password, cfg) {
                        // Apply config defaults
                        cfg = this.cfg.extend(cfg);

                        // Derive key and other params
                        var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);

                        // Add IV to config
                        cfg.iv = derivedParams.iv;

                        // Encrypt
                        var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

                        // Mix in derived params
                        ciphertext.mixIn(derivedParams);

                        return ciphertext;
                    },

                    /**
                     * Decrypts serialized ciphertext using a password.
                     *
                     * @param {Cipher} cipher The cipher algorithm to use.
                     * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
                     * @param {string} password The password.
                     * @param {Object} cfg (Optional) The configuration options to use for this operation.
                     *
                     * @return {WordArray} The plaintext.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
                     *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
                     */
                    decrypt: function (cipher, ciphertext, password, cfg) {
                        // Apply config defaults
                        cfg = this.cfg.extend(cfg);

                        // Convert string to CipherParams
                        ciphertext = this._parse(ciphertext, cfg.format);

                        // Derive key and other params
                        var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);

                        // Add IV to config
                        cfg.iv = derivedParams.iv;

                        // Decrypt
                        var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

                        return plaintext;
                    }
                });
            }());


        }));
    }(cipherCore));
    return cipherCore.exports;
}

var modeCfb = { exports: {} };

var hasRequiredModeCfb;

function requireModeCfb() {
    if (hasRequiredModeCfb) return modeCfb.exports;
    hasRequiredModeCfb = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * Cipher Feedback block mode.
             */
            CryptoJS.mode.CFB = (function () {
                var CFB = CryptoJS.lib.BlockCipherMode.extend();

                CFB.Encryptor = CFB.extend({
                    processBlock: function (words, offset) {
                        // Shortcuts
                        var cipher = this._cipher;
                        var blockSize = cipher.blockSize;

                        generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

                        // Remember this block to use with next block
                        this._prevBlock = words.slice(offset, offset + blockSize);
                    }
                });

                CFB.Decryptor = CFB.extend({
                    processBlock: function (words, offset) {
                        // Shortcuts
                        var cipher = this._cipher;
                        var blockSize = cipher.blockSize;

                        // Remember this block to use with next block
                        var thisBlock = words.slice(offset, offset + blockSize);

                        generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

                        // This block becomes the previous block
                        this._prevBlock = thisBlock;
                    }
                });

                function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
                    var keystream;

                    // Shortcut
                    var iv = this._iv;

                    // Generate keystream
                    if (iv) {
                        keystream = iv.slice(0);

                        // Remove IV for subsequent blocks
                        this._iv = undefined;
                    } else {
                        keystream = this._prevBlock;
                    }
                    cipher.encryptBlock(keystream, 0);

                    // Encrypt
                    for (var i = 0; i < blockSize; i++) {
                        words[offset + i] ^= keystream[i];
                    }
                }

                return CFB;
            }());


            return CryptoJS.mode.CFB;

        }));
    }(modeCfb));
    return modeCfb.exports;
}

var modeCtr = { exports: {} };

var hasRequiredModeCtr;

function requireModeCtr() {
    if (hasRequiredModeCtr) return modeCtr.exports;
    hasRequiredModeCtr = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * Counter block mode.
             */
            CryptoJS.mode.CTR = (function () {
                var CTR = CryptoJS.lib.BlockCipherMode.extend();

                var Encryptor = CTR.Encryptor = CTR.extend({
                    processBlock: function (words, offset) {
                        // Shortcuts
                        var cipher = this._cipher;
                        var blockSize = cipher.blockSize;
                        var iv = this._iv;
                        var counter = this._counter;

                        // Generate keystream
                        if (iv) {
                            counter = this._counter = iv.slice(0);

                            // Remove IV for subsequent blocks
                            this._iv = undefined;
                        }
                        var keystream = counter.slice(0);
                        cipher.encryptBlock(keystream, 0);

                        // Increment counter
                        counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0;

                        // Encrypt
                        for (var i = 0; i < blockSize; i++) {
                            words[offset + i] ^= keystream[i];
                        }
                    }
                });

                CTR.Decryptor = Encryptor;

                return CTR;
            }());


            return CryptoJS.mode.CTR;

        }));
    }(modeCtr));
    return modeCtr.exports;
}

var modeCtrGladman = { exports: {} };

var hasRequiredModeCtrGladman;

function requireModeCtrGladman() {
    if (hasRequiredModeCtrGladman) return modeCtrGladman.exports;
    hasRequiredModeCtrGladman = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /** @preserve
             * Counter block mode compatible with  Dr Brian Gladman fileenc.c
             * derived from CryptoJS.mode.CTR
             * Jan Hruby jhruby.web@gmail.com
             */
            CryptoJS.mode.CTRGladman = (function () {
                var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

                function incWord(word) {
                    if (((word >> 24) & 0xff) === 0xff) { //overflow
                        var b1 = (word >> 16) & 0xff;
                        var b2 = (word >> 8) & 0xff;
                        var b3 = word & 0xff;

                        if (b1 === 0xff) // overflow b1
                        {
                            b1 = 0;
                            if (b2 === 0xff) {
                                b2 = 0;
                                if (b3 === 0xff) {
                                    b3 = 0;
                                }
                                else {
                                    ++b3;
                                }
                            }
                            else {
                                ++b2;
                            }
                        }
                        else {
                            ++b1;
                        }

                        word = 0;
                        word += (b1 << 16);
                        word += (b2 << 8);
                        word += b3;
                    }
                    else {
                        word += (0x01 << 24);
                    }
                    return word;
                }

                function incCounter(counter) {
                    if ((counter[0] = incWord(counter[0])) === 0) {
                        // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
                        counter[1] = incWord(counter[1]);
                    }
                    return counter;
                }

                var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
                    processBlock: function (words, offset) {
                        // Shortcuts
                        var cipher = this._cipher;
                        var blockSize = cipher.blockSize;
                        var iv = this._iv;
                        var counter = this._counter;

                        // Generate keystream
                        if (iv) {
                            counter = this._counter = iv.slice(0);

                            // Remove IV for subsequent blocks
                            this._iv = undefined;
                        }

                        incCounter(counter);

                        var keystream = counter.slice(0);
                        cipher.encryptBlock(keystream, 0);

                        // Encrypt
                        for (var i = 0; i < blockSize; i++) {
                            words[offset + i] ^= keystream[i];
                        }
                    }
                });

                CTRGladman.Decryptor = Encryptor;

                return CTRGladman;
            }());




            return CryptoJS.mode.CTRGladman;

        }));
    }(modeCtrGladman));
    return modeCtrGladman.exports;
}

var modeOfb = { exports: {} };

var hasRequiredModeOfb;

function requireModeOfb() {
    if (hasRequiredModeOfb) return modeOfb.exports;
    hasRequiredModeOfb = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * Output Feedback block mode.
             */
            CryptoJS.mode.OFB = (function () {
                var OFB = CryptoJS.lib.BlockCipherMode.extend();

                var Encryptor = OFB.Encryptor = OFB.extend({
                    processBlock: function (words, offset) {
                        // Shortcuts
                        var cipher = this._cipher;
                        var blockSize = cipher.blockSize;
                        var iv = this._iv;
                        var keystream = this._keystream;

                        // Generate keystream
                        if (iv) {
                            keystream = this._keystream = iv.slice(0);

                            // Remove IV for subsequent blocks
                            this._iv = undefined;
                        }
                        cipher.encryptBlock(keystream, 0);

                        // Encrypt
                        for (var i = 0; i < blockSize; i++) {
                            words[offset + i] ^= keystream[i];
                        }
                    }
                });

                OFB.Decryptor = Encryptor;

                return OFB;
            }());


            return CryptoJS.mode.OFB;

        }));
    }(modeOfb));
    return modeOfb.exports;
}

var modeEcb = { exports: {} };

var hasRequiredModeEcb;

function requireModeEcb() {
    if (hasRequiredModeEcb) return modeEcb.exports;
    hasRequiredModeEcb = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * Electronic Codebook block mode.
             */
            CryptoJS.mode.ECB = (function () {
                var ECB = CryptoJS.lib.BlockCipherMode.extend();

                ECB.Encryptor = ECB.extend({
                    processBlock: function (words, offset) {
                        this._cipher.encryptBlock(words, offset);
                    }
                });

                ECB.Decryptor = ECB.extend({
                    processBlock: function (words, offset) {
                        this._cipher.decryptBlock(words, offset);
                    }
                });

                return ECB;
            }());


            return CryptoJS.mode.ECB;

        }));
    }(modeEcb));
    return modeEcb.exports;
}

var padAnsix923 = { exports: {} };

var hasRequiredPadAnsix923;

function requirePadAnsix923() {
    if (hasRequiredPadAnsix923) return padAnsix923.exports;
    hasRequiredPadAnsix923 = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * ANSI X.923 padding strategy.
             */
            CryptoJS.pad.AnsiX923 = {
                pad: function (data, blockSize) {
                    // Shortcuts
                    var dataSigBytes = data.sigBytes;
                    var blockSizeBytes = blockSize * 4;

                    // Count padding bytes
                    var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

                    // Compute last byte position
                    var lastBytePos = dataSigBytes + nPaddingBytes - 1;

                    // Pad
                    data.clamp();
                    data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
                    data.sigBytes += nPaddingBytes;
                },

                unpad: function (data) {
                    // Get number of padding bytes from last byte
                    var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

                    // Remove padding
                    data.sigBytes -= nPaddingBytes;
                }
            };


            return CryptoJS.pad.Ansix923;

        }));
    }(padAnsix923));
    return padAnsix923.exports;
}

var padIso10126 = { exports: {} };

var hasRequiredPadIso10126;

function requirePadIso10126() {
    if (hasRequiredPadIso10126) return padIso10126.exports;
    hasRequiredPadIso10126 = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * ISO 10126 padding strategy.
             */
            CryptoJS.pad.Iso10126 = {
                pad: function (data, blockSize) {
                    // Shortcut
                    var blockSizeBytes = blockSize * 4;

                    // Count padding bytes
                    var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

                    // Pad
                    data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
                    concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
                },

                unpad: function (data) {
                    // Get number of padding bytes from last byte
                    var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

                    // Remove padding
                    data.sigBytes -= nPaddingBytes;
                }
            };


            return CryptoJS.pad.Iso10126;

        }));
    }(padIso10126));
    return padIso10126.exports;
}

var padIso97971 = { exports: {} };

var hasRequiredPadIso97971;

function requirePadIso97971() {
    if (hasRequiredPadIso97971) return padIso97971.exports;
    hasRequiredPadIso97971 = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * ISO/IEC 9797-1 Padding Method 2.
             */
            CryptoJS.pad.Iso97971 = {
                pad: function (data, blockSize) {
                    // Add 0x80 byte
                    data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

                    // Zero pad the rest
                    CryptoJS.pad.ZeroPadding.pad(data, blockSize);
                },

                unpad: function (data) {
                    // Remove zero padding
                    CryptoJS.pad.ZeroPadding.unpad(data);

                    // Remove one more byte -- the 0x80 byte
                    data.sigBytes--;
                }
            };


            return CryptoJS.pad.Iso97971;

        }));
    }(padIso97971));
    return padIso97971.exports;
}

var padZeropadding = { exports: {} };

var hasRequiredPadZeropadding;

function requirePadZeropadding() {
    if (hasRequiredPadZeropadding) return padZeropadding.exports;
    hasRequiredPadZeropadding = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * Zero padding strategy.
             */
            CryptoJS.pad.ZeroPadding = {
                pad: function (data, blockSize) {
                    // Shortcut
                    var blockSizeBytes = blockSize * 4;

                    // Pad
                    data.clamp();
                    data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
                },

                unpad: function (data) {
                    // Shortcut
                    var dataWords = data.words;

                    // Unpad
                    var i = data.sigBytes - 1;
                    for (var i = data.sigBytes - 1; i >= 0; i--) {
                        if (((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
                            data.sigBytes = i + 1;
                            break;
                        }
                    }
                }
            };


            return CryptoJS.pad.ZeroPadding;

        }));
    }(padZeropadding));
    return padZeropadding.exports;
}

var padNopadding = { exports: {} };

var hasRequiredPadNopadding;

function requirePadNopadding() {
    if (hasRequiredPadNopadding) return padNopadding.exports;
    hasRequiredPadNopadding = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            /**
             * A noop padding strategy.
             */
            CryptoJS.pad.NoPadding = {
                pad: function () {
                },

                unpad: function () {
                }
            };


            return CryptoJS.pad.NoPadding;

        }));
    }(padNopadding));
    return padNopadding.exports;
}

var formatHex = { exports: {} };

var hasRequiredFormatHex;

function requireFormatHex() {
    if (hasRequiredFormatHex) return formatHex.exports;
    hasRequiredFormatHex = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function (undefined$1) {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var CipherParams = C_lib.CipherParams;
                var C_enc = C.enc;
                var Hex = C_enc.Hex;
                var C_format = C.format;

                C_format.Hex = {
                    /**
                     * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
                     *
                     * @param {CipherParams} cipherParams The cipher params object.
                     *
                     * @return {string} The hexadecimally encoded string.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
                     */
                    stringify: function (cipherParams) {
                        return cipherParams.ciphertext.toString(Hex);
                    },

                    /**
                     * Converts a hexadecimally encoded ciphertext string to a cipher params object.
                     *
                     * @param {string} input The hexadecimally encoded string.
                     *
                     * @return {CipherParams} The cipher params object.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
                     */
                    parse: function (input) {
                        var ciphertext = Hex.parse(input);
                        return CipherParams.create({ ciphertext: ciphertext });
                    }
                };
            }());


            return CryptoJS.format.Hex;

        }));
    }(formatHex));
    return formatHex.exports;
}

var aes = { exports: {} };

var hasRequiredAes;

function requireAes() {
    if (hasRequiredAes) return aes.exports;
    hasRequiredAes = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var BlockCipher = C_lib.BlockCipher;
                var C_algo = C.algo;

                // Lookup tables
                var SBOX = [];
                var INV_SBOX = [];
                var SUB_MIX_0 = [];
                var SUB_MIX_1 = [];
                var SUB_MIX_2 = [];
                var SUB_MIX_3 = [];
                var INV_SUB_MIX_0 = [];
                var INV_SUB_MIX_1 = [];
                var INV_SUB_MIX_2 = [];
                var INV_SUB_MIX_3 = [];

                // Compute lookup tables
                (function () {
                    // Compute double table
                    var d = [];
                    for (var i = 0; i < 256; i++) {
                        if (i < 128) {
                            d[i] = i << 1;
                        } else {
                            d[i] = (i << 1) ^ 0x11b;
                        }
                    }

                    // Walk GF(2^8)
                    var x = 0;
                    var xi = 0;
                    for (var i = 0; i < 256; i++) {
                        // Compute sbox
                        var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
                        sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
                        SBOX[x] = sx;
                        INV_SBOX[sx] = x;

                        // Compute multiplication
                        var x2 = d[x];
                        var x4 = d[x2];
                        var x8 = d[x4];

                        // Compute sub bytes, mix columns tables
                        var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
                        SUB_MIX_0[x] = (t << 24) | (t >>> 8);
                        SUB_MIX_1[x] = (t << 16) | (t >>> 16);
                        SUB_MIX_2[x] = (t << 8) | (t >>> 24);
                        SUB_MIX_3[x] = t;

                        // Compute inv sub bytes, inv mix columns tables
                        var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
                        INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
                        INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
                        INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
                        INV_SUB_MIX_3[sx] = t;

                        // Compute next counter
                        if (!x) {
                            x = xi = 1;
                        } else {
                            x = x2 ^ d[d[d[x8 ^ x2]]];
                            xi ^= d[d[xi]];
                        }
                    }
                }());

                // Precomputed Rcon lookup
                var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

                /**
                 * AES block cipher algorithm.
                 */
                var AES = C_algo.AES = BlockCipher.extend({
                    _doReset: function () {
                        var t;

                        // Skip reset of nRounds has been set before and key did not change
                        if (this._nRounds && this._keyPriorReset === this._key) {
                            return;
                        }

                        // Shortcuts
                        var key = this._keyPriorReset = this._key;
                        var keyWords = key.words;
                        var keySize = key.sigBytes / 4;

                        // Compute number of rounds
                        var nRounds = this._nRounds = keySize + 6;

                        // Compute number of key schedule rows
                        var ksRows = (nRounds + 1) * 4;

                        // Compute key schedule
                        var keySchedule = this._keySchedule = [];
                        for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                            if (ksRow < keySize) {
                                keySchedule[ksRow] = keyWords[ksRow];
                            } else {
                                t = keySchedule[ksRow - 1];

                                if (!(ksRow % keySize)) {
                                    // Rot word
                                    t = (t << 8) | (t >>> 24);

                                    // Sub word
                                    t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                                    // Mix Rcon
                                    t ^= RCON[(ksRow / keySize) | 0] << 24;
                                } else if (keySize > 6 && ksRow % keySize == 4) {
                                    // Sub word
                                    t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                                }

                                keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                            }
                        }

                        // Compute inv key schedule
                        var invKeySchedule = this._invKeySchedule = [];
                        for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                            var ksRow = ksRows - invKsRow;

                            if (invKsRow % 4) {
                                var t = keySchedule[ksRow];
                            } else {
                                var t = keySchedule[ksRow - 4];
                            }

                            if (invKsRow < 4 || ksRow <= 4) {
                                invKeySchedule[invKsRow] = t;
                            } else {
                                invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                                    INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                            }
                        }
                    },

                    encryptBlock: function (M, offset) {
                        this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
                    },

                    decryptBlock: function (M, offset) {
                        // Swap 2nd and 4th rows
                        var t = M[offset + 1];
                        M[offset + 1] = M[offset + 3];
                        M[offset + 3] = t;

                        this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

                        // Inv swap 2nd and 4th rows
                        var t = M[offset + 1];
                        M[offset + 1] = M[offset + 3];
                        M[offset + 3] = t;
                    },

                    _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
                        // Shortcut
                        var nRounds = this._nRounds;

                        // Get input, add round key
                        var s0 = M[offset] ^ keySchedule[0];
                        var s1 = M[offset + 1] ^ keySchedule[1];
                        var s2 = M[offset + 2] ^ keySchedule[2];
                        var s3 = M[offset + 3] ^ keySchedule[3];

                        // Key schedule row counter
                        var ksRow = 4;

                        // Rounds
                        for (var round = 1; round < nRounds; round++) {
                            // Shift rows, sub bytes, mix columns, add round key
                            var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                            var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                            var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                            var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

                            // Update state
                            s0 = t0;
                            s1 = t1;
                            s2 = t2;
                            s3 = t3;
                        }

                        // Shift rows, sub bytes, add round key
                        var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
                        var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
                        var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
                        var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

                        // Set output
                        M[offset] = t0;
                        M[offset + 1] = t1;
                        M[offset + 2] = t2;
                        M[offset + 3] = t3;
                    },

                    keySize: 256 / 32
                });

                /**
                 * Shortcut functions to the cipher's object interface.
                 *
                 * @example
                 *
                 *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
                 *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
                 */
                C.AES = BlockCipher._createHelper(AES);
            }());


            return CryptoJS.AES;

        }));
    }(aes));
    return aes.exports;
}

var tripledes = { exports: {} };

var hasRequiredTripledes;

function requireTripledes() {
    if (hasRequiredTripledes) return tripledes.exports;
    hasRequiredTripledes = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var WordArray = C_lib.WordArray;
                var BlockCipher = C_lib.BlockCipher;
                var C_algo = C.algo;

                // Permuted Choice 1 constants
                var PC1 = [
                    57, 49, 41, 33, 25, 17, 9, 1,
                    58, 50, 42, 34, 26, 18, 10, 2,
                    59, 51, 43, 35, 27, 19, 11, 3,
                    60, 52, 44, 36, 63, 55, 47, 39,
                    31, 23, 15, 7, 62, 54, 46, 38,
                    30, 22, 14, 6, 61, 53, 45, 37,
                    29, 21, 13, 5, 28, 20, 12, 4
                ];

                // Permuted Choice 2 constants
                var PC2 = [
                    14, 17, 11, 24, 1, 5,
                    3, 28, 15, 6, 21, 10,
                    23, 19, 12, 4, 26, 8,
                    16, 7, 27, 20, 13, 2,
                    41, 52, 31, 37, 47, 55,
                    30, 40, 51, 45, 33, 48,
                    44, 49, 39, 56, 34, 53,
                    46, 42, 50, 36, 29, 32
                ];

                // Cumulative bit shift constants
                var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

                // SBOXes and round permutation constants
                var SBOX_P = [
                    {
                        0x0: 0x808200,
                        0x10000000: 0x8000,
                        0x20000000: 0x808002,
                        0x30000000: 0x2,
                        0x40000000: 0x200,
                        0x50000000: 0x808202,
                        0x60000000: 0x800202,
                        0x70000000: 0x800000,
                        0x80000000: 0x202,
                        0x90000000: 0x800200,
                        0xa0000000: 0x8200,
                        0xb0000000: 0x808000,
                        0xc0000000: 0x8002,
                        0xd0000000: 0x800002,
                        0xe0000000: 0x0,
                        0xf0000000: 0x8202,
                        0x8000000: 0x0,
                        0x18000000: 0x808202,
                        0x28000000: 0x8202,
                        0x38000000: 0x8000,
                        0x48000000: 0x808200,
                        0x58000000: 0x200,
                        0x68000000: 0x808002,
                        0x78000000: 0x2,
                        0x88000000: 0x800200,
                        0x98000000: 0x8200,
                        0xa8000000: 0x808000,
                        0xb8000000: 0x800202,
                        0xc8000000: 0x800002,
                        0xd8000000: 0x8002,
                        0xe8000000: 0x202,
                        0xf8000000: 0x800000,
                        0x1: 0x8000,
                        0x10000001: 0x2,
                        0x20000001: 0x808200,
                        0x30000001: 0x800000,
                        0x40000001: 0x808002,
                        0x50000001: 0x8200,
                        0x60000001: 0x200,
                        0x70000001: 0x800202,
                        0x80000001: 0x808202,
                        0x90000001: 0x808000,
                        0xa0000001: 0x800002,
                        0xb0000001: 0x8202,
                        0xc0000001: 0x202,
                        0xd0000001: 0x800200,
                        0xe0000001: 0x8002,
                        0xf0000001: 0x0,
                        0x8000001: 0x808202,
                        0x18000001: 0x808000,
                        0x28000001: 0x800000,
                        0x38000001: 0x200,
                        0x48000001: 0x8000,
                        0x58000001: 0x800002,
                        0x68000001: 0x2,
                        0x78000001: 0x8202,
                        0x88000001: 0x8002,
                        0x98000001: 0x800202,
                        0xa8000001: 0x202,
                        0xb8000001: 0x808200,
                        0xc8000001: 0x800200,
                        0xd8000001: 0x0,
                        0xe8000001: 0x8200,
                        0xf8000001: 0x808002
                    },
                    {
                        0x0: 0x40084010,
                        0x1000000: 0x4000,
                        0x2000000: 0x80000,
                        0x3000000: 0x40080010,
                        0x4000000: 0x40000010,
                        0x5000000: 0x40084000,
                        0x6000000: 0x40004000,
                        0x7000000: 0x10,
                        0x8000000: 0x84000,
                        0x9000000: 0x40004010,
                        0xa000000: 0x40000000,
                        0xb000000: 0x84010,
                        0xc000000: 0x80010,
                        0xd000000: 0x0,
                        0xe000000: 0x4010,
                        0xf000000: 0x40080000,
                        0x800000: 0x40004000,
                        0x1800000: 0x84010,
                        0x2800000: 0x10,
                        0x3800000: 0x40004010,
                        0x4800000: 0x40084010,
                        0x5800000: 0x40000000,
                        0x6800000: 0x80000,
                        0x7800000: 0x40080010,
                        0x8800000: 0x80010,
                        0x9800000: 0x0,
                        0xa800000: 0x4000,
                        0xb800000: 0x40080000,
                        0xc800000: 0x40000010,
                        0xd800000: 0x84000,
                        0xe800000: 0x40084000,
                        0xf800000: 0x4010,
                        0x10000000: 0x0,
                        0x11000000: 0x40080010,
                        0x12000000: 0x40004010,
                        0x13000000: 0x40084000,
                        0x14000000: 0x40080000,
                        0x15000000: 0x10,
                        0x16000000: 0x84010,
                        0x17000000: 0x4000,
                        0x18000000: 0x4010,
                        0x19000000: 0x80000,
                        0x1a000000: 0x80010,
                        0x1b000000: 0x40000010,
                        0x1c000000: 0x84000,
                        0x1d000000: 0x40004000,
                        0x1e000000: 0x40000000,
                        0x1f000000: 0x40084010,
                        0x10800000: 0x84010,
                        0x11800000: 0x80000,
                        0x12800000: 0x40080000,
                        0x13800000: 0x4000,
                        0x14800000: 0x40004000,
                        0x15800000: 0x40084010,
                        0x16800000: 0x10,
                        0x17800000: 0x40000000,
                        0x18800000: 0x40084000,
                        0x19800000: 0x40000010,
                        0x1a800000: 0x40004010,
                        0x1b800000: 0x80010,
                        0x1c800000: 0x0,
                        0x1d800000: 0x4010,
                        0x1e800000: 0x40080010,
                        0x1f800000: 0x84000
                    },
                    {
                        0x0: 0x104,
                        0x100000: 0x0,
                        0x200000: 0x4000100,
                        0x300000: 0x10104,
                        0x400000: 0x10004,
                        0x500000: 0x4000004,
                        0x600000: 0x4010104,
                        0x700000: 0x4010000,
                        0x800000: 0x4000000,
                        0x900000: 0x4010100,
                        0xa00000: 0x10100,
                        0xb00000: 0x4010004,
                        0xc00000: 0x4000104,
                        0xd00000: 0x10000,
                        0xe00000: 0x4,
                        0xf00000: 0x100,
                        0x80000: 0x4010100,
                        0x180000: 0x4010004,
                        0x280000: 0x0,
                        0x380000: 0x4000100,
                        0x480000: 0x4000004,
                        0x580000: 0x10000,
                        0x680000: 0x10004,
                        0x780000: 0x104,
                        0x880000: 0x4,
                        0x980000: 0x100,
                        0xa80000: 0x4010000,
                        0xb80000: 0x10104,
                        0xc80000: 0x10100,
                        0xd80000: 0x4000104,
                        0xe80000: 0x4010104,
                        0xf80000: 0x4000000,
                        0x1000000: 0x4010100,
                        0x1100000: 0x10004,
                        0x1200000: 0x10000,
                        0x1300000: 0x4000100,
                        0x1400000: 0x100,
                        0x1500000: 0x4010104,
                        0x1600000: 0x4000004,
                        0x1700000: 0x0,
                        0x1800000: 0x4000104,
                        0x1900000: 0x4000000,
                        0x1a00000: 0x4,
                        0x1b00000: 0x10100,
                        0x1c00000: 0x4010000,
                        0x1d00000: 0x104,
                        0x1e00000: 0x10104,
                        0x1f00000: 0x4010004,
                        0x1080000: 0x4000000,
                        0x1180000: 0x104,
                        0x1280000: 0x4010100,
                        0x1380000: 0x0,
                        0x1480000: 0x10004,
                        0x1580000: 0x4000100,
                        0x1680000: 0x100,
                        0x1780000: 0x4010004,
                        0x1880000: 0x10000,
                        0x1980000: 0x4010104,
                        0x1a80000: 0x10104,
                        0x1b80000: 0x4000004,
                        0x1c80000: 0x4000104,
                        0x1d80000: 0x4010000,
                        0x1e80000: 0x4,
                        0x1f80000: 0x10100
                    },
                    {
                        0x0: 0x80401000,
                        0x10000: 0x80001040,
                        0x20000: 0x401040,
                        0x30000: 0x80400000,
                        0x40000: 0x0,
                        0x50000: 0x401000,
                        0x60000: 0x80000040,
                        0x70000: 0x400040,
                        0x80000: 0x80000000,
                        0x90000: 0x400000,
                        0xa0000: 0x40,
                        0xb0000: 0x80001000,
                        0xc0000: 0x80400040,
                        0xd0000: 0x1040,
                        0xe0000: 0x1000,
                        0xf0000: 0x80401040,
                        0x8000: 0x80001040,
                        0x18000: 0x40,
                        0x28000: 0x80400040,
                        0x38000: 0x80001000,
                        0x48000: 0x401000,
                        0x58000: 0x80401040,
                        0x68000: 0x0,
                        0x78000: 0x80400000,
                        0x88000: 0x1000,
                        0x98000: 0x80401000,
                        0xa8000: 0x400000,
                        0xb8000: 0x1040,
                        0xc8000: 0x80000000,
                        0xd8000: 0x400040,
                        0xe8000: 0x401040,
                        0xf8000: 0x80000040,
                        0x100000: 0x400040,
                        0x110000: 0x401000,
                        0x120000: 0x80000040,
                        0x130000: 0x0,
                        0x140000: 0x1040,
                        0x150000: 0x80400040,
                        0x160000: 0x80401000,
                        0x170000: 0x80001040,
                        0x180000: 0x80401040,
                        0x190000: 0x80000000,
                        0x1a0000: 0x80400000,
                        0x1b0000: 0x401040,
                        0x1c0000: 0x80001000,
                        0x1d0000: 0x400000,
                        0x1e0000: 0x40,
                        0x1f0000: 0x1000,
                        0x108000: 0x80400000,
                        0x118000: 0x80401040,
                        0x128000: 0x0,
                        0x138000: 0x401000,
                        0x148000: 0x400040,
                        0x158000: 0x80000000,
                        0x168000: 0x80001040,
                        0x178000: 0x40,
                        0x188000: 0x80000040,
                        0x198000: 0x1000,
                        0x1a8000: 0x80001000,
                        0x1b8000: 0x80400040,
                        0x1c8000: 0x1040,
                        0x1d8000: 0x80401000,
                        0x1e8000: 0x400000,
                        0x1f8000: 0x401040
                    },
                    {
                        0x0: 0x80,
                        0x1000: 0x1040000,
                        0x2000: 0x40000,
                        0x3000: 0x20000000,
                        0x4000: 0x20040080,
                        0x5000: 0x1000080,
                        0x6000: 0x21000080,
                        0x7000: 0x40080,
                        0x8000: 0x1000000,
                        0x9000: 0x20040000,
                        0xa000: 0x20000080,
                        0xb000: 0x21040080,
                        0xc000: 0x21040000,
                        0xd000: 0x0,
                        0xe000: 0x1040080,
                        0xf000: 0x21000000,
                        0x800: 0x1040080,
                        0x1800: 0x21000080,
                        0x2800: 0x80,
                        0x3800: 0x1040000,
                        0x4800: 0x40000,
                        0x5800: 0x20040080,
                        0x6800: 0x21040000,
                        0x7800: 0x20000000,
                        0x8800: 0x20040000,
                        0x9800: 0x0,
                        0xa800: 0x21040080,
                        0xb800: 0x1000080,
                        0xc800: 0x20000080,
                        0xd800: 0x21000000,
                        0xe800: 0x1000000,
                        0xf800: 0x40080,
                        0x10000: 0x40000,
                        0x11000: 0x80,
                        0x12000: 0x20000000,
                        0x13000: 0x21000080,
                        0x14000: 0x1000080,
                        0x15000: 0x21040000,
                        0x16000: 0x20040080,
                        0x17000: 0x1000000,
                        0x18000: 0x21040080,
                        0x19000: 0x21000000,
                        0x1a000: 0x1040000,
                        0x1b000: 0x20040000,
                        0x1c000: 0x40080,
                        0x1d000: 0x20000080,
                        0x1e000: 0x0,
                        0x1f000: 0x1040080,
                        0x10800: 0x21000080,
                        0x11800: 0x1000000,
                        0x12800: 0x1040000,
                        0x13800: 0x20040080,
                        0x14800: 0x20000000,
                        0x15800: 0x1040080,
                        0x16800: 0x80,
                        0x17800: 0x21040000,
                        0x18800: 0x40080,
                        0x19800: 0x21040080,
                        0x1a800: 0x0,
                        0x1b800: 0x21000000,
                        0x1c800: 0x1000080,
                        0x1d800: 0x40000,
                        0x1e800: 0x20040000,
                        0x1f800: 0x20000080
                    },
                    {
                        0x0: 0x10000008,
                        0x100: 0x2000,
                        0x200: 0x10200000,
                        0x300: 0x10202008,
                        0x400: 0x10002000,
                        0x500: 0x200000,
                        0x600: 0x200008,
                        0x700: 0x10000000,
                        0x800: 0x0,
                        0x900: 0x10002008,
                        0xa00: 0x202000,
                        0xb00: 0x8,
                        0xc00: 0x10200008,
                        0xd00: 0x202008,
                        0xe00: 0x2008,
                        0xf00: 0x10202000,
                        0x80: 0x10200000,
                        0x180: 0x10202008,
                        0x280: 0x8,
                        0x380: 0x200000,
                        0x480: 0x202008,
                        0x580: 0x10000008,
                        0x680: 0x10002000,
                        0x780: 0x2008,
                        0x880: 0x200008,
                        0x980: 0x2000,
                        0xa80: 0x10002008,
                        0xb80: 0x10200008,
                        0xc80: 0x0,
                        0xd80: 0x10202000,
                        0xe80: 0x202000,
                        0xf80: 0x10000000,
                        0x1000: 0x10002000,
                        0x1100: 0x10200008,
                        0x1200: 0x10202008,
                        0x1300: 0x2008,
                        0x1400: 0x200000,
                        0x1500: 0x10000000,
                        0x1600: 0x10000008,
                        0x1700: 0x202000,
                        0x1800: 0x202008,
                        0x1900: 0x0,
                        0x1a00: 0x8,
                        0x1b00: 0x10200000,
                        0x1c00: 0x2000,
                        0x1d00: 0x10002008,
                        0x1e00: 0x10202000,
                        0x1f00: 0x200008,
                        0x1080: 0x8,
                        0x1180: 0x202000,
                        0x1280: 0x200000,
                        0x1380: 0x10000008,
                        0x1480: 0x10002000,
                        0x1580: 0x2008,
                        0x1680: 0x10202008,
                        0x1780: 0x10200000,
                        0x1880: 0x10202000,
                        0x1980: 0x10200008,
                        0x1a80: 0x2000,
                        0x1b80: 0x202008,
                        0x1c80: 0x200008,
                        0x1d80: 0x0,
                        0x1e80: 0x10000000,
                        0x1f80: 0x10002008
                    },
                    {
                        0x0: 0x100000,
                        0x10: 0x2000401,
                        0x20: 0x400,
                        0x30: 0x100401,
                        0x40: 0x2100401,
                        0x50: 0x0,
                        0x60: 0x1,
                        0x70: 0x2100001,
                        0x80: 0x2000400,
                        0x90: 0x100001,
                        0xa0: 0x2000001,
                        0xb0: 0x2100400,
                        0xc0: 0x2100000,
                        0xd0: 0x401,
                        0xe0: 0x100400,
                        0xf0: 0x2000000,
                        0x8: 0x2100001,
                        0x18: 0x0,
                        0x28: 0x2000401,
                        0x38: 0x2100400,
                        0x48: 0x100000,
                        0x58: 0x2000001,
                        0x68: 0x2000000,
                        0x78: 0x401,
                        0x88: 0x100401,
                        0x98: 0x2000400,
                        0xa8: 0x2100000,
                        0xb8: 0x100001,
                        0xc8: 0x400,
                        0xd8: 0x2100401,
                        0xe8: 0x1,
                        0xf8: 0x100400,
                        0x100: 0x2000000,
                        0x110: 0x100000,
                        0x120: 0x2000401,
                        0x130: 0x2100001,
                        0x140: 0x100001,
                        0x150: 0x2000400,
                        0x160: 0x2100400,
                        0x170: 0x100401,
                        0x180: 0x401,
                        0x190: 0x2100401,
                        0x1a0: 0x100400,
                        0x1b0: 0x1,
                        0x1c0: 0x0,
                        0x1d0: 0x2100000,
                        0x1e0: 0x2000001,
                        0x1f0: 0x400,
                        0x108: 0x100400,
                        0x118: 0x2000401,
                        0x128: 0x2100001,
                        0x138: 0x1,
                        0x148: 0x2000000,
                        0x158: 0x100000,
                        0x168: 0x401,
                        0x178: 0x2100400,
                        0x188: 0x2000001,
                        0x198: 0x2100000,
                        0x1a8: 0x0,
                        0x1b8: 0x2100401,
                        0x1c8: 0x100401,
                        0x1d8: 0x400,
                        0x1e8: 0x2000400,
                        0x1f8: 0x100001
                    },
                    {
                        0x0: 0x8000820,
                        0x1: 0x20000,
                        0x2: 0x8000000,
                        0x3: 0x20,
                        0x4: 0x20020,
                        0x5: 0x8020820,
                        0x6: 0x8020800,
                        0x7: 0x800,
                        0x8: 0x8020000,
                        0x9: 0x8000800,
                        0xa: 0x20800,
                        0xb: 0x8020020,
                        0xc: 0x820,
                        0xd: 0x0,
                        0xe: 0x8000020,
                        0xf: 0x20820,
                        0x80000000: 0x800,
                        0x80000001: 0x8020820,
                        0x80000002: 0x8000820,
                        0x80000003: 0x8000000,
                        0x80000004: 0x8020000,
                        0x80000005: 0x20800,
                        0x80000006: 0x20820,
                        0x80000007: 0x20,
                        0x80000008: 0x8000020,
                        0x80000009: 0x820,
                        0x8000000a: 0x20020,
                        0x8000000b: 0x8020800,
                        0x8000000c: 0x0,
                        0x8000000d: 0x8020020,
                        0x8000000e: 0x8000800,
                        0x8000000f: 0x20000,
                        0x10: 0x20820,
                        0x11: 0x8020800,
                        0x12: 0x20,
                        0x13: 0x800,
                        0x14: 0x8000800,
                        0x15: 0x8000020,
                        0x16: 0x8020020,
                        0x17: 0x20000,
                        0x18: 0x0,
                        0x19: 0x20020,
                        0x1a: 0x8020000,
                        0x1b: 0x8000820,
                        0x1c: 0x8020820,
                        0x1d: 0x20800,
                        0x1e: 0x820,
                        0x1f: 0x8000000,
                        0x80000010: 0x20000,
                        0x80000011: 0x800,
                        0x80000012: 0x8020020,
                        0x80000013: 0x20820,
                        0x80000014: 0x20,
                        0x80000015: 0x8020000,
                        0x80000016: 0x8000000,
                        0x80000017: 0x8000820,
                        0x80000018: 0x8020820,
                        0x80000019: 0x8000020,
                        0x8000001a: 0x8000800,
                        0x8000001b: 0x0,
                        0x8000001c: 0x20800,
                        0x8000001d: 0x820,
                        0x8000001e: 0x20020,
                        0x8000001f: 0x8020800
                    }
                ];

                // Masks that select the SBOX input
                var SBOX_MASK = [
                    0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
                    0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
                ];

                /**
                 * DES block cipher algorithm.
                 */
                var DES = C_algo.DES = BlockCipher.extend({
                    _doReset: function () {
                        // Shortcuts
                        var key = this._key;
                        var keyWords = key.words;

                        // Select 56 bits according to PC1
                        var keyBits = [];
                        for (var i = 0; i < 56; i++) {
                            var keyBitPos = PC1[i] - 1;
                            keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
                        }

                        // Assemble 16 subkeys
                        var subKeys = this._subKeys = [];
                        for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
                            // Create subkey
                            var subKey = subKeys[nSubKey] = [];

                            // Shortcut
                            var bitShift = BIT_SHIFTS[nSubKey];

                            // Select 48 bits according to PC2
                            for (var i = 0; i < 24; i++) {
                                // Select from the left 28 key bits
                                subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

                                // Select from the right 28 key bits
                                subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
                            }

                            // Since each subkey is applied to an expanded 32-bit input,
                            // the subkey can be broken into 8 values scaled to 32-bits,
                            // which allows the key to be used without expansion
                            subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
                            for (var i = 1; i < 7; i++) {
                                subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
                            }
                            subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
                        }

                        // Compute inverse subkeys
                        var invSubKeys = this._invSubKeys = [];
                        for (var i = 0; i < 16; i++) {
                            invSubKeys[i] = subKeys[15 - i];
                        }
                    },

                    encryptBlock: function (M, offset) {
                        this._doCryptBlock(M, offset, this._subKeys);
                    },

                    decryptBlock: function (M, offset) {
                        this._doCryptBlock(M, offset, this._invSubKeys);
                    },

                    _doCryptBlock: function (M, offset, subKeys) {
                        // Get input
                        this._lBlock = M[offset];
                        this._rBlock = M[offset + 1];

                        // Initial permutation
                        exchangeLR.call(this, 4, 0x0f0f0f0f);
                        exchangeLR.call(this, 16, 0x0000ffff);
                        exchangeRL.call(this, 2, 0x33333333);
                        exchangeRL.call(this, 8, 0x00ff00ff);
                        exchangeLR.call(this, 1, 0x55555555);

                        // Rounds
                        for (var round = 0; round < 16; round++) {
                            // Shortcuts
                            var subKey = subKeys[round];
                            var lBlock = this._lBlock;
                            var rBlock = this._rBlock;

                            // Feistel function
                            var f = 0;
                            for (var i = 0; i < 8; i++) {
                                f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
                            }
                            this._lBlock = rBlock;
                            this._rBlock = lBlock ^ f;
                        }

                        // Undo swap from last round
                        var t = this._lBlock;
                        this._lBlock = this._rBlock;
                        this._rBlock = t;

                        // Final permutation
                        exchangeLR.call(this, 1, 0x55555555);
                        exchangeRL.call(this, 8, 0x00ff00ff);
                        exchangeRL.call(this, 2, 0x33333333);
                        exchangeLR.call(this, 16, 0x0000ffff);
                        exchangeLR.call(this, 4, 0x0f0f0f0f);

                        // Set output
                        M[offset] = this._lBlock;
                        M[offset + 1] = this._rBlock;
                    },

                    keySize: 64 / 32,

                    ivSize: 64 / 32,

                    blockSize: 64 / 32
                });

                // Swap bits across the left and right words
                function exchangeLR(offset, mask) {
                    var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
                    this._rBlock ^= t;
                    this._lBlock ^= t << offset;
                }

                function exchangeRL(offset, mask) {
                    var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
                    this._lBlock ^= t;
                    this._rBlock ^= t << offset;
                }

                /**
                 * Shortcut functions to the cipher's object interface.
                 *
                 * @example
                 *
                 *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
                 *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
                 */
                C.DES = BlockCipher._createHelper(DES);

                /**
                 * Triple-DES block cipher algorithm.
                 */
                var TripleDES = C_algo.TripleDES = BlockCipher.extend({
                    _doReset: function () {
                        // Shortcuts
                        var key = this._key;
                        var keyWords = key.words;
                        // Make sure the key length is valid (64, 128 or >= 192 bit)
                        if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
                            throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
                        }

                        // Extend the key according to the keying options defined in 3DES standard
                        var key1 = keyWords.slice(0, 2);
                        var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
                        var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);

                        // Create DES instances
                        this._des1 = DES.createEncryptor(WordArray.create(key1));
                        this._des2 = DES.createEncryptor(WordArray.create(key2));
                        this._des3 = DES.createEncryptor(WordArray.create(key3));
                    },

                    encryptBlock: function (M, offset) {
                        this._des1.encryptBlock(M, offset);
                        this._des2.decryptBlock(M, offset);
                        this._des3.encryptBlock(M, offset);
                    },

                    decryptBlock: function (M, offset) {
                        this._des3.decryptBlock(M, offset);
                        this._des2.encryptBlock(M, offset);
                        this._des1.decryptBlock(M, offset);
                    },

                    keySize: 192 / 32,

                    ivSize: 64 / 32,

                    blockSize: 64 / 32
                });

                /**
                 * Shortcut functions to the cipher's object interface.
                 *
                 * @example
                 *
                 *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
                 *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
                 */
                C.TripleDES = BlockCipher._createHelper(TripleDES);
            }());


            return CryptoJS.TripleDES;

        }));
    }(tripledes));
    return tripledes.exports;
}

var rc4 = { exports: {} };

var hasRequiredRc4;

function requireRc4() {
    if (hasRequiredRc4) return rc4.exports;
    hasRequiredRc4 = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var StreamCipher = C_lib.StreamCipher;
                var C_algo = C.algo;

                /**
                 * RC4 stream cipher algorithm.
                 */
                var RC4 = C_algo.RC4 = StreamCipher.extend({
                    _doReset: function () {
                        // Shortcuts
                        var key = this._key;
                        var keyWords = key.words;
                        var keySigBytes = key.sigBytes;

                        // Init sbox
                        var S = this._S = [];
                        for (var i = 0; i < 256; i++) {
                            S[i] = i;
                        }

                        // Key setup
                        for (var i = 0, j = 0; i < 256; i++) {
                            var keyByteIndex = i % keySigBytes;
                            var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

                            j = (j + S[i] + keyByte) % 256;

                            // Swap
                            var t = S[i];
                            S[i] = S[j];
                            S[j] = t;
                        }

                        // Counters
                        this._i = this._j = 0;
                    },

                    _doProcessBlock: function (M, offset) {
                        M[offset] ^= generateKeystreamWord.call(this);
                    },

                    keySize: 256 / 32,

                    ivSize: 0
                });

                function generateKeystreamWord() {
                    // Shortcuts
                    var S = this._S;
                    var i = this._i;
                    var j = this._j;

                    // Generate keystream word
                    var keystreamWord = 0;
                    for (var n = 0; n < 4; n++) {
                        i = (i + 1) % 256;
                        j = (j + S[i]) % 256;

                        // Swap
                        var t = S[i];
                        S[i] = S[j];
                        S[j] = t;

                        keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
                    }

                    // Update counters
                    this._i = i;
                    this._j = j;

                    return keystreamWord;
                }

                /**
                 * Shortcut functions to the cipher's object interface.
                 *
                 * @example
                 *
                 *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
                 *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
                 */
                C.RC4 = StreamCipher._createHelper(RC4);

                /**
                 * Modified RC4 stream cipher algorithm.
                 */
                var RC4Drop = C_algo.RC4Drop = RC4.extend({
                    /**
                     * Configuration options.
                     *
                     * @property {number} drop The number of keystream words to drop. Default 192
                     */
                    cfg: RC4.cfg.extend({
                        drop: 192
                    }),

                    _doReset: function () {
                        RC4._doReset.call(this);

                        // Drop
                        for (var i = this.cfg.drop; i > 0; i--) {
                            generateKeystreamWord.call(this);
                        }
                    }
                });

                /**
                 * Shortcut functions to the cipher's object interface.
                 *
                 * @example
                 *
                 *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
                 *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
                 */
                C.RC4Drop = StreamCipher._createHelper(RC4Drop);
            }());


            return CryptoJS.RC4;

        }));
    }(rc4));
    return rc4.exports;
}

var rabbit = { exports: {} };

var hasRequiredRabbit;

function requireRabbit() {
    if (hasRequiredRabbit) return rabbit.exports;
    hasRequiredRabbit = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var StreamCipher = C_lib.StreamCipher;
                var C_algo = C.algo;

                // Reusable objects
                var S = [];
                var C_ = [];
                var G = [];

                /**
                 * Rabbit stream cipher algorithm
                 */
                var Rabbit = C_algo.Rabbit = StreamCipher.extend({
                    _doReset: function () {
                        // Shortcuts
                        var K = this._key.words;
                        var iv = this.cfg.iv;

                        // Swap endian
                        for (var i = 0; i < 4; i++) {
                            K[i] = (((K[i] << 8) | (K[i] >>> 24)) & 0x00ff00ff) |
                                (((K[i] << 24) | (K[i] >>> 8)) & 0xff00ff00);
                        }

                        // Generate initial state values
                        var X = this._X = [
                            K[0], (K[3] << 16) | (K[2] >>> 16),
                            K[1], (K[0] << 16) | (K[3] >>> 16),
                            K[2], (K[1] << 16) | (K[0] >>> 16),
                            K[3], (K[2] << 16) | (K[1] >>> 16)
                        ];

                        // Generate initial counter values
                        var C = this._C = [
                            (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
                            (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
                            (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
                            (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
                        ];

                        // Carry bit
                        this._b = 0;

                        // Iterate the system four times
                        for (var i = 0; i < 4; i++) {
                            nextState.call(this);
                        }

                        // Modify the counters
                        for (var i = 0; i < 8; i++) {
                            C[i] ^= X[(i + 4) & 7];
                        }

                        // IV setup
                        if (iv) {
                            // Shortcuts
                            var IV = iv.words;
                            var IV_0 = IV[0];
                            var IV_1 = IV[1];

                            // Generate four subvectors
                            var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
                            var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
                            var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
                            var i3 = (i2 << 16) | (i0 & 0x0000ffff);

                            // Modify counter values
                            C[0] ^= i0;
                            C[1] ^= i1;
                            C[2] ^= i2;
                            C[3] ^= i3;
                            C[4] ^= i0;
                            C[5] ^= i1;
                            C[6] ^= i2;
                            C[7] ^= i3;

                            // Iterate the system four times
                            for (var i = 0; i < 4; i++) {
                                nextState.call(this);
                            }
                        }
                    },

                    _doProcessBlock: function (M, offset) {
                        // Shortcut
                        var X = this._X;

                        // Iterate the system
                        nextState.call(this);

                        // Generate four keystream words
                        S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
                        S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
                        S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
                        S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

                        for (var i = 0; i < 4; i++) {
                            // Swap endian
                            S[i] = (((S[i] << 8) | (S[i] >>> 24)) & 0x00ff00ff) |
                                (((S[i] << 24) | (S[i] >>> 8)) & 0xff00ff00);

                            // Encrypt
                            M[offset + i] ^= S[i];
                        }
                    },

                    blockSize: 128 / 32,

                    ivSize: 64 / 32
                });

                function nextState() {
                    // Shortcuts
                    var X = this._X;
                    var C = this._C;

                    // Save old counter values
                    for (var i = 0; i < 8; i++) {
                        C_[i] = C[i];
                    }

                    // Calculate new counter values
                    C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
                    C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
                    C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
                    C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
                    C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
                    C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
                    C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
                    C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
                    this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

                    // Calculate the g-values
                    for (var i = 0; i < 8; i++) {
                        var gx = X[i] + C[i];

                        // Construct high and low argument for squaring
                        var ga = gx & 0xffff;
                        var gb = gx >>> 16;

                        // Calculate high and low result of squaring
                        var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
                        var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

                        // High XOR low
                        G[i] = gh ^ gl;
                    }

                    // Calculate new state values
                    X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
                    X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
                    X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
                    X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
                    X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
                    X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
                    X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
                    X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
                }

                /**
                 * Shortcut functions to the cipher's object interface.
                 *
                 * @example
                 *
                 *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
                 *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
                 */
                C.Rabbit = StreamCipher._createHelper(Rabbit);
            }());


            return CryptoJS.Rabbit;

        }));
    }(rabbit));
    return rabbit.exports;
}

var rabbitLegacy = { exports: {} };

var hasRequiredRabbitLegacy;

function requireRabbitLegacy() {
    if (hasRequiredRabbitLegacy) return rabbitLegacy.exports;
    hasRequiredRabbitLegacy = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var StreamCipher = C_lib.StreamCipher;
                var C_algo = C.algo;

                // Reusable objects
                var S = [];
                var C_ = [];
                var G = [];

                /**
                 * Rabbit stream cipher algorithm.
                 *
                 * This is a legacy version that neglected to convert the key to little-endian.
                 * This error doesn't affect the cipher's security,
                 * but it does affect its compatibility with other implementations.
                 */
                var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
                    _doReset: function () {
                        // Shortcuts
                        var K = this._key.words;
                        var iv = this.cfg.iv;

                        // Generate initial state values
                        var X = this._X = [
                            K[0], (K[3] << 16) | (K[2] >>> 16),
                            K[1], (K[0] << 16) | (K[3] >>> 16),
                            K[2], (K[1] << 16) | (K[0] >>> 16),
                            K[3], (K[2] << 16) | (K[1] >>> 16)
                        ];

                        // Generate initial counter values
                        var C = this._C = [
                            (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
                            (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
                            (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
                            (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
                        ];

                        // Carry bit
                        this._b = 0;

                        // Iterate the system four times
                        for (var i = 0; i < 4; i++) {
                            nextState.call(this);
                        }

                        // Modify the counters
                        for (var i = 0; i < 8; i++) {
                            C[i] ^= X[(i + 4) & 7];
                        }

                        // IV setup
                        if (iv) {
                            // Shortcuts
                            var IV = iv.words;
                            var IV_0 = IV[0];
                            var IV_1 = IV[1];

                            // Generate four subvectors
                            var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
                            var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
                            var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
                            var i3 = (i2 << 16) | (i0 & 0x0000ffff);

                            // Modify counter values
                            C[0] ^= i0;
                            C[1] ^= i1;
                            C[2] ^= i2;
                            C[3] ^= i3;
                            C[4] ^= i0;
                            C[5] ^= i1;
                            C[6] ^= i2;
                            C[7] ^= i3;

                            // Iterate the system four times
                            for (var i = 0; i < 4; i++) {
                                nextState.call(this);
                            }
                        }
                    },

                    _doProcessBlock: function (M, offset) {
                        // Shortcut
                        var X = this._X;

                        // Iterate the system
                        nextState.call(this);

                        // Generate four keystream words
                        S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
                        S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
                        S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
                        S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

                        for (var i = 0; i < 4; i++) {
                            // Swap endian
                            S[i] = (((S[i] << 8) | (S[i] >>> 24)) & 0x00ff00ff) |
                                (((S[i] << 24) | (S[i] >>> 8)) & 0xff00ff00);

                            // Encrypt
                            M[offset + i] ^= S[i];
                        }
                    },

                    blockSize: 128 / 32,

                    ivSize: 64 / 32
                });

                function nextState() {
                    // Shortcuts
                    var X = this._X;
                    var C = this._C;

                    // Save old counter values
                    for (var i = 0; i < 8; i++) {
                        C_[i] = C[i];
                    }

                    // Calculate new counter values
                    C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
                    C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
                    C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
                    C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
                    C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
                    C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
                    C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
                    C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
                    this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

                    // Calculate the g-values
                    for (var i = 0; i < 8; i++) {
                        var gx = X[i] + C[i];

                        // Construct high and low argument for squaring
                        var ga = gx & 0xffff;
                        var gb = gx >>> 16;

                        // Calculate high and low result of squaring
                        var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
                        var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

                        // High XOR low
                        G[i] = gh ^ gl;
                    }

                    // Calculate new state values
                    X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
                    X[1] = (G[1] + ((G[0] << 8) | (G[0] >>> 24)) + G[7]) | 0;
                    X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
                    X[3] = (G[3] + ((G[2] << 8) | (G[2] >>> 24)) + G[1]) | 0;
                    X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
                    X[5] = (G[5] + ((G[4] << 8) | (G[4] >>> 24)) + G[3]) | 0;
                    X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
                    X[7] = (G[7] + ((G[6] << 8) | (G[6] >>> 24)) + G[5]) | 0;
                }

                /**
                 * Shortcut functions to the cipher's object interface.
                 *
                 * @example
                 *
                 *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
                 *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
                 */
                C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
            }());


            return CryptoJS.RabbitLegacy;

        }));
    }(rabbitLegacy));
    return rabbitLegacy.exports;
}

var blowfish = { exports: {} };

var hasRequiredBlowfish;

function requireBlowfish() {
    if (hasRequiredBlowfish) return blowfish.exports;
    hasRequiredBlowfish = 1;
    (function (module, exports) {
        (function (root, factory, undef) {
            {
                // CommonJS
                module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
            }
        }(commonjsGlobal, function (CryptoJS) {

            (function () {
                // Shortcuts
                var C = CryptoJS;
                var C_lib = C.lib;
                var BlockCipher = C_lib.BlockCipher;
                var C_algo = C.algo;

                const N = 16;

                //Origin pbox and sbox, derived from PI
                const ORIG_P = [
                    0x243F6A88, 0x85A308D3, 0x13198A2E, 0x03707344,
                    0xA4093822, 0x299F31D0, 0x082EFA98, 0xEC4E6C89,
                    0x452821E6, 0x38D01377, 0xBE5466CF, 0x34E90C6C,
                    0xC0AC29B7, 0xC97C50DD, 0x3F84D5B5, 0xB5470917,
                    0x9216D5D9, 0x8979FB1B
                ];

                const ORIG_S = [
                    [0xD1310BA6, 0x98DFB5AC, 0x2FFD72DB, 0xD01ADFB7,
                        0xB8E1AFED, 0x6A267E96, 0xBA7C9045, 0xF12C7F99,
                        0x24A19947, 0xB3916CF7, 0x0801F2E2, 0x858EFC16,
                        0x636920D8, 0x71574E69, 0xA458FEA3, 0xF4933D7E,
                        0x0D95748F, 0x728EB658, 0x718BCD58, 0x82154AEE,
                        0x7B54A41D, 0xC25A59B5, 0x9C30D539, 0x2AF26013,
                        0xC5D1B023, 0x286085F0, 0xCA417918, 0xB8DB38EF,
                        0x8E79DCB0, 0x603A180E, 0x6C9E0E8B, 0xB01E8A3E,
                        0xD71577C1, 0xBD314B27, 0x78AF2FDA, 0x55605C60,
                        0xE65525F3, 0xAA55AB94, 0x57489862, 0x63E81440,
                        0x55CA396A, 0x2AAB10B6, 0xB4CC5C34, 0x1141E8CE,
                        0xA15486AF, 0x7C72E993, 0xB3EE1411, 0x636FBC2A,
                        0x2BA9C55D, 0x741831F6, 0xCE5C3E16, 0x9B87931E,
                        0xAFD6BA33, 0x6C24CF5C, 0x7A325381, 0x28958677,
                        0x3B8F4898, 0x6B4BB9AF, 0xC4BFE81B, 0x66282193,
                        0x61D809CC, 0xFB21A991, 0x487CAC60, 0x5DEC8032,
                        0xEF845D5D, 0xE98575B1, 0xDC262302, 0xEB651B88,
                        0x23893E81, 0xD396ACC5, 0x0F6D6FF3, 0x83F44239,
                        0x2E0B4482, 0xA4842004, 0x69C8F04A, 0x9E1F9B5E,
                        0x21C66842, 0xF6E96C9A, 0x670C9C61, 0xABD388F0,
                        0x6A51A0D2, 0xD8542F68, 0x960FA728, 0xAB5133A3,
                        0x6EEF0B6C, 0x137A3BE4, 0xBA3BF050, 0x7EFB2A98,
                        0xA1F1651D, 0x39AF0176, 0x66CA593E, 0x82430E88,
                        0x8CEE8619, 0x456F9FB4, 0x7D84A5C3, 0x3B8B5EBE,
                        0xE06F75D8, 0x85C12073, 0x401A449F, 0x56C16AA6,
                        0x4ED3AA62, 0x363F7706, 0x1BFEDF72, 0x429B023D,
                        0x37D0D724, 0xD00A1248, 0xDB0FEAD3, 0x49F1C09B,
                        0x075372C9, 0x80991B7B, 0x25D479D8, 0xF6E8DEF7,
                        0xE3FE501A, 0xB6794C3B, 0x976CE0BD, 0x04C006BA,
                        0xC1A94FB6, 0x409F60C4, 0x5E5C9EC2, 0x196A2463,
                        0x68FB6FAF, 0x3E6C53B5, 0x1339B2EB, 0x3B52EC6F,
                        0x6DFC511F, 0x9B30952C, 0xCC814544, 0xAF5EBD09,
                        0xBEE3D004, 0xDE334AFD, 0x660F2807, 0x192E4BB3,
                        0xC0CBA857, 0x45C8740F, 0xD20B5F39, 0xB9D3FBDB,
                        0x5579C0BD, 0x1A60320A, 0xD6A100C6, 0x402C7279,
                        0x679F25FE, 0xFB1FA3CC, 0x8EA5E9F8, 0xDB3222F8,
                        0x3C7516DF, 0xFD616B15, 0x2F501EC8, 0xAD0552AB,
                        0x323DB5FA, 0xFD238760, 0x53317B48, 0x3E00DF82,
                        0x9E5C57BB, 0xCA6F8CA0, 0x1A87562E, 0xDF1769DB,
                        0xD542A8F6, 0x287EFFC3, 0xAC6732C6, 0x8C4F5573,
                        0x695B27B0, 0xBBCA58C8, 0xE1FFA35D, 0xB8F011A0,
                        0x10FA3D98, 0xFD2183B8, 0x4AFCB56C, 0x2DD1D35B,
                        0x9A53E479, 0xB6F84565, 0xD28E49BC, 0x4BFB9790,
                        0xE1DDF2DA, 0xA4CB7E33, 0x62FB1341, 0xCEE4C6E8,
                        0xEF20CADA, 0x36774C01, 0xD07E9EFE, 0x2BF11FB4,
                        0x95DBDA4D, 0xAE909198, 0xEAAD8E71, 0x6B93D5A0,
                        0xD08ED1D0, 0xAFC725E0, 0x8E3C5B2F, 0x8E7594B7,
                        0x8FF6E2FB, 0xF2122B64, 0x8888B812, 0x900DF01C,
                        0x4FAD5EA0, 0x688FC31C, 0xD1CFF191, 0xB3A8C1AD,
                        0x2F2F2218, 0xBE0E1777, 0xEA752DFE, 0x8B021FA1,
                        0xE5A0CC0F, 0xB56F74E8, 0x18ACF3D6, 0xCE89E299,
                        0xB4A84FE0, 0xFD13E0B7, 0x7CC43B81, 0xD2ADA8D9,
                        0x165FA266, 0x80957705, 0x93CC7314, 0x211A1477,
                        0xE6AD2065, 0x77B5FA86, 0xC75442F5, 0xFB9D35CF,
                        0xEBCDAF0C, 0x7B3E89A0, 0xD6411BD3, 0xAE1E7E49,
                        0x00250E2D, 0x2071B35E, 0x226800BB, 0x57B8E0AF,
                        0x2464369B, 0xF009B91E, 0x5563911D, 0x59DFA6AA,
                        0x78C14389, 0xD95A537F, 0x207D5BA2, 0x02E5B9C5,
                        0x83260376, 0x6295CFA9, 0x11C81968, 0x4E734A41,
                        0xB3472DCA, 0x7B14A94A, 0x1B510052, 0x9A532915,
                        0xD60F573F, 0xBC9BC6E4, 0x2B60A476, 0x81E67400,
                        0x08BA6FB5, 0x571BE91F, 0xF296EC6B, 0x2A0DD915,
                        0xB6636521, 0xE7B9F9B6, 0xFF34052E, 0xC5855664,
                        0x53B02D5D, 0xA99F8FA1, 0x08BA4799, 0x6E85076A],
                    [0x4B7A70E9, 0xB5B32944, 0xDB75092E, 0xC4192623,
                        0xAD6EA6B0, 0x49A7DF7D, 0x9CEE60B8, 0x8FEDB266,
                        0xECAA8C71, 0x699A17FF, 0x5664526C, 0xC2B19EE1,
                        0x193602A5, 0x75094C29, 0xA0591340, 0xE4183A3E,
                        0x3F54989A, 0x5B429D65, 0x6B8FE4D6, 0x99F73FD6,
                        0xA1D29C07, 0xEFE830F5, 0x4D2D38E6, 0xF0255DC1,
                        0x4CDD2086, 0x8470EB26, 0x6382E9C6, 0x021ECC5E,
                        0x09686B3F, 0x3EBAEFC9, 0x3C971814, 0x6B6A70A1,
                        0x687F3584, 0x52A0E286, 0xB79C5305, 0xAA500737,
                        0x3E07841C, 0x7FDEAE5C, 0x8E7D44EC, 0x5716F2B8,
                        0xB03ADA37, 0xF0500C0D, 0xF01C1F04, 0x0200B3FF,
                        0xAE0CF51A, 0x3CB574B2, 0x25837A58, 0xDC0921BD,
                        0xD19113F9, 0x7CA92FF6, 0x94324773, 0x22F54701,
                        0x3AE5E581, 0x37C2DADC, 0xC8B57634, 0x9AF3DDA7,
                        0xA9446146, 0x0FD0030E, 0xECC8C73E, 0xA4751E41,
                        0xE238CD99, 0x3BEA0E2F, 0x3280BBA1, 0x183EB331,
                        0x4E548B38, 0x4F6DB908, 0x6F420D03, 0xF60A04BF,
                        0x2CB81290, 0x24977C79, 0x5679B072, 0xBCAF89AF,
                        0xDE9A771F, 0xD9930810, 0xB38BAE12, 0xDCCF3F2E,
                        0x5512721F, 0x2E6B7124, 0x501ADDE6, 0x9F84CD87,
                        0x7A584718, 0x7408DA17, 0xBC9F9ABC, 0xE94B7D8C,
                        0xEC7AEC3A, 0xDB851DFA, 0x63094366, 0xC464C3D2,
                        0xEF1C1847, 0x3215D908, 0xDD433B37, 0x24C2BA16,
                        0x12A14D43, 0x2A65C451, 0x50940002, 0x133AE4DD,
                        0x71DFF89E, 0x10314E55, 0x81AC77D6, 0x5F11199B,
                        0x043556F1, 0xD7A3C76B, 0x3C11183B, 0x5924A509,
                        0xF28FE6ED, 0x97F1FBFA, 0x9EBABF2C, 0x1E153C6E,
                        0x86E34570, 0xEAE96FB1, 0x860E5E0A, 0x5A3E2AB3,
                        0x771FE71C, 0x4E3D06FA, 0x2965DCB9, 0x99E71D0F,
                        0x803E89D6, 0x5266C825, 0x2E4CC978, 0x9C10B36A,
                        0xC6150EBA, 0x94E2EA78, 0xA5FC3C53, 0x1E0A2DF4,
                        0xF2F74EA7, 0x361D2B3D, 0x1939260F, 0x19C27960,
                        0x5223A708, 0xF71312B6, 0xEBADFE6E, 0xEAC31F66,
                        0xE3BC4595, 0xA67BC883, 0xB17F37D1, 0x018CFF28,
                        0xC332DDEF, 0xBE6C5AA5, 0x65582185, 0x68AB9802,
                        0xEECEA50F, 0xDB2F953B, 0x2AEF7DAD, 0x5B6E2F84,
                        0x1521B628, 0x29076170, 0xECDD4775, 0x619F1510,
                        0x13CCA830, 0xEB61BD96, 0x0334FE1E, 0xAA0363CF,
                        0xB5735C90, 0x4C70A239, 0xD59E9E0B, 0xCBAADE14,
                        0xEECC86BC, 0x60622CA7, 0x9CAB5CAB, 0xB2F3846E,
                        0x648B1EAF, 0x19BDF0CA, 0xA02369B9, 0x655ABB50,
                        0x40685A32, 0x3C2AB4B3, 0x319EE9D5, 0xC021B8F7,
                        0x9B540B19, 0x875FA099, 0x95F7997E, 0x623D7DA8,
                        0xF837889A, 0x97E32D77, 0x11ED935F, 0x16681281,
                        0x0E358829, 0xC7E61FD6, 0x96DEDFA1, 0x7858BA99,
                        0x57F584A5, 0x1B227263, 0x9B83C3FF, 0x1AC24696,
                        0xCDB30AEB, 0x532E3054, 0x8FD948E4, 0x6DBC3128,
                        0x58EBF2EF, 0x34C6FFEA, 0xFE28ED61, 0xEE7C3C73,
                        0x5D4A14D9, 0xE864B7E3, 0x42105D14, 0x203E13E0,
                        0x45EEE2B6, 0xA3AAABEA, 0xDB6C4F15, 0xFACB4FD0,
                        0xC742F442, 0xEF6ABBB5, 0x654F3B1D, 0x41CD2105,
                        0xD81E799E, 0x86854DC7, 0xE44B476A, 0x3D816250,
                        0xCF62A1F2, 0x5B8D2646, 0xFC8883A0, 0xC1C7B6A3,
                        0x7F1524C3, 0x69CB7492, 0x47848A0B, 0x5692B285,
                        0x095BBF00, 0xAD19489D, 0x1462B174, 0x23820E00,
                        0x58428D2A, 0x0C55F5EA, 0x1DADF43E, 0x233F7061,
                        0x3372F092, 0x8D937E41, 0xD65FECF1, 0x6C223BDB,
                        0x7CDE3759, 0xCBEE7460, 0x4085F2A7, 0xCE77326E,
                        0xA6078084, 0x19F8509E, 0xE8EFD855, 0x61D99735,
                        0xA969A7AA, 0xC50C06C2, 0x5A04ABFC, 0x800BCADC,
                        0x9E447A2E, 0xC3453484, 0xFDD56705, 0x0E1E9EC9,
                        0xDB73DBD3, 0x105588CD, 0x675FDA79, 0xE3674340,
                        0xC5C43465, 0x713E38D8, 0x3D28F89E, 0xF16DFF20,
                        0x153E21E7, 0x8FB03D4A, 0xE6E39F2B, 0xDB83ADF7],
                    [0xE93D5A68, 0x948140F7, 0xF64C261C, 0x94692934,
                        0x411520F7, 0x7602D4F7, 0xBCF46B2E, 0xD4A20068,
                        0xD4082471, 0x3320F46A, 0x43B7D4B7, 0x500061AF,
                        0x1E39F62E, 0x97244546, 0x14214F74, 0xBF8B8840,
                        0x4D95FC1D, 0x96B591AF, 0x70F4DDD3, 0x66A02F45,
                        0xBFBC09EC, 0x03BD9785, 0x7FAC6DD0, 0x31CB8504,
                        0x96EB27B3, 0x55FD3941, 0xDA2547E6, 0xABCA0A9A,
                        0x28507825, 0x530429F4, 0x0A2C86DA, 0xE9B66DFB,
                        0x68DC1462, 0xD7486900, 0x680EC0A4, 0x27A18DEE,
                        0x4F3FFEA2, 0xE887AD8C, 0xB58CE006, 0x7AF4D6B6,
                        0xAACE1E7C, 0xD3375FEC, 0xCE78A399, 0x406B2A42,
                        0x20FE9E35, 0xD9F385B9, 0xEE39D7AB, 0x3B124E8B,
                        0x1DC9FAF7, 0x4B6D1856, 0x26A36631, 0xEAE397B2,
                        0x3A6EFA74, 0xDD5B4332, 0x6841E7F7, 0xCA7820FB,
                        0xFB0AF54E, 0xD8FEB397, 0x454056AC, 0xBA489527,
                        0x55533A3A, 0x20838D87, 0xFE6BA9B7, 0xD096954B,
                        0x55A867BC, 0xA1159A58, 0xCCA92963, 0x99E1DB33,
                        0xA62A4A56, 0x3F3125F9, 0x5EF47E1C, 0x9029317C,
                        0xFDF8E802, 0x04272F70, 0x80BB155C, 0x05282CE3,
                        0x95C11548, 0xE4C66D22, 0x48C1133F, 0xC70F86DC,
                        0x07F9C9EE, 0x41041F0F, 0x404779A4, 0x5D886E17,
                        0x325F51EB, 0xD59BC0D1, 0xF2BCC18F, 0x41113564,
                        0x257B7834, 0x602A9C60, 0xDFF8E8A3, 0x1F636C1B,
                        0x0E12B4C2, 0x02E1329E, 0xAF664FD1, 0xCAD18115,
                        0x6B2395E0, 0x333E92E1, 0x3B240B62, 0xEEBEB922,
                        0x85B2A20E, 0xE6BA0D99, 0xDE720C8C, 0x2DA2F728,
                        0xD0127845, 0x95B794FD, 0x647D0862, 0xE7CCF5F0,
                        0x5449A36F, 0x877D48FA, 0xC39DFD27, 0xF33E8D1E,
                        0x0A476341, 0x992EFF74, 0x3A6F6EAB, 0xF4F8FD37,
                        0xA812DC60, 0xA1EBDDF8, 0x991BE14C, 0xDB6E6B0D,
                        0xC67B5510, 0x6D672C37, 0x2765D43B, 0xDCD0E804,
                        0xF1290DC7, 0xCC00FFA3, 0xB5390F92, 0x690FED0B,
                        0x667B9FFB, 0xCEDB7D9C, 0xA091CF0B, 0xD9155EA3,
                        0xBB132F88, 0x515BAD24, 0x7B9479BF, 0x763BD6EB,
                        0x37392EB3, 0xCC115979, 0x8026E297, 0xF42E312D,
                        0x6842ADA7, 0xC66A2B3B, 0x12754CCC, 0x782EF11C,
                        0x6A124237, 0xB79251E7, 0x06A1BBE6, 0x4BFB6350,
                        0x1A6B1018, 0x11CAEDFA, 0x3D25BDD8, 0xE2E1C3C9,
                        0x44421659, 0x0A121386, 0xD90CEC6E, 0xD5ABEA2A,
                        0x64AF674E, 0xDA86A85F, 0xBEBFE988, 0x64E4C3FE,
                        0x9DBC8057, 0xF0F7C086, 0x60787BF8, 0x6003604D,
                        0xD1FD8346, 0xF6381FB0, 0x7745AE04, 0xD736FCCC,
                        0x83426B33, 0xF01EAB71, 0xB0804187, 0x3C005E5F,
                        0x77A057BE, 0xBDE8AE24, 0x55464299, 0xBF582E61,
                        0x4E58F48F, 0xF2DDFDA2, 0xF474EF38, 0x8789BDC2,
                        0x5366F9C3, 0xC8B38E74, 0xB475F255, 0x46FCD9B9,
                        0x7AEB2661, 0x8B1DDF84, 0x846A0E79, 0x915F95E2,
                        0x466E598E, 0x20B45770, 0x8CD55591, 0xC902DE4C,
                        0xB90BACE1, 0xBB8205D0, 0x11A86248, 0x7574A99E,
                        0xB77F19B6, 0xE0A9DC09, 0x662D09A1, 0xC4324633,
                        0xE85A1F02, 0x09F0BE8C, 0x4A99A025, 0x1D6EFE10,
                        0x1AB93D1D, 0x0BA5A4DF, 0xA186F20F, 0x2868F169,
                        0xDCB7DA83, 0x573906FE, 0xA1E2CE9B, 0x4FCD7F52,
                        0x50115E01, 0xA70683FA, 0xA002B5C4, 0x0DE6D027,
                        0x9AF88C27, 0x773F8641, 0xC3604C06, 0x61A806B5,
                        0xF0177A28, 0xC0F586E0, 0x006058AA, 0x30DC7D62,
                        0x11E69ED7, 0x2338EA63, 0x53C2DD94, 0xC2C21634,
                        0xBBCBEE56, 0x90BCB6DE, 0xEBFC7DA1, 0xCE591D76,
                        0x6F05E409, 0x4B7C0188, 0x39720A3D, 0x7C927C24,
                        0x86E3725F, 0x724D9DB9, 0x1AC15BB4, 0xD39EB8FC,
                        0xED545578, 0x08FCA5B5, 0xD83D7CD3, 0x4DAD0FC4,
                        0x1E50EF5E, 0xB161E6F8, 0xA28514D9, 0x6C51133C,
                        0x6FD5C7E7, 0x56E14EC4, 0x362ABFCE, 0xDDC6C837,
                        0xD79A3234, 0x92638212, 0x670EFA8E, 0x406000E0],
                    [0x3A39CE37, 0xD3FAF5CF, 0xABC27737, 0x5AC52D1B,
                        0x5CB0679E, 0x4FA33742, 0xD3822740, 0x99BC9BBE,
                        0xD5118E9D, 0xBF0F7315, 0xD62D1C7E, 0xC700C47B,
                        0xB78C1B6B, 0x21A19045, 0xB26EB1BE, 0x6A366EB4,
                        0x5748AB2F, 0xBC946E79, 0xC6A376D2, 0x6549C2C8,
                        0x530FF8EE, 0x468DDE7D, 0xD5730A1D, 0x4CD04DC6,
                        0x2939BBDB, 0xA9BA4650, 0xAC9526E8, 0xBE5EE304,
                        0xA1FAD5F0, 0x6A2D519A, 0x63EF8CE2, 0x9A86EE22,
                        0xC089C2B8, 0x43242EF6, 0xA51E03AA, 0x9CF2D0A4,
                        0x83C061BA, 0x9BE96A4D, 0x8FE51550, 0xBA645BD6,
                        0x2826A2F9, 0xA73A3AE1, 0x4BA99586, 0xEF5562E9,
                        0xC72FEFD3, 0xF752F7DA, 0x3F046F69, 0x77FA0A59,
                        0x80E4A915, 0x87B08601, 0x9B09E6AD, 0x3B3EE593,
                        0xE990FD5A, 0x9E34D797, 0x2CF0B7D9, 0x022B8B51,
                        0x96D5AC3A, 0x017DA67D, 0xD1CF3ED6, 0x7C7D2D28,
                        0x1F9F25CF, 0xADF2B89B, 0x5AD6B472, 0x5A88F54C,
                        0xE029AC71, 0xE019A5E6, 0x47B0ACFD, 0xED93FA9B,
                        0xE8D3C48D, 0x283B57CC, 0xF8D56629, 0x79132E28,
                        0x785F0191, 0xED756055, 0xF7960E44, 0xE3D35E8C,
                        0x15056DD4, 0x88F46DBA, 0x03A16125, 0x0564F0BD,
                        0xC3EB9E15, 0x3C9057A2, 0x97271AEC, 0xA93A072A,
                        0x1B3F6D9B, 0x1E6321F5, 0xF59C66FB, 0x26DCF319,
                        0x7533D928, 0xB155FDF5, 0x03563482, 0x8ABA3CBB,
                        0x28517711, 0xC20AD9F8, 0xABCC5167, 0xCCAD925F,
                        0x4DE81751, 0x3830DC8E, 0x379D5862, 0x9320F991,
                        0xEA7A90C2, 0xFB3E7BCE, 0x5121CE64, 0x774FBE32,
                        0xA8B6E37E, 0xC3293D46, 0x48DE5369, 0x6413E680,
                        0xA2AE0810, 0xDD6DB224, 0x69852DFD, 0x09072166,
                        0xB39A460A, 0x6445C0DD, 0x586CDECF, 0x1C20C8AE,
                        0x5BBEF7DD, 0x1B588D40, 0xCCD2017F, 0x6BB4E3BB,
                        0xDDA26A7E, 0x3A59FF45, 0x3E350A44, 0xBCB4CDD5,
                        0x72EACEA8, 0xFA6484BB, 0x8D6612AE, 0xBF3C6F47,
                        0xD29BE463, 0x542F5D9E, 0xAEC2771B, 0xF64E6370,
                        0x740E0D8D, 0xE75B1357, 0xF8721671, 0xAF537D5D,
                        0x4040CB08, 0x4EB4E2CC, 0x34D2466A, 0x0115AF84,
                        0xE1B00428, 0x95983A1D, 0x06B89FB4, 0xCE6EA048,
                        0x6F3F3B82, 0x3520AB82, 0x011A1D4B, 0x277227F8,
                        0x611560B1, 0xE7933FDC, 0xBB3A792B, 0x344525BD,
                        0xA08839E1, 0x51CE794B, 0x2F32C9B7, 0xA01FBAC9,
                        0xE01CC87E, 0xBCC7D1F6, 0xCF0111C3, 0xA1E8AAC7,
                        0x1A908749, 0xD44FBD9A, 0xD0DADECB, 0xD50ADA38,
                        0x0339C32A, 0xC6913667, 0x8DF9317C, 0xE0B12B4F,
                        0xF79E59B7, 0x43F5BB3A, 0xF2D519FF, 0x27D9459C,
                        0xBF97222C, 0x15E6FC2A, 0x0F91FC71, 0x9B941525,
                        0xFAE59361, 0xCEB69CEB, 0xC2A86459, 0x12BAA8D1,
                        0xB6C1075E, 0xE3056A0C, 0x10D25065, 0xCB03A442,
                        0xE0EC6E0E, 0x1698DB3B, 0x4C98A0BE, 0x3278E964,
                        0x9F1F9532, 0xE0D392DF, 0xD3A0342B, 0x8971F21E,
                        0x1B0A7441, 0x4BA3348C, 0xC5BE7120, 0xC37632D8,
                        0xDF359F8D, 0x9B992F2E, 0xE60B6F47, 0x0FE3F11D,
                        0xE54CDA54, 0x1EDAD891, 0xCE6279CF, 0xCD3E7E6F,
                        0x1618B166, 0xFD2C1D05, 0x848FD2C5, 0xF6FB2299,
                        0xF523F357, 0xA6327623, 0x93A83531, 0x56CCCD02,
                        0xACF08162, 0x5A75EBB5, 0x6E163697, 0x88D273CC,
                        0xDE966292, 0x81B949D0, 0x4C50901B, 0x71C65614,
                        0xE6C6C7BD, 0x327A140A, 0x45E1D006, 0xC3F27B9A,
                        0xC9AA53FD, 0x62A80F00, 0xBB25BFE2, 0x35BDD2F6,
                        0x71126905, 0xB2040222, 0xB6CBCF7C, 0xCD769C2B,
                        0x53113EC0, 0x1640E3D3, 0x38ABBD60, 0x2547ADF0,
                        0xBA38209C, 0xF746CE76, 0x77AFA1C5, 0x20756060,
                        0x85CBFE4E, 0x8AE88DD8, 0x7AAAF9B0, 0x4CF9AA7E,
                        0x1948C25C, 0x02FB8A8C, 0x01C36AE4, 0xD6EBE1F9,
                        0x90D4F869, 0xA65CDEA0, 0x3F09252D, 0xC208E69F,
                        0xB74E6132, 0xCE77E25B, 0x578FDFE3, 0x3AC372E6]
                ];

                var BLOWFISH_CTX = {
                    pbox: [],
                    sbox: []
                };

                function F(ctx, x) {
                    let a = (x >> 24) & 0xFF;
                    let b = (x >> 16) & 0xFF;
                    let c = (x >> 8) & 0xFF;
                    let d = x & 0xFF;

                    let y = ctx.sbox[0][a] + ctx.sbox[1][b];
                    y = y ^ ctx.sbox[2][c];
                    y = y + ctx.sbox[3][d];

                    return y;
                }

                function BlowFish_Encrypt(ctx, left, right) {
                    let Xl = left;
                    let Xr = right;
                    let temp;

                    for (let i = 0; i < N; ++i) {
                        Xl = Xl ^ ctx.pbox[i];
                        Xr = F(ctx, Xl) ^ Xr;

                        temp = Xl;
                        Xl = Xr;
                        Xr = temp;
                    }

                    temp = Xl;
                    Xl = Xr;
                    Xr = temp;

                    Xr = Xr ^ ctx.pbox[N];
                    Xl = Xl ^ ctx.pbox[N + 1];

                    return { left: Xl, right: Xr };
                }

                function BlowFish_Decrypt(ctx, left, right) {
                    let Xl = left;
                    let Xr = right;
                    let temp;

                    for (let i = N + 1; i > 1; --i) {
                        Xl = Xl ^ ctx.pbox[i];
                        Xr = F(ctx, Xl) ^ Xr;

                        temp = Xl;
                        Xl = Xr;
                        Xr = temp;
                    }

                    temp = Xl;
                    Xl = Xr;
                    Xr = temp;

                    Xr = Xr ^ ctx.pbox[1];
                    Xl = Xl ^ ctx.pbox[0];

                    return { left: Xl, right: Xr };
                }

                /**
                 * Initialization ctx's pbox and sbox.
                 *
                 * @param {Object} ctx The object has pbox and sbox.
                 * @param {Array} key An array of 32-bit words.
                 * @param {int} keysize The length of the key.
                 *
                 * @example
                 *
                 *     BlowFishInit(BLOWFISH_CTX, key, 128/32);
                 */
                function BlowFishInit(ctx, key, keysize) {
                    for (let Row = 0; Row < 4; Row++) {
                        ctx.sbox[Row] = [];
                        for (let Col = 0; Col < 256; Col++) {
                            ctx.sbox[Row][Col] = ORIG_S[Row][Col];
                        }
                    }

                    let keyIndex = 0;
                    for (let index = 0; index < N + 2; index++) {
                        ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
                        keyIndex++;
                        if (keyIndex >= keysize) {
                            keyIndex = 0;
                        }
                    }

                    let Data1 = 0;
                    let Data2 = 0;
                    let res = 0;
                    for (let i = 0; i < N + 2; i += 2) {
                        res = BlowFish_Encrypt(ctx, Data1, Data2);
                        Data1 = res.left;
                        Data2 = res.right;
                        ctx.pbox[i] = Data1;
                        ctx.pbox[i + 1] = Data2;
                    }

                    for (let i = 0; i < 4; i++) {
                        for (let j = 0; j < 256; j += 2) {
                            res = BlowFish_Encrypt(ctx, Data1, Data2);
                            Data1 = res.left;
                            Data2 = res.right;
                            ctx.sbox[i][j] = Data1;
                            ctx.sbox[i][j + 1] = Data2;
                        }
                    }

                    return true;
                }

                /**
                 * Blowfish block cipher algorithm.
                 */
                var Blowfish = C_algo.Blowfish = BlockCipher.extend({
                    _doReset: function () {
                        // Skip reset of nRounds has been set before and key did not change
                        if (this._keyPriorReset === this._key) {
                            return;
                        }

                        // Shortcuts
                        var key = this._keyPriorReset = this._key;
                        var keyWords = key.words;
                        var keySize = key.sigBytes / 4;

                        //Initialization pbox and sbox
                        BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
                    },

                    encryptBlock: function (M, offset) {
                        var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
                        M[offset] = res.left;
                        M[offset + 1] = res.right;
                    },

                    decryptBlock: function (M, offset) {
                        var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
                        M[offset] = res.left;
                        M[offset + 1] = res.right;
                    },

                    blockSize: 64 / 32,

                    keySize: 128 / 32,

                    ivSize: 64 / 32
                });

                /**
                 * Shortcut functions to the cipher's object interface.
                 *
                 * @example
                 *
                 *     var ciphertext = CryptoJS.Blowfish.encrypt(message, key, cfg);
                 *     var plaintext  = CryptoJS.Blowfish.decrypt(ciphertext, key, cfg);
                 */
                C.Blowfish = BlockCipher._createHelper(Blowfish);
            }());


            return CryptoJS.Blowfish;

        }));
    }(blowfish));
    return blowfish.exports;
}

(function (module, exports) {
    (function (root, factory, undef) {
        {
            // CommonJS
            module.exports = factory(requireCore(), requireX64Core(), requireLibTypedarrays(), requireEncUtf16(), requireEncBase64(), requireEncBase64url(), requireMd5(), requireSha1(), requireSha256(), requireSha224(), requireSha512(), requireSha384(), requireSha3(), requireRipemd160(), requireHmac(), requirePbkdf2(), requireEvpkdf(), requireCipherCore(), requireModeCfb(), requireModeCtr(), requireModeCtrGladman(), requireModeOfb(), requireModeEcb(), requirePadAnsix923(), requirePadIso10126(), requirePadIso97971(), requirePadZeropadding(), requirePadNopadding(), requireFormatHex(), requireAes(), requireTripledes(), requireRc4(), requireRabbit(), requireRabbitLegacy(), requireBlowfish());
        }
    }(commonjsGlobal, function (CryptoJS) {

        return CryptoJS;

    }));
}(cryptoJs));

var cryptoJsExports = cryptoJs.exports;

var CryptoJS = cryptoJsExports;
let window$1 = globalThis;
// rt = '8c78ef33dd555b71'
// challenge = "1a777704c7d13617fddd4ae65aacb746gf"
// gt = "4d91184f0308d36a3bc4b2b01b845a6b"
// c = [12, 58, 98, 36, 43, 95, 62, 15, 12]
// s = "582e724b"

function slide_result(dis, gt, challenge, c, s, rt) {
    dis = dis;
    gt = gt;
    challenge = challenge;
    c = JSON.parse(c);
    s = s;
    rt = rt;
    function aesV(o_text, random_str) {
        var key = CryptoJS.enc.Utf8.parse(random_str);
        var iv = CryptoJS.enc.Utf8.parse("0000000000000000");
        var srcs = CryptoJS.enc.Utf8.parse(o_text);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        for (
            var r = encrypted,
                o = r.ciphertext.words,
                i = r.ciphertext.sigBytes,
                s = [],
                a = 0;
            a < i;
            a++
        ) {
            var c = (o[a >>> 2] >>> (24 - (a % 4) * 8)) & 255;
            s.push(c);
        }
        return s;
    }

    let trace_list = [
        [
            [-45, -28, 0],
            [0, 0, 0],
            [0, 0, 117],
            [1, 1, 192],
            [3, 1, 201],
            [7, 3, 210],
            [7, 3, 217],
            [8, 3, 226],
            [9, 3, 277],
            [9, 3, 288],
            [9, 3, 297],
            [9, 3, 302],
            [10, 3, 310],
            [11, 3, 323],
            [11, 3, 331],
            [14, 3, 340],
            [15, 5, 344],
            [17, 5, 351],
            [19, 5, 361],
            [20, 5, 365],
            [22, 5, 372],
            [23, 5, 381],
            [25, 6, 385],
            [27, 6, 394],
            [28, 6, 403],
            [29, 6, 405],
            [30, 6, 415],
            [31, 6, 422],
            [31, 6, 436],
            [32, 6, 464],
            [33, 6, 484],
            [33, 6, 511],
            [34, 6, 535],
            [35, 6, 555],
            [36, 6, 581],
            [37, 6, 606],
            [37, 6, 609],
            [37, 6, 619],
            [38, 6, 651],
            [39, 6, 665],
            [39, 6, 693],
            [40, 6, 714],
            [41, 6, 731],
            [41, 6, 751],
            [41, 5, 756],
            [42, 5, 772],
            [43, 5, 797],
            [43, 5, 801],
            [43, 5, 814],
            [43, 5, 835],
            [44, 5, 847],
            [44, 4, 869],
            [45, 4, 882],
            [45, 3, 906],
            [46, 3, 927],
            [47, 3, 944],
            [47, 3, 968],
            [47, 2, 972],
            [48, 2, 989],
            [48, 2, 1095],
        ],
        [
            [-37, -40, 0],
            [0, 0, 0],
            [0, 0, 32],
            [0, 0, 182],
            [3, 0, 191],
            [7, 2, 198],
            [13, 4, 208],
            [17, 5, 211],
            [21, 6, 220],
            [25, 7, 226],
            [27, 7, 232],
            [28, 7, 238],
            [29, 7, 244],
            [30, 7, 262],
            [31, 7, 290],
            [31, 7, 304],
            [32, 8, 350],
            [33, 8, 357],
            [35, 8, 366],
            [36, 8, 371],
            [37, 8, 379],
            [37, 8, 386],
            [38, 8, 399],
            [39, 8, 419],
            [39, 8, 445],
            [40, 8, 465],
            [41, 8, 499],
            [41, 8, 511],
            [41, 8, 520],
            [42, 8, 525],
            [43, 8, 561],
            [43, 8, 582],
            [44, 8, 612],
            [45, 8, 624],
            [45, 8, 637],
            [46, 8, 666],
            [46, 8, 680],
            [47, 8, 687],
            [47, 8, 716],
            [48, 8, 737],
            [49, 8, 750],
            [49, 8, 791],
            [50, 8, 833],
            [50, 8, 849],
            [50, 8, 906],
        ],
        [
            [-35, -37, 0],
            [0, 0, 0],
            [0, 0, 143],
            [5, 1, 217],
            [11, 3, 228],
            [18, 4, 234],
            [23, 7, 238],
            [29, 7, 249],
            [33, 9, 253],
            [36, 9, 257],
            [38, 10, 266],
            [39, 10, 274],
            [40, 11, 287],
            [41, 11, 295],
            [41, 11, 308],
            [42, 11, 399],
            [43, 11, 412],
            [43, 11, 440],
            [43, 11, 454],
            [44, 11, 475],
            [45, 11, 491],
            [45, 11, 512],
            [46, 11, 533],
            [47, 11, 546],
            [47, 11, 595],
            [47, 11, 625],
            [47, 11, 632],
            [48, 11, 645],
            [49, 11, 716],
            [49, 11, 763],
            [49, 11, 787],
            [50, 11, 870],
            [50, 11, 926],
        ],
        [
            [-27, -23, 0],
            [0, 0, 0],
            [0, 0, 68],
            [2, 0, 242],
            [5, 0, 249],
            [6, 0, 258],
            [9, 0, 262],
            [10, 0, 271],
            [11, 0, 275],
            [12, 0, 292],
            [13, 0, 296],
            [13, 0, 317],
            [14, 0, 333],
            [14, 0, 346],
            [15, 0, 375],
            [15, 0, 395],
            [15, 0, 404],
            [16, 0, 417],
            [17, 0, 429],
            [17, 0, 471],
            [19, 0, 479],
            [20, 0, 483],
            [22, -1, 491],
            [23, -1, 499],
            [25, -1, 504],
            [27, -1, 512],
            [28, -1, 520],
            [29, -1, 525],
            [29, -1, 533],
            [30, -1, 541],
            [31, -1, 554],
            [31, -1, 558],
            [31, -1, 575],
            [32, -1, 654],
            [33, -1, 687],
            [33, -1, 696],
            [35, -1, 704],
            [35, -2, 708],
            [37, -2, 717],
            [39, -2, 725],
            [42, -3, 728],
            [44, -3, 738],
            [45, -3, 742],
            [47, -4, 749],
            [49, -4, 758],
            [49, -4, 771],
            [50, -4, 788],
            [50, -4, 838],
            [51, -4, 892],
            [51, -4, 900],
            [51, -4, 1080],
            [51, -4, 1345],
            [51, -4, 1420],
            [51, -4, 1570],
            [51, -4, 1578],
            [51, -4, 1663],
        ],
        [
            [-32, -15, 0],
            [0, 0, 0],
            [0, 0, 110],
            [0, 0, 202],
            [3, 0, 259],
            [4, 0, 268],
            [6, 0, 276],
            [7, 0, 289],
            [7, 0, 297],
            [8, 0, 309],
            [9, 0, 323],
            [9, 0, 351],
            [9, 0, 369],
            [10, 0, 389],
            [11, 0, 414],
            [11, 0, 431],
            [12, 0, 465],
            [13, 0, 494],
            [13, 1, 497],
            [15, 1, 506],
            [18, 1, 514],
            [21, 1, 518],
            [23, 1, 527],
            [26, 1, 535],
            [27, 1, 539],
            [28, 1, 548],
            [29, 1, 556],
            [29, 1, 560],
            [30, 1, 598],
            [31, 1, 623],
            [31, 1, 648],
            [33, 1, 686],
            [35, 1, 694],
            [36, 1, 701],
            [37, 1, 707],
            [38, 1, 714],
            [39, 1, 731],
            [39, 1, 757],
            [40, 1, 785],
            [40, 1, 860],
            [41, 1, 864],
            [41, 1, 927],
            [42, 1, 960],
            [43, 1, 973],
            [44, 1, 1010],
            [45, 1, 1031],
            [45, 1, 1085],
            [45, 1, 1095],
            [46, 1, 1114],
            [47, 1, 1126],
            [47, 1, 1177],
            [47, 1, 1185],
            [48, 1, 1219],
            [49, 1, 1256],
            [49, 1, 1301],
            [49, 1, 1361],
            [50, 1, 1365],
            [50, 1, 1382],
            [51, 1, 1465],
            [51, 0, 1519],
            [52, 0, 1561],
            [52, 0, 1590],
            [53, 0, 1619],
            [53, 0, 1683],
            [53, 0, 1724],
            [53, -1, 1758],
            [53, -1, 1857],
            [53, -1, 1908],
        ],
        [
            [-29, -32, 0],
            [0, 0, 0],
            [0, 0, 35],
            [0, 0, 43],
            [0, 0, 143],
            [2, 0, 194],
            [7, 0, 203],
            [13, 2, 211],
            [16, 2, 220],
            [17, 3, 227],
            [19, 3, 232],
            [21, 3, 239],
            [21, 3, 247],
            [21, 3, 253],
            [22, 3, 261],
            [23, 3, 270],
            [23, 3, 290],
            [23, 3, 327],
            [24, 3, 343],
            [25, 4, 353],
            [27, 4, 361],
            [30, 5, 366],
            [31, 5, 373],
            [34, 6, 381],
            [35, 6, 386],
            [37, 7, 394],
            [39, 7, 403],
            [39, 7, 407],
            [40, 7, 423],
            [41, 7, 444],
            [41, 7, 494],
            [42, 7, 512],
            [42, 7, 532],
            [43, 7, 568],
            [43, 7, 598],
            [44, 7, 611],
            [44, 7, 635],
            [45, 7, 648],
            [45, 7, 669],
            [46, 7, 694],
            [47, 7, 732],
            [47, 7, 752],
            [48, 7, 807],
            [49, 7, 829],
            [49, 7, 848],
            [50, 7, 911],
            [51, 7, 940],
            [51, 7, 961],
            [51, 7, 1028],
            [51, 7, 1032],
            [52, 7, 1044],
            [52, 7, 1052],
            [53, 7, 1103],
            [53, 7, 1136],
            [53, 7, 1166],
        ],
        [
            [-27, 0, 0],
            [0, 0, 0],
            [0, 0, 90],
            [3, 0, 224],
            [7, 0, 232],
            [11, 0, 241],
            [15, 1, 247],
            [18, 1, 253],
            [20, 1, 257],
            [20, 1, 263],
            [22, 2, 267],
            [23, 2, 274],
            [24, 2, 288],
            [25, 2, 299],
            [25, 2, 328],
            [26, 2, 391],
            [27, 2, 412],
            [27, 2, 426],
            [27, 2, 433],
            [27, 2, 438],
            [28, 2, 467],
            [29, 2, 483],
            [30, 2, 492],
            [32, 2, 497],
            [33, 2, 506],
            [35, 2, 509],
            [37, 2, 517],
            [37, 2, 525],
            [38, 2, 534],
            [39, 2, 538],
            [40, 2, 546],
            [41, 2, 559],
            [41, 2, 566],
            [41, 2, 591],
            [42, 2, 616],
            [43, 2, 629],
            [43, 2, 670],
            [44, 2, 742],
            [44, 2, 763],
            [45, 2, 791],
            [45, 2, 820],
            [46, 2, 845],
            [46, 1, 854],
            [47, 1, 862],
            [47, 1, 916],
            [48, 1, 930],
            [48, 1, 938],
            [48, 1, 943],
            [49, 1, 950],
            [49, 1, 975],
            [50, 1, 1000],
            [51, 1, 1030],
            [52, 1, 1071],
            [52, 1, 1091],
            [53, 1, 1100],
            [53, 1, 1154],
            [53, 1, 1283],
            [53, 1, 1303],
        ],
        [
            [-35, -36, 0],
            [0, 0, 0],
            [0, 0, 21],
            [0, 0, 118],
            [3, 1, 226],
            [6, 2, 235],
            [11, 2, 243],
            [14, 3, 247],
            [17, 3, 253],
            [18, 3, 263],
            [19, 3, 268],
            [20, 3, 275],
            [21, 3, 288],
            [22, 3, 297],
            [25, 4, 302],
            [27, 4, 308],
            [31, 4, 317],
            [34, 5, 322],
            [37, 5, 332],
            [41, 6, 343],
            [43, 7, 346],
            [46, 7, 351],
            [48, 7, 359],
            [49, 7, 364],
            [50, 7, 372],
            [51, 8, 381],
            [51, 8, 392],
            [52, 8, 413],
            [53, 8, 430],
            [53, 8, 514],
            [54, 8, 535],
            [55, 8, 560],
            [55, 8, 605],
            [55, 8, 610],
            [56, 8, 626],
            [57, 8, 648],
            [57, 8, 672],
            [58, 8, 709],
            [59, 8, 743],
            [59, 8, 764],
            [59, 8, 820],
            [60, 8, 864],
            [60, 8, 1019],
            [60, 8, 1019],
        ],
        [
            [-46, -21, 0],
            [0, 0, 0],
            [0, 0, 67],
            [0, 0, 226],
            [2, 0, 243],
            [5, 0, 251],
            [7, 0, 259],
            [10, 1, 263],
            [11, 1, 275],
            [12, 1, 281],
            [13, 1, 285],
            [13, 1, 292],
            [15, 1, 306],
            [15, 1, 313],
            [16, 1, 342],
            [17, 1, 389],
            [19, 1, 398],
            [20, 1, 406],
            [23, 1, 410],
            [23, 1, 418],
            [25, 1, 426],
            [25, 1, 430],
            [26, 1, 439],
            [27, 1, 448],
            [27, 1, 468],
            [27, 1, 482],
            [29, 1, 522],
            [29, 1, 538],
            [29, 1, 556],
            [30, 1, 593],
            [31, 1, 622],
            [31, 1, 635],
            [33, 1, 645],
            [35, 1, 647],
            [37, 1, 656],
            [40, 2, 664],
            [42, 2, 668],
            [45, 2, 677],
            [47, 2, 686],
            [49, 2, 688],
            [50, 3, 698],
            [51, 3, 706],
            [53, 3, 714],
            [53, 3, 718],
            [54, 3, 731],
            [55, 3, 761],
            [55, 3, 823],
            [56, 3, 873],
            [57, 3, 932],
            [57, 3, 965],
            [58, 3, 993],
            [59, 3, 1014],
            [59, 3, 1048],
            [59, 3, 1068],
            [60, 3, 1102],
            [61, 3, 1169],
            [61, 3, 1227],
            [61, 3, 1301],
        ],
        [
            [-39, -20, 0],
            [0, 0, 0],
            [0, 0, 81],
            [0, 0, 240],
            [4, 0, 256],
            [9, 0, 264],
            [15, 1, 273],
            [19, 1, 278],
            [23, 1, 281],
            [27, 2, 289],
            [30, 2, 295],
            [34, 3, 307],
            [37, 3, 311],
            [40, 3, 317],
            [43, 4, 324],
            [44, 4, 332],
            [46, 4, 340],
            [47, 4, 344],
            [49, 4, 352],
            [51, 4, 361],
            [52, 4, 369],
            [53, 4, 373],
            [54, 4, 381],
            [55, 4, 386],
            [57, 4, 394],
            [59, 4, 403],
            [60, 4, 410],
            [62, 4, 414],
            [63, 4, 423],
            [64, 4, 428],
            [65, 4, 436],
            [65, 4, 445],
            [66, 4, 452],
            [67, 4, 456],
            [67, 4, 474],
            [68, 4, 498],
            [68, 4, 570],
            [69, 4, 591],
            [69, 4, 733],
            [69, 4, 974],
            [69, 4, 1013],
        ],
        [
            [-33, -34, 0],
            [0, 0, 0],
            [0, 0, 179],
            [2, 1, 245],
            [6, 3, 254],
            [8, 5, 262],
            [9, 5, 266],
            [10, 5, 275],
            [11, 5, 283],
            [11, 5, 312],
            [12, 5, 338],
            [13, 5, 383],
            [13, 5, 387],
            [13, 5, 395],
            [14, 6, 399],
            [15, 6, 417],
            [16, 6, 421],
            [18, 7, 430],
            [21, 7, 437],
            [23, 8, 442],
            [26, 9, 450],
            [29, 10, 459],
            [33, 12, 463],
            [37, 13, 471],
            [41, 14, 480],
            [43, 14, 484],
            [46, 15, 491],
            [49, 16, 501],
            [50, 16, 508],
            [51, 16, 512],
            [51, 16, 521],
            [52, 16, 525],
            [53, 16, 563],
            [53, 16, 616],
            [53, 16, 667],
            [54, 16, 709],
            [55, 16, 738],
            [55, 16, 750],
            [56, 16, 780],
            [57, 16, 792],
            [57, 16, 808],
            [58, 16, 821],
            [59, 16, 833],
            [60, 16, 850],
            [60, 16, 884],
            [61, 16, 896],
            [61, 16, 925],
            [61, 16, 980],
            [62, 16, 988],
            [63, 16, 1067],
            [63, 16, 1138],
            [63, 15, 1150],
            [63, 15, 1167],
            [64, 15, 1179],
            [65, 15, 1255],
            [65, 15, 1317],
            [65, 15, 1380],
            [66, 15, 1401],
            [66, 15, 1475],
            [67, 15, 1492],
            [67, 15, 1534],
            [67, 13, 1585],
            [68, 13, 1596],
            [69, 13, 1634],
            [69, 13, 1663],
            [69, 13, 1667],
            [69, 13, 1730],
            [69, 13, 1739],
            [69, 13, 1880],
            [69, 13, 1886],
        ],
        [
            [-57, -21, 0],
            [0, 0, 0],
            [0, 0, 111],
            [2, 0, 186],
            [5, 2, 194],
            [9, 4, 202],
            [13, 5, 208],
            [17, 7, 212],
            [21, 7, 220],
            [23, 9, 224],
            [25, 9, 233],
            [27, 9, 240],
            [27, 9, 245],
            [28, 9, 253],
            [29, 9, 268],
            [29, 9, 283],
            [30, 9, 316],
            [31, 9, 324],
            [34, 10, 332],
            [36, 11, 337],
            [39, 11, 345],
            [40, 11, 350],
            [41, 13, 359],
            [43, 13, 366],
            [44, 13, 371],
            [45, 13, 379],
            [45, 13, 388],
            [46, 13, 399],
            [46, 14, 407],
            [47, 14, 470],
            [47, 14, 486],
            [48, 15, 490],
            [50, 15, 500],
            [52, 15, 504],
            [53, 15, 512],
            [55, 16, 520],
            [57, 17, 525],
            [59, 17, 533],
            [61, 18, 540],
            [63, 19, 550],
            [66, 19, 553],
            [69, 20, 562],
            [70, 20, 570],
            [73, 21, 575],
            [73, 21, 584],
            [74, 21, 592],
            [74, 21, 599],
            [75, 21, 603],
            [76, 21, 617],
            [77, 21, 630],
            [77, 21, 724],
            [77, 21, 900],
            [77, 21, 1108],
            [77, 20, 1142],
            [76, 20, 1179],
            [76, 20, 1220],
            [75, 20, 1254],
            [75, 19, 1275],
            [74, 19, 1304],
            [73, 19, 1338],
            [73, 18, 1353],
            [73, 18, 1387],
            [73, 17, 1395],
            [73, 17, 1417],
            [73, 16, 1434],
            [72, 16, 1441],
            [72, 15, 1512],
            [72, 15, 1554],
            [72, 15, 1608],
            [72, 15, 1613],
            [72, 14, 1663],
            [71, 14, 1696],
            [71, 14, 1730],
            [71, 13, 1792],
            [71, 13, 1905],
            [71, 13, 2078],
            [71, 13, 2108],
            [71, 13, 2238],
            [71, 12, 2246],
            [70, 12, 2368],
            [70, 11, 2372],
            [70, 11, 2403],
            [70, 10, 2409],
            [69, 10, 2464],
            [69, 9, 2472],
            [69, 9, 2497],
            [69, 9, 2522],
            [69, 9, 2606],
            [69, 9, 2711],
        ],
        [
            [-32, -38, 0],
            [0, 0, 0],
            [0, 0, 76],
            [0, 0, 84],
            [1, 0, 193],
            [5, 2, 201],
            [11, 5, 210],
            [14, 6, 218],
            [17, 7, 226],
            [19, 7, 231],
            [21, 9, 239],
            [24, 9, 248],
            [26, 9, 252],
            [27, 10, 259],
            [27, 10, 269],
            [29, 10, 276],
            [30, 11, 281],
            [31, 11, 309],
            [31, 11, 351],
            [32, 11, 389],
            [34, 11, 392],
            [37, 12, 402],
            [39, 13, 410],
            [41, 13, 414],
            [41, 14, 422],
            [43, 14, 431],
            [43, 15, 435],
            [44, 15, 444],
            [45, 15, 457],
            [45, 15, 482],
            [46, 15, 498],
            [47, 15, 505],
            [47, 15, 513],
            [48, 15, 522],
            [49, 15, 526],
            [53, 15, 535],
            [55, 15, 539],
            [57, 15, 548],
            [59, 15, 552],
            [61, 16, 560],
            [62, 16, 568],
            [62, 16, 573],
            [63, 16, 576],
            [63, 16, 590],
            [64, 16, 610],
            [65, 16, 623],
            [65, 16, 697],
            [65, 16, 780],
            [66, 16, 864],
            [67, 16, 885],
            [67, 16, 899],
            [68, 16, 948],
            [69, 16, 989],
            [69, 16, 1072],
            [69, 16, 1110],
        ],
        [
            [-25, -23, 0],
            [0, 0, 0],
            [0, 0, 38],
            [5, 0, 221],
            [11, 0, 230],
            [25, 0, 238],
            [31, 0, 247],
            [39, 0, 255],
            [44, 0, 263],
            [51, 0, 268],
            [54, 0, 276],
            [57, 0, 280],
            [59, 0, 289],
            [59, 0, 297],
            [60, 0, 301],
            [60, 0, 306],
            [61, 0, 309],
            [61, 0, 330],
            [62, 0, 351],
            [62, 0, 368],
            [63, 0, 380],
            [63, 0, 414],
            [63, -1, 430],
            [64, -1, 472],
            [65, -1, 493],
            [65, -1, 526],
            [65, -1, 531],
            [65, -1, 543],
            [66, -1, 576],
            [67, -1, 605],
            [67, -1, 639],
            [67, -2, 647],
            [68, -2, 659],
            [69, -3, 689],
            [69, -3, 740],
            [69, -3, 742],
            [70, -3, 764],
            [70, -3, 805],
            [70, -4, 827],
            [71, -4, 842],
            [71, -4, 864],
            [71, -4, 928],
        ],
        [
            [-46, -31, 0],
            [0, 0, 0],
            [0, 0, 41],
            [2, 2, 166],
            [6, 4, 174],
            [14, 8, 184],
            [19, 9, 190],
            [23, 11, 199],
            [27, 12, 203],
            [27, 12, 207],
            [29, 13, 212],
            [33, 13, 220],
            [35, 13, 224],
            [38, 15, 233],
            [40, 15, 237],
            [41, 16, 247],
            [43, 16, 253],
            [45, 17, 262],
            [45, 17, 266],
            [47, 17, 274],
            [47, 18, 283],
            [48, 18, 287],
            [49, 18, 296],
            [49, 18, 307],
            [50, 18, 315],
            [51, 19, 324],
            [53, 19, 337],
            [53, 19, 345],
            [55, 19, 350],
            [55, 20, 358],
            [57, 20, 366],
            [58, 21, 371],
            [59, 21, 379],
            [59, 22, 392],
            [60, 22, 400],
            [60, 22, 412],
            [61, 22, 429],
            [62, 22, 483],
            [63, 22, 499],
            [63, 22, 532],
            [63, 22, 537],
            [64, 22, 562],
            [65, 22, 575],
            [67, 23, 582],
            [69, 23, 588],
            [71, 23, 596],
            [73, 24, 604],
            [73, 24, 608],
            [75, 24, 617],
            [75, 25, 624],
            [76, 25, 637],
            [77, 25, 667],
            [77, 25, 708],
            [78, 25, 833],
            [78, 25, 908],
            [78, 25, 912],
            [78, 25, 1041],
            [77, 25, 1059],
            [77, 25, 1088],
            [76, 25, 1149],
            [75, 25, 1203],
            [75, 25, 1241],
            [74, 25, 1255],
            [74, 24, 1287],
            [73, 24, 1295],
            [73, 24, 1405],
            [73, 24, 1413],
            [73, 24, 1494],
        ],
        [
            [-51, -30, 0],
            [0, 0, 0],
            [0, 0, 23],
            [0, 0, 32],
            [0, 0, 148],
            [3, 1, 190],
            [7, 4, 199],
            [13, 7, 208],
            [17, 9, 213],
            [21, 9, 217],
            [29, 12, 230],
            [32, 13, 238],
            [35, 14, 244],
            [36, 14, 252],
            [37, 15, 259],
            [37, 15, 264],
            [38, 15, 273],
            [39, 15, 289],
            [39, 15, 311],
            [41, 15, 330],
            [43, 15, 338],
            [46, 17, 343],
            [49, 17, 352],
            [53, 18, 356],
            [55, 19, 364],
            [57, 19, 371],
            [58, 20, 377],
            [59, 20, 384],
            [60, 20, 393],
            [61, 20, 398],
            [61, 20, 406],
            [62, 20, 435],
            [63, 20, 464],
            [63, 20, 484],
            [64, 20, 506],
            [65, 20, 519],
            [65, 20, 539],
            [65, 20, 547],
            [66, 20, 568],
            [67, 20, 590],
            [67, 20, 610],
            [68, 20, 631],
            [69, 20, 651],
            [69, 20, 665],
            [69, 20, 706],
            [70, 20, 732],
            [71, 20, 764],
            [71, 20, 838],
            [71, 20, 852],
            [72, 20, 860],
            [73, 20, 902],
            [73, 20, 960],
            [74, 20, 993],
            [74, 20, 1035],
            [74, 20, 1039],
            [74, 20, 1157],
            [74, 20, 1158],
        ],
        [
            [-15, -26, 0],
            [0, 0, 0],
            [0, 0, 2],
            [0, 0, 167],
            [2, 1, 209],
            [5, 1, 217],
            [8, 2, 226],
            [11, 2, 231],
            [13, 2, 239],
            [15, 3, 248],
            [15, 3, 251],
            [16, 3, 260],
            [17, 3, 268],
            [17, 3, 273],
            [18, 3, 302],
            [19, 3, 323],
            [19, 3, 373],
            [20, 3, 405],
            [20, 3, 409],
            [21, 3, 423],
            [23, 3, 435],
            [25, 4, 443],
            [27, 4, 447],
            [30, 4, 456],
            [33, 4, 464],
            [35, 5, 468],
            [37, 5, 477],
            [39, 5, 482],
            [39, 5, 489],
            [40, 5, 497],
            [40, 5, 502],
            [41, 5, 510],
            [41, 5, 527],
            [42, 5, 589],
            [43, 5, 598],
            [46, 5, 602],
            [47, 5, 611],
            [50, 7, 615],
            [53, 7, 622],
            [54, 7, 631],
            [56, 7, 635],
            [57, 7, 643],
            [57, 7, 656],
            [59, 7, 658],
            [59, 7, 681],
            [60, 7, 744],
            [61, 7, 790],
            [61, 7, 868],
            [63, 7, 898],
            [63, 7, 910],
            [63, 7, 931],
            [65, 7, 960],
            [66, 7, 965],
            [69, 7, 973],
            [71, 7, 980],
            [73, 7, 990],
            [75, 7, 993],
            [76, 7, 1002],
            [77, 7, 1006],
            [78, 7, 1015],
            [79, 7, 1035],
            [79, 7, 1098],
            [79, 7, 1158],
            [80, 7, 1198],
            [79, 7, 1373],
            [79, 7, 1378],
            [78, 7, 1387],
            [77, 7, 1391],
            [76, 7, 1402],
            [75, 7, 1406],
            [75, 7, 1423],
            [74, 7, 1435],
            [73, 7, 1490],
            [73, 7, 1503],
            [73, 7, 1660],
            [73, 7, 1668],
            [73, 7, 1912],
            [73, 7, 2002],
            [73, 7, 2161],
            [73, 7, 2411],
            [73, 7, 2503],
            [73, 7, 2661],
            [73, 7, 2819],
            [74, 7, 2912],
            [74, 7, 3008],
            [75, 7, 3049],
            [75, 7, 3101],
            [75, 6, 3121],
            [75, 6, 3167],
            [75, 6, 3413],
            [75, 6, 3445],
        ],
        [
            [-38, -41, 0],
            [0, 0, 0],
            [0, 0, 118],
            [1, 0, 184],
            [4, 2, 193],
            [8, 4, 201],
            [12, 6, 206],
            [15, 7, 213],
            [19, 9, 218],
            [25, 10, 226],
            [29, 11, 231],
            [32, 12, 239],
            [35, 13, 248],
            [37, 13, 256],
            [40, 13, 260],
            [41, 13, 268],
            [43, 13, 278],
            [45, 13, 280],
            [45, 13, 289],
            [46, 13, 298],
            [47, 14, 310],
            [47, 14, 331],
            [47, 14, 352],
            [48, 14, 372],
            [49, 14, 381],
            [51, 14, 389],
            [54, 15, 393],
            [56, 15, 402],
            [59, 16, 410],
            [61, 17, 414],
            [62, 17, 422],
            [62, 17, 426],
            [63, 17, 431],
            [64, 17, 435],
            [65, 17, 443],
            [65, 17, 472],
            [67, 17, 506],
            [67, 17, 535],
            [68, 17, 568],
            [69, 17, 606],
            [69, 17, 614],
            [69, 17, 624],
            [70, 17, 639],
            [71, 17, 672],
            [71, 17, 706],
            [72, 17, 718],
            [73, 17, 744],
            [73, 17, 764],
            [74, 17, 815],
            [74, 17, 831],
            [75, 17, 844],
            [75, 17, 865],
            [75, 17, 920],
            [76, 17, 956],
            [76, 17, 1089],
        ],
        [
            [-29, -29, 0],
            [0, 0, 0],
            [0, 0, 113],
            [9, 0, 204],
            [14, 0, 213],
            [21, 0, 217],
            [27, 0, 226],
            [34, 0, 234],
            [41, 0, 242],
            [45, 0, 247],
            [49, 0, 256],
            [53, 0, 259],
            [54, 0, 268],
            [55, 0, 276],
            [55, 0, 280],
            [56, 0, 289],
            [57, 0, 296],
            [57, 0, 309],
            [58, 0, 331],
            [59, 0, 359],
            [59, 0, 368],
            [61, 0, 372],
            [61, 0, 380],
            [62, 0, 385],
            [62, 0, 389],
            [64, 0, 393],
            [65, 0, 401],
            [65, 0, 409],
            [66, 0, 414],
            [67, 0, 444],
            [67, 0, 451],
            [67, 0, 464],
            [68, 0, 505],
            [68, 0, 602],
            [68, 0, 605],
            [69, 0, 622],
            [69, 0, 672],
            [70, 0, 710],
            [70, -1, 714],
            [71, -1, 731],
            [71, -1, 735],
            [72, -1, 751],
            [73, -1, 801],
            [73, -1, 847],
            [73, -1, 881],
            [74, -1, 927],
            [75, -1, 956],
            [75, -1, 961],
            [75, -1, 982],
            [76, -1, 1085],
            [76, -2, 1093],
            [77, -2, 1106],
            [77, -2, 1111],
            [77, -2, 1119],
            [77, -2, 1194],
        ],
        [
            [-51, -6, 0],
            [0, 0, 0],
            [0, 0, 46],
            [0, 0, 187],
            [3, 0, 196],
            [7, 0, 204],
            [13, 1, 212],
            [16, 1, 217],
            [20, 2, 226],
            [27, 3, 239],
            [30, 4, 246],
            [32, 4, 252],
            [35, 4, 260],
            [37, 5, 268],
            [40, 5, 273],
            [42, 6, 281],
            [44, 6, 289],
            [46, 6, 297],
            [47, 6, 302],
            [49, 7, 310],
            [50, 7, 317],
            [51, 7, 321],
            [51, 7, 338],
            [52, 7, 351],
            [52, 7, 368],
            [53, 7, 380],
            [54, 7, 384],
            [57, 7, 393],
            [57, 7, 401],
            [58, 7, 406],
            [59, 7, 464],
            [59, 7, 493],
            [60, 7, 510],
            [60, 7, 539],
            [61, 7, 563],
            [61, 7, 576],
            [62, 7, 580],
            [63, 7, 589],
            [64, 7, 597],
            [65, 7, 617],
            [65, 7, 638],
            [65, 7, 676],
            [66, 7, 680],
            [67, 7, 751],
            [67, 7, 822],
            [69, 7, 834],
            [69, 7, 839],
            [72, 7, 848],
            [73, 7, 855],
            [73, 7, 865],
            [74, 7, 868],
            [75, 7, 877],
            [75, 7, 889],
            [76, 7, 909],
            [76, 7, 1040],
            [77, 7, 1065],
            [77, 7, 1177],
            [77, 7, 1365],
            [77, 7, 1539],
            [77, 7, 1647],
        ],
        [
            [-41, -32, 0],
            [0, 0, 0],
            [0, 0, 72],
            [0, 0, 131],
            [4, 0, 222],
            [9, 1, 231],
            [16, 2, 238],
            [23, 2, 243],
            [29, 3, 247],
            [34, 3, 256],
            [39, 4, 260],
            [43, 4, 268],
            [45, 5, 276],
            [47, 5, 281],
            [49, 5, 290],
            [49, 5, 297],
            [50, 5, 305],
            [51, 5, 309],
            [51, 5, 314],
            [51, 5, 339],
            [52, 5, 372],
            [53, 5, 381],
            [55, 5, 385],
            [57, 5, 393],
            [60, 6, 402],
            [63, 6, 410],
            [64, 6, 414],
            [66, 6, 423],
            [67, 6, 432],
            [68, 6, 434],
            [69, 6, 443],
            [69, 6, 451],
            [70, 6, 472],
            [71, 6, 524],
            [71, 6, 535],
            [71, 6, 560],
            [72, 6, 623],
            [73, 6, 660],
            [73, 6, 702],
            [74, 6, 743],
            [75, 6, 752],
            [75, 6, 780],
            [76, 6, 806],
            [77, 6, 836],
            [77, 6, 864],
            [78, 6, 897],
            [79, 6, 956],
            [79, 6, 1005],
        ],
        [
            [-43, -32, 0],
            [0, 0, 0],
            [0, 0, 194],
            [3, 0, 235],
            [8, 0, 243],
            [13, 0, 252],
            [18, 0, 256],
            [22, 0, 260],
            [24, 0, 267],
            [27, 0, 274],
            [27, 0, 282],
            [28, 0, 288],
            [29, 0, 297],
            [29, 0, 301],
            [30, 0, 315],
            [31, 0, 339],
            [31, 0, 364],
            [33, 0, 373],
            [35, 0, 380],
            [37, 0, 385],
            [40, -1, 394],
            [41, -1, 402],
            [43, -1, 406],
            [45, -1, 414],
            [47, -2, 423],
            [49, -2, 428],
            [51, -2, 436],
            [51, -2, 440],
            [52, -2, 444],
            [53, -2, 452],
            [53, -2, 464],
            [54, -2, 494],
            [55, -2, 540],
            [55, -2, 560],
            [57, -2, 568],
            [59, -2, 577],
            [62, -2, 581],
            [63, -2, 589],
            [65, -2, 598],
            [67, -2, 606],
            [67, -2, 624],
            [68, -2, 648],
            [69, -2, 666],
            [69, -2, 702],
            [70, -2, 753],
            [70, -2, 761],
            [71, -2, 773],
            [71, -2, 840],
            [72, -2, 869],
            [73, -2, 890],
            [73, -3, 906],
            [74, -3, 948],
            [74, -3, 953],
            [75, -3, 982],
            [75, -3, 990],
            [75, -3, 1012],
            [76, -3, 1058],
            [77, -3, 1106],
            [77, -4, 1120],
            [77, -4, 1166],
            [77, -4, 1198],
            [78, -4, 1261],
            [79, -4, 1340],
            [79, -4, 1396],
        ],
        [
            [-38, -32, 0],
            [0, 0, 0],
            [0, 0, 67],
            [3, 1, 226],
            [6, 3, 234],
            [10, 5, 242],
            [14, 5, 246],
            [19, 7, 254],
            [23, 9, 262],
            [27, 9, 268],
            [31, 10, 276],
            [34, 11, 280],
            [37, 12, 288],
            [39, 12, 296],
            [42, 13, 306],
            [46, 14, 309],
            [49, 15, 317],
            [51, 15, 325],
            [55, 16, 329],
            [57, 17, 338],
            [60, 17, 347],
            [63, 17, 350],
            [66, 19, 358],
            [70, 19, 368],
            [73, 20, 373],
            [77, 20, 379],
            [81, 20, 389],
            [83, 21, 393],
            [86, 21, 400],
            [87, 21, 405],
            [88, 21, 414],
            [89, 21, 421],
            [89, 21, 434],
            [90, 21, 455],
            [91, 21, 547],
            [91, 21, 558],
            [91, 21, 563],
            [91, 21, 770],
            [91, 21, 882],
            [91, 21, 1080],
            [90, 21, 1105],
            [89, 21, 1134],
            [89, 21, 1198],
            [88, 21, 1235],
            [87, 19, 1239],
            [84, 17, 1248],
            [81, 15, 1255],
            [79, 13, 1260],
            [77, 12, 1268],
            [75, 11, 1276],
            [75, 11, 1280],
            [74, 10, 1288],
            [73, 10, 1297],
            [73, 9, 1309],
            [73, 9, 1384],
            [74, 9, 1554],
            [75, 9, 1569],
            [75, 9, 1576],
            [75, 9, 1584],
            [76, 9, 1603],
            [77, 9, 1616],
            [77, 9, 1640],
            [78, 9, 1660],
            [79, 9, 1681],
            [79, 9, 1723],
            [79, 9, 1772],
            [79, 9, 1879],
            [79, 9, 1956],
        ],
        [
            [-46, -19, 0],
            [0, 0, 0],
            [0, 0, 11],
            [0, 0, 192],
            [4, 1, 207],
            [13, 3, 215],
            [17, 5, 224],
            [21, 5, 232],
            [27, 7, 237],
            [32, 7, 245],
            [37, 7, 254],
            [43, 7, 257],
            [50, 7, 265],
            [55, 7, 274],
            [61, 7, 278],
            [67, 7, 287],
            [71, 7, 292],
            [75, 7, 299],
            [79, 7, 308],
            [81, 5, 316],
            [83, 5, 320],
            [85, 5, 328],
            [85, 5, 336],
            [86, 5, 341],
            [87, 5, 357],
            [87, 5, 380],
            [87, 5, 512],
            [87, 5, 707],
            [87, 5, 875],
            [87, 4, 942],
            [87, 3, 949],
            [86, 3, 957],
            [85, 3, 967],
            [83, 2, 970],
            [82, 1, 980],
            [81, 1, 987],
            [79, 1, 997],
            [78, -1, 1000],
            [77, -1, 1008],
            [77, -1, 1012],
            [77, -1, 1021],
            [77, -1, 1203],
            [77, -1, 1371],
            [77, -1, 1383],
            [78, -1, 1475],
            [78, -1, 1509],
            [79, -1, 1534],
            [79, -1, 1629],
            [79, -1, 1700],
            [79, -2, 1712],
            [80, -2, 1755],
            [80, -2, 1814],
        ],
        [
            [-33, -21, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 5],
            [7, 0, 238],
            [11, 1, 247],
            [15, 1, 256],
            [18, 1, 260],
            [22, 1, 267],
            [25, 1, 276],
            [27, 1, 280],
            [29, 1, 288],
            [31, 1, 297],
            [33, 1, 300],
            [35, 1, 310],
            [36, 1, 318],
            [37, 1, 322],
            [38, 1, 330],
            [39, 1, 339],
            [41, 1, 343],
            [42, 1, 350],
            [43, 1, 359],
            [46, 1, 364],
            [47, 1, 372],
            [50, 1, 380],
            [51, 1, 389],
            [54, 1, 393],
            [57, 1, 401],
            [60, 1, 405],
            [61, 1, 413],
            [64, 1, 422],
            [66, 1, 430],
            [67, 1, 434],
            [67, 1, 456],
            [67, 1, 497],
            [68, 1, 518],
            [69, 1, 581],
            [69, 1, 630],
            [70, 1, 647],
            [71, 1, 659],
            [71, 1, 710],
            [72, 1, 722],
            [72, 1, 731],
            [73, 1, 743],
            [73, 1, 756],
            [74, 1, 772],
            [75, 1, 801],
            [75, 1, 813],
            [75, 1, 822],
            [76, 1, 847],
            [77, 1, 868],
            [77, 1, 885],
            [78, 1, 918],
            [79, 1, 955],
            [79, 1, 972],
            [79, 1, 980],
            [79, 1, 1008],
            [79, 1, 1010],
            [80, 1, 1030],
            [81, 1, 1064],
            [81, 1, 1088],
            [82, 1, 1143],
            [83, 1, 1192],
            [83, 1, 1242],
            [83, 1, 1298],
            [83, 1, 1334],
            [83, 0, 1338],
            [84, 0, 1379],
            [83, 0, 1475],
            [83, 0, 1484],
            [82, 0, 1492],
            [81, 1, 1496],
            [81, 1, 1503],
        ],
        [
            [-42, -10, 0],
            [0, 0, 0],
            [0, 0, 9],
            [0, 0, 192],
            [3, 0, 208],
            [15, 2, 217],
            [20, 4, 226],
            [25, 4, 234],
            [31, 7, 238],
            [34, 7, 247],
            [37, 7, 254],
            [39, 7, 260],
            [41, 8, 268],
            [42, 8, 281],
            [43, 8, 305],
            [43, 8, 319],
            [43, 8, 323],
            [44, 8, 338],
            [47, 9, 348],
            [50, 9, 352],
            [54, 10, 359],
            [59, 11, 364],
            [66, 12, 372],
            [71, 12, 380],
            [77, 13, 384],
            [81, 14, 393],
            [85, 15, 401],
            [87, 15, 410],
            [89, 15, 414],
            [90, 15, 427],
            [91, 15, 443],
            [91, 15, 484],
            [91, 15, 510],
            [91, 15, 688],
            [91, 15, 697],
            [91, 15, 830],
            [86, 14, 938],
            [84, 13, 946],
            [83, 13, 951],
            [83, 13, 960],
            [82, 13, 968],
            [81, 13, 997],
            [81, 13, 1011],
            [81, 13, 1114],
            [81, 13, 1185],
            [81, 13, 1291],
        ],
        [
            [-34, -38, 0],
            [0, 0, 0],
            [0, 0, 14],
            [1, 0, 197],
            [4, 1, 204],
            [8, 2, 215],
            [11, 3, 221],
            [14, 4, 226],
            [17, 5, 237],
            [19, 5, 241],
            [21, 5, 245],
            [23, 5, 253],
            [24, 5, 262],
            [25, 6, 267],
            [26, 6, 274],
            [27, 6, 283],
            [29, 7, 291],
            [31, 7, 295],
            [33, 8, 303],
            [34, 8, 312],
            [35, 9, 316],
            [38, 9, 325],
            [40, 9, 329],
            [43, 11, 337],
            [45, 11, 346],
            [47, 11, 354],
            [49, 12, 359],
            [52, 13, 366],
            [53, 13, 376],
            [55, 13, 379],
            [57, 14, 387],
            [59, 14, 396],
            [61, 14, 400],
            [61, 14, 417],
            [62, 14, 421],
            [63, 14, 449],
            [63, 14, 458],
            [65, 15, 466],
            [67, 15, 470],
            [67, 15, 479],
            [68, 15, 487],
            [69, 15, 491],
            [71, 15, 500],
            [72, 15, 504],
            [73, 15, 513],
            [73, 15, 520],
            [74, 15, 550],
            [75, 15, 576],
            [75, 15, 603],
            [76, 15, 646],
            [76, 15, 692],
            [77, 15, 717],
            [77, 15, 780],
            [78, 15, 812],
            [79, 15, 833],
            [79, 15, 862],
            [80, 15, 892],
            [81, 15, 920],
            [81, 15, 962],
            [82, 15, 1012],
            [82, 15, 1017],
            [83, 15, 1100],
            [83, 15, 1173],
        ],
        [
            [-58, -30, 0],
            [0, 0, 0],
            [7, 0, 190],
            [17, 1, 199],
            [23, 3, 209],
            [30, 3, 212],
            [37, 4, 217],
            [40, 4, 225],
            [44, 4, 233],
            [45, 5, 241],
            [47, 5, 245],
            [48, 5, 255],
            [49, 5, 261],
            [49, 5, 275],
            [50, 5, 288],
            [51, 5, 303],
            [51, 5, 324],
            [52, 5, 345],
            [53, 5, 358],
            [53, 5, 371],
            [53, 5, 374],
            [55, 5, 378],
            [57, 5, 388],
            [59, 5, 395],
            [61, 5, 401],
            [63, 5, 408],
            [65, 5, 417],
            [68, 5, 420],
            [69, 5, 429],
            [72, 6, 438],
            [75, 6, 441],
            [77, 7, 450],
            [79, 7, 458],
            [81, 7, 463],
            [81, 7, 471],
            [82, 7, 479],
            [83, 7, 484],
            [83, 7, 492],
            [84, 7, 500],
            [85, 7, 503],
            [85, 7, 520],
            [86, 7, 534],
            [87, 7, 616],
            [87, 7, 645],
            [87, 7, 679],
            [87, 7, 878],
            [87, 7, 885],
        ],
        [
            [-31, -35, 0],
            [0, 0, 0],
            [0, 0, 54],
            [3, 1, 203],
            [7, 4, 212],
            [13, 6, 221],
            [18, 8, 228],
            [23, 11, 235],
            [29, 13, 238],
            [34, 14, 246],
            [39, 16, 255],
            [43, 17, 259],
            [47, 18, 269],
            [51, 19, 273],
            [54, 19, 280],
            [57, 21, 289],
            [59, 21, 296],
            [62, 22, 300],
            [63, 22, 310],
            [64, 23, 317],
            [66, 23, 322],
            [67, 23, 331],
            [67, 23, 350],
            [67, 23, 376],
            [68, 23, 385],
            [69, 23, 409],
            [69, 23, 450],
            [70, 23, 476],
            [71, 23, 493],
            [71, 23, 496],
            [73, 23, 506],
            [74, 25, 514],
            [75, 25, 522],
            [76, 25, 527],
            [77, 25, 539],
            [77, 25, 552],
            [77, 25, 555],
            [78, 25, 568],
            [79, 25, 606],
            [79, 25, 626],
            [80, 25, 652],
            [81, 25, 697],
            [81, 25, 722],
            [82, 25, 761],
            [83, 25, 797],
            [83, 25, 822],
            [84, 25, 847],
            [84, 25, 880],
            [85, 25, 894],
            [85, 25, 935],
            [86, 25, 973],
            [87, 25, 1013],
            [87, 25, 1047],
            [87, 25, 1051],
            [87, 25, 1222],
            [87, 25, 1277],
        ],
        [
            [-47, -33, 0],
            [0, 0, 0],
            [0, 0, 85],
            [0, 0, 275],
            [1, 0, 292],
            [1, 0, 318],
            [2, 0, 332],
            [3, 0, 360],
            [3, 0, 364],
            [5, 1, 372],
            [7, 1, 381],
            [11, 1, 385],
            [15, 1, 393],
            [17, 2, 402],
            [20, 3, 406],
            [24, 4, 414],
            [26, 4, 422],
            [28, 4, 430],
            [29, 5, 434],
            [31, 5, 443],
            [32, 5, 448],
            [33, 5, 455],
            [34, 5, 464],
            [35, 5, 472],
            [35, 5, 477],
            [35, 5, 481],
            [36, 5, 493],
            [37, 5, 519],
            [37, 5, 547],
            [39, 5, 556],
            [41, 7, 563],
            [43, 7, 568],
            [43, 7, 573],
            [45, 7, 577],
            [47, 7, 581],
            [49, 7, 589],
            [50, 7, 598],
            [53, 7, 606],
            [53, 7, 610],
            [54, 7, 618],
            [55, 7, 630],
            [55, 7, 653],
            [56, 7, 689],
            [57, 7, 730],
            [57, 8, 735],
            [59, 8, 744],
            [62, 9, 752],
            [65, 10, 760],
            [68, 11, 764],
            [71, 11, 773],
            [73, 11, 776],
            [76, 11, 785],
            [77, 12, 793],
            [79, 12, 802],
            [79, 13, 806],
            [81, 13, 814],
            [82, 13, 834],
            [83, 13, 868],
            [83, 13, 948],
            [84, 13, 989],
            [84, 13, 998],
            [85, 13, 1073],
            [85, 13, 1089],
            [85, 13, 1148],
            [86, 13, 1206],
            [86, 13, 1277],
            [87, 13, 1281],
            [87, 13, 1402],
            [87, 13, 1493],
            [88, 13, 1511],
            [88, 13, 1587],
            [89, 13, 1694],
            [89, 13, 1774],
            [89, 13, 1858],
        ],
        [
            [-56, -34, 0],
            [0, 0, 0],
            [0, 0, 68],
            [1, 0, 211],
            [3, 1, 219],
            [5, 1, 227],
            [8, 3, 231],
            [9, 3, 235],
            [11, 4, 244],
            [13, 4, 252],
            [15, 5, 257],
            [17, 6, 265],
            [19, 6, 270],
            [21, 7, 278],
            [23, 7, 286],
            [25, 8, 294],
            [27, 8, 299],
            [29, 9, 306],
            [32, 10, 311],
            [35, 11, 320],
            [37, 11, 328],
            [40, 12, 336],
            [43, 13, 340],
            [45, 13, 349],
            [48, 13, 353],
            [49, 13, 361],
            [51, 14, 370],
            [53, 14, 378],
            [53, 14, 382],
            [54, 14, 390],
            [54, 14, 394],
            [55, 14, 398],
            [55, 14, 419],
            [56, 14, 431],
            [57, 14, 461],
            [57, 15, 465],
            [59, 15, 474],
            [61, 16, 481],
            [63, 16, 486],
            [63, 17, 494],
            [65, 17, 503],
            [67, 17, 512],
            [67, 17, 515],
            [68, 17, 524],
            [69, 17, 528],
            [69, 17, 536],
            [69, 17, 565],
            [70, 17, 573],
            [71, 17, 607],
            [71, 17, 649],
            [72, 17, 683],
            [72, 17, 699],
            [73, 17, 711],
            [74, 18, 720],
            [77, 18, 729],
            [79, 19, 732],
            [80, 19, 740],
            [81, 19, 749],
            [82, 19, 753],
            [84, 19, 761],
            [85, 19, 770],
            [85, 19, 774],
            [86, 19, 782],
            [87, 19, 815],
            [87, 19, 853],
            [87, 19, 890],
            [88, 19, 924],
            [89, 19, 987],
            [89, 19, 1057],
            [89, 19, 1199],
            [89, 19, 1281],
        ],
        [
            [-45, -26, 0],
            [0, 0, 0],
            [0, 0, 125],
            [3, 1, 217],
            [11, 4, 225],
            [17, 6, 233],
            [24, 9, 242],
            [29, 9, 246],
            [33, 9, 254],
            [37, 10, 264],
            [40, 11, 268],
            [43, 11, 275],
            [44, 11, 280],
            [46, 12, 288],
            [47, 12, 296],
            [49, 12, 305],
            [49, 12, 308],
            [50, 13, 318],
            [51, 13, 325],
            [51, 13, 330],
            [51, 13, 338],
            [52, 13, 368],
            [53, 13, 379],
            [55, 13, 388],
            [56, 14, 393],
            [57, 14, 402],
            [59, 15, 409],
            [62, 16, 413],
            [63, 16, 422],
            [65, 17, 430],
            [67, 17, 435],
            [68, 17, 443],
            [69, 17, 450],
            [69, 17, 459],
            [70, 17, 463],
            [70, 17, 477],
            [71, 17, 493],
            [71, 17, 526],
            [71, 18, 534],
            [74, 18, 543],
            [77, 19, 547],
            [78, 19, 555],
            [80, 19, 563],
            [81, 19, 568],
            [82, 19, 584],
            [83, 19, 589],
            [83, 19, 604],
            [83, 19, 622],
            [84, 19, 646],
            [85, 19, 689],
            [85, 19, 751],
            [86, 19, 788],
            [86, 19, 826],
            [87, 19, 877],
            [87, 19, 935],
            [88, 19, 968],
            [88, 19, 981],
            [89, 19, 1030],
            [89, 19, 1101],
            [89, 19, 1118],
            [89, 19, 1180],
        ],
        [
            [-41, -13, 0],
            [0, 0, 0],
            [0, 0, 1],
            [0, 0, 204],
            [2, 0, 221],
            [5, 1, 230],
            [10, 3, 238],
            [13, 3, 247],
            [14, 3, 255],
            [15, 3, 260],
            [19, 5, 277],
            [19, 5, 282],
            [22, 5, 293],
            [23, 5, 294],
            [24, 5, 301],
            [27, 5, 309],
            [27, 5, 318],
            [29, 5, 322],
            [31, 6, 330],
            [32, 6, 338],
            [33, 6, 344],
            [34, 6, 351],
            [35, 7, 360],
            [36, 7, 368],
            [38, 7, 372],
            [39, 7, 381],
            [39, 7, 385],
            [41, 7, 393],
            [42, 7, 406],
            [43, 7, 414],
            [43, 7, 422],
            [45, 8, 431],
            [45, 8, 434],
            [46, 8, 443],
            [48, 8, 451],
            [49, 8, 455],
            [51, 8, 465],
            [52, 8, 472],
            [54, 8, 477],
            [55, 8, 484],
            [57, 9, 490],
            [59, 9, 496],
            [59, 9, 505],
            [59, 9, 510],
            [61, 9, 514],
            [61, 9, 523],
            [62, 9, 535],
            [63, 9, 539],
            [63, 9, 568],
            [64, 9, 609],
            [65, 9, 639],
            [65, 9, 660],
            [66, 9, 702],
            [66, 9, 710],
            [67, 9, 735],
            [67, 9, 756],
            [68, 9, 764],
            [69, 9, 777],
            [69, 9, 827],
            [70, 9, 843],
            [70, 9, 864],
            [71, 9, 868],
            [71, 9, 939],
            [71, 8, 969],
            [72, 8, 973],
            [75, 7, 981],
            [76, 7, 990],
            [79, 7, 994],
            [81, 6, 1001],
            [81, 6, 1006],
            [82, 6, 1010],
            [83, 6, 1015],
            [84, 5, 1023],
            [85, 5, 1030],
            [85, 5, 1036],
            [86, 5, 1102],
            [87, 5, 1151],
            [87, 5, 1205],
            [87, 5, 1326],
            [87, 5, 1348],
            [87, 5, 1360],
            [89, 4, 1513],
            [89, 4, 1627],
        ],
        [
            [-20, -13, 0],
            [0, 0, 0],
            [0, 0, 16],
            [0, 0, 153],
            [5, 1, 194],
            [17, 5, 203],
            [23, 6, 212],
            [32, 7, 219],
            [39, 8, 224],
            [45, 9, 233],
            [52, 11, 238],
            [55, 11, 250],
            [59, 11, 254],
            [63, 11, 261],
            [65, 11, 266],
            [67, 11, 275],
            [67, 11, 284],
            [68, 11, 287],
            [69, 11, 324],
            [69, 11, 338],
            [69, 11, 370],
            [70, 11, 378],
            [72, 11, 387],
            [74, 11, 392],
            [77, 11, 400],
            [81, 11, 408],
            [83, 11, 418],
            [86, 11, 420],
            [87, 11, 429],
            [88, 11, 437],
            [89, 11, 441],
            [89, 11, 461],
            [90, 11, 478],
            [91, 11, 482],
            [91, 11, 500],
            [91, 11, 511],
            [92, 11, 517],
            [93, 11, 574],
            [93, 11, 596],
            [94, 11, 611],
            [95, 11, 633],
            [95, 11, 647],
            [95, 11, 667],
            [96, 11, 707],
            [96, 11, 854],
            [96, 11, 1013],
            [96, 11, 1028],
            [96, 11, 1161],
            [95, 11, 1270],
            [95, 10, 1304],
            [95, 10, 1324],
            [95, 10, 1339],
            [94, 9, 1350],
            [93, 9, 1408],
            [93, 9, 1442],
            [93, 9, 1492],
            [93, 9, 1512],
            [93, 8, 1566],
            [92, 8, 1583],
            [92, 8, 1650],
            [91, 7, 1782],
            [91, 7, 1837],
            [91, 7, 1948],
        ],
        [
            [-26, -25, 0],
            [0, 0, 0],
            [0, 0, 33],
            [7, 1, 224],
            [13, 1, 233],
            [17, 1, 241],
            [21, 3, 249],
            [25, 3, 253],
            [27, 3, 262],
            [29, 4, 266],
            [31, 4, 274],
            [31, 4, 282],
            [32, 4, 287],
            [33, 4, 295],
            [33, 4, 307],
            [34, 4, 337],
            [34, 4, 345],
            [35, 5, 366],
            [37, 5, 374],
            [39, 5, 379],
            [41, 5, 387],
            [43, 6, 392],
            [45, 6, 401],
            [47, 7, 406],
            [49, 7, 416],
            [50, 7, 420],
            [52, 7, 429],
            [53, 7, 437],
            [54, 7, 441],
            [55, 7, 449],
            [55, 7, 457],
            [56, 7, 499],
            [57, 7, 512],
            [57, 7, 529],
            [57, 7, 540],
            [58, 8, 574],
            [59, 8, 582],
            [61, 8, 591],
            [63, 8, 596],
            [63, 8, 604],
            [65, 8, 612],
            [67, 9, 615],
            [69, 9, 624],
            [71, 9, 633],
            [73, 9, 637],
            [75, 9, 645],
            [76, 9, 653],
            [77, 9, 658],
            [77, 9, 668],
            [78, 9, 674],
            [79, 9, 737],
            [79, 9, 749],
            [79, 9, 812],
            [79, 9, 841],
            [80, 9, 849],
            [81, 9, 897],
            [81, 9, 933],
            [82, 9, 945],
            [83, 9, 966],
            [83, 9, 974],
            [84, 9, 995],
            [85, 9, 1017],
            [85, 9, 1024],
            [86, 9, 1028],
            [86, 9, 1033],
            [88, 9, 1037],
            [89, 9, 1046],
            [90, 9, 1049],
            [91, 9, 1059],
            [91, 9, 1071],
            [92, 9, 1087],
            [93, 9, 1113],
            [93, 8, 1121],
            [93, 8, 1133],
            [93, 8, 1246],
            [94, 8, 1254],
            [94, 8, 1342],
            [94, 8, 1535],
            [94, 8, 1750],
            [94, 8, 1841],
            [94, 8, 2027],
            [94, 8, 2259],
            [94, 8, 2341],
            [94, 8, 2382],
        ],
        [
            [-35, -26, 0],
            [0, 0, 0],
            [0, 0, 44],
            [0, 0, 169],
            [3, 1, 202],
            [15, 5, 211],
            [23, 7, 221],
            [30, 8, 226],
            [38, 9, 234],
            [45, 11, 243],
            [50, 11, 246],
            [59, 11, 262],
            [61, 12, 270],
            [64, 12, 282],
            [65, 12, 294],
            [66, 12, 338],
            [66, 12, 352],
            [67, 12, 367],
            [70, 12, 371],
            [72, 13, 380],
            [75, 13, 389],
            [76, 13, 393],
            [77, 13, 401],
            [79, 13, 409],
            [80, 13, 413],
            [81, 13, 430],
            [81, 13, 459],
            [82, 13, 472],
            [83, 13, 500],
            [83, 13, 525],
            [83, 13, 539],
            [83, 13, 543],
            [84, 13, 554],
            [85, 13, 589],
            [85, 13, 602],
            [86, 13, 625],
            [87, 13, 659],
            [87, 13, 667],
            [87, 13, 680],
            [88, 13, 714],
            [89, 13, 743],
            [89, 13, 763],
            [90, 13, 805],
            [91, 13, 842],
            [91, 13, 851],
            [91, 13, 871],
            [92, 13, 896],
            [93, 13, 961],
            [93, 13, 1004],
            [93, 13, 1039],
            [94, 13, 1071],
            [94, 13, 1113],
            [95, 13, 1151],
            [95, 13, 1164],
            [95, 13, 1222],
            [95, 13, 1350],
            [95, 13, 1378],
            [95, 13, 1382],
        ],
        [
            [-53, -20, 0],
            [0, 0, 0],
            [3, 0, 181],
            [12, 0, 190],
            [16, 0, 198],
            [19, 0, 207],
            [22, 0, 210],
            [25, 0, 219],
            [27, 1, 228],
            [29, 1, 232],
            [31, 1, 240],
            [33, 1, 249],
            [35, 2, 253],
            [36, 2, 261],
            [39, 2, 266],
            [40, 3, 273],
            [42, 3, 282],
            [44, 3, 290],
            [47, 3, 299],
            [49, 3, 303],
            [51, 5, 311],
            [53, 5, 315],
            [56, 5, 323],
            [59, 5, 332],
            [61, 6, 336],
            [64, 6, 344],
            [64, 6, 348],
            [67, 6, 353],
            [68, 6, 358],
            [70, 7, 366],
            [71, 7, 370],
            [73, 7, 378],
            [73, 7, 386],
            [74, 7, 395],
            [75, 7, 398],
            [76, 7, 423],
            [77, 7, 469],
            [77, 7, 487],
            [78, 7, 498],
            [79, 7, 511],
            [79, 7, 548],
            [80, 7, 582],
            [81, 7, 612],
            [81, 7, 624],
            [82, 7, 641],
            [83, 7, 665],
            [83, 7, 690],
            [83, 7, 708],
            [84, 7, 720],
            [85, 7, 745],
            [85, 7, 770],
            [86, 7, 816],
            [87, 7, 828],
            [87, 7, 840],
            [87, 7, 845],
            [88, 7, 883],
            [89, 7, 920],
            [89, 7, 940],
            [90, 7, 987],
            [90, 6, 994],
            [91, 6, 1113],
            [91, 6, 1191],
            [91, 6, 1242],
            [91, 5, 1261],
            [92, 5, 1308],
            [93, 5, 1358],
            [93, 5, 1389],
            [93, 4, 1400],
            [94, 4, 1429],
            [95, 4, 1459],
            [95, 4, 1500],
            [95, 3, 1530],
            [95, 3, 1534],
            [96, 3, 1630],
            [96, 3, 1655],
            [96, 3, 1700],
            [96, 3, 1705],
            [96, 3, 1753],
        ],
        [
            [-40, -26, 0],
            [0, 0, 0],
            [0, 0, 165],
            [4, 0, 198],
            [9, 1, 206],
            [16, 3, 215],
            [23, 3, 219],
            [31, 5, 224],
            [38, 5, 232],
            [43, 5, 240],
            [46, 5, 245],
            [50, 5, 253],
            [53, 5, 261],
            [54, 5, 266],
            [55, 5, 274],
            [56, 5, 282],
            [58, 5, 286],
            [59, 6, 296],
            [59, 6, 303],
            [61, 6, 307],
            [61, 7, 316],
            [62, 7, 324],
            [63, 7, 328],
            [65, 8, 336],
            [67, 8, 345],
            [68, 9, 353],
            [71, 9, 357],
            [73, 9, 366],
            [76, 11, 375],
            [80, 12, 378],
            [82, 12, 386],
            [84, 13, 395],
            [85, 13, 399],
            [87, 13, 408],
            [87, 13, 420],
            [89, 13, 433],
            [89, 13, 454],
            [89, 14, 508],
            [90, 14, 517],
            [91, 14, 553],
            [91, 14, 616],
            [92, 14, 624],
            [93, 14, 638],
            [93, 14, 657],
            [93, 14, 661],
            [93, 14, 699],
            [94, 14, 729],
            [95, 14, 750],
            [95, 14, 792],
            [95, 14, 812],
            [96, 14, 841],
            [97, 14, 862],
            [97, 14, 954],
            [97, 14, 997],
        ],
        [
            [-48, -10, 0],
            [0, 0, 0],
            [0, 0, 76],
            [4, 1, 176],
            [9, 2, 184],
            [16, 4, 193],
            [28, 6, 205],
            [34, 6, 213],
            [41, 7, 218],
            [47, 7, 231],
            [54, 7, 233],
            [59, 7, 243],
            [64, 7, 247],
            [67, 7, 254],
            [71, 7, 259],
            [75, 7, 268],
            [77, 7, 276],
            [80, 7, 280],
            [81, 7, 289],
            [83, 7, 297],
            [83, 7, 305],
            [85, 7, 309],
            [86, 7, 318],
            [87, 7, 322],
            [87, 7, 330],
            [88, 7, 338],
            [89, 7, 346],
            [90, 7, 351],
            [91, 7, 364],
            [91, 7, 381],
            [92, 7, 409],
            [92, 7, 440],
            [93, 7, 500],
            [93, 7, 555],
            [93, 7, 559],
            [94, 7, 626],
            [95, 7, 668],
            [95, 7, 697],
            [96, 7, 717],
            [96, 7, 738],
            [97, 7, 742],
            [97, 7, 771],
            [97, 7, 893],
        ],
        [
            [-32, -14, 0],
            [0, 0, 0],
            [0, 0, 94],
            [3, 0, 195],
            [7, 1, 203],
            [15, 3, 212],
            [19, 3, 219],
            [21, 3, 225],
            [24, 4, 233],
            [28, 5, 246],
            [30, 5, 253],
            [31, 6, 261],
            [34, 7, 270],
            [37, 7, 274],
            [39, 7, 282],
            [43, 9, 290],
            [45, 9, 296],
            [49, 10, 304],
            [52, 10, 312],
            [53, 11, 316],
            [56, 12, 324],
            [57, 12, 329],
            [60, 12, 338],
            [62, 13, 346],
            [63, 13, 354],
            [65, 13, 358],
            [67, 13, 365],
            [69, 13, 374],
            [71, 13, 379],
            [73, 15, 387],
            [73, 15, 391],
            [75, 15, 395],
            [76, 15, 400],
            [78, 15, 409],
            [79, 15, 425],
            [79, 15, 449],
            [80, 15, 511],
            [81, 15, 570],
            [82, 15, 575],
            [83, 15, 583],
            [85, 15, 591],
            [85, 15, 597],
            [86, 15, 604],
            [87, 15, 617],
            [87, 15, 624],
            [88, 16, 641],
            [89, 16, 645],
            [91, 16, 655],
            [93, 17, 659],
            [94, 17, 666],
            [95, 17, 682],
            [95, 17, 695],
            [96, 17, 716],
            [97, 17, 749],
            [97, 17, 771],
            [97, 17, 842],
            [97, 17, 908],
            [97, 17, 970],
        ],
        [
            [-41, -45, 0],
            [0, 0, 0],
            [0, 0, 13],
            [0, 0, 205],
            [2, 0, 230],
            [5, 0, 238],
            [9, 1, 246],
            [12, 1, 251],
            [15, 1, 259],
            [17, 1, 263],
            [19, 1, 272],
            [20, 1, 280],
            [21, 1, 284],
            [21, 1, 293],
            [23, 1, 301],
            [23, 1, 305],
            [24, 1, 314],
            [25, 1, 318],
            [26, 1, 326],
            [29, 3, 335],
            [30, 3, 343],
            [32, 3, 347],
            [34, 3, 356],
            [38, 3, 361],
            [41, 3, 368],
            [44, 3, 377],
            [47, 3, 385],
            [49, 3, 389],
            [53, 3, 397],
            [55, 3, 405],
            [56, 3, 409],
            [57, 3, 418],
            [57, 3, 427],
            [58, 3, 431],
            [58, 3, 451],
            [58, 3, 455],
            [59, 3, 460],
            [59, 3, 522],
            [60, 3, 539],
            [61, 3, 580],
            [61, 3, 630],
            [64, 3, 635],
            [66, 3, 643],
            [71, 2, 647],
            [74, 2, 655],
            [77, 2, 664],
            [80, 1, 668],
            [83, 1, 677],
            [84, 1, 685],
            [85, 1, 693],
            [86, 1, 697],
            [86, 1, 701],
            [87, 1, 706],
            [87, 1, 718],
            [88, 1, 747],
            [88, 1, 764],
            [89, 1, 818],
            [90, 1, 852],
            [91, 1, 872],
            [91, 1, 914],
            [91, 1, 952],
            [92, 0, 973],
            [93, -1, 1019],
            [93, -1, 1060],
            [94, -1, 1118],
            [94, -1, 1151],
            [94, -1, 1194],
            [95, -1, 1230],
            [95, -1, 1277],
            [95, -2, 1301],
            [95, -2, 1313],
            [95, -3, 1425],
            [95, -3, 1461],
            [96, -3, 1477],
            [97, -3, 1540],
            [97, -3, 1573],
            [98, -3, 1644],
            [98, -4, 1672],
            [98, -4, 1703],
            [99, -4, 1715],
            [99, -5, 1727],
            [99, -5, 1768],
            [99, -5, 1831],
            [99, -5, 1917],
        ],
        [
            [-35, -28, 0],
            [0, 0, 0],
            [0, 0, 154],
            [0, 0, 163],
            [5, 0, 221],
            [9, 0, 230],
            [16, 0, 238],
            [21, 0, 242],
            [26, 0, 250],
            [31, 0, 254],
            [34, 0, 263],
            [38, 0, 268],
            [41, 0, 276],
            [43, 0, 284],
            [45, 0, 288],
            [46, 0, 296],
            [47, 0, 305],
            [47, 0, 309],
            [48, 0, 326],
            [49, 0, 367],
            [49, 0, 376],
            [52, 0, 380],
            [54, 0, 388],
            [57, 0, 397],
            [61, 0, 400],
            [63, 1, 409],
            [66, 1, 417],
            [68, 1, 422],
            [71, 1, 429],
            [73, 1, 438],
            [75, 1, 442],
            [75, 1, 450],
            [77, 1, 459],
            [77, 1, 463],
            [78, 1, 467],
            [79, 1, 501],
            [79, 1, 526],
            [80, 1, 571],
            [81, 1, 596],
            [81, 1, 613],
            [83, 1, 618],
            [84, 1, 626],
            [85, 1, 634],
            [87, 1, 647],
            [87, 1, 658],
            [88, 1, 688],
            [89, 1, 730],
            [89, 1, 755],
            [90, 1, 801],
            [91, 1, 834],
            [91, 1, 864],
            [92, 1, 893],
            [93, 1, 917],
            [93, 1, 939],
            [93, 1, 959],
            [94, 1, 968],
            [95, 1, 984],
            [95, 1, 1009],
            [96, 1, 1025],
            [97, 1, 1046],
            [97, 1, 1079],
            [98, 1, 1121],
            [99, 1, 1158],
            [99, 1, 1162],
            [99, 0, 1221],
            [99, 0, 1334],
        ],
        [
            [-34, -36, 0],
            [0, 0, 0],
            [0, 0, 11],
            [0, 0, 164],
            [0, 0, 174],
            [4, 0, 189],
            [9, 1, 199],
            [18, 3, 206],
            [26, 3, 211],
            [33, 5, 219],
            [39, 5, 227],
            [45, 6, 231],
            [49, 6, 240],
            [53, 7, 244],
            [57, 7, 252],
            [59, 7, 262],
            [61, 7, 270],
            [61, 7, 273],
            [62, 7, 282],
            [63, 7, 286],
            [63, 7, 295],
            [64, 7, 323],
            [65, 7, 345],
            [65, 7, 366],
            [68, 7, 373],
            [71, 7, 378],
            [75, 9, 386],
            [80, 9, 391],
            [83, 9, 399],
            [85, 10, 406],
            [85, 10, 411],
            [87, 10, 415],
            [89, 10, 420],
            [89, 10, 427],
            [90, 10, 437],
            [91, 10, 448],
            [91, 10, 477],
            [91, 10, 503],
            [92, 10, 511],
            [93, 10, 541],
            [93, 10, 591],
            [94, 10, 624],
            [94, 10, 674],
            [95, 10, 694],
            [95, 10, 745],
            [96, 10, 840],
            [97, 10, 878],
            [97, 10, 915],
            [97, 10, 953],
            [98, 10, 973],
            [98, 10, 1011],
            [99, 10, 1016],
            [99, 9, 1065],
            [99, 9, 1150],
        ],
        [
            [-45, -34, 0],
            [0, 0, 0],
            [0, 0, 13],
            [0, 0, 196],
            [1, 0, 237],
            [7, 0, 245],
            [9, 0, 254],
            [11, 0, 258],
            [11, 0, 266],
            [12, 0, 275],
            [13, 0, 279],
            [13, 0, 296],
            [14, 0, 308],
            [15, 0, 365],
            [15, 0, 373],
            [18, 0, 377],
            [21, 0, 387],
            [24, 0, 391],
            [27, 0, 401],
            [31, 0, 409],
            [35, 0, 413],
            [39, 0, 421],
            [42, 0, 429],
            [45, 0, 434],
            [49, 1, 442],
            [52, 1, 447],
            [55, 1, 454],
            [58, 1, 463],
            [59, 1, 472],
            [60, 1, 476],
            [61, 1, 484],
            [61, 1, 492],
            [61, 1, 501],
            [62, 1, 513],
            [63, 1, 587],
            [65, 1, 597],
            [66, 1, 601],
            [67, 1, 609],
            [68, 1, 625],
            [69, 1, 680],
            [69, 1, 688],
            [69, 1, 692],
            [69, 1, 729],
            [70, 1, 742],
            [71, 1, 792],
            [71, 1, 801],
            [74, 1, 805],
            [77, 1, 813],
            [78, 1, 817],
            [79, 1, 825],
            [81, 1, 834],
            [83, 1, 843],
            [83, 1, 847],
            [84, 1, 856],
            [85, 1, 864],
            [85, 1, 909],
            [85, 1, 916],
            [86, 1, 959],
            [86, 1, 1001],
            [87, 1, 1029],
            [87, 1, 1114],
            [88, 1, 1147],
            [89, 1, 1189],
            [89, 1, 1214],
            [90, 1, 1240],
            [91, 1, 1267],
            [91, 1, 1275],
            [91, 1, 1288],
            [92, 1, 1330],
            [93, 1, 1380],
            [93, 1, 1404],
            [93, 1, 1451],
            [93, 1, 1494],
            [94, 1, 1555],
            [95, 1, 1589],
            [95, 1, 1622],
            [95, 0, 1639],
            [96, 0, 1664],
            [96, 0, 1684],
            [96, -1, 1714],
            [97, -1, 1755],
            [97, -1, 1798],
            [97, -1, 1806],
            [97, -1, 1898],
            [98, -1, 1926],
            [98, -1, 1997],
            [98, -2, 2023],
            [99, -2, 2080],
            [99, -2, 2185],
            [99, -2, 2193],
            [99, -2, 2305],
        ],
        [
            [-43, -28, 0],
            [0, 0, 0],
            [0, 0, 184],
            [3, 0, 193],
            [7, 2, 201],
            [14, 5, 209],
            [19, 6, 218],
            [23, 7, 226],
            [27, 8, 230],
            [29, 9, 239],
            [33, 9, 247],
            [35, 9, 252],
            [36, 9, 260],
            [38, 11, 268],
            [39, 11, 272],
            [42, 11, 280],
            [43, 11, 288],
            [46, 11, 293],
            [47, 12, 301],
            [49, 12, 309],
            [52, 12, 314],
            [53, 12, 322],
            [55, 13, 327],
            [55, 13, 331],
            [57, 13, 335],
            [58, 13, 343],
            [59, 13, 351],
            [60, 13, 355],
            [61, 13, 364],
            [61, 13, 385],
            [62, 13, 414],
            [63, 13, 456],
            [65, 15, 468],
            [65, 15, 472],
            [67, 15, 476],
            [69, 16, 485],
            [71, 17, 488],
            [73, 18, 498],
            [75, 19, 505],
            [77, 19, 510],
            [80, 19, 518],
            [81, 20, 527],
            [83, 20, 530],
            [85, 21, 539],
            [86, 21, 547],
            [87, 21, 565],
            [88, 22, 568],
            [90, 22, 572],
            [91, 22, 580],
            [91, 23, 588],
            [93, 23, 593],
            [94, 23, 601],
            [95, 23, 609],
            [96, 23, 615],
            [98, 23, 622],
            [99, 23, 631],
            [100, 23, 636],
            [101, 23, 652],
            [101, 23, 677],
            [101, 23, 681],
            [102, 23, 727],
            [102, 23, 830],
            [102, 23, 981],
            [102, 23, 1174],
            [102, 23, 1341],
            [102, 23, 1485],
            [102, 23, 1685],
            [102, 23, 1702],
            [101, 23, 1714],
            [101, 22, 1722],
            [101, 22, 1735],
            [101, 21, 1743],
            [100, 21, 1793],
            [100, 21, 1829],
            [100, 20, 1882],
            [99, 20, 1898],
            [99, 19, 1919],
            [99, 19, 1961],
            [99, 19, 2002],
            [99, 18, 2052],
            [99, 17, 2136],
            [99, 17, 2187],
            [99, 17, 2348],
            [99, 17, 2437],
        ],
        [
            [-21, -9, 0],
            [0, 0, 0],
            [0, 0, 120],
            [5, 0, 187],
            [25, 4, 197],
            [33, 5, 204],
            [42, 5, 212],
            [51, 5, 221],
            [59, 6, 228],
            [67, 6, 231],
            [71, 6, 241],
            [77, 6, 248],
            [80, 6, 252],
            [82, 6, 258],
            [83, 6, 268],
            [84, 6, 273],
            [84, 6, 277],
            [85, 6, 281],
            [85, 6, 319],
            [86, 6, 352],
            [87, 6, 394],
            [87, 6, 407],
            [88, 6, 420],
            [88, 6, 440],
            [89, 6, 456],
            [89, 6, 490],
            [90, 6, 498],
            [91, 6, 531],
            [91, 6, 569],
            [92, 6, 594],
            [93, 6, 615],
            [93, 6, 640],
            [94, 6, 686],
            [95, 6, 714],
            [95, 6, 728],
            [96, 6, 786],
            [96, 5, 799],
            [97, 5, 827],
            [98, 5, 889],
            [98, 5, 940],
            [99, 5, 944],
            [99, 5, 968],
            [99, 5, 972],
            [100, 5, 1024],
            [100, 5, 1109],
            [100, 5, 1109],
        ],
        [
            [-40, -21, 0],
            [0, 0, 0],
            [3, 0, 224],
            [8, 0, 231],
            [15, -1, 239],
            [19, -1, 248],
            [21, -1, 252],
            [21, -1, 256],
            [23, -1, 259],
            [25, -1, 269],
            [25, -1, 273],
            [26, -1, 281],
            [27, -1, 298],
            [27, -1, 310],
            [27, -1, 314],
            [28, -1, 339],
            [30, -1, 343],
            [32, -1, 352],
            [34, -1, 360],
            [37, -1, 364],
            [39, -1, 373],
            [43, -1, 381],
            [47, -1, 385],
            [50, -1, 394],
            [54, -1, 402],
            [56, -1, 406],
            [59, -1, 415],
            [61, -2, 423],
            [61, -2, 427],
            [62, -2, 443],
            [63, -2, 469],
            [63, -2, 490],
            [63, -2, 519],
            [64, -2, 589],
            [65, -2, 630],
            [65, -2, 638],
            [67, -3, 646],
            [68, -3, 651],
            [70, -3, 659],
            [71, -3, 668],
            [72, -3, 672],
            [73, -3, 680],
            [75, -3, 689],
            [77, -3, 693],
            [77, -3, 700],
            [79, -4, 709],
            [81, -4, 717],
            [81, -4, 722],
            [82, -5, 730],
            [83, -5, 738],
            [83, -5, 751],
            [84, -5, 800],
            [84, -5, 813],
            [85, -5, 848],
            [85, -5, 863],
            [85, -5, 884],
            [86, -5, 926],
            [87, -6, 939],
            [87, -6, 947],
            [89, -6, 955],
            [90, -7, 960],
            [92, -7, 968],
            [95, -8, 976],
            [96, -9, 981],
            [97, -9, 988],
            [97, -9, 993],
            [99, -9, 996],
            [100, -9, 1001],
            [101, -9, 1009],
            [101, -9, 1039],
            [101, -9, 1262],
            [101, -9, 1319],
            [101, -9, 1502],
            [101, -9, 1511],
            [101, -9, 1725],
        ],
        [
            [-41, -16, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 201],
            [11, 0, 225],
            [17, 0, 234],
            [22, 0, 242],
            [29, 1, 246],
            [34, 1, 255],
            [37, 1, 263],
            [40, 1, 267],
            [43, 1, 275],
            [44, 1, 284],
            [47, 1, 288],
            [48, 1, 296],
            [49, 1, 304],
            [51, 1, 309],
            [52, 1, 318],
            [54, 1, 334],
            [55, 1, 338],
            [58, 1, 347],
            [61, 2, 354],
            [63, 2, 359],
            [66, 2, 367],
            [69, 3, 372],
            [72, 3, 380],
            [75, 4, 388],
            [77, 4, 397],
            [80, 4, 400],
            [81, 4, 409],
            [83, 4, 417],
            [84, 4, 421],
            [85, 4, 430],
            [85, 4, 438],
            [85, 4, 480],
            [85, 4, 500],
            [86, 4, 513],
            [87, 4, 526],
            [87, 4, 567],
            [88, 4, 609],
            [89, 4, 626],
            [90, 4, 634],
            [93, 4, 638],
            [95, 3, 647],
            [97, 3, 656],
            [98, 2, 659],
            [100, 2, 667],
            [101, 2, 675],
            [101, 2, 684],
            [102, 2, 689],
            [103, 2, 709],
            [103, 2, 742],
            [104, 2, 781],
            [104, 1, 809],
            [105, 1, 848],
            [105, 1, 876],
            [105, 1, 934],
            [106, 1, 939],
            [106, 1, 967],
            [107, 1, 981],
            [107, 1, 997],
            [106, 1, 1109],
            [105, 1, 1130],
            [105, 1, 1148],
            [104, 1, 1176],
            [104, 1, 1199],
            [103, 1, 1214],
            [103, 1, 1236],
            [102, 1, 1248],
            [101, 1, 1276],
            [101, 1, 1297],
            [101, 1, 1447],
            [101, 1, 1510],
            [101, 1, 1558],
        ],
        [
            [-45, -30, 0],
            [0, 0, 0],
            [0, 0, 9],
            [0, 0, 189],
            [3, 0, 272],
            [13, 2, 281],
            [19, 5, 289],
            [23, 5, 297],
            [27, 7, 301],
            [31, 7, 310],
            [33, 7, 315],
            [36, 7, 322],
            [38, 8, 331],
            [39, 8, 336],
            [40, 8, 343],
            [41, 8, 351],
            [41, 8, 373],
            [42, 8, 394],
            [42, 8, 414],
            [43, 8, 427],
            [45, 9, 465],
            [47, 9, 472],
            [50, 10, 477],
            [53, 10, 485],
            [55, 11, 494],
            [59, 11, 498],
            [59, 11, 502],
            [62, 11, 507],
            [65, 13, 515],
            [69, 13, 519],
            [73, 13, 527],
            [76, 13, 535],
            [79, 13, 539],
            [81, 13, 548],
            [83, 13, 552],
            [85, 14, 560],
            [86, 14, 569],
            [87, 14, 577],
            [87, 14, 581],
            [88, 14, 610],
            [88, 14, 673],
            [88, 14, 678],
            [89, 14, 727],
            [89, 14, 752],
            [90, 14, 798],
            [91, 14, 833],
            [91, 14, 848],
            [92, 14, 881],
            [93, 14, 911],
            [93, 14, 928],
            [94, 14, 953],
            [95, 14, 973],
            [95, 14, 1003],
            [96, 14, 1007],
            [97, 14, 1057],
            [97, 14, 1156],
            [97, 14, 1178],
            [98, 14, 1249],
            [99, 14, 1337],
            [99, 14, 1406],
            [99, 13, 1436],
            [99, 13, 1515],
            [100, 13, 1528],
            [101, 13, 1591],
            [101, 13, 1673],
            [101, 13, 1682],
            [101, 13, 1715],
            [101, 12, 1786],
            [101, 12, 1879],
        ],
        [
            [-40, -39, 0],
            [0, 0, 0],
            [0, 0, 181],
            [4, 1, 206],
            [9, 2, 214],
            [16, 3, 223],
            [21, 4, 227],
            [28, 5, 236],
            [31, 5, 239],
            [35, 6, 247],
            [37, 6, 253],
            [39, 6, 261],
            [41, 7, 269],
            [42, 7, 274],
            [43, 7, 281],
            [43, 7, 289],
            [44, 7, 311],
            [45, 7, 340],
            [45, 7, 343],
            [47, 7, 353],
            [51, 9, 361],
            [55, 9, 365],
            [58, 9, 373],
            [62, 10, 382],
            [65, 11, 386],
            [69, 12, 394],
            [75, 13, 403],
            [77, 13, 407],
            [79, 14, 415],
            [82, 14, 423],
            [84, 15, 428],
            [85, 15, 436],
            [85, 15, 444],
            [86, 15, 453],
            [87, 15, 494],
            [87, 15, 519],
            [88, 15, 536],
            [90, 15, 540],
            [92, 15, 549],
            [93, 16, 556],
            [94, 16, 561],
            [95, 16, 570],
            [95, 16, 590],
            [96, 16, 631],
            [96, 16, 669],
            [97, 16, 711],
            [97, 16, 744],
            [97, 16, 765],
            [97, 17, 828],
            [98, 17, 836],
            [99, 17, 857],
            [99, 17, 890],
            [100, 17, 952],
            [101, 17, 974],
            [101, 17, 1019],
            [102, 17, 1115],
            [102, 17, 1169],
            [102, 17, 1208],
        ],
        [
            [-38, -16, 0],
            [0, 0, 0],
            [0, 0, 71],
            [0, 0, 136],
            [3, 0, 263],
            [5, 0, 270],
            [9, 1, 279],
            [12, 1, 283],
            [14, 1, 292],
            [17, 1, 295],
            [19, 1, 304],
            [21, 1, 313],
            [21, 1, 317],
            [21, 1, 321],
            [23, 1, 325],
            [23, 1, 346],
            [24, 1, 408],
            [25, 1, 420],
            [25, 1, 429],
            [27, 1, 438],
            [29, 1, 442],
            [33, 1, 450],
            [35, 1, 458],
            [38, 1, 462],
            [42, 1, 471],
            [43, 1, 479],
            [47, 1, 484],
            [49, 1, 492],
            [51, 1, 500],
            [54, 1, 504],
            [55, 1, 513],
            [56, 1, 526],
            [57, 1, 534],
            [57, 1, 542],
            [57, 1, 571],
            [58, 1, 596],
            [59, 1, 634],
            [61, 1, 638],
            [63, 1, 646],
            [66, 1, 654],
            [69, 1, 662],
            [71, 1, 667],
            [73, 1, 676],
            [75, 1, 679],
            [78, 1, 687],
            [79, -1, 696],
            [80, -1, 701],
            [81, -1, 708],
            [81, -1, 721],
            [82, -1, 771],
            [82, -1, 813],
            [82, -1, 820],
            [83, -1, 829],
            [83, -1, 871],
            [84, -1, 875],
            [87, -1, 884],
            [88, -1, 892],
            [91, -1, 901],
            [92, -1, 905],
            [95, -2, 914],
            [96, -2, 917],
            [98, -2, 926],
            [99, -2, 933],
            [99, -2, 937],
            [100, -2, 946],
            [100, -3, 954],
            [101, -3, 967],
            [101, -3, 988],
            [102, -3, 1051],
            [102, -3, 1067],
            [102, -3, 1129],
            [103, -3, 1151],
            [103, -3, 1180],
            [103, -3, 1321],
            [103, -3, 1397],
        ],
        [
            [-39, -26, 0],
            [0, 0, 0],
            [0, 0, 1],
            [0, 0, 115],
            [1, 0, 182],
            [13, 5, 190],
            [20, 6, 198],
            [29, 8, 207],
            [35, 9, 211],
            [42, 9, 219],
            [49, 11, 228],
            [53, 11, 232],
            [56, 11, 241],
            [57, 11, 248],
            [60, 11, 253],
            [61, 11, 262],
            [61, 11, 270],
            [62, 11, 291],
            [62, 11, 307],
            [63, 11, 340],
            [63, 11, 357],
            [64, 12, 365],
            [67, 12, 374],
            [68, 13, 379],
            [69, 13, 387],
            [70, 13, 395],
            [71, 13, 403],
            [72, 13, 407],
            [73, 13, 445],
            [73, 13, 449],
            [74, 13, 457],
            [76, 13, 462],
            [79, 13, 469],
            [81, 13, 478],
            [83, 13, 487],
            [84, 13, 492],
            [85, 13, 499],
            [85, 13, 512],
            [86, 13, 528],
            [87, 13, 556],
            [87, 13, 599],
            [88, 13, 623],
            [90, 13, 632],
            [91, 13, 637],
            [94, 13, 645],
            [95, 13, 653],
            [97, 13, 658],
            [99, 13, 666],
            [99, 13, 674],
            [101, 13, 679],
            [101, 13, 694],
            [102, 13, 715],
            [103, 13, 728],
            [103, 13, 807],
            [103, 13, 819],
            [103, 13, 1011],
            [103, 13, 1088],
        ],
        [
            [-38, -26, 0],
            [0, 0, 0],
            [0, 0, 115],
            [2, 0, 222],
            [7, 0, 231],
            [22, 1, 239],
            [31, 1, 248],
            [40, 1, 256],
            [48, 1, 260],
            [57, 1, 269],
            [64, 1, 278],
            [71, 1, 282],
            [75, 1, 290],
            [81, 1, 298],
            [86, 0, 302],
            [89, 0, 311],
            [92, 0, 319],
            [93, 0, 328],
            [95, 0, 331],
            [95, 0, 340],
            [97, 0, 348],
            [97, 0, 374],
            [98, 0, 411],
            [98, 0, 444],
            [99, 0, 486],
            [99, 0, 528],
            [100, 0, 544],
            [101, 0, 590],
            [101, 0, 603],
            [101, 0, 610],
            [102, 0, 640],
            [103, 0, 653],
            [103, 0, 670],
            [104, 0, 715],
            [105, 0, 750],
            [105, 0, 774],
            [105, 0, 854],
            [106, 0, 857],
            [106, -1, 865],
            [107, -1, 885],
            [107, -1, 949],
            [107, -1, 1111],
            [107, -1, 1361],
            [107, -1, 1453],
            [107, -1, 1602],
            [107, -1, 1610],
            [107, -1, 1852],
            [107, -1, 1944],
            [107, -1, 2102],
            [107, -1, 2136],
            [106, -1, 2157],
            [106, -2, 2261],
            [105, -2, 2282],
            [105, -3, 2319],
            [105, -3, 2345],
            [105, -3, 2350],
            [105, -3, 2387],
            [105, -3, 2444],
            [104, -3, 2486],
            [104, -3, 2599],
            [104, -3, 2603],
            [104, -3, 2607],
        ],
        [
            [-46, -32, 0],
            [0, 0, 0],
            [0, 0, 178],
            [0, 0, 186],
            [2, 0, 228],
            [5, 1, 235],
            [9, 1, 244],
            [15, 3, 248],
            [18, 3, 257],
            [22, 4, 261],
            [25, 5, 269],
            [29, 6, 274],
            [34, 6, 283],
            [39, 7, 291],
            [46, 7, 295],
            [53, 7, 304],
            [57, 7, 309],
            [64, 7, 316],
            [69, 7, 324],
            [73, 7, 332],
            [77, 7, 337],
            [81, 7, 345],
            [83, 7, 353],
            [87, 7, 358],
            [89, 7, 366],
            [92, 7, 374],
            [95, 7, 382],
            [97, 7, 387],
            [99, 7, 394],
            [101, 7, 403],
            [102, 7, 408],
            [103, 7, 416],
            [105, 7, 424],
            [106, 7, 429],
            [107, 7, 446],
            [107, 7, 478],
            [107, 7, 483],
            [108, 7, 515],
            [109, 7, 562],
            [109, 7, 612],
            [110, 7, 632],
            [110, 7, 674],
            [110, 7, 895],
            [110, 7, 995],
            [110, 7, 1179],
            [110, 7, 1396],
            [110, 7, 1488],
            [105, 7, 1645],
            [104, 7, 1654],
            [103, 7, 1663],
            [103, 7, 1665],
            [103, 7, 1670],
            [102, 7, 1674],
            [102, 7, 1899],
            [102, 7, 1991],
            [103, 7, 2087],
            [103, 7, 2118],
            [104, 7, 2141],
            [104, 7, 2171],
            [105, 7, 2179],
            [105, 7, 2200],
            [105, 7, 2242],
            [106, 7, 2301],
            [107, 7, 2354],
            [107, 7, 2388],
            [107, 7, 2438],
            [107, 7, 2480],
            [107, 7, 2689],
            [107, 7, 2897],
            [106, 7, 2943],
            [105, 7, 2984],
            [105, 7, 2992],
            [105, 6, 3059],
            [105, 6, 3186],
            [105, 6, 3243],
        ],
        [
            [-28, -14, 0],
            [0, 0, 0],
            [0, 0, 86],
            [2, 0, 187],
            [9, 2, 195],
            [13, 2, 203],
            [20, 2, 207],
            [27, 3, 213],
            [32, 3, 220],
            [38, 3, 229],
            [43, 3, 238],
            [48, 3, 241],
            [52, 3, 250],
            [55, 3, 254],
            [59, 3, 262],
            [61, 3, 266],
            [64, 3, 275],
            [65, 3, 284],
            [67, 3, 288],
            [68, 3, 296],
            [69, 3, 358],
            [71, 3, 366],
            [75, 5, 376],
            [77, 5, 379],
            [81, 7, 388],
            [83, 7, 396],
            [86, 8, 400],
            [88, 9, 408],
            [89, 9, 416],
            [90, 9, 420],
            [91, 10, 429],
            [91, 10, 458],
            [92, 10, 507],
            [93, 10, 533],
            [93, 10, 562],
            [93, 10, 579],
            [93, 10, 583],
            [94, 10, 617],
            [95, 10, 637],
            [95, 10, 675],
            [96, 10, 695],
            [97, 10, 708],
            [97, 10, 737],
            [98, 10, 772],
            [99, 10, 787],
            [99, 10, 796],
            [100, 10, 821],
            [101, 10, 841],
            [101, 10, 862],
            [102, 10, 892],
            [102, 10, 904],
            [103, 10, 920],
            [103, 10, 941],
            [104, 10, 966],
            [105, 10, 1004],
            [105, 10, 1092],
            [105, 10, 1208],
        ],
        [
            [-30, -28, 0],
            [0, 0, 0],
            [0, 0, 47],
            [0, 0, 213],
            [3, 0, 222],
            [9, 2, 230],
            [22, 5, 239],
            [29, 5, 247],
            [34, 5, 258],
            [39, 5, 260],
            [44, 7, 267],
            [47, 7, 278],
            [49, 7, 282],
            [52, 7, 288],
            [53, 7, 297],
            [55, 7, 305],
            [57, 7, 309],
            [57, 7, 318],
            [58, 7, 326],
            [58, 7, 346],
            [59, 7, 360],
            [60, 7, 376],
            [61, 7, 379],
            [65, 7, 388],
            [69, 8, 397],
            [74, 9, 401],
            [77, 9, 410],
            [83, 10, 414],
            [88, 11, 422],
            [91, 11, 430],
            [95, 12, 435],
            [97, 12, 443],
            [99, 12, 451],
            [100, 12, 459],
            [101, 12, 464],
            [101, 12, 472],
            [102, 12, 484],
            [103, 12, 526],
            [103, 12, 531],
            [103, 12, 547],
            [104, 12, 596],
            [105, 12, 647],
            [105, 12, 705],
            [105, 12, 850],
            [105, 12, 1037],
            [105, 12, 1075],
        ],
        [
            [-27, -38, 0],
            [0, 0, 0],
            [3, 0, 228],
            [7, 0, 236],
            [12, 1, 245],
            [15, 1, 249],
            [19, 1, 253],
            [23, 1, 262],
            [25, 1, 270],
            [27, 1, 274],
            [28, 1, 283],
            [29, 1, 291],
            [29, 1, 295],
            [30, 1, 312],
            [31, 1, 316],
            [31, 1, 345],
            [31, 1, 354],
            [32, 1, 357],
            [33, 1, 376],
            [35, 1, 383],
            [38, 1, 386],
            [42, 1, 394],
            [44, 1, 403],
            [48, 1, 407],
            [51, 1, 416],
            [53, 1, 425],
            [55, 2, 430],
            [58, 2, 435],
            [60, 2, 446],
            [61, 2, 449],
            [61, 2, 456],
            [62, 2, 471],
            [63, 2, 491],
            [63, 2, 508],
            [63, 2, 550],
            [64, 2, 554],
            [66, 2, 562],
            [69, 3, 570],
            [71, 3, 574],
            [73, 3, 582],
            [75, 3, 591],
            [77, 3, 599],
            [79, 3, 604],
            [80, 3, 611],
            [81, 3, 619],
            [82, 3, 624],
            [84, 3, 640],
            [85, 3, 644],
            [86, 3, 654],
            [87, 3, 660],
            [87, 3, 666],
            [88, 3, 712],
            [89, 3, 752],
            [89, 3, 757],
            [91, 3, 765],
            [91, 3, 774],
            [92, 3, 778],
            [93, 3, 786],
            [95, 3, 791],
            [97, 3, 798],
            [98, 3, 806],
            [99, 3, 815],
            [101, 3, 820],
            [102, 1, 827],
            [103, 1, 836],
            [103, 1, 840],
            [103, 1, 848],
            [104, 1, 857],
            [105, 1, 869],
            [105, 1, 907],
            [106, 1, 981],
            [106, 1, 1002],
            [106, 1, 1006],
            [107, 1, 1023],
            [107, 1, 1074],
            [107, 1, 1236],
        ],
        [
            [-41, -20, 0],
            [0, 0, 0],
            [0, 0, 195],
            [0, 0, 278],
            [1, 0, 286],
            [2, 0, 294],
            [3, 0, 298],
            [4, 0, 319],
            [5, 0, 332],
            [5, 0, 354],
            [7, 0, 361],
            [10, 0, 366],
            [14, 0, 373],
            [17, 1, 382],
            [22, 1, 386],
            [26, 1, 394],
            [31, 1, 399],
            [34, 1, 407],
            [37, 1, 415],
            [39, 1, 424],
            [41, 1, 432],
            [43, 1, 436],
            [44, 1, 445],
            [45, 1, 450],
            [45, 1, 457],
            [46, 1, 469],
            [47, 1, 507],
            [47, 1, 528],
            [48, 1, 532],
            [49, 1, 540],
            [52, 1, 549],
            [55, 1, 557],
            [56, 1, 561],
            [58, 1, 570],
            [60, 1, 578],
            [61, 1, 581],
            [63, 1, 590],
            [64, 1, 599],
            [65, 1, 603],
            [66, 1, 613],
            [67, 1, 622],
            [68, 1, 624],
            [69, 1, 631],
            [69, 1, 640],
            [71, 1, 645],
            [71, 1, 652],
            [73, 1, 662],
            [73, 2, 667],
            [75, 2, 673],
            [76, 2, 683],
            [77, 3, 687],
            [78, 3, 696],
            [80, 3, 703],
            [81, 3, 707],
            [82, 3, 716],
            [83, 3, 725],
            [85, 3, 727],
            [87, 3, 736],
            [88, 3, 744],
            [90, 3, 749],
            [91, 3, 757],
            [92, 3, 765],
            [93, 3, 773],
            [93, 3, 778],
            [94, 3, 836],
            [95, 3, 870],
            [95, 3, 932],
            [95, 3, 936],
            [95, 3, 961],
            [96, 3, 1012],
            [97, 3, 1036],
            [97, 3, 1053],
            [98, 3, 1109],
            [99, 3, 1121],
            [99, 3, 1148],
            [100, 3, 1165],
            [101, 3, 1178],
            [102, 3, 1187],
            [105, 3, 1191],
            [107, 3, 1199],
            [110, 3, 1209],
            [111, 3, 1212],
            [113, 3, 1219],
            [114, 3, 1227],
            [116, 3, 1233],
            [117, 3, 1249],
            [117, 3, 1274],
            [117, 3, 1283],
            [118, 3, 1341],
            [119, 3, 1395],
            [119, 3, 1440],
            [119, 3, 1444],
            [118, 3, 1506],
            [117, 3, 1516],
            [117, 2, 1521],
            [116, 2, 1533],
            [115, 2, 1541],
            [115, 2, 1549],
            [114, 2, 1557],
            [113, 2, 1570],
            [113, 2, 1599],
            [112, 2, 1620],
            [111, 2, 1674],
            [111, 2, 1691],
            [111, 2, 1716],
            [111, 2, 1782],
            [109, 2, 1915],
            [109, 2, 1938],
            [109, 2, 2024],
            [108, 2, 2029],
            [107, 2, 2046],
            [107, 2, 2068],
        ],
        [
            [-39, -16, 0],
            [0, 0, 0],
            [0, 0, 110],
            [0, 0, 202],
            [3, 0, 218],
            [7, 0, 227],
            [11, 0, 235],
            [16, 0, 240],
            [20, 0, 248],
            [22, 0, 252],
            [24, 0, 261],
            [26, 0, 268],
            [27, 0, 281],
            [28, 0, 289],
            [29, 0, 311],
            [29, 0, 315],
            [30, 0, 331],
            [31, 0, 365],
            [31, 0, 387],
            [33, 0, 392],
            [36, 0, 402],
            [40, 0, 407],
            [45, 0, 415],
            [49, 1, 423],
            [52, 2, 427],
            [56, 2, 435],
            [59, 2, 445],
            [62, 3, 448],
            [65, 3, 457],
            [66, 4, 465],
            [69, 4, 469],
            [71, 5, 477],
            [72, 5, 486],
            [73, 5, 491],
            [73, 5, 499],
            [74, 5, 519],
            [75, 5, 539],
            [75, 5, 560],
            [76, 5, 611],
            [76, 5, 616],
            [77, 5, 644],
            [77, 5, 682],
            [79, 5, 685],
            [81, 5, 694],
            [84, 5, 702],
            [87, 5, 706],
            [87, 5, 711],
            [89, 5, 714],
            [92, 5, 724],
            [94, 5, 727],
            [96, 5, 736],
            [99, 5, 744],
            [99, 5, 748],
            [100, 5, 757],
            [101, 5, 765],
            [101, 5, 777],
            [102, 5, 807],
            [103, 5, 869],
            [103, 5, 898],
            [103, 5, 903],
            [103, 5, 924],
            [104, 5, 965],
            [105, 5, 1011],
            [105, 5, 1057],
            [105, 5, 1119],
            [105, 5, 1216],
            [106, 5, 1224],
            [107, 5, 1312],
            [107, 5, 1400],
            [107, 5, 1416],
            [108, 5, 1554],
            [108, 5, 1614],
            [108, 5, 1697],
        ],
        [
            [-53, -16, 0],
            [0, 0, 0],
            [0, 0, 53],
            [0, 0, 177],
            [3, 1, 202],
            [12, 4, 211],
            [16, 5, 220],
            [20, 7, 228],
            [22, 7, 231],
            [25, 7, 241],
            [27, 7, 249],
            [29, 7, 252],
            [31, 9, 261],
            [31, 9, 266],
            [33, 9, 273],
            [33, 9, 283],
            [35, 9, 291],
            [36, 9, 294],
            [38, 9, 303],
            [39, 9, 311],
            [40, 10, 316],
            [42, 10, 323],
            [45, 11, 331],
            [49, 11, 343],
            [53, 11, 352],
            [56, 13, 357],
            [59, 13, 365],
            [62, 13, 374],
            [65, 13, 378],
            [69, 13, 385],
            [71, 13, 394],
            [73, 13, 399],
            [75, 13, 406],
            [75, 13, 414],
            [77, 13, 420],
            [77, 13, 428],
            [78, 13, 436],
            [79, 13, 444],
            [80, 13, 449],
            [81, 13, 457],
            [81, 13, 469],
            [83, 13, 483],
            [83, 13, 490],
            [84, 13, 511],
            [85, 13, 519],
            [86, 13, 525],
            [87, 13, 532],
            [87, 13, 541],
            [87, 13, 545],
            [88, 13, 548],
            [89, 13, 558],
            [89, 14, 565],
            [90, 14, 570],
            [91, 14, 578],
            [91, 14, 619],
            [92, 14, 639],
            [92, 14, 669],
            [93, 14, 703],
            [93, 14, 716],
            [95, 14, 720],
            [97, 14, 728],
            [97, 14, 736],
            [98, 14, 745],
            [99, 14, 753],
            [99, 14, 794],
            [100, 14, 820],
            [100, 14, 837],
            [101, 14, 857],
            [101, 14, 903],
            [102, 14, 941],
            [103, 14, 961],
            [103, 14, 975],
            [104, 14, 1003],
            [105, 14, 1037],
            [105, 14, 1057],
            [106, 14, 1078],
            [107, 14, 1099],
            [107, 14, 1116],
            [108, 14, 1157],
            [108, 13, 1162],
            [108, 13, 1250],
        ],
        [
            [-35, -34, 0],
            [0, 0, 0],
            [0, 0, 173],
            [3, 0, 232],
            [7, 0, 240],
            [11, -1, 248],
            [15, -1, 252],
            [20, -1, 260],
            [25, -1, 269],
            [29, -1, 273],
            [32, -1, 281],
            [35, -1, 290],
            [37, -2, 298],
            [39, -2, 303],
            [40, -2, 311],
            [41, -2, 315],
            [41, -2, 324],
            [43, -2, 336],
            [45, -2, 340],
            [45, -2, 345],
            [47, -2, 352],
            [49, -2, 361],
            [51, -2, 365],
            [53, -2, 374],
            [55, -2, 381],
            [57, -2, 385],
            [59, -2, 394],
            [61, -2, 403],
            [64, -2, 406],
            [65, -2, 415],
            [68, -2, 423],
            [70, -2, 427],
            [71, -2, 435],
            [72, -2, 445],
            [73, -2, 452],
            [73, -2, 457],
            [74, -2, 470],
            [75, -2, 515],
            [75, -2, 561],
            [78, -2, 570],
            [80, -2, 578],
            [84, -2, 581],
            [87, -2, 590],
            [91, -2, 599],
            [95, -2, 603],
            [98, -2, 611],
            [100, -3, 620],
            [103, -3, 623],
            [104, -3, 632],
            [105, -3, 640],
            [105, -3, 653],
            [105, -3, 665],
            [106, -3, 686],
            [106, -3, 727],
            [106, -3, 889],
            [106, -3, 1175],
            [106, -3, 1232],
            [106, -3, 1392],
            [106, -3, 1673],
            [106, -3, 1732],
            [106, -3, 1890],
            [107, -3, 1924],
            [107, -3, 1974],
            [108, -3, 2023],
            [109, -3, 2103],
            [109, -4, 2165],
            [109, -4, 2174],
            [109, -4, 2183],
            [109, -4, 2237],
            [109, -4, 2389],
        ],
        [
            [-37, -24, 0],
            [0, 0, 0],
            [0, 0, 35],
            [13, 4, 177],
            [22, 6, 185],
            [30, 9, 189],
            [37, 10, 197],
            [45, 11, 207],
            [52, 11, 215],
            [60, 12, 218],
            [65, 12, 228],
            [70, 12, 231],
            [70, 12, 236],
            [73, 12, 240],
            [76, 12, 249],
            [79, 13, 253],
            [80, 13, 260],
            [82, 13, 269],
            [85, 14, 274],
            [86, 14, 282],
            [87, 14, 290],
            [88, 15, 298],
            [89, 15, 303],
            [90, 15, 311],
            [91, 15, 318],
            [93, 16, 324],
            [94, 16, 331],
            [96, 17, 340],
            [97, 17, 344],
            [99, 18, 352],
            [101, 18, 360],
            [101, 18, 365],
            [102, 18, 374],
            [102, 19, 390],
            [103, 19, 394],
            [103, 19, 498],
            [103, 19, 545],
            [104, 19, 549],
            [105, 19, 600],
            [105, 19, 620],
            [106, 19, 652],
            [107, 19, 682],
            [107, 19, 724],
            [107, 19, 745],
            [107, 19, 749],
            [108, 19, 765],
            [109, 19, 799],
            [109, 19, 886],
            [109, 19, 899],
            [109, 19, 970],
        ],
        [
            [-38, -28, 0],
            [0, 0, 0],
            [0, 0, 136],
            [5, 1, 177],
            [13, 3, 186],
            [27, 6, 195],
            [38, 9, 198],
            [48, 10, 202],
            [53, 11, 212],
            [59, 12, 219],
            [65, 12, 224],
            [71, 12, 233],
            [78, 13, 243],
            [83, 14, 248],
            [87, 14, 253],
            [90, 15, 261],
            [94, 15, 266],
            [95, 15, 274],
            [97, 15, 282],
            [99, 16, 287],
            [99, 16, 295],
            [100, 16, 303],
            [101, 16, 311],
            [101, 16, 316],
            [101, 16, 337],
            [102, 17, 346],
            [103, 17, 350],
            [105, 17, 357],
            [107, 17, 366],
            [109, 18, 370],
            [111, 19, 379],
            [111, 19, 387],
            [112, 19, 395],
            [113, 19, 416],
            [113, 19, 424],
            [113, 19, 461],
            [114, 19, 496],
            [114, 19, 628],
            [114, 19, 825],
            [114, 19, 933],
            [114, 19, 1033],
            [114, 19, 1125],
            [113, 19, 1270],
            [113, 18, 1278],
            [112, 18, 1287],
            [112, 17, 1298],
            [111, 17, 1302],
            [111, 17, 1319],
            [111, 17, 1323],
            [111, 17, 1326],
            [111, 17, 1350],
            [111, 16, 1409],
            [110, 16, 1422],
            [110, 16, 1430],
            [109, 15, 1441],
            [109, 15, 1455],
            [109, 15, 1463],
            [109, 15, 1642],
            [109, 15, 1675],
        ],
        [
            [-41, -30, 0],
            [0, 0, 0],
            [0, 0, 82],
            [3, 0, 190],
            [9, 1, 199],
            [14, 1, 209],
            [17, 2, 213],
            [21, 3, 221],
            [25, 3, 226],
            [27, 4, 234],
            [31, 4, 238],
            [34, 5, 246],
            [36, 5, 254],
            [39, 5, 262],
            [41, 6, 267],
            [44, 6, 275],
            [47, 7, 283],
            [50, 7, 288],
            [53, 7, 296],
            [57, 9, 304],
            [59, 9, 308],
            [62, 9, 316],
            [65, 10, 325],
            [67, 10, 330],
            [69, 11, 337],
            [71, 11, 347],
            [74, 12, 350],
            [75, 12, 358],
            [77, 12, 367],
            [79, 12, 371],
            [80, 12, 380],
            [81, 13, 388],
            [82, 13, 392],
            [83, 13, 401],
            [83, 13, 408],
            [84, 13, 450],
            [85, 13, 483],
            [85, 13, 508],
            [86, 13, 529],
            [87, 13, 554],
            [87, 13, 568],
            [87, 13, 575],
            [88, 13, 604],
            [89, 13, 625],
            [89, 13, 637],
            [90, 13, 667],
            [91, 13, 680],
            [91, 13, 695],
            [92, 13, 721],
            [93, 13, 729],
            [95, 13, 737],
            [97, 13, 743],
            [99, 13, 751],
            [99, 13, 759],
            [100, 13, 763],
            [101, 13, 770],
            [101, 13, 784],
            [102, 13, 799],
            [103, 13, 829],
            [103, 13, 842],
            [104, 13, 863],
            [104, 13, 876],
            [105, 13, 884],
            [105, 12, 904],
            [105, 12, 917],
            [106, 12, 945],
            [107, 11, 959],
            [107, 11, 975],
            [107, 11, 996],
            [108, 11, 1025],
            [109, 11, 1046],
            [109, 10, 1066],
            [109, 10, 1071],
            [109, 10, 1092],
            [109, 10, 1171],
            [109, 10, 1180],
        ],
        [
            [-42, -30, 0],
            [0, 0, 0],
            [0, 0, 198],
            [3, 0, 231],
            [8, 0, 238],
            [15, 1, 247],
            [21, 1, 255],
            [27, 1, 259],
            [33, 1, 267],
            [39, 1, 276],
            [43, 1, 280],
            [45, 1, 288],
            [48, 1, 296],
            [51, 1, 301],
            [52, 1, 309],
            [53, 1, 317],
            [53, 1, 322],
            [55, 1, 330],
            [55, 1, 338],
            [55, 2, 342],
            [57, 2, 352],
            [57, 2, 359],
            [59, 2, 364],
            [61, 2, 372],
            [63, 2, 380],
            [66, 3, 385],
            [69, 3, 392],
            [72, 4, 400],
            [75, 5, 405],
            [79, 5, 413],
            [83, 5, 421],
            [85, 6, 426],
            [88, 6, 434],
            [88, 6, 438],
            [89, 6, 443],
            [89, 6, 451],
            [90, 6, 455],
            [91, 6, 493],
            [91, 6, 518],
            [92, 6, 539],
            [93, 6, 589],
            [93, 6, 627],
            [94, 6, 639],
            [95, 6, 647],
            [98, 6, 652],
            [100, 6, 659],
            [102, 6, 668],
            [103, 6, 672],
            [105, 6, 680],
            [105, 6, 685],
            [106, 6, 713],
            [107, 6, 734],
            [107, 6, 752],
            [107, 6, 763],
            [108, 6, 802],
            [109, 6, 868],
            [109, 5, 938],
            [109, 5, 976],
            [110, 5, 997],
            [110, 5, 1123],
        ],
        [
            [-38, -33, 0],
            [0, 0, 0],
            [0, 0, 129],
            [5, 1, 186],
            [13, 3, 194],
            [27, 8, 203],
            [34, 9, 211],
            [41, 11, 219],
            [47, 11, 224],
            [54, 11, 233],
            [61, 13, 240],
            [67, 13, 249],
            [73, 13, 254],
            [79, 13, 262],
            [83, 13, 265],
            [86, 13, 274],
            [89, 13, 282],
            [90, 13, 288],
            [91, 13, 294],
            [91, 13, 303],
            [92, 13, 336],
            [93, 13, 373],
            [95, 15, 378],
            [97, 15, 387],
            [99, 15, 395],
            [99, 16, 400],
            [101, 16, 408],
            [101, 16, 416],
            [101, 16, 435],
            [101, 17, 441],
            [102, 17, 449],
            [103, 17, 503],
            [103, 17, 528],
            [104, 17, 549],
            [104, 17, 554],
            [105, 17, 567],
            [105, 17, 604],
            [106, 17, 616],
            [106, 17, 624],
            [106, 17, 629],
            [107, 17, 637],
            [107, 17, 687],
            [108, 17, 716],
            [108, 17, 733],
            [109, 17, 750],
            [109, 17, 779],
            [110, 17, 799],
            [110, 17, 885],
        ],
        [
            [-43, -23, 0],
            [0, 0, 0],
            [0, 0, 16],
            [3, 1, 190],
            [8, 3, 199],
            [15, 6, 207],
            [21, 8, 211],
            [21, 8, 216],
            [29, 11, 219],
            [35, 11, 224],
            [41, 13, 232],
            [47, 14, 240],
            [51, 14, 245],
            [55, 15, 253],
            [58, 15, 261],
            [62, 15, 270],
            [65, 17, 274],
            [67, 17, 281],
            [69, 17, 291],
            [72, 17, 295],
            [74, 18, 303],
            [75, 18, 308],
            [78, 19, 316],
            [79, 20, 324],
            [81, 20, 332],
            [83, 21, 336],
            [85, 21, 347],
            [86, 22, 354],
            [89, 23, 357],
            [91, 24, 365],
            [93, 25, 375],
            [95, 26, 377],
            [95, 26, 382],
            [97, 26, 386],
            [100, 27, 395],
            [101, 27, 399],
            [102, 28, 408],
            [103, 28, 415],
            [103, 28, 420],
            [104, 28, 450],
            [105, 28, 487],
            [105, 28, 511],
            [105, 28, 520],
            [106, 28, 595],
            [106, 29, 612],
            [107, 29, 616],
            [107, 29, 654],
            [108, 29, 704],
            [109, 29, 728],
            [109, 29, 770],
            [110, 29, 834],
            [111, 29, 858],
            [111, 29, 883],
            [112, 29, 925],
            [112, 29, 991],
        ],
        [
            [-38, -39, 0],
            [0, 0, 0],
            [0, 0, 5],
            [0, 0, 143],
            [6, 3, 192],
            [15, 6, 200],
            [31, 12, 209],
            [39, 15, 218],
            [48, 17, 226],
            [55, 19, 231],
            [62, 21, 240],
            [67, 23, 247],
            [71, 25, 252],
            [74, 25, 260],
            [75, 25, 268],
            [77, 25, 273],
            [77, 26, 281],
            [78, 26, 289],
            [79, 26, 324],
            [79, 26, 336],
            [79, 27, 372],
            [81, 27, 381],
            [84, 28, 386],
            [87, 29, 394],
            [89, 31, 403],
            [92, 31, 406],
            [94, 31, 414],
            [95, 32, 419],
            [97, 33, 426],
            [99, 34, 435],
            [99, 34, 443],
            [101, 34, 448],
            [101, 34, 456],
            [102, 34, 477],
            [103, 35, 486],
            [103, 35, 489],
            [104, 35, 507],
            [105, 35, 510],
            [105, 35, 534],
            [106, 35, 556],
            [107, 35, 581],
            [107, 35, 602],
            [108, 35, 623],
            [108, 35, 635],
            [109, 35, 640],
            [109, 35, 664],
            [111, 35, 693],
            [111, 35, 706],
            [112, 35, 731],
            [113, 35, 735],
            [113, 35, 756],
            [114, 35, 806],
            [115, 35, 826],
            [115, 35, 836],
            [115, 34, 861],
            [116, 34, 931],
            [116, 34, 997],
        ],
        [
            [-63, -26, 0],
            [0, 0, 0],
            [0, 0, 172],
            [1, 0, 197],
            [1, 0, 206],
            [2, 0, 219],
            [3, 0, 247],
            [3, 0, 280],
            [3, 1, 290],
            [4, 1, 301],
            [5, 1, 340],
            [5, 1, 364],
            [6, 2, 373],
            [8, 3, 378],
            [12, 3, 385],
            [15, 5, 394],
            [18, 6, 402],
            [22, 7, 408],
            [26, 8, 414],
            [29, 9, 424],
            [32, 10, 428],
            [36, 11, 436],
            [37, 11, 445],
            [37, 11, 447],
            [38, 11, 456],
            [39, 11, 464],
            [39, 11, 479],
            [39, 11, 494],
            [40, 11, 527],
            [41, 11, 535],
            [41, 11, 539],
            [42, 12, 548],
            [43, 12, 556],
            [44, 12, 561],
            [45, 12, 571],
            [47, 13, 578],
            [49, 13, 581],
            [50, 14, 590],
            [52, 14, 599],
            [55, 15, 603],
            [56, 15, 611],
            [59, 15, 620],
            [60, 16, 624],
            [63, 16, 633],
            [63, 17, 638],
            [65, 17, 644],
            [66, 17, 658],
            [67, 17, 673],
            [67, 17, 677],
            [67, 17, 682],
            [67, 17, 702],
            [69, 17, 723],
            [70, 18, 728],
            [72, 19, 737],
            [73, 19, 745],
            [76, 19, 749],
            [77, 20, 757],
            [78, 21, 765],
            [80, 21, 774],
            [81, 21, 778],
            [83, 21, 785],
            [85, 21, 791],
            [87, 23, 799],
            [89, 23, 808],
            [91, 23, 816],
            [93, 23, 821],
            [94, 23, 827],
            [95, 23, 833],
            [96, 23, 841],
            [97, 23, 849],
            [97, 23, 856],
            [98, 23, 911],
            [99, 23, 1002],
            [99, 24, 1010],
            [101, 24, 1016],
            [101, 24, 1024],
            [103, 24, 1029],
            [103, 24, 1036],
            [104, 24, 1046],
            [105, 24, 1052],
            [105, 24, 1065],
            [106, 24, 1073],
            [107, 24, 1086],
            [107, 24, 1174],
            [107, 24, 1212],
            [108, 24, 1270],
            [109, 24, 1304],
            [109, 24, 1311],
            [109, 24, 1357],
            [110, 24, 1395],
            [111, 24, 1420],
            [111, 23, 1457],
            [111, 23, 1470],
            [111, 23, 1500],
            [112, 23, 1504],
            [113, 23, 1549],
            [113, 22, 1575],
            [113, 22, 1602],
            [114, 22, 1665],
            [114, 22, 1669],
            [114, 22, 1674],
            [114, 21, 1696],
            [115, 21, 1728],
            [115, 21, 1749],
            [115, 21, 1778],
            [115, 21, 1808],
            [115, 20, 1850],
            [116, 20, 1857],
            [116, 20, 1997],
            [116, 20, 1998],
        ],
        [
            [-31, -46, 0],
            [0, 0, 0],
            [0, 0, 148],
            [0, 0, 238],
            [8, 2, 246],
            [13, 3, 255],
            [17, 5, 260],
            [21, 6, 268],
            [23, 7, 277],
            [26, 7, 281],
            [29, 8, 289],
            [31, 9, 297],
            [32, 9, 302],
            [33, 9, 310],
            [33, 9, 319],
            [34, 9, 324],
            [35, 9, 332],
            [35, 9, 339],
            [36, 10, 344],
            [37, 10, 353],
            [37, 10, 373],
            [38, 10, 390],
            [38, 10, 393],
            [39, 10, 403],
            [41, 10, 406],
            [45, 11, 414],
            [49, 12, 422],
            [54, 13, 431],
            [61, 14, 435],
            [67, 15, 444],
            [74, 17, 452],
            [79, 17, 456],
            [84, 17, 465],
            [89, 19, 469],
            [93, 19, 477],
            [97, 19, 485],
            [99, 19, 493],
            [101, 19, 498],
            [102, 19, 506],
            [103, 19, 515],
            [103, 19, 518],
            [104, 19, 527],
            [105, 19, 564],
            [105, 19, 610],
            [106, 19, 623],
            [106, 19, 637],
            [107, 19, 648],
            [107, 19, 694],
            [108, 19, 732],
            [109, 19, 752],
            [109, 19, 786],
            [110, 19, 824],
            [111, 19, 844],
            [111, 19, 865],
            [113, 19, 885],
            [113, 19, 889],
            [113, 19, 939],
            [114, 19, 961],
            [115, 19, 978],
            [115, 19, 1052],
            [116, 19, 1123],
            [116, 19, 1150],
            [116, 19, 1227],
            [117, 19, 1235],
            [117, 19, 1391],
            [117, 19, 1640],
            [117, 19, 1739],
            [117, 19, 1817],
        ],
        [
            [-37, -20, 0],
            [0, 0, 0],
            [0, 0, 121],
            [4, 0, 197],
            [11, 0, 205],
            [19, 0, 214],
            [25, 1, 221],
            [32, 1, 225],
            [39, 3, 239],
            [43, 3, 242],
            [50, 3, 246],
            [55, 3, 254],
            [59, 3, 263],
            [62, 3, 267],
            [66, 5, 275],
            [67, 5, 284],
            [68, 5, 288],
            [69, 5, 296],
            [69, 5, 305],
            [69, 5, 331],
            [70, 5, 338],
            [71, 5, 359],
            [71, 5, 379],
            [72, 5, 397],
            [73, 5, 421],
            [73, 5, 426],
            [74, 5, 471],
            [76, 5, 480],
            [79, 5, 485],
            [83, 4, 492],
            [86, 4, 501],
            [89, 4, 505],
            [92, 4, 513],
            [95, 4, 522],
            [96, 3, 527],
            [98, 3, 534],
            [99, 3, 542],
            [100, 3, 555],
            [101, 3, 568],
            [101, 3, 610],
            [101, 3, 613],
            [102, 3, 660],
            [103, 3, 680],
            [105, 3, 710],
            [107, 3, 719],
            [110, 3, 722],
            [114, 3, 731],
            [117, 3, 738],
            [120, 5, 743],
            [123, 5, 751],
            [125, 5, 760],
            [127, 5, 764],
            [127, 5, 772],
            [128, 5, 780],
            [129, 5, 785],
            [129, 5, 830],
            [129, 5, 834],
            [129, 5, 922],
            [129, 5, 1113],
            [129, 5, 1121],
            [129, 5, 1330],
            [128, 5, 1339],
            [125, 5, 1348],
            [123, 3, 1355],
            [121, 3, 1359],
            [119, 3, 1368],
            [119, 3, 1381],
            [119, 3, 1418],
            [118, 3, 1432],
            [118, 3, 1502],
            [118, 3, 1606],
            [117, 3, 1636],
            [117, 3, 1826],
            [117, 3, 1894],
        ],
        [
            [-15, -19, 0],
            [0, 0, 0],
            [13, 1, 161],
            [21, 3, 168],
            [27, 3, 178],
            [34, 5, 182],
            [39, 6, 190],
            [45, 6, 196],
            [49, 7, 203],
            [52, 7, 212],
            [55, 8, 220],
            [56, 8, 224],
            [58, 8, 232],
            [59, 9, 240],
            [60, 9, 245],
            [61, 9, 251],
            [64, 10, 261],
            [66, 10, 269],
            [69, 11, 275],
            [70, 12, 284],
            [73, 13, 286],
            [75, 13, 294],
            [78, 15, 303],
            [79, 15, 308],
            [82, 15, 315],
            [84, 15, 323],
            [85, 16, 331],
            [86, 16, 336],
            [87, 17, 344],
            [87, 17, 352],
            [88, 17, 356],
            [89, 17, 373],
            [89, 17, 397],
            [90, 17, 406],
            [93, 17, 443],
            [95, 17, 448],
            [99, 18, 456],
            [102, 18, 465],
            [105, 19, 470],
            [109, 19, 476],
            [111, 19, 485],
            [114, 19, 493],
            [115, 19, 498],
            [115, 19, 502],
            [117, 19, 506],
            [117, 19, 511],
            [118, 19, 519],
            [119, 19, 527],
            [119, 19, 548],
            [120, 19, 590],
            [120, 19, 668],
            [121, 19, 682],
            [119, 19, 823],
            [119, 19, 834],
            [117, 19, 845],
            [117, 19, 849],
            [117, 19, 858],
            [116, 19, 871],
            [115, 19, 874],
            [115, 19, 899],
            [114, 19, 913],
            [114, 18, 926],
            [113, 18, 933],
            [113, 18, 946],
            [112, 18, 959],
            [112, 18, 995],
            [111, 18, 1024],
            [111, 18, 1166],
            [112, 18, 1211],
            [113, 18, 1241],
            [113, 18, 1263],
            [114, 18, 1296],
            [114, 18, 1325],
            [115, 18, 1330],
            [115, 18, 1358],
            [116, 18, 1379],
            [117, 18, 1429],
            [117, 18, 1487],
            [117, 18, 1491],
            [117, 18, 1543],
        ],
        [
            [-33, -20, 0],
            [0, 0, 0],
            [0, 0, 123],
            [4, 0, 182],
            [9, 0, 190],
            [25, 0, 199],
            [35, 0, 206],
            [43, 0, 216],
            [53, 0, 220],
            [57, 0, 227],
            [63, 0, 236],
            [65, 0, 241],
            [67, 0, 249],
            [68, 0, 254],
            [69, 0, 261],
            [70, 0, 303],
            [71, 0, 319],
            [71, 0, 332],
            [73, 0, 362],
            [74, 0, 365],
            [75, 0, 373],
            [76, 0, 382],
            [77, 0, 390],
            [79, 0, 395],
            [81, 0, 402],
            [83, 0, 410],
            [85, 0, 416],
            [86, 0, 423],
            [88, 0, 432],
            [89, 0, 436],
            [90, 0, 444],
            [91, 0, 453],
            [91, 0, 457],
            [91, 0, 494],
            [92, 0, 536],
            [93, 0, 541],
            [96, 0, 548],
            [99, 0, 557],
            [101, 0, 561],
            [103, 0, 570],
            [104, 0, 577],
            [106, 0, 582],
            [109, -1, 591],
            [109, -1, 599],
            [110, -1, 604],
            [110, -1, 612],
            [111, -1, 632],
            [111, -1, 653],
            [112, -1, 694],
            [113, -1, 753],
            [113, -1, 799],
            [114, -1, 857],
            [114, -1, 878],
            [115, -1, 891],
            [115, -1, 911],
            [115, -1, 953],
            [116, -1, 1016],
            [116, -1, 1111],
            [117, -1, 1124],
            [117, -1, 1187],
            [117, -2, 1192],
            [118, -2, 1271],
            [118, -3, 1320],
            [119, -3, 1370],
            [119, -3, 1388],
            [119, -3, 1455],
            [119, -3, 1457],
            [119, -3, 1466],
            [119, -3, 1612],
            [119, -4, 1645],
            [120, -4, 1661],
            [120, -4, 1782],
        ],
        [
            [-27, -22, 0],
            [0, 0, 0],
            [0, 0, 143],
            [4, 0, 201],
            [8, 0, 209],
            [16, 0, 218],
            [20, 0, 231],
            [23, 0, 234],
            [25, 0, 239],
            [27, 0, 246],
            [30, 0, 255],
            [31, 0, 264],
            [33, 0, 267],
            [34, 0, 276],
            [35, 0, 285],
            [37, 0, 289],
            [37, 0, 297],
            [39, 0, 305],
            [41, 0, 310],
            [43, 0, 318],
            [45, 0, 326],
            [47, 0, 331],
            [50, 0, 339],
            [53, 1, 347],
            [55, 1, 352],
            [57, 1, 359],
            [60, 1, 368],
            [64, 1, 372],
            [66, 1, 382],
            [69, 1, 389],
            [71, 1, 393],
            [74, 2, 401],
            [77, 2, 409],
            [78, 2, 414],
            [80, 2, 422],
            [81, 2, 430],
            [82, 2, 445],
            [83, 2, 452],
            [83, 2, 473],
            [83, 2, 481],
            [84, 2, 535],
            [85, 2, 564],
            [85, 2, 589],
            [86, 2, 626],
            [87, 2, 640],
            [87, 2, 648],
            [90, 2, 652],
            [92, 2, 660],
            [95, 2, 668],
            [97, 2, 673],
            [99, 2, 681],
            [101, 2, 690],
            [103, 2, 697],
            [105, 2, 701],
            [106, 2, 710],
            [107, 2, 718],
            [107, 2, 739],
            [108, 2, 780],
            [109, 2, 836],
            [109, 2, 889],
            [109, 2, 906],
            [111, 2, 919],
            [113, 2, 927],
            [113, 2, 931],
            [114, 1, 939],
            [115, 1, 960],
            [115, 1, 978],
            [115, 1, 1019],
            [116, 1, 1060],
            [116, 1, 1073],
            [117, 1, 1102],
            [117, 1, 1132],
            [117, 1, 1139],
            [117, 1, 1235],
            [118, 1, 1310],
            [119, 1, 1373],
            [119, 1, 1386],
            [119, 0, 1431],
            [119, 0, 1460],
            [119, 0, 1481],
            [120, 0, 1494],
            [120, -1, 1498],
            [121, -1, 1627],
            [121, -1, 1636],
            [121, -1, 1646],
            [121, -1, 1654],
            [121, -1, 1761],
        ],
        [
            [-45, -19, 0],
            [0, 0, 0],
            [5, 1, 185],
            [15, 1, 193],
            [23, 3, 201],
            [31, 4, 207],
            [39, 4, 210],
            [46, 5, 218],
            [51, 5, 227],
            [54, 5, 231],
            [56, 6, 239],
            [59, 6, 248],
            [59, 6, 255],
            [60, 6, 260],
            [61, 6, 268],
            [61, 6, 280],
            [62, 6, 294],
            [63, 6, 301],
            [63, 6, 323],
            [65, 6, 331],
            [69, 7, 339],
            [75, 8, 344],
            [79, 9, 351],
            [85, 11, 360],
            [89, 11, 364],
            [93, 12, 373],
            [96, 13, 377],
            [100, 14, 384],
            [101, 14, 395],
            [103, 15, 402],
            [104, 15, 405],
            [105, 15, 419],
            [105, 15, 422],
            [106, 15, 448],
            [106, 15, 494],
            [107, 15, 497],
            [109, 15, 506],
            [111, 15, 515],
            [115, 15, 518],
            [117, 17, 526],
            [119, 17, 536],
            [122, 17, 539],
            [123, 17, 548],
            [124, 17, 555],
            [125, 17, 585],
            [125, 17, 598],
            [125, 17, 685],
            [125, 17, 901],
            [125, 17, 993],
            [125, 17, 1186],
            [125, 17, 1194],
            [125, 17, 1402],
            [125, 17, 1494],
            [125, 17, 1685],
            [125, 17, 1839],
            [125, 17, 1877],
            [125, 16, 1890],
            [125, 16, 1894],
            [125, 15, 1918],
            [124, 15, 1932],
            [123, 14, 1940],
            [120, 12, 1945],
            [116, 11, 1958],
            [113, 9, 1961],
            [111, 9, 1969],
            [111, 9, 1974],
            [111, 7, 1990],
            [110, 7, 1995],
            [110, 7, 2181],
            [112, 8, 2190],
            [113, 8, 2199],
            [113, 9, 2203],
            [114, 9, 2212],
            [115, 9, 2220],
            [115, 9, 2224],
            [116, 10, 2232],
            [117, 10, 2246],
            [117, 10, 2262],
            [117, 11, 2273],
            [118, 11, 2283],
            [119, 11, 2303],
            [119, 11, 2315],
            [119, 11, 2333],
            [120, 11, 2354],
            [120, 11, 2391],
            [121, 11, 2395],
            [121, 11, 2487],
            [121, 11, 2641],
        ],
        [
            [-43, -34, 0],
            [0, 0, 0],
            [0, 0, 70],
            [2, 0, 186],
            [9, 1, 194],
            [23, 5, 204],
            [29, 6, 212],
            [35, 7, 220],
            [41, 8, 224],
            [45, 8, 232],
            [49, 9, 241],
            [51, 10, 249],
            [53, 10, 253],
            [53, 10, 262],
            [54, 10, 270],
            [55, 11, 274],
            [55, 11, 291],
            [56, 11, 303],
            [57, 11, 324],
            [57, 11, 332],
            [60, 11, 337],
            [63, 12, 345],
            [66, 13, 353],
            [70, 13, 358],
            [73, 14, 365],
            [77, 15, 374],
            [80, 15, 378],
            [82, 15, 386],
            [84, 15, 394],
            [85, 15, 400],
            [86, 15, 408],
            [87, 15, 415],
            [87, 15, 420],
            [88, 15, 449],
            [89, 15, 499],
            [91, 15, 507],
            [94, 17, 512],
            [97, 17, 520],
            [100, 17, 529],
            [101, 17, 533],
            [103, 17, 540],
            [106, 17, 548],
            [107, 17, 554],
            [107, 17, 558],
            [107, 17, 561],
            [108, 17, 570],
            [109, 17, 583],
            [109, 17, 620],
            [110, 17, 682],
            [111, 17, 728],
            [111, 17, 745],
            [111, 17, 750],
            [111, 17, 768],
            [112, 17, 837],
            [113, 17, 850],
            [113, 17, 861],
            [113, 17, 915],
            [114, 17, 920],
            [115, 17, 941],
            [115, 17, 953],
            [116, 17, 1012],
            [117, 17, 1045],
            [117, 17, 1058],
            [117, 17, 1174],
            [118, 17, 1220],
            [118, 17, 1246],
            [119, 17, 1263],
            [119, 17, 1333],
            [119, 17, 1346],
            [120, 17, 1379],
            [120, 17, 1417],
            [121, 17, 1421],
            [121, 16, 1430],
            [121, 16, 1500],
            [121, 16, 1558],
            [121, 16, 1670],
        ],
        [
            [-45, -36, 0],
            [0, 0, 0],
            [0, 0, 96],
            [7, 1, 204],
            [25, 2, 212],
            [37, 2, 221],
            [48, 2, 225],
            [53, 2, 235],
            [63, 2, 238],
            [71, 2, 245],
            [80, 2, 254],
            [85, 2, 262],
            [93, 2, 267],
            [98, 2, 275],
            [105, 1, 283],
            [110, 1, 288],
            [117, 1, 296],
            [120, 1, 304],
            [123, 1, 310],
            [126, 1, 317],
            [128, 1, 325],
            [129, 1, 333],
            [130, 1, 337],
            [131, 1, 350],
            [131, 1, 374],
            [132, 1, 421],
            [132, 1, 492],
            [132, 1, 594],
            [132, 1, 797],
            [132, 1, 995],
            [132, 1, 1104],
            [132, 1, 1145],
            [131, 1, 1179],
            [131, 1, 1184],
            [130, 1, 1192],
            [129, 1, 1200],
            [126, 1, 1204],
            [124, 1, 1213],
            [123, 1, 1218],
            [123, 1, 1226],
            [122, 1, 1234],
            [122, 1, 1300],
            [121, 1, 1333],
            [121, 1, 1486],
            [121, 1, 1604],
            [121, 1, 1669],
        ],
        [
            [-27, -30, 0],
            [0, 0, 0],
            [0, 0, 111],
            [8, 1, 177],
            [19, 3, 186],
            [31, 3, 194],
            [37, 5, 198],
            [46, 7, 203],
            [54, 7, 211],
            [59, 8, 219],
            [66, 9, 227],
            [69, 9, 232],
            [71, 10, 240],
            [73, 11, 245],
            [75, 12, 254],
            [78, 12, 261],
            [79, 13, 267],
            [81, 13, 273],
            [83, 15, 282],
            [83, 15, 291],
            [83, 15, 294],
            [84, 15, 299],
            [85, 15, 312],
            [85, 15, 336],
            [86, 16, 344],
            [89, 16, 353],
            [91, 17, 360],
            [95, 17, 366],
            [97, 19, 374],
            [101, 19, 383],
            [104, 19, 386],
            [106, 20, 395],
            [109, 20, 403],
            [111, 20, 406],
            [113, 21, 416],
            [114, 21, 420],
            [115, 21, 428],
            [115, 21, 436],
            [116, 21, 449],
            [117, 21, 486],
            [117, 21, 499],
            [118, 21, 520],
            [119, 21, 546],
            [119, 21, 591],
            [119, 21, 603],
            [120, 21, 611],
            [121, 21, 724],
            [121, 21, 791],
            [121, 21, 802],
        ],
        [
            [-31, -30, 0],
            [0, 0, 0],
            [0, 0, 52],
            [0, 0, 60],
            [3, 0, 202],
            [11, 1, 210],
            [25, 1, 219],
            [31, 1, 226],
            [37, 3, 235],
            [40, 3, 239],
            [43, 3, 248],
            [45, 3, 256],
            [46, 3, 261],
            [47, 3, 268],
            [48, 3, 278],
            [49, 3, 290],
            [49, 3, 316],
            [50, 3, 344],
            [51, 3, 369],
            [54, 3, 373],
            [58, 4, 381],
            [63, 4, 387],
            [67, 5, 393],
            [70, 5, 403],
            [74, 6, 406],
            [76, 6, 415],
            [79, 7, 423],
            [81, 7, 432],
            [83, 7, 435],
            [84, 7, 444],
            [85, 7, 452],
            [85, 7, 456],
            [86, 7, 477],
            [87, 7, 485],
            [87, 7, 541],
            [87, 7, 548],
            [87, 7, 553],
            [88, 7, 590],
            [89, 7, 611],
            [92, 7, 619],
            [95, 8, 623],
            [99, 8, 631],
            [103, 9, 640],
            [105, 9, 648],
            [109, 10, 652],
            [111, 10, 660],
            [113, 10, 672],
            [115, 10, 673],
            [115, 10, 681],
            [116, 10, 694],
            [117, 10, 715],
            [117, 10, 758],
            [117, 10, 786],
            [118, 10, 827],
            [118, 10, 878],
            [119, 10, 911],
            [119, 10, 950],
            [119, 10, 1039],
            [120, 10, 1052],
            [121, 10, 1190],
            [121, 10, 1278],
            [121, 10, 1304],
            [121, 10, 1374],
            [122, 10, 1382],
            [122, 10, 1552],
            [122, 10, 1593],
        ],
        [
            [-51, -24, 0],
            [0, 0, 0],
            [0, 0, 24],
            [3, 1, 171],
            [10, 1, 180],
            [17, 4, 189],
            [25, 5, 195],
            [32, 7, 200],
            [39, 9, 205],
            [46, 9, 210],
            [49, 11, 216],
            [53, 11, 225],
            [57, 13, 233],
            [61, 13, 238],
            [64, 13, 246],
            [67, 14, 254],
            [71, 15, 259],
            [74, 15, 267],
            [78, 16, 276],
            [81, 16, 280],
            [85, 17, 288],
            [87, 18, 296],
            [91, 18, 301],
            [95, 19, 309],
            [99, 19, 317],
            [100, 19, 321],
            [103, 19, 331],
            [105, 21, 338],
            [108, 21, 344],
            [109, 21, 351],
            [112, 21, 360],
            [113, 21, 368],
            [114, 21, 372],
            [115, 22, 381],
            [115, 22, 385],
            [116, 22, 401],
            [117, 22, 427],
            [117, 22, 472],
            [117, 22, 526],
            [119, 22, 543],
            [119, 22, 576],
            [120, 22, 602],
            [121, 22, 638],
            [121, 22, 660],
            [122, 22, 701],
            [122, 22, 713],
            [123, 22, 752],
            [123, 22, 764],
            [123, 22, 885],
            [123, 22, 885],
        ],
        [
            [-46, -34, 0],
            [0, 0, 0],
            [0, 0, 80],
            [3, 0, 198],
            [7, 1, 204],
            [13, 2, 211],
            [17, 4, 220],
            [20, 5, 225],
            [24, 5, 234],
            [27, 5, 238],
            [28, 7, 247],
            [30, 7, 253],
            [31, 7, 262],
            [32, 7, 269],
            [32, 8, 273],
            [33, 8, 282],
            [33, 8, 304],
            [35, 8, 332],
            [37, 9, 337],
            [39, 10, 349],
            [43, 11, 353],
            [47, 13, 357],
            [52, 15, 366],
            [56, 17, 374],
            [59, 17, 378],
            [65, 19, 387],
            [69, 21, 394],
            [73, 21, 403],
            [75, 21, 407],
            [75, 21, 411],
            [77, 21, 416],
            [77, 21, 424],
            [78, 21, 429],
            [79, 21, 437],
            [79, 21, 441],
            [80, 21, 472],
            [81, 21, 499],
            [81, 21, 520],
            [83, 22, 525],
            [83, 22, 532],
            [86, 22, 540],
            [87, 22, 549],
            [89, 23, 553],
            [91, 23, 561],
            [92, 24, 570],
            [94, 24, 578],
            [95, 25, 582],
            [96, 25, 591],
            [97, 25, 595],
            [98, 25, 603],
            [99, 25, 612],
            [99, 25, 624],
            [100, 25, 662],
            [101, 25, 695],
            [101, 25, 703],
            [104, 25, 708],
            [107, 25, 716],
            [108, 25, 724],
            [109, 25, 728],
            [109, 25, 736],
            [110, 25, 742],
            [111, 25, 766],
            [111, 25, 787],
            [112, 25, 821],
            [113, 25, 904],
            [113, 25, 911],
            [113, 25, 924],
            [114, 25, 962],
            [115, 25, 1004],
            [115, 25, 1024],
            [116, 25, 1036],
            [117, 25, 1058],
            [117, 24, 1075],
            [117, 24, 1079],
            [118, 24, 1095],
            [119, 24, 1100],
            [119, 23, 1108],
            [120, 23, 1116],
            [122, 23, 1121],
            [123, 23, 1128],
            [123, 23, 1136],
            [123, 23, 1141],
            [124, 23, 1158],
            [125, 23, 1170],
            [125, 22, 1207],
            [125, 22, 1212],
            [125, 22, 1217],
            [125, 22, 1405],
            [125, 22, 1413],
            [125, 22, 1586],
            [125, 22, 1599],
        ],
        [
            [-49, -30, 0],
            [0, 0, 0],
            [0, 0, 132],
            [1, 0, 216],
            [6, 2, 224],
            [10, 3, 232],
            [13, 3, 241],
            [19, 5, 244],
            [24, 7, 252],
            [31, 7, 262],
            [36, 8, 265],
            [43, 9, 274],
            [48, 10, 284],
            [55, 10, 291],
            [63, 10, 294],
            [71, 10, 302],
            [79, 10, 307],
            [87, 10, 316],
            [93, 10, 324],
            [93, 10, 328],
            [99, 10, 332],
            [105, 9, 339],
            [110, 9, 345],
            [113, 9, 353],
            [116, 9, 358],
            [119, 8, 366],
            [121, 8, 373],
            [123, 8, 378],
            [125, 7, 386],
            [125, 7, 394],
            [127, 7, 398],
            [127, 7, 408],
            [128, 7, 416],
            [129, 7, 420],
            [130, 7, 428],
            [131, 7, 437],
            [131, 5, 440],
            [132, 5, 449],
            [133, 5, 462],
            [134, 5, 478],
            [135, 5, 528],
            [135, 5, 583],
            [135, 5, 623],
            [135, 5, 715],
            [133, 3, 739],
            [131, 2, 742],
            [128, 2, 749],
            [127, 1, 758],
            [125, 1, 766],
            [123, 0, 770],
            [123, 0, 779],
            [122, 0, 787],
            [121, -1, 791],
            [121, -1, 799],
            [120, -1, 817],
            [120, -1, 825],
            [120, -1, 829],
            [120, -1, 991],
            [120, -1, 1124],
            [120, -1, 1326],
            [120, -1, 1500],
            [120, -1, 1632],
            [121, -1, 1680],
            [121, -1, 1697],
            [121, -1, 1708],
            [122, -1, 1729],
            [122, -2, 1737],
            [123, -2, 1763],
            [123, -2, 1779],
            [123, -3, 1784],
            [124, -3, 1800],
            [124, -3, 1830],
            [125, -3, 1850],
            [125, -4, 1854],
            [125, -5, 1871],
            [125, -5, 1875],
            [125, -5, 1896],
            [126, -5, 1916],
            [126, -5, 1987],
            [126, -5, 2132],
            [126, -6, 2266],
            [126, -6, 2331],
            [126, -6, 2354],
        ],
        [
            [-49, -34, 0],
            [0, 0, 0],
            [0, 0, 176],
            [19, 0, 226],
            [31, 0, 233],
            [46, -1, 242],
            [56, -3, 246],
            [67, -3, 254],
            [67, -3, 260],
            [75, -3, 264],
            [84, -5, 268],
            [89, -6, 276],
            [94, -7, 284],
            [98, -7, 288],
            [99, -7, 297],
            [100, -7, 305],
            [101, -7, 310],
            [101, -7, 317],
            [102, -7, 360],
            [103, -7, 417],
            [103, -7, 422],
            [106, -7, 430],
            [108, -7, 438],
            [113, -7, 442],
            [118, -7, 451],
            [121, -7, 459],
            [127, -7, 464],
            [130, -7, 473],
            [133, -7, 481],
            [136, -7, 484],
            [139, -7, 493],
            [139, -7, 501],
            [140, -7, 505],
            [141, -7, 526],
            [141, -7, 534],
            [142, -7, 584],
            [142, -7, 664],
            [142, -7, 768],
            [142, -7, 926],
            [142, -7, 1176],
            [141, -7, 1184],
            [139, -7, 1192],
            [138, -7, 1201],
            [137, -7, 1205],
            [137, -7, 1214],
            [136, -7, 1244],
            [136, -7, 1256],
            [135, -7, 1327],
            [135, -7, 1418],
            [135, -7, 1502],
            [134, -7, 1544],
            [133, -7, 1598],
            [133, -7, 1669],
            [133, -7, 1765],
            [133, -7, 1805],
            [133, -7, 1915],
            [133, -7, 1919],
            [132, -7, 1994],
            [131, -7, 2094],
            [131, -8, 2116],
            [131, -8, 2170],
            [131, -8, 2262],
            [130, -8, 2299],
            [130, -9, 2316],
            [129, -9, 2354],
            [129, -9, 2379],
            [129, -9, 2416],
            [129, -9, 2424],
            [129, -10, 2437],
            [128, -10, 2466],
            [127, -11, 2500],
            [127, -11, 2667],
            [127, -11, 2757],
            [127, -11, 2782],
        ],
        [
            [-57, -13, 0],
            [0, 0, 0],
            [0, 0, 104],
            [2, 0, 204],
            [7, 1, 212],
            [13, 2, 219],
            [18, 3, 224],
            [23, 4, 232],
            [27, 4, 241],
            [29, 5, 246],
            [32, 6, 254],
            [35, 7, 259],
            [36, 7, 269],
            [38, 7, 277],
            [39, 7, 280],
            [40, 7, 288],
            [41, 7, 299],
            [43, 7, 304],
            [43, 8, 308],
            [46, 8, 316],
            [47, 8, 325],
            [48, 8, 330],
            [51, 9, 341],
            [53, 10, 345],
            [56, 10, 353],
            [59, 11, 358],
            [61, 11, 366],
            [65, 12, 375],
            [66, 12, 379],
            [69, 12, 387],
            [71, 13, 395],
            [72, 13, 399],
            [73, 13, 408],
            [73, 13, 416],
            [74, 13, 420],
            [75, 13, 441],
            [75, 13, 454],
            [75, 13, 479],
            [77, 13, 483],
            [79, 13, 491],
            [82, 13, 496],
            [85, 15, 503],
            [87, 15, 512],
            [90, 15, 521],
            [93, 15, 524],
            [94, 15, 534],
            [95, 16, 541],
            [97, 16, 546],
            [98, 16, 554],
            [99, 16, 562],
            [100, 17, 570],
            [101, 17, 576],
            [101, 17, 583],
            [102, 17, 591],
            [103, 17, 604],
            [103, 17, 617],
            [104, 17, 625],
            [105, 17, 629],
            [106, 17, 638],
            [107, 17, 645],
            [107, 17, 667],
            [108, 17, 738],
            [109, 17, 757],
            [109, 17, 796],
            [110, 17, 800],
            [111, 17, 833],
            [111, 17, 862],
            [112, 17, 870],
            [114, 17, 874],
            [116, 19, 883],
            [117, 19, 888],
            [118, 19, 896],
            [119, 19, 904],
            [119, 19, 934],
            [119, 19, 949],
            [120, 19, 953],
            [121, 19, 975],
            [121, 19, 1066],
            [121, 19, 1083],
            [122, 19, 1196],
            [123, 19, 1231],
            [123, 19, 1263],
            [123, 19, 1292],
            [123, 19, 1296],
            [124, 19, 1317],
            [125, 19, 1349],
            [125, 19, 1396],
            [125, 19, 1446],
            [126, 19, 1480],
            [126, 19, 1592],
            [127, 19, 1604],
            [127, 18, 1625],
            [127, 18, 1731],
        ],
        [
            [-33, -26, 0],
            [0, 0, 0],
            [0, 0, 99],
            [11, 3, 183],
            [17, 5, 190],
            [25, 6, 199],
            [31, 8, 203],
            [39, 9, 212],
            [46, 11, 221],
            [53, 13, 224],
            [60, 14, 232],
            [65, 15, 240],
            [69, 16, 249],
            [73, 17, 252],
            [76, 17, 261],
            [76, 17, 265],
            [79, 17, 269],
            [81, 18, 274],
            [84, 19, 282],
            [87, 19, 290],
            [88, 19, 294],
            [91, 19, 303],
            [93, 19, 311],
            [96, 19, 315],
            [99, 21, 324],
            [101, 21, 333],
            [105, 21, 341],
            [107, 21, 345],
            [110, 21, 354],
            [113, 21, 358],
            [115, 21, 365],
            [115, 21, 374],
            [116, 21, 382],
            [117, 21, 386],
            [117, 21, 391],
            [117, 21, 395],
            [119, 21, 416],
            [119, 21, 457],
            [120, 21, 513],
            [121, 21, 533],
            [121, 21, 579],
            [121, 21, 596],
            [122, 21, 604],
            [123, 21, 620],
            [123, 21, 666],
            [124, 21, 708],
            [125, 21, 724],
            [125, 21, 763],
            [125, 21, 796],
            [126, 21, 833],
            [126, 21, 904],
            [127, 21, 925],
            [127, 21, 945],
            [128, 21, 1008],
            [128, 21, 1092],
            [128, 21, 1095],
            [128, 21, 1187],
        ],
        [
            [-35, -21, 0],
            [0, 0, 0],
            [0, 0, 114],
            [5, 0, 213],
            [9, 0, 222],
            [16, 0, 231],
            [23, 0, 235],
            [27, 0, 242],
            [32, 0, 247],
            [37, 0, 255],
            [41, 0, 263],
            [45, 0, 268],
            [48, 0, 276],
            [49, 0, 284],
            [51, 0, 289],
            [53, 0, 296],
            [53, 0, 313],
            [54, 0, 334],
            [55, 0, 356],
            [56, 0, 361],
            [58, 0, 368],
            [61, 0, 376],
            [64, 0, 381],
            [67, 0, 389],
            [71, 0, 393],
            [75, 0, 402],
            [77, 0, 409],
            [81, 0, 414],
            [82, 0, 422],
            [84, 0, 431],
            [85, 0, 438],
            [86, 0, 444],
            [87, 0, 451],
            [87, 0, 492],
            [88, 0, 514],
            [89, 0, 522],
            [89, 0, 526],
            [92, 0, 534],
            [94, 0, 542],
            [97, 0, 547],
            [101, 0, 556],
            [103, 1, 563],
            [108, 1, 568],
            [111, 1, 576],
            [113, 1, 584],
            [115, 1, 592],
            [117, 1, 596],
            [119, 1, 606],
            [119, 1, 618],
            [120, 1, 634],
            [121, 1, 680],
            [121, 1, 743],
            [122, 1, 789],
            [123, 1, 814],
            [123, 1, 852],
            [124, 1, 877],
            [124, 1, 884],
            [125, 1, 914],
            [125, 1, 947],
            [125, 0, 956],
            [126, 0, 976],
            [127, 0, 989],
            [127, 0, 1030],
            [128, 0, 1090],
            [128, 0, 1098],
            [129, 0, 1176],
            [129, -1, 1214],
            [129, -1, 1268],
            [129, -1, 1310],
            [129, -1, 1382],
            [129, -1, 1452],
            [130, -1, 1494],
            [130, -1, 1606],
            [130, -1, 1677],
        ],
        [
            [-39, -40, 0],
            [0, 0, 0],
            [0, 0, 108],
            [3, 1, 199],
            [9, 5, 208],
            [22, 11, 218],
            [29, 14, 225],
            [36, 17, 234],
            [44, 19, 238],
            [53, 21, 246],
            [63, 25, 254],
            [71, 26, 258],
            [79, 27, 267],
            [87, 30, 275],
            [95, 31, 280],
            [101, 31, 288],
            [107, 32, 297],
            [110, 32, 301],
            [113, 32, 309],
            [114, 32, 318],
            [115, 32, 322],
            [115, 32, 330],
            [116, 32, 351],
            [117, 32, 388],
            [117, 32, 430],
            [117, 32, 434],
            [117, 32, 471],
            [119, 33, 505],
            [119, 33, 525],
            [120, 33, 543],
            [121, 33, 568],
            [121, 33, 588],
            [121, 33, 597],
            [122, 33, 605],
            [122, 33, 613],
            [123, 33, 617],
            [123, 33, 629],
            [124, 33, 651],
            [125, 33, 680],
            [125, 33, 721],
            [125, 33, 742],
            [126, 33, 750],
            [127, 33, 792],
            [127, 33, 842],
            [128, 33, 905],
            [128, 33, 930],
            [129, 33, 947],
            [129, 33, 988],
            [129, 33, 1096],
            [130, 33, 1121],
            [130, 33, 1231],
            [130, 33, 1242],
        ],
        [
            [-45, -20, 0],
            [0, 0, 0],
            [0, 0, 15],
            [0, 0, 20],
            [3, 1, 203],
            [12, 5, 211],
            [16, 7, 220],
            [21, 7, 228],
            [27, 10, 233],
            [32, 11, 241],
            [39, 12, 250],
            [44, 13, 254],
            [51, 14, 262],
            [57, 14, 270],
            [61, 15, 274],
            [64, 15, 282],
            [68, 16, 291],
            [71, 16, 295],
            [74, 16, 303],
            [76, 17, 311],
            [77, 17, 316],
            [79, 17, 324],
            [79, 17, 333],
            [80, 17, 337],
            [80, 18, 346],
            [82, 18, 353],
            [83, 18, 358],
            [84, 18, 366],
            [85, 18, 374],
            [87, 19, 379],
            [89, 20, 387],
            [91, 20, 395],
            [93, 21, 399],
            [96, 21, 408],
            [98, 21, 416],
            [101, 23, 424],
            [103, 23, 428],
            [105, 23, 436],
            [105, 24, 441],
            [107, 24, 449],
            [107, 25, 458],
            [108, 25, 478],
            [109, 25, 512],
            [109, 25, 516],
            [109, 25, 521],
            [109, 25, 562],
            [110, 25, 583],
            [111, 25, 612],
            [113, 25, 625],
            [115, 25, 633],
            [117, 25, 641],
            [118, 26, 646],
            [120, 26, 653],
            [121, 26, 661],
            [122, 26, 666],
            [123, 26, 679],
            [123, 26, 703],
            [123, 26, 716],
            [124, 26, 737],
            [125, 26, 799],
            [125, 26, 812],
            [125, 26, 850],
            [126, 26, 954],
            [127, 26, 983],
            [127, 26, 1013],
            [127, 26, 1046],
            [127, 26, 1213],
            [127, 26, 1311],
            [127, 26, 1536],
            [127, 26, 1723],
            [127, 26, 1828],
            [127, 26, 2046],
            [128, 26, 2162],
            [128, 26, 2206],
            [128, 25, 2233],
            [128, 25, 2254],
            [128, 24, 2284],
            [128, 23, 2304],
            [128, 23, 2313],
            [128, 23, 2333],
            [128, 22, 2346],
            [128, 21, 2380],
            [128, 21, 2430],
            [128, 21, 2531],
            [128, 21, 2535],
            [128, 21, 2709],
            [128, 20, 2783],
            [128, 20, 2813],
            [128, 20, 3033],
            [128, 19, 3042],
            [128, 19, 3094],
            [128, 18, 3121],
            [128, 17, 3172],
            [128, 17, 3200],
            [128, 16, 3276],
            [128, 15, 3309],
            [128, 15, 3372],
            [128, 14, 3535],
            [128, 13, 3564],
            [128, 13, 3597],
            [128, 12, 3639],
            [128, 11, 3681],
            [128, 11, 3714],
            [128, 11, 3743],
            [128, 10, 3786],
            [128, 10, 3819],
            [128, 9, 3836],
            [128, 9, 3869],
            [128, 8, 3894],
            [128, 7, 3926],
            [128, 7, 3961],
            [128, 6, 4019],
            [128, 6, 4040],
            [128, 5, 4064],
            [128, 5, 4110],
            [128, 4, 4122],
            [128, 3, 4198],
            [128, 3, 4210],
            [128, 1, 4298],
            [129, -1, 4303],
            [129, -3, 4310],
            [130, -5, 4319],
            [131, -7, 4323],
            [131, -7, 4331],
            [131, -7, 4336],
            [131, -8, 4360],
            [131, -9, 4416],
            [131, -9, 4477],
            [131, -9, 4540],
            [131, -9, 4716],
            [131, -9, 4840],
            [131, -9, 4851],
        ],
        [
            [-50, -43, 0],
            [0, 0, 0],
            [0, 0, 83],
            [4, 1, 201],
            [9, 3, 208],
            [15, 5, 217],
            [19, 7, 220],
            [23, 9, 225],
            [27, 11, 233],
            [29, 11, 242],
            [33, 12, 245],
            [35, 12, 258],
            [37, 13, 260],
            [39, 13, 268],
            [40, 14, 275],
            [41, 14, 283],
            [41, 15, 287],
            [41, 15, 292],
            [41, 15, 296],
            [41, 15, 300],
            [42, 15, 305],
            [43, 15, 367],
            [45, 15, 375],
            [49, 16, 379],
            [53, 18, 388],
            [57, 19, 392],
            [60, 20, 400],
            [63, 21, 408],
            [65, 22, 417],
            [69, 23, 421],
            [72, 23, 430],
            [75, 23, 434],
            [77, 25, 443],
            [79, 25, 450],
            [81, 25, 459],
            [83, 25, 463],
            [84, 25, 473],
            [86, 25, 480],
            [87, 26, 483],
            [88, 26, 492],
            [89, 26, 501],
            [91, 26, 505],
            [93, 26, 512],
            [94, 27, 521],
            [95, 27, 529],
            [97, 27, 534],
            [98, 27, 542],
            [101, 28, 546],
            [102, 28, 554],
            [104, 29, 563],
            [105, 29, 572],
            [105, 29, 575],
            [106, 29, 583],
            [106, 29, 588],
            [107, 29, 596],
            [107, 29, 617],
            [108, 29, 634],
            [109, 29, 675],
            [109, 29, 700],
            [110, 29, 717],
            [111, 29, 729],
            [111, 29, 742],
            [112, 29, 763],
            [113, 29, 784],
            [113, 29, 791],
            [113, 29, 796],
            [115, 29, 801],
            [116, 29, 808],
            [117, 29, 812],
            [119, 29, 821],
            [119, 29, 830],
            [120, 29, 833],
            [121, 29, 842],
            [121, 29, 855],
            [122, 29, 871],
            [123, 29, 896],
            [123, 29, 951],
            [123, 29, 967],
            [124, 29, 1009],
            [124, 29, 1093],
            [125, 29, 1130],
            [125, 29, 1171],
            [126, 29, 1205],
            [127, 29, 1225],
            [127, 29, 1264],
            [128, 29, 1284],
            [128, 29, 1292],
            [128, 29, 1297],
            [128, 28, 1302],
            [129, 28, 1359],
            [129, 28, 1402],
            [129, 27, 1408],
            [130, 27, 1430],
            [130, 27, 1451],
            [130, 27, 1471],
            [131, 27, 1499],
            [131, 27, 1547],
            [131, 27, 1589],
            [131, 26, 1610],
            [131, 26, 1662],
        ],
        [
            [-35, -33, 0],
            [0, 0, 0],
            [0, 0, 141],
            [5, 1, 207],
            [14, 6, 214],
            [21, 9, 222],
            [29, 11, 227],
            [36, 13, 231],
            [43, 15, 242],
            [47, 17, 246],
            [51, 17, 255],
            [53, 18, 260],
            [56, 19, 267],
            [57, 20, 277],
            [59, 20, 281],
            [61, 21, 287],
            [61, 21, 293],
            [62, 21, 296],
            [63, 21, 301],
            [65, 21, 309],
            [65, 21, 329],
            [66, 22, 346],
            [67, 22, 351],
            [71, 23, 360],
            [75, 24, 368],
            [80, 25, 371],
            [83, 26, 379],
            [87, 27, 388],
            [91, 28, 392],
            [93, 28, 401],
            [95, 29, 410],
            [96, 29, 417],
            [97, 29, 422],
            [97, 29, 435],
            [98, 29, 462],
            [98, 29, 484],
            [99, 29, 493],
            [100, 29, 501],
            [103, 30, 506],
            [105, 31, 512],
            [108, 32, 518],
            [111, 32, 526],
            [113, 33, 534],
            [115, 33, 539],
            [117, 33, 546],
            [119, 33, 555],
            [119, 34, 562],
            [121, 34, 569],
            [121, 34, 585],
            [123, 34, 617],
            [123, 34, 630],
            [123, 34, 634],
            [124, 34, 655],
            [125, 34, 679],
            [125, 34, 730],
            [126, 34, 751],
            [127, 34, 788],
            [127, 34, 792],
            [127, 34, 812],
            [128, 34, 851],
            [129, 34, 884],
            [129, 34, 934],
            [130, 34, 967],
            [130, 34, 981],
            [131, 34, 988],
            [131, 34, 1132],
        ],
        [
            [-39, -42, 0],
            [0, 0, 0],
            [0, 0, 90],
            [3, 1, 198],
            [9, 3, 206],
            [16, 6, 214],
            [21, 8, 218],
            [25, 10, 223],
            [31, 11, 231],
            [32, 12, 239],
            [36, 13, 244],
            [37, 13, 252],
            [38, 13, 261],
            [39, 13, 269],
            [39, 14, 282],
            [40, 14, 294],
            [41, 14, 315],
            [41, 15, 340],
            [43, 15, 344],
            [49, 17, 355],
            [53, 18, 358],
            [58, 20, 365],
            [63, 22, 373],
            [67, 23, 382],
            [71, 25, 386],
            [73, 26, 394],
            [75, 27, 399],
            [77, 27, 406],
            [79, 29, 415],
            [80, 29, 419],
            [81, 29, 428],
            [82, 29, 436],
            [84, 30, 444],
            [85, 31, 448],
            [88, 31, 456],
            [91, 33, 465],
            [93, 33, 470],
            [96, 34, 477],
            [100, 35, 486],
            [103, 36, 489],
            [107, 36, 499],
            [109, 37, 507],
            [112, 38, 512],
            [114, 38, 519],
            [115, 38, 527],
            [116, 38, 531],
            [117, 38, 548],
            [117, 38, 573],
            [117, 38, 577],
            [118, 38, 624],
            [119, 38, 639],
            [119, 38, 665],
            [119, 38, 686],
            [120, 38, 715],
            [121, 38, 744],
            [121, 38, 765],
            [122, 38, 819],
            [123, 38, 849],
            [123, 38, 862],
            [124, 38, 899],
            [125, 38, 945],
            [125, 38, 966],
            [126, 38, 1024],
            [127, 38, 1073],
            [127, 38, 1078],
            [127, 38, 1164],
            [127, 38, 1187],
            [128, 38, 1253],
            [129, 38, 1352],
            [129, 38, 1357],
            [129, 37, 1445],
            [131, 37, 1507],
            [131, 37, 1532],
            [131, 37, 1583],
            [131, 37, 1590],
            [132, 37, 1632],
            [132, 36, 1637],
            [132, 36, 1700],
            [132, 36, 1794],
        ],
        [
            [-50, -23, 0],
            [0, 0, 0],
            [0, 0, 94],
            [5, 1, 183],
            [12, 3, 193],
            [20, 6, 200],
            [27, 7, 208],
            [34, 9, 212],
            [41, 11, 219],
            [47, 11, 227],
            [53, 13, 231],
            [57, 13, 241],
            [60, 15, 245],
            [63, 15, 253],
            [64, 15, 261],
            [64, 15, 265],
            [66, 15, 270],
            [67, 15, 273],
            [68, 16, 282],
            [69, 16, 290],
            [69, 16, 295],
            [70, 16, 315],
            [71, 17, 336],
            [74, 17, 344],
            [78, 19, 353],
            [81, 19, 357],
            [85, 21, 366],
            [89, 21, 374],
            [93, 22, 378],
            [98, 23, 386],
            [101, 24, 395],
            [104, 24, 398],
            [105, 24, 407],
            [107, 24, 415],
            [108, 25, 420],
            [109, 25, 428],
            [109, 25, 445],
            [109, 25, 483],
            [110, 25, 507],
            [111, 25, 573],
            [111, 25, 586],
            [111, 25, 623],
            [112, 25, 662],
            [113, 25, 666],
            [116, 27, 673],
            [117, 27, 682],
            [119, 27, 687],
            [119, 27, 702],
            [120, 27, 724],
            [121, 27, 749],
            [121, 27, 757],
            [121, 27, 762],
            [122, 27, 807],
            [123, 27, 820],
            [127, 28, 834],
            [130, 28, 846],
            [131, 28, 846],
            [133, 29, 854],
            [134, 29, 865],
            [135, 29, 870],
            [135, 29, 891],
            [136, 29, 920],
            [137, 29, 961],
            [137, 29, 979],
            [137, 29, 1086],
            [137, 29, 1258],
            [137, 29, 1483],
            [137, 29, 1591],
            [136, 28, 1700],
            [134, 27, 1707],
            [133, 27, 1716],
            [133, 26, 1720],
            [133, 26, 1744],
            [133, 25, 1750],
            [133, 25, 1758],
            [133, 25, 1816],
            [132, 25, 1821],
            [132, 24, 1879],
            [132, 23, 1975],
            [132, 23, 2082],
            [132, 23, 2165],
        ],
        [
            [-59, -37, 0],
            [0, 0, 0],
            [0, 0, 19],
            [6, 2, 177],
            [16, 6, 184],
            [25, 9, 193],
            [39, 13, 198],
            [49, 16, 206],
            [61, 17, 210],
            [66, 19, 221],
            [73, 19, 224],
            [79, 22, 231],
            [86, 22, 239],
            [91, 23, 249],
            [95, 23, 252],
            [99, 24, 260],
            [102, 24, 269],
            [105, 25, 273],
            [107, 25, 281],
            [109, 25, 290],
            [111, 25, 301],
            [111, 25, 307],
            [112, 25, 323],
            [113, 25, 378],
            [113, 25, 436],
            [114, 25, 457],
            [115, 25, 490],
            [115, 25, 498],
            [115, 25, 507],
            [116, 25, 511],
            [117, 25, 532],
            [117, 25, 548],
            [118, 25, 569],
            [119, 25, 582],
            [119, 25, 590],
            [120, 25, 612],
            [121, 25, 618],
            [121, 25, 625],
            [122, 25, 633],
            [123, 25, 641],
            [123, 25, 660],
            [124, 25, 674],
            [125, 25, 686],
            [125, 25, 698],
            [125, 25, 707],
            [126, 25, 731],
            [127, 25, 745],
            [127, 25, 785],
            [127, 25, 806],
            [128, 25, 812],
            [129, 25, 835],
            [129, 24, 865],
            [130, 24, 882],
            [130, 23, 898],
            [131, 23, 902],
            [131, 23, 948],
            [132, 23, 969],
            [132, 23, 1011],
            [133, 22, 1014],
            [133, 22, 1193],
        ],
        [
            [-44, -13, 0],
            [0, 0, 0],
            [0, 0, 32],
            [0, 0, 174],
            [18, 1, 189],
            [29, 2, 198],
            [41, 3, 207],
            [47, 5, 211],
            [54, 5, 220],
            [61, 5, 224],
            [65, 5, 233],
            [68, 7, 238],
            [71, 7, 251],
            [72, 7, 254],
            [73, 7, 263],
            [74, 7, 274],
            [75, 7, 282],
            [75, 7, 319],
            [77, 7, 324],
            [80, 8, 332],
            [84, 8, 336],
            [84, 8, 341],
            [89, 10, 345],
            [94, 11, 353],
            [99, 12, 358],
            [105, 13, 365],
            [110, 14, 374],
            [113, 15, 378],
            [117, 16, 387],
            [120, 16, 395],
            [121, 16, 400],
            [122, 16, 408],
            [123, 16, 424],
            [123, 16, 444],
            [124, 16, 507],
            [124, 16, 527],
            [125, 16, 599],
            [125, 16, 616],
            [126, 16, 654],
            [126, 16, 682],
            [127, 16, 703],
            [127, 16, 724],
            [128, 16, 744],
            [129, 16, 786],
            [129, 16, 812],
            [130, 16, 841],
            [131, 16, 870],
            [131, 16, 911],
            [132, 16, 954],
            [133, 16, 982],
            [133, 16, 1024],
            [133, 16, 1028],
            [133, 16, 1044],
            [133, 16, 1183],
            [133, 16, 1221],
        ],
        [
            [-34, -30, 0],
            [0, 0, 0],
            [0, 0, 56],
            [0, 0, 106],
            [5, 0, 214],
            [11, 0, 223],
            [16, 0, 230],
            [23, 0, 235],
            [29, 0, 239],
            [34, 0, 248],
            [37, 0, 256],
            [43, 0, 260],
            [46, 0, 268],
            [49, 0, 277],
            [51, 0, 281],
            [54, 0, 289],
            [57, 0, 297],
            [58, 0, 306],
            [59, 0, 310],
            [60, 0, 318],
            [61, 0, 323],
            [61, 0, 339],
            [62, 0, 352],
            [63, 0, 362],
            [64, 0, 364],
            [67, 0, 373],
            [71, 0, 381],
            [74, 0, 389],
            [77, 0, 393],
            [81, 0, 402],
            [86, 0, 406],
            [90, 0, 415],
            [93, 0, 423],
            [97, 0, 431],
            [101, 0, 436],
            [103, 0, 443],
            [105, 0, 452],
            [107, 0, 456],
            [109, 0, 464],
            [109, 0, 473],
            [110, 0, 477],
            [111, 0, 485],
            [111, 0, 515],
            [112, 0, 540],
            [112, 0, 560],
            [115, 0, 568],
            [116, 0, 577],
            [119, 0, 581],
            [120, 0, 590],
            [121, 0, 598],
            [123, 0, 606],
            [125, 0, 610],
            [126, 0, 619],
            [128, 0, 623],
            [129, 0, 632],
            [130, 0, 652],
            [131, 0, 681],
            [131, 0, 735],
            [131, 0, 778],
            [132, 0, 835],
            [133, 0, 848],
            [133, -1, 885],
            [133, -1, 890],
            [133, -1, 982],
            [134, -1, 990],
            [134, -1, 1061],
            [134, -1, 1128],
            [134, -1, 1166],
        ],
        [
            [-22, -20, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 99],
            [6, 0, 216],
            [23, 0, 225],
            [31, 0, 232],
            [40, 0, 241],
            [48, 0, 246],
            [48, 0, 250],
            [56, -1, 254],
            [65, -1, 258],
            [74, -1, 269],
            [82, -3, 274],
            [89, -3, 283],
            [95, -3, 290],
            [99, -3, 295],
            [102, -3, 304],
            [106, -3, 311],
            [107, -3, 315],
            [108, -3, 323],
            [109, -3, 328],
            [109, -3, 367],
            [110, -3, 428],
            [110, -3, 500],
            [111, -3, 520],
            [111, -3, 563],
            [112, -3, 588],
            [113, -3, 604],
            [114, -3, 612],
            [117, -3, 616],
            [119, -2, 624],
            [121, -2, 633],
            [123, -2, 637],
            [124, -1, 645],
            [126, -1, 654],
            [127, -1, 658],
            [127, -1, 675],
            [128, -1, 695],
            [129, -1, 707],
            [129, -1, 729],
            [129, -1, 749],
            [130, -1, 791],
            [131, -1, 978],
            [131, -1, 994],
            [131, -1, 1050],
            [131, -1, 1088],
            [132, -1, 1112],
            [133, -1, 1172],
            [133, -1, 1246],
            [133, -1, 1254],
            [134, -1, 1296],
            [135, -1, 1346],
            [134, -1, 1496],
            [134, -1, 1501],
        ],
        [
            [-47, -21, 0],
            [0, 0, 0],
            [0, 0, 147],
            [6, 2, 189],
            [16, 7, 197],
            [26, 12, 206],
            [36, 15, 209],
            [45, 17, 218],
            [55, 19, 225],
            [61, 21, 235],
            [69, 21, 239],
            [77, 21, 247],
            [84, 21, 252],
            [91, 21, 260],
            [95, 21, 269],
            [101, 21, 273],
            [105, 21, 280],
            [108, 21, 290],
            [111, 21, 293],
            [113, 21, 302],
            [115, 21, 310],
            [115, 21, 315],
            [116, 21, 331],
            [117, 21, 351],
            [117, 21, 385],
            [119, 21, 393],
            [120, 21, 401],
            [123, 21, 406],
            [125, 21, 414],
            [125, 21, 423],
            [127, 21, 427],
            [127, 21, 435],
            [129, 21, 441],
            [129, 21, 447],
            [129, 21, 451],
            [130, 21, 465],
            [131, 21, 485],
            [131, 21, 513],
            [132, 21, 518],
            [133, 21, 536],
            [133, 21, 589],
            [133, 21, 635],
            [133, 21, 639],
            [134, 21, 647],
            [134, 21, 744],
            [134, 21, 773],
        ],
        [
            [-43, -29, 0],
            [0, 0, 0],
            [0, 0, 12],
            [7, 0, 176],
            [18, 2, 185],
            [29, 2, 193],
            [41, 3, 198],
            [51, 3, 209],
            [60, 5, 213],
            [71, 5, 217],
            [81, 5, 225],
            [86, 5, 233],
            [93, 5, 240],
            [97, 5, 248],
            [100, 5, 251],
            [103, 5, 260],
            [103, 5, 268],
            [104, 5, 273],
            [105, 5, 281],
            [105, 5, 301],
            [105, 5, 317],
            [106, 5, 375],
            [107, 5, 378],
            [108, 5, 385],
            [111, 6, 394],
            [113, 7, 402],
            [116, 8, 406],
            [118, 9, 415],
            [119, 9, 423],
            [121, 10, 427],
            [123, 10, 436],
            [123, 10, 441],
            [124, 11, 448],
            [125, 11, 456],
            [125, 11, 465],
            [126, 11, 486],
            [127, 11, 498],
            [127, 11, 503],
            [127, 11, 511],
            [128, 11, 535],
            [129, 11, 557],
            [129, 11, 602],
            [130, 11, 652],
            [131, 11, 694],
            [131, 11, 724],
            [131, 11, 728],
            [132, 11, 774],
            [133, 11, 820],
            [133, 11, 856],
            [134, 11, 927],
            [135, 11, 961],
            [135, 11, 1006],
            [135, 11, 1011],
            [135, 11, 1045],
            [135, 11, 1151],
        ],
        [
            [-38, -18, 0],
            [0, 0, 0],
            [0, 0, 148],
            [3, 1, 206],
            [9, 3, 215],
            [14, 5, 222],
            [21, 5, 228],
            [26, 7, 231],
            [30, 7, 240],
            [35, 9, 247],
            [40, 9, 256],
            [44, 9, 261],
            [49, 9, 269],
            [52, 9, 273],
            [56, 9, 281],
            [56, 9, 286],
            [59, 11, 289],
            [61, 11, 294],
            [63, 11, 302],
            [65, 11, 311],
            [67, 11, 319],
            [67, 11, 322],
            [68, 11, 331],
            [69, 11, 336],
            [69, 11, 344],
            [71, 11, 361],
            [71, 11, 365],
            [73, 12, 373],
            [74, 12, 381],
            [75, 13, 385],
            [78, 13, 394],
            [79, 13, 403],
            [82, 13, 407],
            [84, 15, 415],
            [85, 15, 420],
            [87, 15, 428],
            [89, 17, 446],
            [91, 17, 449],
            [91, 17, 460],
            [92, 17, 462],
            [93, 17, 473],
            [93, 17, 486],
            [93, 17, 490],
            [94, 17, 519],
            [94, 18, 527],
            [95, 18, 540],
            [95, 19, 548],
            [98, 19, 557],
            [99, 19, 560],
            [102, 21, 570],
            [105, 21, 574],
            [107, 22, 582],
            [110, 23, 589],
            [113, 23, 599],
            [114, 24, 602],
            [115, 24, 610],
            [117, 24, 619],
            [119, 25, 623],
            [119, 25, 631],
            [120, 25, 640],
            [120, 25, 653],
            [121, 25, 665],
            [121, 25, 693],
            [122, 25, 765],
            [123, 25, 794],
            [123, 25, 828],
            [124, 25, 861],
            [125, 25, 890],
            [125, 25, 903],
            [127, 25, 919],
            [128, 25, 924],
            [129, 25, 932],
            [130, 25, 940],
            [131, 25, 945],
            [133, 25, 953],
            [134, 25, 961],
            [135, 25, 965],
            [136, 25, 973],
            [137, 25, 981],
            [137, 25, 986],
            [137, 25, 1002],
            [138, 25, 1015],
            [139, 25, 1045],
            [139, 25, 1107],
            [139, 25, 1157],
            [139, 25, 1289],
            [139, 25, 1500],
            [139, 25, 1657],
            [139, 25, 1799],
            [139, 24, 1953],
            [139, 24, 1970],
            [139, 23, 1974],
            [139, 23, 1987],
            [139, 23, 1991],
            [138, 23, 1994],
            [138, 23, 1999],
            [137, 22, 2054],
            [137, 21, 2066],
            [136, 21, 2087],
            [136, 21, 2095],
            [136, 20, 2116],
            [135, 19, 2128],
            [135, 19, 2150],
            [135, 19, 2153],
            [135, 19, 2158],
            [135, 19, 2299],
            [135, 19, 2438],
        ],
        [
            [-24, -20, 0],
            [0, 0, 0],
            [0, 0, 119],
            [5, 1, 160],
            [22, 5, 168],
            [32, 7, 176],
            [40, 10, 185],
            [49, 11, 189],
            [55, 12, 197],
            [62, 13, 206],
            [65, 13, 210],
            [69, 14, 218],
            [72, 14, 227],
            [75, 15, 231],
            [76, 15, 240],
            [77, 16, 248],
            [79, 16, 256],
            [82, 17, 261],
            [83, 17, 269],
            [85, 17, 277],
            [87, 19, 281],
            [90, 19, 289],
            [93, 20, 297],
            [95, 22, 302],
            [98, 22, 310],
            [101, 24, 318],
            [103, 24, 322],
            [106, 25, 331],
            [109, 27, 339],
            [110, 27, 343],
            [112, 27, 351],
            [113, 27, 361],
            [113, 27, 364],
            [114, 27, 380],
            [115, 27, 394],
            [115, 27, 472],
            [115, 27, 476],
            [115, 28, 485],
            [116, 28, 498],
            [117, 28, 548],
            [118, 29, 556],
            [121, 29, 559],
            [121, 29, 569],
            [123, 29, 577],
            [123, 29, 602],
            [124, 29, 618],
            [124, 29, 632],
            [125, 29, 660],
            [126, 29, 715],
            [127, 29, 735],
            [127, 29, 784],
            [128, 29, 823],
            [129, 29, 835],
            [129, 29, 856],
            [129, 29, 865],
            [130, 29, 890],
            [131, 29, 918],
            [131, 29, 939],
            [132, 29, 960],
            [133, 29, 994],
            [133, 29, 1031],
            [134, 29, 1061],
            [135, 29, 1094],
            [135, 29, 1151],
            [135, 29, 1177],
            [135, 29, 1185],
            [135, 29, 1270],
        ],
        [
            [-43, -31, 0],
            [0, 0, 0],
            [0, 0, 107],
            [0, 0, 174],
            [4, 0, 232],
            [13, 0, 240],
            [19, 1, 248],
            [25, 1, 253],
            [34, 1, 262],
            [41, 3, 270],
            [45, 3, 275],
            [51, 3, 283],
            [56, 4, 288],
            [59, 4, 295],
            [63, 4, 304],
            [65, 4, 309],
            [68, 4, 317],
            [69, 4, 324],
            [71, 4, 330],
            [72, 4, 337],
            [73, 4, 345],
            [73, 4, 354],
            [74, 4, 357],
            [75, 4, 375],
            [76, 4, 387],
            [77, 4, 395],
            [80, 4, 399],
            [85, 4, 407],
            [89, 4, 417],
            [92, 4, 421],
            [95, 4, 429],
            [101, 4, 437],
            [104, 4, 441],
            [107, 4, 450],
            [111, 4, 459],
            [113, 4, 462],
            [115, 4, 470],
            [116, 4, 479],
            [117, 4, 488],
            [117, 4, 500],
            [118, 4, 521],
            [119, 4, 533],
            [119, 4, 575],
            [119, 4, 600],
            [120, 4, 633],
            [121, 4, 654],
            [121, 4, 663],
            [121, 4, 683],
            [122, 4, 725],
            [123, 4, 750],
            [123, 4, 770],
            [124, 4, 787],
            [125, 3, 791],
            [127, 3, 800],
            [131, 2, 808],
            [135, 2, 812],
            [136, 1, 820],
            [137, 1, 830],
            [139, 1, 833],
            [141, 1, 842],
            [141, 1, 846],
            [141, 1, 854],
            [142, 1, 863],
            [143, 1, 879],
            [143, 1, 904],
            [144, 1, 987],
            [145, 1, 1037],
            [145, 1, 1116],
            [144, 1, 1128],
            [143, 1, 1133],
            [143, 1, 1141],
            [142, 1, 1150],
            [141, 1, 1159],
            [141, 1, 1162],
            [140, 1, 1171],
            [139, 1, 1175],
            [139, 1, 1179],
            [139, 1, 1183],
            [138, 1, 1200],
            [137, 1, 1205],
            [137, 1, 1221],
            [136, 1, 1242],
            [136, 1, 1375],
            [136, 1, 1616],
            [136, 1, 1634],
        ],
        [
            [-39, -42, 0],
            [0, 0, 0],
            [0, 0, 74],
            [3, 1, 207],
            [11, 3, 216],
            [21, 6, 225],
            [27, 9, 232],
            [30, 9, 239],
            [33, 9, 247],
            [35, 10, 256],
            [37, 10, 262],
            [37, 10, 270],
            [39, 10, 276],
            [40, 11, 284],
            [41, 11, 291],
            [42, 11, 295],
            [44, 11, 303],
            [47, 13, 312],
            [51, 13, 317],
            [54, 13, 325],
            [58, 15, 330],
            [63, 16, 338],
            [67, 17, 346],
            [71, 18, 350],
            [74, 19, 358],
            [77, 21, 366],
            [79, 21, 371],
            [82, 22, 380],
            [84, 23, 387],
            [87, 23, 395],
            [88, 23, 399],
            [89, 23, 409],
            [90, 23, 413],
            [91, 23, 421],
            [91, 23, 429],
            [92, 23, 434],
            [92, 24, 450],
            [94, 24, 458],
            [97, 24, 463],
            [100, 25, 471],
            [103, 25, 480],
            [105, 26, 483],
            [108, 26, 492],
            [111, 27, 500],
            [113, 27, 504],
            [115, 27, 517],
            [118, 27, 521],
            [121, 27, 529],
            [122, 27, 534],
            [125, 27, 541],
            [125, 27, 546],
            [127, 29, 554],
            [128, 29, 562],
            [128, 29, 567],
            [129, 29, 575],
            [129, 29, 604],
            [130, 29, 646],
            [131, 29, 708],
            [131, 29, 717],
            [131, 29, 746],
            [132, 29, 779],
            [133, 29, 812],
            [133, 29, 841],
            [134, 29, 864],
            [135, 29, 884],
            [135, 29, 898],
            [135, 28, 921],
            [136, 28, 963],
            [136, 28, 1032],
        ],
        [
            [-47, -32, 0],
            [0, 0, 0],
            [0, 0, 73],
            [1, 0, 281],
            [4, 0, 289],
            [6, 0, 298],
            [8, 1, 301],
            [8, 1, 308],
            [11, 1, 312],
            [12, 1, 315],
            [13, 1, 323],
            [15, 1, 330],
            [16, 1, 339],
            [17, 1, 343],
            [17, 1, 360],
            [18, 1, 401],
            [18, 1, 407],
            [19, 2, 415],
            [21, 2, 423],
            [25, 3, 427],
            [29, 3, 435],
            [33, 4, 444],
            [37, 4, 448],
            [41, 5, 457],
            [44, 5, 465],
            [48, 6, 469],
            [51, 6, 478],
            [54, 6, 486],
            [55, 6, 490],
            [57, 7, 498],
            [58, 7, 506],
            [59, 7, 515],
            [59, 7, 527],
            [60, 7, 537],
            [61, 7, 560],
            [61, 7, 573],
            [61, 7, 577],
            [61, 7, 581],
            [63, 7, 590],
            [66, 7, 598],
            [70, 7, 602],
            [75, 7, 610],
            [80, 8, 619],
            [83, 8, 624],
            [87, 8, 631],
            [91, 8, 640],
            [93, 8, 648],
            [96, 8, 653],
            [97, 9, 660],
            [99, 9, 665],
            [99, 9, 673],
            [100, 9, 686],
            [101, 9, 723],
            [101, 9, 786],
            [102, 9, 794],
            [104, 9, 799],
            [106, 9, 807],
            [110, 9, 815],
            [113, 9, 819],
            [113, 9, 823],
            [117, 9, 827],
            [122, 9, 836],
            [126, 9, 844],
            [129, 11, 848],
            [133, 11, 856],
            [135, 11, 861],
            [136, 11, 870],
            [137, 11, 878],
            [137, 11, 882],
            [137, 11, 912],
            [138, 11, 928],
            [139, 11, 969],
            [139, 11, 1074],
            [139, 11, 1332],
            [139, 11, 1423],
            [139, 11, 1582],
            [139, 11, 1823],
            [139, 11, 1915],
            [138, 11, 1962],
            [138, 10, 1966],
            [138, 9, 2033],
            [138, 9, 2069],
            [137, 9, 2095],
            [137, 9, 2190],
            [137, 9, 2324],
            [137, 9, 2333],
            [137, 9, 2412],
            [137, 9, 2417],
        ],
        [
            [-31, -23, 0],
            [0, 0, 0],
            [0, 0, 98],
            [4, 1, 190],
            [11, 3, 197],
            [17, 4, 207],
            [24, 5, 210],
            [31, 5, 220],
            [36, 6, 227],
            [41, 6, 232],
            [46, 6, 240],
            [49, 6, 249],
            [52, 6, 253],
            [52, 6, 257],
            [55, 6, 262],
            [56, 6, 266],
            [59, 6, 274],
            [60, 6, 279],
            [62, 7, 286],
            [63, 7, 295],
            [64, 7, 302],
            [65, 7, 316],
            [65, 7, 332],
            [67, 7, 337],
            [68, 7, 346],
            [72, 7, 350],
            [75, 9, 357],
            [77, 9, 365],
            [82, 11, 373],
            [86, 11, 378],
            [91, 11, 387],
            [94, 11, 394],
            [98, 12, 403],
            [101, 12, 407],
            [103, 13, 415],
            [105, 13, 420],
            [105, 13, 428],
            [106, 13, 436],
            [107, 13, 441],
            [107, 13, 457],
            [108, 13, 478],
            [109, 13, 483],
            [113, 13, 491],
            [118, 13, 499],
            [122, 13, 503],
            [125, 13, 511],
            [129, 13, 519],
            [133, 12, 528],
            [136, 12, 532],
            [140, 12, 541],
            [141, 12, 549],
            [144, 12, 552],
            [145, 12, 561],
            [145, 12, 574],
            [145, 12, 587],
            [146, 12, 594],
            [147, 12, 623],
            [147, 12, 686],
            [148, 12, 723],
            [148, 11, 736],
            [149, 11, 745],
            [149, 11, 760],
            [148, 11, 919],
            [147, 11, 924],
            [147, 11, 933],
            [145, 11, 940],
            [143, 11, 945],
            [141, 11, 953],
            [141, 11, 961],
            [139, 11, 966],
            [139, 11, 983],
            [138, 11, 1007],
            [137, 11, 1053],
            [137, 11, 1078],
            [137, 11, 1083],
            [137, 11, 1261],
            [137, 11, 1423],
            [137, 11, 1586],
            [137, 11, 1761],
            [137, 11, 1928],
            [137, 11, 2104],
            [137, 11, 2256],
        ],
        [
            [-41, -20, 0],
            [0, 0, 0],
            [0, 0, 98],
            [0, 0, 199],
            [13, 1, 231],
            [21, 1, 240],
            [31, 4, 247],
            [39, 4, 257],
            [47, 5, 261],
            [55, 6, 269],
            [62, 6, 278],
            [69, 7, 281],
            [75, 9, 290],
            [81, 9, 298],
            [83, 9, 302],
            [85, 9, 310],
            [87, 9, 319],
            [88, 9, 323],
            [89, 9, 332],
            [89, 9, 340],
            [90, 9, 344],
            [91, 9, 353],
            [91, 9, 361],
            [93, 9, 394],
            [95, 9, 402],
            [99, 9, 407],
            [103, 9, 418],
            [106, 9, 423],
            [111, 9, 427],
            [116, 9, 435],
            [119, 9, 443],
            [123, 9, 452],
            [125, 9, 456],
            [127, 9, 464],
            [129, 9, 469],
            [129, 9, 486],
            [130, 9, 498],
            [131, 9, 527],
            [131, 9, 582],
            [131, 9, 590],
            [132, 9, 645],
            [133, 9, 682],
            [133, 9, 715],
            [134, 9, 752],
            [135, 9, 778],
            [135, 9, 820],
            [135, 9, 840],
            [135, 9, 844],
            [136, 9, 858],
            [137, 9, 882],
            [137, 9, 962],
            [138, 9, 1011],
            [138, 9, 1068],
        ],
        [
            [-54, -23, 0],
            [0, 0, 0],
            [0, 0, 157],
            [5, 0, 213],
            [18, 2, 224],
            [25, 2, 232],
            [31, 2, 239],
            [38, 3, 246],
            [44, 3, 254],
            [51, 4, 262],
            [59, 5, 267],
            [66, 5, 276],
            [71, 7, 283],
            [77, 7, 288],
            [83, 9, 297],
            [89, 9, 301],
            [96, 11, 309],
            [96, 11, 313],
            [100, 12, 317],
            [104, 13, 325],
            [107, 13, 329],
            [109, 13, 339],
            [111, 14, 343],
            [112, 14, 351],
            [113, 14, 359],
            [114, 14, 368],
            [115, 14, 370],
            [116, 14, 388],
            [117, 14, 408],
            [117, 14, 421],
            [118, 14, 435],
            [119, 14, 441],
            [119, 15, 451],
            [121, 15, 454],
            [124, 16, 463],
            [127, 16, 471],
            [139, 17, 504],
            [140, 17, 512],
            [141, 17, 529],
            [141, 17, 535],
            [142, 17, 563],
            [143, 17, 598],
            [144, 17, 634],
            [144, 17, 642],
            [144, 17, 647],
            [144, 17, 818],
            [144, 17, 975],
            [144, 17, 1150],
            [144, 17, 1316],
            [144, 17, 1475],
            [143, 17, 1516],
            [142, 17, 1540],
            [141, 17, 1562],
            [141, 17, 1576],
            [140, 16, 1609],
            [139, 16, 1634],
            [139, 16, 1642],
            [139, 15, 1650],
            [139, 15, 1659],
            [138, 15, 1680],
            [138, 15, 1687],
            [137, 15, 1717],
            [137, 15, 1813],
            [137, 15, 1972],
            [138, 15, 2005],
            [138, 15, 2011],
        ],
        [
            [-31, -12, 0],
            [0, 0, 0],
            [0, 0, 120],
            [3, 0, 177],
            [11, 0, 187],
            [18, 0, 195],
            [25, 0, 199],
            [33, 0, 203],
            [39, 0, 211],
            [45, 0, 217],
            [52, 0, 225],
            [57, 0, 233],
            [61, 0, 242],
            [64, 0, 245],
            [68, 0, 253],
            [70, 0, 258],
            [73, 0, 267],
            [77, 0, 275],
            [79, 0, 279],
            [81, 0, 287],
            [83, 0, 296],
            [85, 0, 300],
            [85, 0, 305],
            [88, 0, 309],
            [91, 0, 316],
            [93, 0, 325],
            [97, 0, 329],
            [101, 0, 338],
            [104, 0, 342],
            [109, 1, 351],
            [114, 1, 358],
            [117, 1, 366],
            [120, 1, 371],
            [123, 1, 379],
            [124, 1, 387],
            [125, 1, 392],
            [125, 1, 400],
            [126, 1, 457],
            [127, 1, 504],
            [128, 1, 533],
            [129, 1, 546],
            [131, 1, 553],
            [132, 1, 562],
            [133, 1, 568],
            [133, 1, 575],
            [134, 1, 595],
            [134, 1, 609],
            [135, 1, 616],
            [135, 1, 630],
            [137, 1, 708],
            [137, 1, 729],
            [138, 1, 771],
            [138, 1, 804],
            [139, 1, 853],
            [139, 1, 895],
            [139, 1, 958],
            [139, 1, 1018],
        ],
        [
            [-39, -14, 0],
            [0, 0, 0],
            [0, 0, 55],
            [0, 0, 213],
            [2, 0, 256],
            [5, 0, 264],
            [9, 0, 273],
            [9, 0, 280],
            [10, 0, 289],
            [11, 0, 301],
            [11, 0, 319],
            [12, 0, 331],
            [13, 0, 401],
            [14, 0, 405],
            [16, 0, 415],
            [19, 0, 423],
            [21, 0, 426],
            [23, 0, 435],
            [26, 0, 444],
            [27, 0, 447],
            [30, 0, 456],
            [33, 0, 464],
            [34, 0, 468],
            [36, 0, 477],
            [37, -1, 485],
            [39, -1, 489],
            [40, -1, 497],
            [41, -1, 506],
            [41, -1, 510],
            [42, -1, 531],
            [43, -1, 547],
            [43, -1, 560],
            [44, -1, 591],
            [45, -1, 594],
            [47, -1, 602],
            [51, -1, 610],
            [53, -1, 618],
            [57, -1, 622],
            [59, -1, 631],
            [64, -1, 639],
            [67, -1, 644],
            [72, -1, 652],
            [75, -1, 657],
            [77, -1, 664],
            [80, -1, 674],
            [81, -1, 681],
            [83, -1, 685],
            [85, -1, 694],
            [85, -1, 701],
            [86, -1, 710],
            [87, -1, 714],
            [87, -1, 719],
            [87, -1, 723],
            [88, -1, 727],
            [89, -1, 743],
            [89, -1, 756],
            [90, -1, 797],
            [91, -1, 848],
            [91, -1, 869],
            [92, -1, 897],
            [92, -2, 910],
            [93, -2, 939],
            [93, -2, 968],
            [93, -2, 989],
            [95, -3, 1000],
            [97, -3, 1010],
            [100, -3, 1014],
            [103, -3, 1022],
            [104, -4, 1030],
            [106, -4, 1035],
            [107, -5, 1043],
            [108, -5, 1051],
            [109, -5, 1059],
            [109, -5, 1064],
            [109, -6, 1080],
            [109, -6, 1085],
            [110, -6, 1114],
            [111, -6, 1176],
            [111, -6, 1218],
            [111, -6, 1221],
            [111, -6, 1280],
            [112, -7, 1322],
            [114, -7, 1328],
            [115, -7, 1337],
            [118, -7, 1344],
            [119, -8, 1349],
            [121, -8, 1356],
            [122, -8, 1365],
            [123, -8, 1370],
            [123, -8, 1378],
            [123, -8, 1465],
            [123, -8, 1566],
            [123, -8, 1722],
            [123, -8, 1965],
            [123, -8, 2057],
            [123, -8, 2215],
            [124, -8, 2231],
            [125, -9, 2241],
            [126, -9, 2248],
            [127, -9, 2252],
            [127, -9, 2262],
            [129, -9, 2270],
            [129, -9, 2274],
            [130, -9, 2282],
            [131, -9, 2302],
            [131, -9, 2460],
            [131, -9, 2563],
            [131, -9, 2611],
            [132, -9, 2620],
            [133, -9, 2628],
            [134, -9, 2632],
            [135, -9, 2658],
            [135, -9, 2724],
            [136, -9, 2783],
            [137, -9, 2937],
            [137, -9, 2972],
            [137, -9, 2989],
            [137, -9, 2996],
            [138, -9, 3017],
            [139, -9, 3039],
            [139, -9, 3063],
            [139, -10, 3071],
            [139, -10, 3084],
            [140, -10, 3134],
            [140, -10, 3217],
            [140, -10, 3222],
            [140, -10, 3284],
        ],
        [
            [-41, -24, 0],
            [0, 0, 0],
            [0, 0, 162],
            [0, 0, 170],
            [4, 1, 204],
            [11, 2, 213],
            [17, 5, 221],
            [23, 7, 226],
            [29, 8, 234],
            [35, 10, 237],
            [40, 11, 247],
            [43, 11, 255],
            [45, 12, 258],
            [48, 13, 266],
            [49, 13, 274],
            [51, 13, 283],
            [53, 13, 288],
            [55, 13, 295],
            [57, 15, 300],
            [59, 15, 308],
            [61, 15, 316],
            [64, 16, 326],
            [65, 16, 330],
            [68, 17, 338],
            [69, 18, 343],
            [72, 18, 351],
            [75, 19, 359],
            [77, 19, 367],
            [80, 21, 371],
            [83, 21, 379],
            [85, 22, 388],
            [88, 22, 392],
            [91, 23, 401],
            [94, 24, 409],
            [97, 25, 414],
            [99, 26, 422],
            [102, 26, 430],
            [103, 26, 434],
            [104, 27, 442],
            [106, 27, 450],
            [107, 27, 455],
            [108, 27, 464],
            [109, 27, 471],
            [111, 28, 477],
            [113, 29, 485],
            [114, 29, 492],
            [115, 30, 497],
            [116, 30, 505],
            [117, 30, 512],
            [117, 30, 517],
            [117, 31, 526],
            [118, 31, 534],
            [119, 31, 568],
            [119, 31, 609],
            [120, 31, 617],
            [121, 31, 622],
            [123, 32, 631],
            [125, 32, 638],
            [125, 32, 643],
            [126, 32, 652],
            [127, 32, 660],
            [127, 32, 702],
            [128, 32, 743],
            [129, 32, 780],
            [129, 32, 784],
            [129, 32, 813],
            [130, 32, 846],
            [132, 32, 861],
            [134, 32, 868],
            [137, 33, 877],
            [139, 33, 885],
            [141, 33, 889],
            [142, 33, 898],
            [143, 33, 905],
            [145, 33, 909],
            [147, 33, 918],
            [147, 33, 926],
            [148, 33, 934],
            [149, 33, 948],
            [149, 33, 956],
            [149, 33, 960],
            [150, 33, 975],
            [150, 33, 1156],
            [150, 33, 1171],
            [150, 33, 1196],
            [149, 33, 1205],
            [149, 33, 1213],
            [149, 32, 1218],
            [148, 32, 1227],
            [147, 32, 1231],
            [147, 32, 1239],
            [147, 31, 1248],
            [146, 31, 1257],
            [145, 31, 1260],
            [145, 31, 1268],
            [145, 31, 1277],
            [144, 31, 1281],
            [143, 31, 1289],
            [143, 31, 1302],
            [142, 31, 1331],
            [141, 31, 1345],
            [141, 31, 1373],
            [140, 31, 1402],
            [140, 31, 1451],
            [140, 31, 1655],
            [140, 31, 1724],
        ],
        [
            [-41, -28, 0],
            [0, 0, 0],
            [0, 0, 69],
            [3, 0, 219],
            [9, 3, 229],
            [16, 5, 236],
            [23, 6, 239],
            [29, 7, 252],
            [35, 8, 256],
            [40, 9, 260],
            [45, 9, 269],
            [49, 9, 277],
            [55, 10, 280],
            [60, 10, 289],
            [65, 10, 297],
            [69, 10, 302],
            [72, 10, 310],
            [73, 10, 315],
            [75, 9, 322],
            [76, 9, 331],
            [77, 9, 339],
            [77, 9, 343],
            [78, 9, 364],
            [79, 9, 381],
            [79, 9, 415],
            [80, 9, 423],
            [81, 8, 427],
            [83, 8, 435],
            [85, 7, 444],
            [87, 7, 449],
            [89, 7, 456],
            [91, 7, 465],
            [92, 7, 468],
            [92, 7, 472],
            [95, 7, 477],
            [95, 7, 485],
            [96, 7, 490],
            [97, 7, 497],
            [98, 7, 506],
            [99, 7, 520],
            [99, 7, 527],
            [100, 7, 539],
            [101, 7, 568],
            [102, 7, 577],
            [103, 7, 581],
            [106, 7, 590],
            [108, 7, 598],
            [111, 8, 602],
            [112, 9, 610],
            [114, 9, 619],
            [115, 10, 623],
            [117, 10, 631],
            [119, 11, 639],
            [119, 11, 644],
            [120, 11, 652],
            [121, 11, 693],
            [121, 11, 743],
            [121, 11, 757],
            [122, 12, 764],
            [123, 12, 773],
            [126, 13, 776],
            [129, 13, 785],
            [130, 13, 794],
            [133, 13, 799],
            [133, 13, 806],
            [135, 13, 811],
            [137, 14, 827],
            [137, 14, 844],
            [138, 14, 849],
            [139, 14, 860],
            [139, 14, 897],
            [139, 14, 973],
            [140, 14, 981],
            [141, 14, 1040],
            [141, 14, 1065],
            [141, 14, 1215],
            [141, 14, 1252],
            [141, 14, 1424],
        ],
        [
            [-41, -20, 0],
            [0, 0, 0],
            [0, 0, 100],
            [5, 0, 190],
            [13, 1, 199],
            [20, 1, 207],
            [27, 1, 211],
            [32, 3, 220],
            [37, 3, 229],
            [41, 3, 234],
            [44, 3, 241],
            [47, 5, 245],
            [49, 5, 254],
            [52, 5, 263],
            [53, 5, 266],
            [56, 6, 276],
            [59, 7, 281],
            [61, 7, 288],
            [64, 8, 296],
            [67, 9, 304],
            [69, 9, 308],
            [72, 10, 317],
            [75, 11, 325],
            [78, 11, 329],
            [81, 11, 338],
            [85, 13, 346],
            [87, 13, 350],
            [91, 14, 357],
            [93, 14, 366],
            [96, 15, 371],
            [97, 15, 378],
            [99, 16, 387],
            [101, 16, 396],
            [101, 16, 400],
            [102, 16, 408],
            [103, 16, 416],
            [103, 16, 420],
            [104, 16, 428],
            [105, 16, 437],
            [105, 16, 442],
            [106, 16, 449],
            [107, 16, 458],
            [108, 16, 462],
            [110, 17, 471],
            [111, 17, 480],
            [113, 17, 487],
            [115, 17, 495],
            [116, 17, 499],
            [117, 17, 508],
            [118, 17, 512],
            [119, 18, 521],
            [119, 18, 532],
            [120, 18, 553],
            [120, 18, 596],
            [120, 18, 600],
            [121, 18, 604],
            [122, 18, 616],
            [123, 18, 633],
            [123, 18, 679],
            [124, 18, 700],
            [125, 18, 724],
            [128, 18, 730],
            [130, 18, 738],
            [133, 18, 742],
            [135, 19, 749],
            [137, 19, 759],
            [139, 19, 766],
            [141, 19, 770],
            [142, 19, 778],
            [143, 19, 784],
            [144, 19, 791],
            [145, 19, 809],
            [145, 19, 834],
            [146, 19, 849],
            [146, 19, 908],
            [147, 19, 962],
            [147, 19, 1104],
            [146, 19, 1201],
            [145, 19, 1213],
            [145, 19, 1234],
            [144, 19, 1255],
            [144, 19, 1263],
            [143, 19, 1275],
            [143, 19, 1292],
            [143, 19, 1296],
            [142, 19, 1317],
            [141, 19, 1393],
            [141, 19, 1397],
            [141, 19, 1599],
            [141, 19, 1767],
            [141, 19, 1781],
        ],
        [
            [-53, -34, 0],
            [0, 0, 0],
            [0, 0, 126],
            [5, 1, 176],
            [13, 2, 185],
            [37, 8, 204],
            [43, 8, 210],
            [51, 9, 224],
            [55, 9, 230],
            [57, 10, 239],
            [59, 10, 247],
            [61, 10, 253],
            [63, 10, 259],
            [65, 11, 268],
            [68, 11, 273],
            [71, 12, 281],
            [74, 13, 288],
            [78, 13, 297],
            [81, 13, 302],
            [85, 15, 310],
            [91, 15, 315],
            [95, 15, 323],
            [99, 15, 330],
            [104, 17, 339],
            [107, 17, 344],
            [108, 17, 352],
            [109, 17, 356],
            [109, 17, 363],
            [110, 17, 380],
            [111, 17, 385],
            [111, 17, 414],
            [112, 17, 427],
            [113, 17, 435],
            [116, 17, 443],
            [119, 17, 448],
            [121, 19, 456],
            [125, 19, 463],
            [127, 19, 469],
            [130, 19, 476],
            [132, 20, 484],
            [133, 20, 490],
            [134, 20, 505],
            [135, 20, 514],
            [135, 20, 527],
            [136, 20, 555],
            [137, 20, 598],
            [137, 20, 609],
            [137, 20, 648],
            [138, 20, 709],
            [139, 20, 723],
            [139, 20, 814],
            [139, 20, 818],
            [140, 20, 848],
            [141, 20, 931],
            [141, 20, 939],
            [141, 20, 1014],
            [141, 20, 1126],
            [141, 21, 1192],
            [141, 21, 1200],
        ],
        [
            [-36, -40, 0],
            [0, 0, 0],
            [0, 0, 1],
            [7, 2, 197],
            [20, 3, 205],
            [31, 5, 215],
            [45, 9, 219],
            [56, 11, 223],
            [63, 13, 231],
            [73, 15, 239],
            [80, 17, 248],
            [87, 18, 252],
            [93, 19, 261],
            [99, 20, 268],
            [103, 21, 273],
            [109, 22, 282],
            [111, 22, 290],
            [114, 23, 294],
            [117, 23, 302],
            [118, 23, 310],
            [119, 23, 315],
            [119, 23, 331],
            [120, 23, 360],
            [120, 23, 389],
            [120, 23, 394],
            [121, 23, 407],
            [121, 23, 443],
            [122, 23, 477],
            [123, 23, 498],
            [123, 23, 506],
            [124, 23, 519],
            [126, 23, 527],
            [127, 23, 531],
            [128, 25, 540],
            [131, 25, 548],
            [133, 25, 557],
            [135, 25, 560],
            [136, 25, 568],
            [137, 25, 573],
            [137, 25, 581],
            [138, 25, 590],
            [139, 25, 598],
            [139, 25, 622],
            [140, 25, 648],
            [140, 25, 703],
            [141, 25, 735],
            [141, 25, 901],
            [141, 25, 962],
        ],
        [
            [-31, -28, 0],
            [0, 0, 0],
            [0, 0, 93],
            [9, 2, 194],
            [20, 3, 202],
            [31, 6, 210],
            [38, 7, 214],
            [47, 8, 218],
            [55, 8, 227],
            [63, 9, 235],
            [69, 9, 239],
            [79, 9, 248],
            [93, 9, 260],
            [100, 10, 274],
            [105, 10, 277],
            [109, 10, 282],
            [111, 10, 289],
            [113, 10, 298],
            [113, 10, 302],
            [114, 10, 330],
            [116, 11, 373],
            [117, 11, 380],
            [120, 12, 389],
            [123, 13, 393],
            [127, 15, 402],
            [131, 16, 406],
            [133, 17, 414],
            [135, 17, 422],
            [137, 17, 431],
            [138, 18, 435],
            [139, 18, 443],
            [139, 18, 448],
            [139, 18, 473],
            [140, 18, 494],
            [141, 18, 511],
            [141, 18, 581],
            [141, 19, 597],
            [141, 19, 602],
            [142, 19, 668],
            [142, 19, 756],
            [142, 19, 981],
            [142, 19, 1090],
            [142, 19, 1259],
            [142, 19, 1482],
            [142, 19, 1494],
        ],
        [
            [-37, -30, 0],
            [0, 0, 0],
            [0, 0, 125],
            [0, 0, 133],
            [3, 0, 217],
            [18, 1, 226],
            [26, 1, 233],
            [36, 1, 238],
            [44, 1, 247],
            [51, 1, 255],
            [57, 1, 264],
            [62, 1, 267],
            [65, 1, 277],
            [68, 1, 285],
            [71, 1, 289],
            [72, 1, 297],
            [74, 1, 306],
            [75, 1, 309],
            [75, 1, 326],
            [76, 1, 338],
            [76, 1, 372],
            [77, 1, 380],
            [80, 1, 389],
            [85, 3, 398],
            [91, 4, 400],
            [98, 5, 409],
            [103, 6, 418],
            [110, 7, 422],
            [115, 8, 431],
            [120, 8, 435],
            [124, 8, 442],
            [127, 8, 451],
            [130, 9, 456],
            [131, 9, 463],
            [131, 9, 468],
            [132, 9, 471],
            [133, 9, 484],
            [134, 9, 505],
            [135, 9, 526],
            [135, 9, 543],
            [136, 9, 576],
            [136, 9, 622],
            [136, 9, 626],
            [137, 9, 640],
            [137, 9, 668],
            [138, 9, 718],
            [139, 9, 759],
            [139, 9, 792],
            [140, 9, 856],
            [140, 9, 868],
            [141, 9, 872],
            [141, 9, 893],
            [142, 9, 947],
            [142, 9, 967],
            [143, 9, 977],
            [143, 9, 1082],
        ],
        [
            [-35, -15, 0],
            [0, 0, 0],
            [0, 0, 153],
            [5, 1, 194],
            [12, 3, 202],
            [30, 7, 210],
            [38, 8, 216],
            [47, 9, 224],
            [55, 10, 231],
            [61, 11, 240],
            [67, 11, 244],
            [72, 12, 252],
            [75, 12, 262],
            [80, 13, 265],
            [84, 13, 274],
            [89, 13, 283],
            [92, 13, 291],
            [96, 13, 295],
            [101, 13, 303],
            [104, 13, 307],
            [108, 13, 316],
            [111, 13, 324],
            [114, 13, 328],
            [117, 13, 336],
            [119, 13, 344],
            [121, 13, 349],
            [122, 13, 357],
            [123, 13, 365],
            [123, 13, 370],
            [124, 13, 386],
            [125, 13, 398],
            [125, 13, 449],
            [125, 13, 463],
            [126, 13, 478],
            [127, 13, 503],
            [127, 13, 521],
            [128, 13, 541],
            [129, 13, 566],
            [129, 13, 591],
            [130, 13, 603],
            [131, 13, 624],
            [131, 13, 636],
            [131, 13, 650],
            [132, 13, 666],
            [133, 13, 695],
            [134, 13, 716],
            [135, 13, 728],
            [135, 13, 770],
            [136, 13, 807],
            [136, 13, 820],
            [136, 12, 832],
            [137, 12, 849],
            [137, 12, 882],
            [138, 12, 895],
            [139, 11, 903],
            [140, 11, 911],
            [141, 11, 916],
            [141, 11, 925],
            [142, 11, 954],
            [143, 11, 966],
            [143, 11, 1033],
            [144, 11, 1099],
            [144, 11, 1145],
            [144, 11, 1150],
            [144, 11, 1321],
            [144, 11, 1374],
        ],
        [
            [-52, -26, 0],
            [0, 0, 0],
            [0, 0, 89],
            [4, 0, 213],
            [11, 1, 221],
            [19, 3, 231],
            [25, 3, 234],
            [32, 3, 242],
            [39, 3, 247],
            [45, 5, 255],
            [50, 5, 260],
            [55, 5, 268],
            [58, 5, 277],
            [61, 5, 282],
            [62, 5, 291],
            [63, 5, 297],
            [64, 6, 301],
            [67, 6, 310],
            [68, 7, 318],
            [70, 7, 323],
            [71, 7, 331],
            [74, 8, 339],
            [77, 9, 345],
            [80, 10, 351],
            [84, 11, 360],
            [87, 11, 369],
            [90, 13, 374],
            [94, 13, 381],
            [97, 13, 390],
            [100, 14, 393],
            [103, 14, 402],
            [105, 15, 407],
            [108, 15, 415],
            [109, 15, 422],
            [111, 16, 427],
            [112, 16, 436],
            [113, 16, 442],
            [115, 16, 451],
            [117, 17, 456],
            [118, 17, 464],
            [119, 17, 472],
            [121, 17, 476],
            [122, 17, 486],
            [123, 17, 493],
            [124, 17, 498],
            [125, 17, 506],
            [125, 17, 513],
            [126, 17, 527],
            [127, 17, 548],
            [127, 17, 577],
            [127, 17, 648],
            [128, 17, 672],
            [129, 17, 722],
            [129, 17, 743],
            [130, 17, 752],
            [131, 17, 765],
            [131, 17, 773],
            [131, 17, 792],
            [132, 17, 806],
            [133, 17, 847],
            [134, 17, 864],
            [136, 17, 869],
            [137, 19, 877],
            [140, 19, 885],
            [143, 19, 889],
            [144, 20, 898],
            [147, 20, 906],
            [149, 21, 915],
            [150, 21, 919],
            [151, 21, 928],
            [151, 21, 940],
            [151, 21, 957],
            [152, 21, 965],
            [152, 21, 1085],
            [152, 21, 1290],
            [152, 21, 1473],
            [152, 21, 1598],
            [151, 21, 1681],
            [151, 20, 1689],
            [148, 20, 1698],
            [147, 19, 1703],
            [145, 19, 1710],
            [144, 19, 1714],
            [143, 19, 1723],
            [143, 19, 1732],
            [143, 19, 1777],
            [143, 19, 1964],
            [143, 19, 1973],
            [143, 19, 2089],
            [144, 18, 2248],
            [144, 18, 2273],
            [145, 18, 2290],
            [146, 18, 2332],
            [147, 18, 2382],
            [147, 17, 2435],
            [147, 17, 2457],
            [147, 17, 2461],
            [148, 17, 2486],
            [149, 17, 2528],
            [149, 17, 2548],
            [149, 17, 2579],
            [150, 17, 2599],
            [151, 17, 2611],
            [151, 17, 2690],
            [151, 17, 2770],
            [151, 17, 2961],
            [151, 17, 2969],
            [151, 17, 3086],
            [151, 17, 3278],
            [151, 17, 3328],
            [150, 17, 3346],
            [149, 17, 3362],
            [149, 17, 3383],
            [148, 17, 3424],
            [147, 17, 3445],
            [147, 17, 3454],
            [147, 17, 3465],
            [146, 17, 3491],
            [145, 17, 3533],
            [145, 16, 3558],
            [144, 16, 3561],
            [144, 16, 3578],
            [144, 16, 3775],
            [144, 16, 3975],
            [144, 16, 4099],
            [145, 16, 4150],
            [146, 16, 4171],
            [147, 16, 4199],
            [147, 16, 4211],
            [148, 16, 4249],
            [149, 16, 4280],
            [149, 16, 4311],
            [149, 16, 4473],
            [149, 16, 4600],
            [149, 16, 4784],
            [149, 17, 4866],
            [147, 17, 4874],
            [146, 18, 4879],
            [146, 19, 4888],
            [145, 19, 4891],
            [145, 19, 4900],
            [145, 19, 4912],
            [145, 20, 4918],
            [144, 21, 4926],
            [144, 21, 4928],
        ],
        [
            [-36, -22, 0],
            [0, 0, 0],
            [0, 0, 74],
            [19, 1, 183],
            [24, 2, 191],
            [32, 3, 200],
            [40, 5, 204],
            [47, 6, 214],
            [52, 6, 218],
            [57, 6, 224],
            [61, 6, 232],
            [64, 6, 238],
            [67, 6, 245],
            [69, 6, 254],
            [72, 7, 261],
            [73, 7, 266],
            [76, 7, 273],
            [79, 7, 282],
            [81, 9, 286],
            [84, 9, 296],
            [87, 9, 300],
            [91, 10, 308],
            [94, 11, 316],
            [99, 11, 325],
            [103, 12, 328],
            [107, 13, 338],
            [113, 13, 345],
            [115, 13, 350],
            [117, 13, 359],
            [120, 13, 366],
            [121, 13, 371],
            [121, 13, 379],
            [122, 13, 400],
            [123, 13, 450],
            [123, 13, 458],
            [123, 13, 463],
            [123, 13, 491],
            [124, 13, 512],
            [125, 13, 525],
            [125, 13, 538],
            [127, 13, 571],
            [127, 13, 574],
            [128, 13, 595],
            [129, 13, 605],
            [129, 13, 608],
            [130, 13, 617],
            [131, 13, 630],
            [131, 13, 646],
            [132, 13, 667],
            [133, 13, 688],
            [133, 13, 708],
            [133, 13, 716],
            [134, 13, 721],
            [135, 13, 730],
            [135, 13, 742],
            [137, 11, 750],
            [138, 11, 758],
            [139, 11, 762],
            [139, 11, 771],
            [139, 11, 791],
            [140, 11, 812],
            [141, 11, 826],
            [141, 11, 850],
            [143, 11, 884],
            [143, 10, 946],
            [143, 10, 954],
            [143, 10, 960],
            [144, 10, 1025],
            [144, 9, 1029],
            [144, 9, 1067],
            [144, 9, 1158],
        ],
        [
            [-43, -37, 0],
            [0, 0, 0],
            [0, 0, 74],
            [3, 1, 215],
            [9, 3, 223],
            [23, 7, 231],
            [28, 9, 240],
            [39, 11, 253],
            [44, 12, 261],
            [49, 13, 269],
            [54, 14, 274],
            [58, 15, 282],
            [61, 16, 290],
            [65, 16, 294],
            [69, 17, 303],
            [73, 17, 310],
            [74, 17, 315],
            [78, 19, 323],
            [79, 19, 331],
            [81, 19, 337],
            [82, 19, 344],
            [84, 19, 352],
            [85, 19, 357],
            [87, 19, 366],
            [89, 19, 373],
            [90, 19, 382],
            [92, 20, 385],
            [94, 20, 393],
            [96, 21, 402],
            [97, 21, 406],
            [99, 21, 415],
            [101, 22, 423],
            [103, 22, 427],
            [104, 22, 435],
            [105, 23, 444],
            [105, 23, 448],
            [106, 23, 457],
            [107, 23, 465],
            [107, 23, 483],
            [108, 23, 535],
            [109, 23, 549],
            [110, 23, 557],
            [111, 23, 561],
            [113, 24, 570],
            [116, 24, 577],
            [117, 25, 582],
            [118, 25, 590],
            [119, 25, 598],
            [119, 25, 602],
            [119, 25, 611],
            [120, 25, 618],
            [121, 25, 631],
            [121, 25, 644],
            [122, 25, 665],
            [122, 25, 720],
            [123, 25, 736],
            [123, 25, 753],
            [124, 25, 774],
            [125, 25, 786],
            [126, 25, 794],
            [129, 27, 798],
            [131, 27, 806],
            [134, 27, 815],
            [136, 28, 819],
            [137, 28, 828],
            [139, 29, 836],
            [139, 29, 840],
            [140, 29, 856],
            [141, 29, 869],
            [141, 29, 911],
            [141, 29, 924],
            [142, 29, 981],
            [142, 29, 1069],
            [143, 29, 1098],
            [143, 29, 1226],
            [143, 29, 1260],
            [144, 29, 1311],
            [145, 29, 1383],
            [145, 29, 1417],
            [145, 29, 1420],
            [145, 29, 1488],
        ],
        [
            [-51, -33, 0],
            [0, 0, 0],
            [0, 0, 104],
            [3, 0, 222],
            [9, 2, 230],
            [25, 6, 239],
            [33, 8, 249],
            [43, 11, 253],
            [53, 12, 263],
            [61, 13, 266],
            [67, 14, 279],
            [73, 14, 282],
            [79, 15, 291],
            [84, 15, 295],
            [91, 15, 304],
            [97, 15, 309],
            [102, 15, 317],
            [106, 15, 325],
            [111, 15, 328],
            [114, 15, 337],
            [117, 15, 345],
            [119, 15, 350],
            [121, 16, 358],
            [123, 16, 366],
            [123, 16, 371],
            [125, 16, 380],
            [125, 16, 412],
            [126, 16, 429],
            [127, 17, 437],
            [129, 17, 442],
            [131, 18, 451],
            [132, 19, 458],
            [134, 19, 463],
            [135, 19, 471],
            [138, 20, 478],
            [139, 20, 482],
            [141, 21, 491],
            [142, 21, 500],
            [143, 22, 504],
            [143, 22, 525],
            [144, 22, 546],
            [145, 22, 588],
            [145, 22, 609],
            [145, 22, 637],
            [145, 22, 729],
            [145, 22, 913],
            [145, 22, 1081],
        ],
        [
            [-35, -39, 0],
            [0, 0, 0],
            [0, 0, 127],
            [3, 1, 161],
            [9, 2, 171],
            [15, 3, 179],
            [23, 5, 187],
            [31, 6, 190],
            [39, 9, 198],
            [47, 10, 205],
            [55, 11, 211],
            [63, 13, 219],
            [69, 15, 228],
            [75, 15, 231],
            [78, 17, 239],
            [81, 17, 247],
            [85, 18, 252],
            [87, 19, 260],
            [90, 20, 269],
            [92, 20, 273],
            [95, 21, 282],
            [97, 22, 289],
            [100, 23, 298],
            [104, 23, 302],
            [107, 23, 311],
            [110, 25, 319],
            [114, 25, 323],
            [117, 26, 332],
            [121, 26, 339],
            [124, 27, 343],
            [127, 28, 352],
            [129, 28, 357],
            [131, 29, 365],
            [132, 29, 373],
            [133, 29, 385],
            [133, 29, 401],
            [133, 29, 443],
            [134, 29, 465],
            [135, 29, 477],
            [135, 29, 519],
            [136, 29, 548],
            [137, 29, 577],
            [137, 29, 590],
            [138, 29, 596],
            [139, 29, 610],
            [139, 29, 631],
            [140, 29, 644],
            [141, 29, 664],
            [141, 29, 687],
            [142, 29, 710],
            [143, 29, 724],
            [144, 29, 765],
            [145, 29, 815],
            [145, 29, 819],
            [145, 29, 871],
        ],
        [
            [-58, -12, 0],
            [0, 0, 0],
            [5, 1, 173],
            [27, 3, 182],
            [37, 4, 190],
            [44, 5, 199],
            [57, 5, 205],
            [68, 7, 213],
            [79, 7, 217],
            [86, 7, 225],
            [94, 7, 232],
            [102, 7, 241],
            [109, 6, 250],
            [113, 6, 252],
            [119, 6, 260],
            [122, 6, 269],
            [126, 6, 274],
            [129, 6, 282],
            [131, 6, 287],
            [133, 6, 295],
            [136, 6, 302],
            [139, 6, 311],
            [140, 7, 316],
            [142, 7, 325],
            [143, 7, 333],
            [144, 7, 336],
            [145, 7, 350],
            [145, 7, 366],
            [146, 7, 383],
            [147, 7, 437],
            [147, 7, 467],
            [147, 7, 687],
            [147, 7, 828],
            [147, 7, 970],
            [147, 7, 1151],
        ],
        [
            [-31, -23, 0],
            [0, 0, 0],
            [5, 0, 204],
            [13, 0, 212],
            [19, 0, 221],
            [27, 0, 225],
            [36, 0, 233],
            [36, 0, 237],
            [42, 0, 242],
            [49, 0, 247],
            [53, 0, 254],
            [57, 0, 262],
            [61, 0, 266],
            [63, 0, 275],
            [66, -1, 285],
            [67, -1, 289],
            [68, -1, 296],
            [68, -1, 300],
            [69, -1, 304],
            [69, -1, 316],
            [70, -1, 325],
            [71, -1, 338],
            [72, -1, 350],
            [73, -1, 359],
            [75, -1, 367],
            [79, -2, 371],
            [82, -3, 380],
            [85, -3, 387],
            [88, -3, 396],
            [92, -3, 400],
            [93, -4, 409],
            [96, -4, 416],
            [97, -5, 421],
            [99, -5, 430],
            [100, -5, 442],
            [101, -5, 455],
            [101, -5, 479],
            [101, -5, 488],
            [102, -5, 522],
            [103, -5, 546],
            [104, -5, 555],
            [105, -5, 562],
            [108, -5, 567],
            [111, -5, 575],
            [113, -5, 584],
            [115, -5, 589],
            [117, -5, 596],
            [119, -5, 605],
            [121, -5, 609],
            [123, -5, 616],
            [124, -5, 625],
            [125, -5, 634],
            [126, -5, 638],
            [127, -5, 667],
            [127, -5, 722],
            [127, -5, 739],
            [128, -5, 750],
            [129, -5, 784],
            [129, -5, 792],
            [130, -5, 800],
            [132, -5, 805],
            [134, -5, 812],
            [137, -5, 821],
            [138, -6, 830],
            [139, -6, 834],
            [141, -6, 842],
            [143, -6, 851],
            [143, -6, 855],
            [144, -6, 863],
            [145, -6, 905],
            [145, -6, 976],
            [145, -7, 980],
            [145, -7, 984],
            [146, -7, 1025],
            [147, -7, 1147],
            [147, -7, 1184],
            [148, -7, 1235],
            [149, -7, 1285],
            [149, -7, 1294],
            [149, -7, 1339],
            [150, -7, 1389],
            [150, -8, 1401],
            [150, -8, 1498],
            [148, -7, 1567],
            [148, -6, 1571],
            [148, -6, 1578],
        ],
        [
            [-55, -20, 0],
            [0, 0, 0],
            [0, 0, 118],
            [5, 1, 183],
            [13, 3, 193],
            [22, 5, 200],
            [29, 6, 205],
            [37, 7, 213],
            [42, 7, 217],
            [49, 8, 225],
            [53, 8, 233],
            [59, 8, 238],
            [62, 9, 247],
            [65, 9, 255],
            [67, 10, 259],
            [69, 10, 267],
            [71, 10, 275],
            [73, 11, 280],
            [74, 11, 288],
            [75, 11, 297],
            [78, 13, 301],
            [81, 13, 309],
            [82, 14, 317],
            [85, 15, 322],
            [87, 17, 330],
            [91, 18, 338],
            [94, 19, 344],
            [97, 21, 352],
            [101, 23, 359],
            [104, 24, 364],
            [108, 25, 372],
            [111, 26, 380],
            [114, 28, 388],
            [117, 28, 393],
            [119, 29, 401],
            [122, 30, 406],
            [123, 30, 413],
            [125, 30, 421],
            [127, 30, 430],
            [128, 31, 434],
            [130, 31, 443],
            [131, 31, 450],
            [133, 31, 454],
            [133, 31, 463],
            [134, 31, 471],
            [135, 31, 477],
            [135, 31, 485],
            [136, 31, 504],
            [137, 31, 526],
            [137, 31, 589],
            [139, 31, 596],
            [141, 31, 604],
            [143, 31, 610],
            [144, 31, 618],
            [145, 31, 625],
            [145, 31, 651],
            [146, 31, 714],
            [147, 31, 742],
            [147, 31, 763],
            [148, 31, 843],
            [148, 31, 920],
        ],
        [
            [-49, -28, 0],
            [0, 0, 0],
            [4, 0, 235],
            [11, 0, 243],
            [22, 0, 253],
            [29, 0, 260],
            [32, 1, 269],
            [37, 1, 274],
            [41, 1, 282],
            [43, 1, 290],
            [46, 1, 294],
            [46, 1, 299],
            [49, 1, 302],
            [51, 1, 312],
            [53, 1, 316],
            [55, 1, 323],
            [57, 1, 332],
            [58, 1, 340],
            [60, 1, 344],
            [61, 1, 352],
            [63, 1, 360],
            [65, 1, 366],
            [68, 1, 374],
            [71, 1, 381],
            [73, 1, 386],
            [77, 1, 394],
            [79, 1, 402],
            [82, 1, 406],
            [84, 1, 414],
            [87, 1, 423],
            [89, 1, 428],
            [90, 1, 437],
            [91, 1, 444],
            [93, 1, 448],
            [93, 1, 457],
            [95, 1, 465],
            [96, 1, 469],
            [97, 1, 477],
            [98, 1, 515],
            [99, 1, 536],
            [100, 1, 553],
            [102, 1, 561],
            [105, 1, 569],
            [107, 1, 577],
            [110, 1, 581],
            [113, 1, 591],
            [116, 1, 599],
            [119, 0, 602],
            [121, 0, 611],
            [123, 0, 615],
            [125, 0, 623],
            [125, 0, 632],
            [126, 0, 637],
            [127, 0, 644],
            [127, 0, 661],
            [128, 0, 681],
            [129, 0, 732],
            [130, 0, 735],
            [130, 0, 740],
            [131, 0, 744],
            [133, 0, 752],
            [135, 0, 757],
            [137, 0, 764],
            [139, -1, 774],
            [141, -1, 777],
            [141, -1, 786],
            [142, -1, 795],
            [143, -1, 798],
            [143, -1, 802],
            [143, -1, 816],
            [144, -1, 862],
            [145, -1, 932],
            [145, -1, 960],
            [145, -2, 970],
            [145, -2, 973],
            [146, -2, 1078],
            [146, -3, 1086],
            [147, -3, 1124],
            [147, -3, 1186],
            [147, -3, 1191],
            [147, -3, 1240],
            [147, -3, 1304],
            [148, -3, 1329],
            [148, -4, 1361],
            [149, -4, 1386],
            [149, -5, 1445],
            [149, -5, 1458],
            [149, -5, 1462],
            [149, -5, 1512],
            [150, -5, 1532],
            [150, -5, 1739],
            [150, -5, 1739],
        ],
        [
            [-39, -17, 0],
            [0, 0, 0],
            [0, 0, 72],
            [0, 0, 155],
            [5, 0, 214],
            [13, 0, 223],
            [27, -1, 231],
            [37, -1, 235],
            [53, -1, 239],
            [63, -3, 247],
            [73, -3, 256],
            [79, -3, 260],
            [87, -4, 269],
            [92, -4, 277],
            [97, -5, 282],
            [100, -5, 290],
            [103, -5, 298],
            [103, -5, 302],
            [105, -5, 311],
            [105, -5, 315],
            [105, -5, 324],
            [107, -5, 373],
            [108, -5, 382],
            [112, -5, 386],
            [115, -5, 393],
            [121, -5, 403],
            [124, -5, 407],
            [129, -5, 415],
            [133, -5, 423],
            [136, -5, 428],
            [139, -5, 436],
            [141, -5, 444],
            [143, -5, 452],
            [144, -5, 456],
            [145, -5, 464],
            [147, -5, 470],
            [147, -5, 486],
            [148, -5, 519],
            [149, -5, 548],
            [149, -5, 561],
            [149, -5, 631],
            [150, -5, 653],
            [150, -5, 657],
            [150, -5, 817],
            [150, -5, 826],
            [150, -5, 915],
        ],
        [
            [-46, -18, 0],
            [0, 0, 0],
            [0, 0, 125],
            [5, 1, 192],
            [11, 1, 200],
            [20, 4, 207],
            [28, 5, 213],
            [36, 5, 220],
            [43, 6, 224],
            [49, 7, 233],
            [55, 7, 238],
            [59, 9, 245],
            [63, 9, 254],
            [66, 9, 262],
            [67, 9, 267],
            [69, 9, 274],
            [71, 9, 283],
            [72, 9, 287],
            [73, 9, 297],
            [74, 9, 312],
            [75, 9, 317],
            [75, 9, 337],
            [77, 9, 346],
            [79, 9, 350],
            [83, 9, 359],
            [87, 10, 366],
            [92, 10, 375],
            [95, 11, 378],
            [99, 11, 387],
            [104, 12, 395],
            [107, 12, 400],
            [111, 12, 408],
            [115, 12, 416],
            [117, 12, 421],
            [120, 12, 428],
            [123, 12, 438],
            [123, 12, 442],
            [125, 12, 450],
            [125, 12, 458],
            [126, 12, 470],
            [127, 12, 500],
            [127, 12, 521],
            [128, 12, 533],
            [131, 12, 541],
            [133, 12, 550],
            [135, 11, 554],
            [138, 11, 562],
            [140, 11, 567],
            [142, 11, 575],
            [144, 11, 583],
            [145, 11, 588],
            [145, 11, 596],
            [146, 11, 607],
            [147, 11, 612],
            [147, 11, 617],
            [147, 11, 624],
            [148, 11, 663],
            [149, 11, 738],
            [149, 11, 771],
            [149, 11, 784],
            [150, 11, 850],
            [150, 11, 925],
            [150, 11, 1117],
            [150, 11, 1131],
        ],
        [
            [-37, -28, 0],
            [0, 0, 0],
            [0, 0, 97],
            [5, 1, 223],
            [18, 3, 232],
            [27, 5, 250],
            [31, 5, 256],
            [33, 5, 265],
            [35, 5, 267],
            [37, 7, 275],
            [37, 7, 287],
            [38, 7, 290],
            [39, 7, 296],
            [39, 7, 305],
            [41, 7, 308],
            [43, 7, 317],
            [44, 7, 326],
            [45, 7, 330],
            [47, 8, 338],
            [50, 9, 347],
            [53, 9, 356],
            [55, 10, 359],
            [60, 11, 368],
            [63, 11, 372],
            [67, 13, 380],
            [71, 13, 388],
            [75, 15, 393],
            [77, 15, 401],
            [80, 15, 409],
            [84, 15, 426],
            [87, 16, 440],
            [87, 16, 459],
            [89, 16, 477],
            [90, 16, 484],
            [93, 17, 492],
            [95, 17, 501],
            [98, 17, 505],
            [101, 18, 513],
            [104, 18, 521],
            [108, 18, 526],
            [111, 19, 535],
            [115, 19, 543],
            [117, 19, 547],
            [121, 19, 555],
            [123, 19, 564],
            [124, 19, 567],
            [125, 19, 576],
            [127, 19, 585],
            [127, 19, 597],
            [127, 19, 601],
            [128, 19, 645],
            [129, 19, 689],
            [129, 19, 697],
            [131, 19, 701],
            [133, 20, 710],
            [135, 20, 714],
            [135, 20, 730],
            [136, 20, 739],
            [137, 20, 759],
            [137, 20, 772],
            [138, 20, 822],
            [139, 20, 835],
            [140, 20, 843],
            [142, 20, 847],
            [145, 20, 855],
            [146, 20, 864],
            [147, 20, 869],
            [148, 20, 877],
            [149, 20, 885],
            [150, 20, 893],
            [151, 20, 897],
            [152, 20, 915],
            [152, 20, 930],
            [153, 20, 955],
            [153, 20, 989],
            [154, 20, 1026],
            [154, 20, 1101],
            [154, 20, 1252],
            [154, 20, 1434],
            [154, 20, 1595],
            [154, 20, 1738],
            [154, 20, 1929],
            [154, 20, 2094],
            [154, 19, 2136],
            [153, 19, 2143],
            [153, 19, 2156],
            [153, 18, 2198],
            [153, 17, 2218],
            [153, 17, 2227],
            [153, 17, 2231],
            [153, 17, 2240],
            [151, 16, 2282],
            [151, 15, 2298],
            [151, 15, 2310],
            [151, 14, 2390],
            [150, 14, 2424],
            [150, 14, 2432],
            [150, 14, 2590],
            [150, 14, 2726],
        ],
        [
            [-41, -39, 0],
            [0, 0, 0],
            [0, 0, 57],
            [4, 0, 225],
            [17, 1, 233],
            [23, 1, 241],
            [30, 3, 250],
            [35, 3, 254],
            [39, 3, 262],
            [43, 3, 267],
            [45, 4, 275],
            [47, 4, 283],
            [48, 4, 288],
            [50, 4, 296],
            [51, 4, 304],
            [52, 4, 312],
            [53, 4, 316],
            [54, 4, 324],
            [55, 4, 335],
            [56, 4, 338],
            [59, 4, 346],
            [62, 4, 355],
            [66, 4, 358],
            [69, 5, 367],
            [75, 5, 375],
            [79, 5, 379],
            [86, 5, 388],
            [91, 6, 396],
            [95, 6, 400],
            [99, 7, 408],
            [103, 7, 416],
            [107, 7, 421],
            [109, 7, 429],
            [112, 7, 438],
            [115, 7, 442],
            [117, 7, 450],
            [120, 7, 458],
            [123, 7, 463],
            [126, 7, 471],
            [129, 7, 480],
            [131, 7, 484],
            [133, 7, 492],
            [135, 7, 501],
            [138, 7, 505],
            [140, 7, 513],
            [142, 7, 521],
            [143, 7, 529],
            [143, 7, 535],
            [143, 7, 546],
            [144, 7, 554],
            [145, 7, 592],
            [145, 7, 616],
            [146, 7, 634],
            [147, 7, 675],
            [147, 7, 698],
            [148, 7, 729],
            [148, 7, 734],
            [149, 7, 758],
            [149, 7, 813],
            [150, 7, 842],
            [150, 7, 847],
            [151, 7, 884],
            [151, 7, 942],
            [152, 7, 967],
            [152, 6, 983],
            [153, 6, 996],
            [153, 6, 1038],
            [153, 6, 1059],
            [153, 6, 1145],
        ],
        [
            [-27, -20, 0],
            [0, 0, 0],
            [0, 0, 40],
            [6, 1, 164],
            [15, 4, 172],
            [29, 7, 181],
            [41, 9, 186],
            [57, 11, 189],
            [67, 12, 198],
            [76, 12, 206],
            [83, 12, 211],
            [89, 13, 219],
            [98, 13, 234],
            [101, 13, 244],
            [107, 13, 252],
            [108, 13, 261],
            [110, 13, 268],
            [111, 13, 274],
            [112, 13, 281],
            [113, 13, 290],
            [114, 13, 294],
            [116, 15, 302],
            [117, 15, 310],
            [118, 15, 318],
            [119, 15, 323],
            [121, 15, 332],
            [123, 16, 339],
            [124, 16, 343],
            [126, 17, 352],
            [127, 17, 361],
            [128, 17, 365],
            [129, 17, 374],
            [129, 17, 378],
            [129, 17, 385],
            [130, 17, 394],
            [131, 17, 402],
            [132, 18, 407],
            [134, 19, 416],
            [135, 19, 423],
            [135, 19, 432],
            [136, 19, 436],
            [136, 20, 469],
            [137, 20, 478],
            [137, 20, 497],
            [137, 20, 531],
            [137, 20, 535],
            [138, 20, 548],
            [139, 20, 577],
            [139, 20, 607],
            [139, 21, 620],
            [140, 21, 634],
            [141, 21, 669],
            [141, 21, 682],
            [141, 21, 693],
            [142, 21, 715],
            [143, 21, 735],
            [143, 21, 756],
            [144, 21, 777],
            [145, 21, 819],
            [145, 21, 824],
            [145, 21, 840],
            [146, 21, 869],
            [147, 21, 910],
            [147, 21, 932],
            [148, 21, 961],
            [149, 21, 990],
            [149, 20, 1024],
            [149, 20, 1031],
            [150, 20, 1065],
            [151, 20, 1094],
            [151, 19, 1107],
            [151, 19, 1127],
            [152, 19, 1157],
            [152, 19, 1182],
            [153, 19, 1191],
            [153, 18, 1220],
            [153, 18, 1313],
        ],
        [
            [-36, -20, 0],
            [0, 0, 0],
            [0, 0, 34],
            [4, 1, 193],
            [12, 2, 202],
            [25, 6, 210],
            [33, 7, 218],
            [39, 8, 226],
            [46, 9, 235],
            [51, 10, 239],
            [57, 10, 245],
            [63, 10, 257],
            [66, 11, 260],
            [70, 11, 268],
            [73, 11, 274],
            [75, 12, 281],
            [77, 12, 290],
            [78, 12, 297],
            [79, 12, 302],
            [79, 12, 310],
            [80, 12, 315],
            [81, 13, 331],
            [82, 13, 339],
            [85, 13, 344],
            [89, 13, 352],
            [92, 13, 360],
            [97, 13, 365],
            [102, 13, 373],
            [109, 15, 377],
            [115, 15, 386],
            [121, 16, 394],
            [124, 16, 403],
            [127, 16, 406],
            [129, 16, 415],
            [130, 16, 422],
            [131, 16, 427],
            [131, 16, 455],
            [132, 16, 484],
            [133, 16, 519],
            [133, 16, 526],
            [133, 16, 560],
            [134, 16, 581],
            [135, 16, 610],
            [135, 16, 639],
            [136, 16, 672],
            [136, 16, 711],
            [137, 16, 714],
            [137, 16, 722],
            [138, 16, 736],
            [139, 16, 773],
            [139, 16, 793],
            [140, 16, 813],
            [141, 16, 839],
            [141, 16, 848],
            [142, 16, 854],
            [143, 16, 860],
            [144, 16, 868],
            [145, 16, 898],
            [145, 16, 911],
            [145, 16, 931],
            [146, 16, 966],
            [146, 16, 1035],
            [147, 16, 1044],
            [147, 16, 1094],
            [148, 16, 1185],
            [148, 16, 1223],
            [149, 16, 1306],
            [149, 16, 1403],
            [149, 16, 1407],
            [149, 16, 1411],
            [150, 16, 1477],
            [150, 16, 1530],
            [151, 16, 1540],
            [152, 16, 1645],
            [152, 15, 1695],
            [152, 15, 1712],
            [153, 15, 1727],
            [153, 15, 1900],
            [153, 15, 1990],
        ],
        [
            [-24, -34, 0],
            [0, 0, 0],
            [0, 0, 179],
            [4, 1, 219],
            [9, 3, 227],
            [17, 3, 236],
            [21, 5, 240],
            [25, 5, 245],
            [30, 5, 252],
            [34, 7, 261],
            [37, 7, 270],
            [43, 7, 278],
            [45, 7, 282],
            [49, 7, 292],
            [52, 7, 294],
            [55, 9, 302],
            [57, 9, 311],
            [61, 9, 315],
            [63, 9, 324],
            [66, 9, 332],
            [69, 9, 336],
            [73, 10, 344],
            [75, 10, 353],
            [77, 10, 357],
            [83, 10, 365],
            [85, 10, 373],
            [90, 10, 383],
            [95, 10, 386],
            [98, 10, 395],
            [103, 10, 399],
            [107, 10, 412],
            [109, 10, 415],
            [112, 10, 423],
            [113, 10, 430],
            [115, 9, 436],
            [116, 9, 449],
            [117, 9, 457],
            [117, 9, 499],
            [118, 9, 540],
            [119, 9, 558],
            [119, 9, 590],
            [120, 9, 612],
            [121, 9, 619],
            [124, 9, 624],
            [127, 10, 632],
            [128, 10, 640],
            [131, 10, 645],
            [132, 11, 653],
            [134, 11, 661],
            [135, 11, 665],
            [136, 11, 675],
            [137, 11, 678],
            [137, 11, 683],
            [137, 11, 716],
            [138, 11, 745],
            [138, 11, 748],
            [139, 11, 792],
            [139, 11, 816],
            [140, 11, 849],
            [140, 11, 854],
            [141, 11, 875],
            [141, 11, 900],
            [142, 11, 932],
            [143, 11, 974],
            [143, 11, 991],
            [144, 11, 1024],
            [145, 11, 1045],
            [145, 11, 1066],
            [146, 11, 1098],
            [147, 11, 1140],
            [147, 11, 1161],
            [147, 11, 1182],
            [148, 11, 1203],
            [149, 11, 1233],
            [149, 11, 1268],
            [149, 11, 1303],
            [150, 11, 1345],
            [150, 11, 1353],
            [151, 11, 1386],
            [152, 11, 1424],
            [152, 11, 1491],
            [153, 11, 1532],
            [153, 10, 1549],
            [153, 10, 1591],
            [153, 10, 1680],
            [154, 10, 1736],
            [154, 10, 1796],
        ],
        [
            [-41, -25, 0],
            [0, 0, 0],
            [0, 0, 13],
            [0, 0, 200],
            [6, 0, 218],
            [15, 1, 226],
            [24, 1, 235],
            [32, 1, 238],
            [39, 1, 247],
            [43, 1, 252],
            [47, 2, 259],
            [50, 2, 267],
            [53, 2, 272],
            [54, 2, 281],
            [55, 2, 285],
            [56, 2, 293],
            [59, 3, 301],
            [60, 3, 306],
            [62, 3, 314],
            [63, 4, 322],
            [65, 4, 331],
            [67, 5, 335],
            [70, 6, 344],
            [72, 7, 349],
            [75, 7, 355],
            [78, 9, 364],
            [82, 9, 371],
            [85, 11, 376],
            [89, 11, 385],
            [93, 12, 394],
            [97, 12, 398],
            [99, 12, 406],
            [103, 12, 413],
            [105, 12, 418],
            [108, 12, 426],
            [109, 12, 434],
            [111, 12, 439],
            [113, 12, 448],
            [113, 12, 456],
            [114, 12, 461],
            [115, 12, 476],
            [115, 12, 489],
            [117, 12, 497],
            [119, 12, 506],
            [121, 12, 511],
            [123, 13, 518],
            [124, 13, 527],
            [127, 13, 531],
            [128, 13, 540],
            [131, 13, 547],
            [131, 13, 552],
            [132, 13, 560],
            [133, 13, 567],
            [133, 13, 572],
            [134, 13, 589],
            [135, 13, 681],
            [137, 13, 685],
            [138, 13, 694],
            [141, 13, 698],
            [142, 14, 705],
            [143, 14, 713],
            [145, 14, 719],
            [148, 14, 727],
            [149, 14, 736],
            [150, 14, 739],
            [151, 14, 749],
            [151, 14, 755],
            [152, 14, 765],
            [153, 14, 784],
            [153, 14, 818],
            [153, 14, 844],
            [154, 14, 867],
            [155, 14, 972],
            [155, 14, 1006],
            [155, 14, 1073],
        ],
        [
            [-39, -14, 0],
            [0, 0, 0],
            [0, 0, 166],
            [5, 0, 215],
            [11, 0, 224],
            [25, 0, 232],
            [32, 0, 240],
            [39, 0, 249],
            [43, 0, 254],
            [49, 0, 262],
            [52, 0, 266],
            [53, 0, 274],
            [55, 0, 282],
            [56, 0, 291],
            [57, 0, 295],
            [57, 0, 304],
            [58, 0, 324],
            [59, 0, 346],
            [60, 0, 353],
            [63, 0, 362],
            [65, 0, 365],
            [70, 0, 374],
            [73, 0, 383],
            [79, 0, 386],
            [86, 0, 395],
            [93, 1, 404],
            [99, 1, 408],
            [106, 2, 415],
            [111, 2, 421],
            [115, 2, 428],
            [115, 2, 433],
            [117, 2, 437],
            [119, 2, 445],
            [120, 2, 454],
            [121, 2, 465],
            [121, 2, 491],
            [121, 2, 495],
            [123, 2, 528],
            [123, 2, 579],
            [125, 2, 600],
            [126, 2, 604],
            [127, 2, 612],
            [129, 2, 620],
            [131, 2, 624],
            [134, 2, 632],
            [137, 2, 641],
            [139, 2, 645],
            [141, 2, 654],
            [141, 2, 658],
            [143, 2, 662],
            [145, 2, 666],
            [145, 2, 674],
            [147, 2, 684],
            [148, 2, 695],
            [149, 2, 729],
            [149, 2, 767],
            [150, 2, 817],
            [151, 2, 849],
            [151, 2, 862],
            [152, 2, 891],
            [153, 2, 920],
            [153, 2, 938],
            [153, 2, 945],
            [154, 2, 962],
            [154, 1, 983],
            [155, 1, 987],
            [155, 1, 992],
            [155, 1, 1025],
            [156, 1, 1096],
            [156, 1, 1154],
            [156, 1, 1208],
        ],
        [
            [-43, -25, 0],
            [0, 0, 0],
            [0, 0, 64],
            [7, 0, 231],
            [12, 0, 238],
            [17, 0, 247],
            [23, 0, 259],
            [26, 0, 268],
            [27, 0, 272],
            [29, 0, 280],
            [31, 0, 288],
            [31, 0, 294],
            [31, 0, 297],
            [32, 0, 301],
            [33, 0, 319],
            [34, 0, 339],
            [37, 0, 343],
            [39, 0, 352],
            [43, 0, 359],
            [47, 1, 364],
            [51, 1, 374],
            [58, 2, 384],
            [63, 2, 387],
            [70, 3, 393],
            [77, 4, 401],
            [83, 4, 405],
            [87, 4, 413],
            [91, 5, 422],
            [93, 5, 426],
            [95, 5, 434],
            [97, 5, 443],
            [99, 5, 451],
            [100, 5, 455],
            [101, 5, 464],
            [102, 5, 472],
            [103, 5, 496],
            [103, 5, 518],
            [103, 5, 551],
            [105, 6, 567],
            [106, 6, 577],
            [109, 7, 580],
            [111, 8, 588],
            [114, 8, 597],
            [117, 9, 601],
            [119, 9, 609],
            [122, 9, 618],
            [125, 11, 623],
            [127, 11, 630],
            [130, 12, 638],
            [131, 12, 647],
            [132, 12, 652],
            [133, 12, 659],
            [133, 12, 690],
            [134, 12, 735],
            [135, 13, 743],
            [138, 13, 752],
            [139, 13, 755],
            [140, 13, 763],
            [140, 13, 796],
            [141, 13, 813],
            [141, 13, 847],
            [142, 13, 867],
            [142, 13, 892],
            [143, 13, 972],
            [143, 13, 1001],
            [144, 13, 1018],
            [146, 13, 1022],
            [147, 13, 1031],
            [149, 13, 1035],
            [149, 13, 1048],
            [149, 13, 1051],
            [150, 13, 1102],
            [151, 13, 1135],
            [151, 13, 1206],
            [152, 13, 1259],
            [152, 13, 1310],
            [153, 13, 1360],
            [153, 13, 1393],
            [153, 13, 1402],
            [154, 13, 1444],
            [154, 13, 1456],
            [155, 13, 1506],
            [155, 13, 1560],
            [155, 12, 1589],
            [156, 12, 1623],
            [156, 11, 1630],
            [156, 11, 1766],
        ],
        [
            [-41, -27, 0],
            [0, 0, 0],
            [0, 0, 144],
            [5, 1, 185],
            [15, 3, 195],
            [23, 5, 202],
            [31, 7, 206],
            [38, 8, 211],
            [45, 11, 218],
            [52, 11, 228],
            [55, 13, 235],
            [59, 13, 240],
            [62, 13, 248],
            [63, 14, 257],
            [65, 14, 261],
            [67, 15, 269],
            [68, 15, 273],
            [70, 16, 282],
            [71, 16, 291],
            [73, 17, 294],
            [73, 17, 302],
            [76, 17, 311],
            [79, 18, 320],
            [81, 19, 323],
            [81, 19, 327],
            [84, 20, 332],
            [87, 21, 341],
            [91, 21, 344],
            [95, 22, 353],
            [99, 23, 361],
            [101, 23, 364],
            [104, 25, 373],
            [107, 25, 382],
            [109, 26, 385],
            [111, 26, 395],
            [112, 26, 402],
            [113, 26, 406],
            [115, 26, 415],
            [116, 27, 424],
            [117, 27, 427],
            [118, 27, 436],
            [119, 27, 443],
            [120, 27, 448],
            [122, 28, 457],
            [123, 28, 465],
            [124, 28, 469],
            [127, 28, 477],
            [128, 28, 485],
            [131, 28, 490],
            [131, 28, 494],
            [132, 28, 499],
            [135, 28, 506],
            [135, 28, 511],
            [137, 28, 519],
            [137, 28, 527],
            [138, 28, 590],
            [139, 28, 619],
            [139, 28, 632],
            [139, 28, 645],
            [140, 28, 715],
            [141, 28, 736],
            [141, 28, 765],
            [142, 28, 798],
            [143, 27, 816],
            [143, 27, 824],
            [143, 27, 828],
            [144, 27, 849],
            [145, 27, 870],
            [145, 27, 886],
            [145, 27, 899],
            [147, 26, 927],
            [147, 26, 940],
            [148, 25, 969],
            [149, 25, 1011],
            [149, 25, 1083],
            [150, 25, 1107],
            [151, 25, 1116],
            [152, 25, 1121],
            [153, 25, 1132],
            [154, 24, 1136],
            [155, 24, 1149],
            [155, 24, 1186],
            [156, 24, 1232],
            [156, 24, 1336],
            [156, 24, 1341],
            [156, 24, 1512],
            [156, 24, 1653],
            [156, 24, 1774],
        ],
        [
            [-29, -28, 0],
            [0, 0, 0],
            [3, 0, 187],
            [17, 3, 196],
            [23, 5, 203],
            [32, 5, 212],
            [39, 8, 216],
            [47, 8, 225],
            [52, 9, 232],
            [57, 10, 243],
            [61, 10, 246],
            [63, 10, 254],
            [66, 10, 258],
            [67, 10, 266],
            [68, 11, 275],
            [69, 11, 282],
            [69, 11, 287],
            [70, 11, 308],
            [71, 11, 316],
            [72, 11, 322],
            [75, 11, 328],
            [79, 11, 337],
            [83, 13, 342],
            [89, 13, 350],
            [94, 15, 359],
            [99, 15, 363],
            [106, 17, 371],
            [111, 18, 378],
            [115, 18, 386],
            [118, 19, 392],
            [121, 19, 400],
            [123, 19, 409],
            [123, 19, 421],
            [124, 19, 434],
            [124, 19, 474],
            [125, 19, 533],
            [125, 19, 561],
            [126, 19, 603],
            [127, 19, 612],
            [128, 19, 617],
            [132, 21, 625],
            [135, 21, 628],
            [138, 21, 637],
            [141, 21, 645],
            [142, 22, 650],
            [144, 22, 658],
            [145, 22, 666],
            [145, 22, 672],
            [146, 22, 688],
            [147, 22, 701],
            [147, 22, 720],
            [148, 22, 736],
            [149, 22, 783],
            [149, 22, 824],
            [150, 22, 862],
            [150, 22, 876],
            [150, 22, 879],
            [151, 22, 896],
            [151, 22, 945],
            [151, 22, 975],
            [152, 22, 986],
            [153, 22, 1093],
            [153, 22, 1154],
            [153, 22, 1191],
            [154, 22, 1222],
            [154, 21, 1274],
            [155, 21, 1280],
            [155, 21, 1308],
            [155, 21, 1338],
            [156, 21, 1379],
            [156, 20, 1458],
            [156, 20, 1487],
            [157, 20, 1491],
            [157, 20, 1654],
        ],
        [
            [-33, -36, 0],
            [0, 0, 0],
            [0, 0, 80],
            [13, 5, 205],
            [21, 7, 212],
            [34, 10, 224],
            [39, 11, 234],
            [42, 12, 239],
            [45, 13, 246],
            [47, 14, 252],
            [49, 14, 259],
            [51, 15, 267],
            [53, 15, 276],
            [55, 15, 280],
            [57, 17, 288],
            [60, 17, 297],
            [63, 18, 301],
            [65, 19, 309],
            [69, 20, 318],
            [73, 21, 322],
            [76, 22, 330],
            [80, 24, 338],
            [85, 25, 342],
            [89, 26, 351],
            [93, 27, 359],
            [95, 27, 363],
            [98, 29, 372],
            [100, 29, 380],
            [101, 29, 384],
            [103, 29, 392],
            [103, 30, 401],
            [104, 30, 409],
            [105, 30, 413],
            [105, 30, 417],
            [105, 31, 422],
            [106, 31, 431],
            [107, 31, 434],
            [109, 31, 443],
            [111, 31, 451],
            [113, 32, 455],
            [114, 32, 463],
            [117, 33, 472],
            [118, 34, 476],
            [120, 34, 485],
            [123, 34, 493],
            [124, 35, 497],
            [125, 35, 505],
            [127, 35, 513],
            [128, 35, 518],
            [129, 35, 526],
            [129, 35, 543],
            [130, 35, 555],
            [130, 35, 584],
            [131, 35, 618],
            [132, 37, 626],
            [133, 37, 631],
            [136, 37, 639],
            [138, 37, 643],
            [139, 37, 651],
            [139, 37, 660],
            [140, 37, 664],
            [141, 37, 693],
            [141, 37, 722],
            [141, 37, 743],
            [142, 37, 813],
            [143, 38, 818],
            [145, 38, 829],
            [147, 38, 834],
            [147, 38, 839],
            [148, 38, 847],
            [149, 38, 868],
            [149, 38, 909],
            [149, 38, 913],
            [149, 38, 927],
            [150, 38, 969],
            [151, 38, 1014],
            [151, 38, 1080],
            [151, 38, 1085],
            [152, 38, 1135],
            [153, 38, 1168],
            [153, 38, 1206],
            [153, 38, 1223],
            [154, 38, 1239],
            [155, 38, 1277],
            [155, 38, 1330],
            [156, 38, 1402],
            [156, 38, 1410],
            [156, 37, 1414],
            [157, 37, 1486],
            [157, 37, 1497],
            [157, 37, 1578],
            [157, 37, 1704],
            [157, 37, 1722],
            [158, 36, 1777],
            [158, 36, 1906],
            [158, 36, 1920],
        ],
        [
            [-43, -30, 0],
            [0, 0, 0],
            [0, 0, 182],
            [13, 3, 192],
            [22, 5, 198],
            [29, 6, 207],
            [35, 7, 211],
            [42, 8, 220],
            [47, 8, 226],
            [54, 8, 234],
            [60, 8, 239],
            [67, 8, 247],
            [73, 8, 252],
            [80, 8, 261],
            [85, 8, 268],
            [91, 8, 273],
            [95, 8, 281],
            [99, 8, 289],
            [102, 8, 294],
            [103, 8, 302],
            [106, 8, 310],
            [107, 8, 318],
            [108, 9, 322],
            [109, 9, 339],
            [109, 9, 343],
            [111, 9, 389],
            [111, 9, 435],
            [112, 10, 451],
            [113, 10, 456],
            [116, 11, 463],
            [120, 12, 482],
            [122, 13, 485],
            [125, 14, 494],
            [127, 15, 505],
            [129, 15, 512],
            [130, 15, 526],
            [131, 15, 547],
            [131, 17, 560],
            [131, 17, 589],
            [133, 17, 602],
            [135, 17, 610],
            [138, 17, 618],
            [139, 17, 627],
            [142, 18, 631],
            [143, 18, 640],
            [144, 19, 644],
            [146, 19, 652],
            [147, 19, 660],
            [147, 19, 669],
            [148, 19, 672],
            [148, 19, 677],
            [149, 19, 711],
            [149, 19, 731],
            [149, 19, 798],
            [150, 19, 814],
            [150, 19, 843],
            [151, 19, 847],
            [151, 19, 889],
            [152, 19, 935],
            [153, 19, 952],
            [153, 19, 966],
            [153, 19, 998],
            [154, 19, 1001],
            [155, 19, 1031],
            [155, 19, 1064],
            [156, 19, 1099],
            [157, 19, 1164],
            [157, 19, 1186],
            [157, 19, 1214],
            [157, 19, 1310],
            [158, 19, 1366],
            [159, 19, 1472],
            [159, 18, 1487],
            [159, 18, 1495],
            [159, 18, 1519],
            [159, 18, 1690],
            [159, 18, 1809],
            [159, 18, 1809],
        ],
        [
            [-29, -37, 0],
            [0, 0, 0],
            [0, 0, 129],
            [7, 1, 204],
            [17, 1, 212],
            [24, 4, 220],
            [29, 5, 224],
            [34, 6, 234],
            [38, 7, 242],
            [41, 8, 245],
            [44, 8, 255],
            [46, 8, 262],
            [47, 8, 266],
            [49, 8, 275],
            [49, 9, 280],
            [50, 9, 288],
            [51, 9, 296],
            [53, 9, 304],
            [56, 9, 309],
            [57, 10, 316],
            [60, 10, 326],
            [63, 10, 330],
            [66, 11, 339],
            [70, 11, 346],
            [73, 12, 350],
            [76, 13, 359],
            [79, 13, 367],
            [81, 13, 371],
            [83, 13, 379],
            [85, 14, 387],
            [87, 14, 392],
            [89, 14, 400],
            [89, 14, 409],
            [91, 14, 412],
            [91, 14, 417],
            [91, 14, 421],
            [92, 14, 441],
            [93, 14, 463],
            [94, 15, 471],
            [97, 15, 481],
            [99, 15, 483],
            [102, 15, 491],
            [105, 15, 499],
            [107, 16, 504],
            [110, 17, 513],
            [111, 17, 518],
            [114, 18, 526],
            [117, 19, 534],
            [118, 20, 542],
            [121, 20, 546],
            [123, 21, 555],
            [123, 21, 563],
            [125, 21, 567],
            [125, 21, 575],
            [125, 21, 584],
            [125, 21, 614],
            [125, 21, 622],
            [126, 21, 629],
            [127, 21, 638],
            [128, 22, 646],
            [130, 22, 650],
            [133, 23, 658],
            [134, 23, 666],
            [135, 23, 675],
            [137, 24, 678],
            [139, 24, 688],
            [140, 24, 695],
            [141, 24, 700],
            [141, 24, 709],
            [142, 24, 729],
            [143, 24, 749],
            [143, 24, 779],
            [143, 24, 804],
            [144, 24, 832],
            [145, 24, 861],
            [145, 24, 891],
            [145, 24, 913],
            [146, 24, 945],
            [147, 24, 958],
            [147, 24, 966],
            [148, 24, 995],
            [149, 24, 1012],
            [150, 24, 1024],
            [151, 24, 1065],
            [151, 23, 1070],
            [151, 23, 1088],
            [152, 23, 1112],
            [152, 23, 1115],
            [153, 23, 1171],
            [153, 23, 1203],
            [154, 23, 1246],
            [154, 22, 1266],
            [154, 22, 1299],
            [155, 22, 1305],
            [155, 22, 1407],
            [155, 22, 1433],
            [156, 22, 1485],
            [156, 21, 1497],
            [157, 21, 1530],
            [157, 21, 1568],
            [157, 21, 1614],
            [158, 21, 1623],
            [159, 21, 1669],
            [159, 21, 1723],
            [159, 20, 1737],
            [159, 20, 1797],
            [160, 20, 1802],
            [160, 20, 1902],
            [160, 20, 2046],
        ],
        [
            [-33, -40, 0],
            [0, 0, 0],
            [0, 0, 134],
            [6, 2, 218],
            [12, 5, 225],
            [17, 5, 235],
            [23, 7, 238],
            [29, 9, 247],
            [37, 11, 255],
            [45, 13, 259],
            [53, 15, 267],
            [59, 15, 276],
            [66, 16, 280],
            [71, 16, 289],
            [76, 16, 298],
            [79, 16, 302],
            [80, 16, 310],
            [81, 16, 318],
            [81, 16, 326],
            [82, 16, 330],
            [83, 16, 359],
            [83, 16, 402],
            [83, 16, 422],
            [84, 16, 451],
            [87, 16, 476],
            [89, 17, 485],
            [94, 17, 490],
            [97, 17, 497],
            [103, 20, 505],
            [107, 21, 513],
            [112, 22, 518],
            [117, 23, 527],
            [119, 23, 534],
            [122, 23, 539],
            [124, 23, 548],
            [125, 23, 556],
            [125, 23, 561],
            [126, 23, 585],
            [126, 23, 622],
            [127, 23, 693],
            [128, 23, 703],
            [129, 23, 710],
            [132, 23, 713],
            [134, 23, 723],
            [135, 23, 731],
            [136, 23, 735],
            [137, 23, 743],
            [139, 23, 751],
            [139, 23, 764],
            [140, 23, 785],
            [141, 23, 890],
            [141, 23, 898],
            [141, 23, 906],
            [143, 23, 976],
            [144, 23, 980],
            [145, 23, 989],
            [146, 23, 993],
            [147, 23, 1051],
            [147, 23, 1123],
            [147, 23, 1181],
            [147, 23, 1218],
            [148, 23, 1235],
            [148, 23, 1248],
            [149, 23, 1253],
            [150, 23, 1260],
            [152, 22, 1269],
            [153, 22, 1273],
            [153, 22, 1299],
            [155, 22, 1319],
            [156, 22, 1323],
            [157, 22, 1332],
            [158, 21, 1339],
            [159, 21, 1372],
            [159, 21, 1403],
            [159, 21, 1406],
            [159, 21, 1498],
            [160, 21, 1569],
            [160, 21, 1619],
            [161, 21, 1652],
            [161, 21, 1710],
            [161, 21, 1767],
        ],
        [
            [-47, -28, 0],
            [0, 0, 0],
            [0, 0, 29],
            [11, 1, 186],
            [23, 3, 195],
            [52, 7, 204],
            [70, 10, 212],
            [81, 11, 216],
            [91, 13, 225],
            [98, 13, 233],
            [103, 13, 238],
            [109, 15, 245],
            [112, 15, 254],
            [116, 17, 259],
            [119, 17, 266],
            [121, 18, 279],
            [123, 18, 283],
            [125, 19, 287],
            [128, 20, 296],
            [129, 20, 303],
            [129, 21, 308],
            [130, 21, 317],
            [131, 21, 329],
            [131, 21, 346],
            [131, 21, 387],
            [132, 21, 420],
            [133, 21, 471],
            [133, 21, 484],
            [135, 21, 492],
            [137, 21, 499],
            [139, 22, 504],
            [141, 22, 513],
            [141, 22, 517],
            [142, 23, 521],
            [144, 23, 525],
            [145, 23, 541],
            [147, 23, 545],
            [149, 23, 555],
            [150, 24, 559],
            [151, 24, 567],
            [152, 24, 574],
            [153, 24, 596],
            [153, 24, 633],
            [153, 24, 688],
            [154, 24, 708],
            [155, 24, 750],
            [155, 24, 780],
            [156, 24, 813],
            [156, 24, 846],
            [157, 24, 854],
            [157, 24, 884],
            [158, 24, 924],
            [159, 24, 962],
            [160, 24, 984],
            [161, 24, 1008],
            [161, 24, 1016],
            [161, 23, 1029],
            [161, 23, 1037],
            [162, 23, 1088],
            [162, 23, 1163],
            [163, 23, 1171],
            [163, 23, 1187],
            [163, 23, 1235],
        ],
        [
            [-40, -34, 0],
            [0, 0, 0],
            [0, 0, 117],
            [9, 1, 208],
            [30, 2, 217],
            [35, 2, 226],
            [41, 3, 235],
            [47, 3, 238],
            [50, 5, 247],
            [54, 5, 256],
            [57, 5, 260],
            [59, 5, 267],
            [61, 5, 272],
            [63, 6, 281],
            [66, 7, 288],
            [69, 8, 297],
            [71, 8, 301],
            [74, 9, 308],
            [76, 9, 319],
            [80, 11, 323],
            [85, 13, 329],
            [91, 14, 339],
            [96, 15, 343],
            [103, 16, 351],
            [108, 17, 359],
            [113, 19, 364],
            [118, 19, 372],
            [122, 20, 380],
            [125, 20, 385],
            [127, 21, 394],
            [129, 21, 401],
            [130, 21, 406],
            [131, 21, 422],
            [131, 21, 426],
            [131, 21, 460],
            [132, 21, 484],
            [135, 21, 493],
            [138, 22, 498],
            [142, 22, 506],
            [145, 22, 514],
            [148, 22, 518],
            [151, 22, 525],
            [153, 22, 534],
            [155, 22, 538],
            [156, 22, 547],
            [157, 22, 555],
            [157, 22, 559],
            [158, 22, 580],
            [158, 22, 610],
            [159, 22, 640],
            [159, 22, 701],
            [160, 22, 735],
            [161, 22, 755],
            [161, 22, 784],
            [161, 22, 835],
            [162, 22, 856],
            [163, 22, 869],
            [163, 22, 897],
            [164, 22, 939],
            [164, 22, 955],
            [165, 21, 970],
            [166, 21, 988],
            [167, 21, 1022],
            [167, 21, 1051],
            [167, 21, 1109],
            [167, 21, 1179],
        ],
        [
            [-40, -18, 0],
            [0, 0, 0],
            [0, 0, 33],
            [0, 0, 133],
            [5, 0, 209],
            [11, 0, 217],
            [27, 0, 230],
            [34, 0, 234],
            [41, 0, 239],
            [46, 0, 247],
            [49, 0, 255],
            [54, 0, 261],
            [58, 0, 270],
            [61, 0, 277],
            [65, 0, 283],
            [67, 0, 291],
            [70, 0, 300],
            [71, 0, 303],
            [71, 0, 311],
            [72, 0, 318],
            [73, 0, 340],
            [73, 0, 368],
            [75, 0, 373],
            [79, 0, 381],
            [85, 0, 385],
            [91, 0, 394],
            [96, -1, 402],
            [103, -2, 406],
            [108, -3, 414],
            [115, -3, 423],
            [119, -4, 432],
            [124, -5, 435],
            [126, -6, 444],
            [128, -6, 451],
            [129, -6, 456],
            [129, -7, 464],
            [130, -7, 480],
            [131, -7, 524],
            [131, -7, 531],
            [131, -7, 569],
            [132, -7, 624],
            [133, -7, 698],
            [135, -7, 702],
            [140, -7, 710],
            [142, -7, 714],
            [146, -7, 723],
            [149, -7, 732],
            [151, -7, 739],
            [153, -7, 743],
            [156, -7, 751],
            [158, -7, 756],
            [159, -7, 764],
            [159, -7, 777],
            [159, -7, 780],
            [159, -7, 785],
            [160, -7, 805],
            [161, -7, 857],
            [161, -7, 926],
            [162, -7, 1022],
            [162, -7, 1028],
            [163, -7, 1106],
            [163, -7, 1118],
            [163, -7, 1131],
            [164, -7, 1156],
            [165, -7, 1219],
            [165, -7, 1240],
            [165, -7, 1277],
            [166, -7, 1311],
            [167, -7, 1369],
            [167, -7, 1431],
            [167, -7, 1520],
            [168, -7, 1547],
            [169, -7, 1607],
            [169, -7, 1615],
            [169, -7, 1695],
            [169, -7, 1768],
        ],
        [
            [-38, -16, 0],
            [0, 0, 0],
            [0, 0, 79],
            [9, 0, 187],
            [21, 3, 196],
            [37, 7, 204],
            [43, 7, 212],
            [49, 9, 221],
            [53, 9, 225],
            [57, 11, 233],
            [59, 11, 238],
            [60, 11, 246],
            [61, 11, 254],
            [61, 11, 262],
            [61, 11, 276],
            [62, 11, 284],
            [63, 11, 288],
            [63, 12, 297],
            [66, 13, 304],
            [69, 13, 314],
            [75, 16, 317],
            [81, 17, 324],
            [87, 19, 330],
            [95, 20, 338],
            [101, 23, 346],
            [107, 23, 351],
            [111, 25, 359],
            [115, 25, 367],
            [117, 25, 372],
            [119, 26, 380],
            [120, 26, 388],
            [121, 27, 392],
            [122, 27, 401],
            [123, 27, 409],
            [124, 27, 414],
            [125, 28, 421],
            [127, 28, 430],
            [129, 29, 434],
            [131, 29, 442],
            [134, 29, 451],
            [137, 29, 458],
            [139, 30, 463],
            [142, 31, 472],
            [143, 31, 476],
            [145, 32, 484],
            [147, 32, 492],
            [148, 32, 500],
            [149, 32, 505],
            [149, 32, 534],
            [150, 32, 555],
            [150, 32, 567],
            [151, 32, 617],
            [152, 32, 625],
            [153, 32, 630],
            [155, 33, 638],
            [155, 33, 648],
            [156, 33, 658],
            [157, 33, 729],
            [157, 33, 771],
            [157, 33, 805],
            [158, 33, 854],
            [159, 33, 875],
            [159, 33, 884],
            [161, 33, 889],
            [163, 33, 897],
            [165, 33, 905],
            [166, 33, 912],
            [167, 33, 918],
            [167, 33, 922],
            [167, 33, 926],
            [168, 33, 934],
            [169, 33, 954],
            [169, 33, 976],
            [169, 33, 1068],
            [170, 33, 1100],
            [170, 33, 1243],
        ],
        [
            [-49, -22, 0],
            [0, 0, 0],
            [0, 0, 74],
            [0, 0, 90],
            [3, 0, 165],
            [6, 0, 174],
            [15, 3, 182],
            [21, 4, 190],
            [26, 5, 199],
            [29, 6, 203],
            [35, 7, 211],
            [40, 8, 219],
            [45, 9, 228],
            [50, 10, 232],
            [55, 11, 240],
            [61, 13, 244],
            [66, 13, 254],
            [71, 15, 262],
            [75, 15, 265],
            [77, 15, 274],
            [81, 15, 282],
            [83, 16, 290],
            [86, 16, 295],
            [89, 17, 303],
            [91, 18, 308],
            [95, 18, 315],
            [97, 19, 324],
            [100, 19, 335],
            [103, 20, 337],
            [107, 21, 347],
            [109, 21, 351],
            [113, 21, 358],
            [115, 23, 367],
            [119, 23, 371],
            [123, 23, 379],
            [123, 23, 382],
            [126, 23, 390],
            [131, 25, 395],
            [134, 25, 399],
            [137, 25, 407],
            [140, 26, 417],
            [143, 26, 420],
            [144, 26, 428],
            [146, 26, 436],
            [147, 27, 441],
            [149, 27, 449],
            [151, 27, 457],
            [151, 27, 466],
            [153, 28, 470],
            [153, 28, 478],
            [155, 28, 486],
            [155, 28, 490],
            [156, 28, 574],
            [157, 28, 604],
            [157, 28, 637],
            [158, 28, 688],
            [159, 28, 707],
            [159, 28, 723],
            [160, 28, 745],
            [161, 28, 757],
            [161, 28, 791],
            [162, 28, 811],
            [163, 28, 820],
            [163, 28, 849],
            [164, 28, 870],
            [164, 28, 883],
            [165, 28, 912],
            [165, 28, 961],
            [166, 28, 1008],
            [166, 28, 1087],
            [166, 28, 1095],
            [167, 28, 1107],
            [168, 28, 1171],
            [169, 28, 1245],
            [169, 28, 1308],
            [169, 28, 1358],
            [169, 28, 1400],
            [170, 28, 1408],
            [171, 28, 1529],
            [171, 27, 1538],
            [171, 27, 1584],
            [171, 27, 1613],
        ],
        [
            [-43, -20, 0],
            [0, 0, 0],
            [0, 0, 83],
            [7, 0, 141],
            [19, 1, 149],
            [30, 1, 158],
            [41, 4, 162],
            [53, 5, 171],
            [59, 7, 175],
            [68, 8, 184],
            [74, 8, 191],
            [81, 9, 197],
            [85, 9, 204],
            [88, 10, 214],
            [92, 10, 217],
            [95, 11, 225],
            [98, 11, 233],
            [101, 11, 238],
            [103, 11, 246],
            [106, 13, 255],
            [109, 13, 263],
            [110, 13, 267],
            [112, 14, 276],
            [113, 14, 284],
            [115, 14, 288],
            [116, 14, 308],
            [118, 15, 316],
            [121, 16, 325],
            [124, 17, 330],
            [128, 17, 338],
            [131, 19, 342],
            [134, 19, 350],
            [136, 20, 358],
            [139, 21, 367],
            [141, 21, 372],
            [143, 22, 379],
            [143, 23, 388],
            [145, 23, 392],
            [145, 23, 421],
            [145, 23, 429],
            [146, 23, 463],
            [147, 23, 471],
            [149, 23, 476],
            [152, 24, 484],
            [155, 25, 494],
            [158, 26, 497],
            [162, 27, 505],
            [165, 27, 513],
            [167, 28, 518],
            [169, 28, 525],
            [170, 28, 534],
            [171, 28, 541],
            [172, 29, 564],
            [173, 29, 575],
            [173, 29, 588],
            [173, 29, 625],
            [174, 29, 675],
            [175, 29, 696],
            [175, 29, 775],
            [175, 29, 780],
            [174, 29, 901],
            [173, 29, 910],
            [173, 29, 927],
            [171, 29, 946],
            [171, 29, 1008],
            [171, 29, 1084],
            [171, 29, 1228],
        ],
        [
            [-48, -21, 0],
            [0, 0, 0],
            [0, 0, 25],
            [5, 3, 182],
            [23, 11, 191],
            [31, 15, 199],
            [39, 17, 203],
            [39, 17, 207],
            [48, 19, 211],
            [55, 22, 219],
            [61, 23, 227],
            [68, 24, 232],
            [73, 25, 241],
            [78, 25, 249],
            [83, 26, 254],
            [90, 27, 262],
            [95, 27, 270],
            [101, 28, 275],
            [105, 28, 283],
            [111, 29, 292],
            [114, 29, 295],
            [118, 30, 303],
            [119, 30, 311],
            [121, 30, 316],
            [123, 30, 324],
            [123, 30, 330],
            [124, 30, 337],
            [125, 30, 345],
            [125, 30, 378],
            [126, 30, 386],
            [127, 31, 395],
            [129, 31, 399],
            [131, 32, 409],
            [132, 32, 415],
            [135, 33, 424],
            [136, 33, 428],
            [139, 33, 436],
            [141, 35, 441],
            [145, 35, 449],
            [148, 35, 457],
            [150, 35, 466],
            [152, 36, 469],
            [153, 36, 479],
            [154, 36, 483],
            [155, 36, 500],
            [155, 36, 512],
            [155, 36, 516],
            [156, 36, 532],
            [157, 36, 599],
            [157, 36, 620],
            [158, 36, 661],
            [159, 36, 687],
            [159, 36, 708],
            [159, 36, 715],
            [160, 36, 737],
            [161, 36, 765],
            [162, 36, 779],
            [163, 36, 791],
            [163, 36, 799],
            [164, 36, 820],
            [164, 36, 825],
            [165, 36, 837],
            [165, 36, 850],
            [166, 36, 870],
            [167, 36, 903],
            [167, 36, 950],
            [167, 35, 953],
            [168, 35, 974],
            [169, 35, 1012],
            [169, 35, 1016],
            [169, 35, 1086],
            [170, 35, 1134],
            [170, 35, 1141],
            [171, 35, 1200],
            [171, 34, 1207],
            [171, 34, 1233],
            [172, 34, 1283],
            [172, 33, 1291],
            [172, 33, 1325],
            [173, 33, 1358],
            [173, 33, 1488],
        ],
        [
            [-43, -42, 0],
            [0, 0, 0],
            [0, 0, 131],
            [9, 1, 181],
            [32, 7, 189],
            [44, 9, 198],
            [57, 11, 205],
            [67, 12, 211],
            [73, 12, 219],
            [78, 13, 228],
            [83, 14, 231],
            [87, 15, 240],
            [91, 15, 248],
            [93, 15, 252],
            [96, 15, 260],
            [97, 15, 268],
            [100, 17, 274],
            [100, 17, 277],
            [102, 17, 282],
            [104, 17, 290],
            [107, 18, 294],
            [109, 19, 303],
            [112, 20, 310],
            [115, 21, 315],
            [117, 22, 324],
            [121, 23, 331],
            [124, 23, 340],
            [127, 25, 344],
            [130, 25, 353],
            [133, 26, 360],
            [135, 27, 365],
            [137, 27, 373],
            [139, 27, 382],
            [139, 28, 386],
            [140, 28, 393],
            [141, 28, 402],
            [141, 28, 431],
            [141, 28, 465],
            [142, 28, 469],
            [143, 29, 477],
            [146, 29, 485],
            [147, 29, 490],
            [150, 30, 498],
            [153, 31, 506],
            [155, 32, 512],
            [157, 32, 519],
            [159, 33, 528],
            [161, 33, 532],
            [162, 33, 540],
            [163, 33, 548],
            [164, 33, 558],
            [165, 33, 574],
            [165, 33, 601],
            [165, 34, 611],
            [165, 34, 624],
            [166, 34, 643],
            [167, 34, 723],
            [167, 34, 753],
            [167, 34, 777],
            [168, 34, 794],
            [169, 34, 848],
            [169, 34, 861],
            [170, 34, 898],
            [171, 34, 923],
            [171, 34, 952],
            [171, 34, 966],
            [172, 34, 1010],
            [173, 34, 1106],
            [173, 34, 1119],
            [173, 34, 1207],
        ],
        [
            [-29, -26, 0],
            [0, 0, 0],
            [0, 0, 148],
            [5, 0, 216],
            [12, 0, 224],
            [30, 0, 231],
            [36, 0, 241],
            [43, 1, 248],
            [48, 1, 253],
            [51, 2, 261],
            [55, 2, 270],
            [57, 2, 274],
            [58, 2, 282],
            [60, 3, 290],
            [61, 3, 303],
            [61, 3, 315],
            [62, 3, 354],
            [64, 3, 357],
            [69, 4, 366],
            [74, 4, 374],
            [83, 5, 378],
            [89, 5, 387],
            [97, 7, 395],
            [104, 7, 400],
            [109, 7, 407],
            [113, 7, 416],
            [116, 7, 420],
            [117, 7, 428],
            [119, 7, 437],
            [121, 7, 441],
            [121, 7, 449],
            [122, 7, 458],
            [123, 7, 478],
            [123, 7, 528],
            [124, 7, 540],
            [127, 7, 549],
            [129, 7, 553],
            [134, 5, 561],
            [137, 5, 570],
            [141, 5, 579],
            [145, 5, 582],
            [150, 3, 591],
            [153, 3, 594],
            [155, 3, 603],
            [156, 3, 612],
            [157, 3, 616],
            [157, 3, 624],
            [158, 3, 637],
            [158, 3, 654],
            [159, 3, 665],
            [159, 3, 716],
            [159, 3, 728],
            [160, 3, 758],
            [160, 2, 779],
            [161, 2, 791],
            [161, 2, 841],
            [162, 2, 891],
            [162, 2, 904],
            [162, 1, 945],
            [163, 1, 954],
            [163, 1, 976],
            [164, 1, 1015],
            [165, 1, 1095],
            [165, 1, 1149],
            [165, 1, 1153],
            [166, 1, 1170],
            [167, 1, 1179],
            [167, 1, 1183],
            [169, 1, 1191],
            [170, 1, 1203],
            [170, 1, 1216],
            [171, 1, 1262],
            [171, 1, 1408],
            [171, 1, 1416],
            [171, 1, 1449],
            [172, 1, 1504],
            [173, 1, 1596],
            [173, 1, 1638],
            [173, 1, 1651],
            [174, 1, 1680],
            [174, 1, 1718],
            [175, 1, 1835],
            [175, 1, 1884],
            [175, 1, 1900],
            [175, 1, 1904],
            [176, 1, 1947],
            [176, 1, 2150],
            [176, 1, 2217],
            [176, 1, 2400],
            [176, 1, 2659],
            [176, 1, 2726],
            [176, 1, 2918],
            [176, 1, 3167],
            [176, 1, 3225],
            [176, 1, 3401],
            [176, 1, 3659],
            [176, 1, 3717],
            [176, 1, 3900],
            [176, 1, 4151],
            [176, 1, 4218],
            [176, 1, 4259],
            [176, 0, 4275],
            [176, -1, 4297],
            [176, -1, 4309],
            [176, -2, 4338],
            [176, -2, 4397],
            [176, -3, 4409],
            [176, -3, 4430],
            [176, -4, 4451],
            [176, -5, 4498],
            [176, -5, 4564],
            [176, -5, 4643],
            [176, -5, 4702],
            [176, -6, 4751],
            [177, -6, 4767],
            [177, -6, 4906],
            [177, -7, 4959],
            [177, -7, 4982],
            [178, -7, 5031],
            [179, -7, 5037],
            [180, -7, 5044],
            [181, -7, 5054],
            [181, -8, 5056],
            [181, -8, 5123],
            [181, -8, 5152],
            [182, -8, 5186],
            [182, -8, 5215],
            [182, -8, 5404],
            [182, -8, 5652],
            [182, -9, 5702],
            [182, -9, 5719],
            [181, -9, 5723],
            [181, -9, 5731],
            [181, -9, 5744],
            [180, -9, 5757],
            [179, -9, 5765],
            [179, -9, 5786],
            [178, -9, 5794],
            [177, -9, 5798],
            [177, -9, 5815],
            [176, -9, 5820],
            [175, -9, 5836],
            [174, -9, 5840],
            [173, -9, 5857],
            [173, -9, 5869],
            [172, -9, 5891],
            [172, -9, 5899],
            [172, -9, 6148],
            [172, -9, 6215],
            [173, -9, 6373],
            [173, -9, 6391],
            [173, -9, 6395],
            [174, -9, 6416],
            [175, -9, 6443],
            [175, -9, 6483],
            [176, -9, 6541],
            [177, -9, 6570],
            [177, -9, 6617],
            [177, -9, 6658],
            [178, -9, 6687],
            [178, -9, 6716],
            [179, -9, 6812],
            [179, -9, 6903],
            [179, -9, 6907],
            [178, -7, 6920],
            [177, -7, 6923],
            [177, -7, 6932],
            [177, -7, 6942],
        ],
    ];
    function findClosestValue(trace_list, target) {
        let left = 0;
        let right = trace_list.length - 1;
        let mid;
        let closest = trace_list[0]; // 假设第一个元素是最接近的

        while (left <= right) {
            mid = Math.floor((left + right) / 2);

            // 更新最接近的值
            if (
                Math.abs(
                    trace_list[mid][trace_list[mid].length - 1][0] - target,
                ) < Math.abs(closest[closest.length - 1][0] - target)
            ) {
                closest = trace_list[mid];
            }

            // 缩小搜索范围
            if (trace_list[mid][trace_list[mid].length - 1][0] === target) {
                return trace_list[mid]; // 直接找到目标值，返回
            } else if (
                trace_list[mid][trace_list[mid].length - 1][0] < target
            ) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return closest;
    }

    // function send(dis, gt, challenge, c, s, rt) {
    let trace = findClosestValue(trace_list, dis);

    mwbxQ.$_Au = (function () {
        var $_DBGFP = 2;
        for (; $_DBGFP !== 1;) {
            switch ($_DBGFP) {
                case 2:
                    return {
                        $_DBGGJ: (function ($_DBGHw) {
                            var $_DBGIf = 2;
                            for (; $_DBGIf !== 14;) {
                                switch ($_DBGIf) {
                                    case 5:
                                        $_DBGIf =
                                            $_DBGJC < $_DBHAf.length ? 4 : 7;
                                        break;
                                    case 2:
                                        var $_DBHBj = "",
                                            $_DBHAf = decodeURI(
                                                "C9-%0E%0C*%02%14%1B%20;+VVZ%11%17%13%02%12=&$%119%13%1A*;+%02%14%1B%20;*%00%03%1D%0B(%00%028%1D%20%0F%1D%1F%03%0D%11m+$#%1F%11$%07%008%E9%84%A4%E7%BC%A1%E5%8E%8B%E6%94%84%00%12%E6%9D%A0%E8%AE%A0%EF%BD%93%E8%AE%83%E6%A2%A7%E6%9E%83%E5%89%B4%E5%A6%84%E5%8D%9F%E6%96%82%E4%BD%87%E5%84%83%E7%9B%AD%E9%84%82%E7%BC%A7%E5%8E%B6%E6%94%97%01%1D%EF%BD%87%E5%AE%B0%E5%BB%A0%E7%95%94%E8%AE%91%E6%96%9F%E7%9B%8B%000%EF%BD%AE8%0C=;%1B%159X%7Fx*2%15%0C=%0A%15%0B%0A+.*%1F%22%14%1B%20;*H%01%0C;g%04%0F%16%E8%AE%9E%E6%B0%8D%E6%8B%AC%E9%95%AD%EF%BD%BDWG%E8%AE%B8%E4%BE%94%E6%8D%B5%E7%BC%B6%E7%BA%BA%E7%94%AC%E9%81%95%EF%BD%92FI%E6%A2%A6%E6%9E%8C%E5%89%92%E5%A6%82%E5%8D%A2%E6%96%91%E4%BD%86%E5%84%8C%E7%9B%8B%E9%84%84%E7%BC%9A%E5%8E%A5%E6%94%96%0E;%E5%93%85%17%0F%07%05#,%1A%00%0379(%18%12%03&)%17%10%06%12%08%11g%5B%12%15%0C=*%15%0B%0A%0B.*%1FH8%0A.'%02%06%157(,%00!%13%05#%10%11%06%1478%20%10%13%0E7%E6%8A%99%E5%8B%A1%E6%BA%A5%E5%9C%B0%E5%B1%A0%E6%83%85%E6%B4%A1%E5%9A%B7%E5%82%BB%E6%AC%84%E7%A0%88%E6%8A%95%E5%91%87%17%5D9%14%08!-%1B%0A8%E4%BD%89%E7%BA%96%E5%91%8D%E5%9A%AA%E8%B1%A4%E7%9B%A2%E5%8E%AB%E6%94%BF%E4%B9%84%E6%99%9B%E5%86%9A%E6%94%96%E7%B0%92%E5%9F%84%EF%BD%93%E8%AE%83%E4%BD%87%E5%84%83%E5%86%94%E6%94%BF%E7%B0%B2%E5%9F%BF%E5%8E%A5%E6%94%967%E5%84%BC%E9%96%A4%E9%AB%B8%E8%AE%A68G%11%E5%89%BE%E6%97%84%E9%AB%AB%E8%AE%A77%08,%11%13%03%1A;%0C%06%15%09%1B%11m+%25,:%11%E5%92%8E%E5%92%92%EF%BC%B9%E6%81%8C%E7%88%80%E5%91%8C%E4%BB%8F%E6%8A%88%E5%9A%99FZo%E7%A6%9B%E5%91%BA%E9%86%AA%E8%AE%B37k%160%25%0E7%3C=%15%13%13%1A%11!%1D%03%02%0C!%17%11%15%14%06=%17%04%08%15%1D%11.%11%13/%04..%11#%07%1D.%17%13%02%12$%20'%00%0F8M%10%0A078%1C!-%11%01%0F%07*-*%13%1F%19*%17P8%25!'%17D9B6%3C%1D%0D%1E%0A%0C%11%E8%A6%8F%E8%A6%BD%E9%9B%BB%E7%A3%AB7%E5%B9%A1%E5%8B%A0%E5%8E%B9%E9%A7%AF8%E6%8A%BF%E5%8B%A7%E5%B6%AF%E8%BF%8D%E6%BA%B6%E5%9C%B1%E5%AF%A5%E6%89%9F%E4%B9%83%E6%97%8D%E6%8A%9B%E5%9A%987=,%04%0B%07%0A*%17%E8%AE%83%E5%84%94%E9%96%8B%E9%AB%A5%E8%AE%8E%E9%86%84%E8%AE%A19%01%0C;%1A%11%04%09%07+:*%E5%8B%87%E8%BC%9B%E4%B9%84agZ9%16%1C;%00%19%06%01%0C%0B(%00%068%0A=,%15%13%03,#,%19%02%08%1D%11:%00%15%0F%07(%17P8%25.%06%17%E7%95%85%E6%9F%A6%E9%AB%AA%E6%8E%B9%E4%BF%94%E6%8B%89%E6%9D%9B%E6%95%88%E6%8D%A77od*%00%03%1D%0C&%1A%13%03%11;%17%07%02%05I%E7%A6%9D%E7%9B%8D%E9%81%AB%E5%BB%81%E8%B7%A3%E8%BE%AEo:%17%08%14%0Cji%E7%9B%B0%E7%95%8F%E6%89%917o%17%E4%BD%94%E7%BA%BE%04%00!-;%09%E6%8F%83%E5%8E%8A%E7%9B%8B%E5%8E%8B%E6%94%84%E6%9D%AE%E8%AE%89%EF%BD%B3%E5%8E%A5%E6%8F%AC%E5%8E%A3%0E%02%E9%81%A0%E6%8A%A6%E5%98%A1%E5%93%B8#)$%E5%84%8C%E7%B5%A9%EF%BD%B8%E5%B8%91%E4%B9%B2%E9%9D%A9%E4%BE%92%E8%AE%88%E5%84%82%E5%AC%BF%E5%9D%8E%E4%BB%A7%E9%A0%BA%E9%9C%AB%E4%B9%999B6%0C%0819%03%1B=&%068WY%7D%17%16%08%09%05*(%1A9%03%1B=&%068%05%06+,*%14%14%0A%11-%06%06%11%20%22(%13%028.*,%00%02%15%1Do;%11%16%13%00=,%07G%07I8%20%1A%03%09%1Eo%3E%1D%13%0EI.i%10%08%05%1C%22,%1A%138%0D*=%15%0E%0A7k%167-%0D7%7D-*C9*%09%0E*%0E%08%19:=*C9*%0C;*%00%03%1D%02%20%1A%12%12%0C%3C%17%10%08%05%1C%22,%1A%138So%17%1C%06%15&8'$%15%09%19*;%00%1E8_%7F%7D*%0F%03%00(!%009K7u%17%1D%0A%017?1*%02%14%1B%20;+VV%5D%11'%01%0A%04%0C=%17%11%15%14%06=%16EWV7+(%00%06%5C%00%22(%13%02I%1E*+%04%5C%04%08%3C,BSJ%3C$%2535%0F%5D%0E%085%25%3E;%1A%03%251%0A(%7B%1D7%22'(%0E%08%02&3(%0E%0C6_%11(&%04%03&%01:%1C%07%00%14%03F,%11%1E%1F%1F*%0C$%06%3E(%3E%1F%3E%19/4!v#%03*'7+%20%029%15%19#%20%009%00%1C!*%00%0E%09%07%119%06%08%12%06,&%189%E4%BD%86%E7%BA%B0.9%04%02%08%0D%1B&%E6%8F%91%E5%8E%84%E7%9B%A2%E5%8E%AB%E6%94%BF%E6%9D%80%E8%AE%9B%EF%BD%BD%E5%8E%8C%E6%8F%8C%E5%8E%98%20%10%E9%81%AE%E6%8A%8F%E5%98%81%E5%93%83%0D;*%E5%84%A5%E7%B5%89%EF%BD%83%E5%B8%BF%E4%B9%A0%E9%9D%A7%E4%BE%BB%E8%AE%A8%E5%84%B9%E5%AC%91%E5%9D%9C%E4%BB%A9%E9%A0%93%E9%9C%8B%E4%B9%A2%17%01%15%0AA%11m+$/9%11&%1A%0B%09%08+%17P8%25+%08%17%11%1F%16%06==%079%09%0B%25,%17%138%06!,%06%15%09%1B%11.%11%13.%06:;%079I%08%25(%0CI%16%01?%E8%AE%BE%E6%B0%B6%E6%8B%82%E9%95%BF%EF%BD%B3~g%E8%AE%83%E4%BE%BA%E6%8D%A7%E7%BC%B8%E7%BA%93%E7%94%8C%E9%81%AE%EF%BD%BCTG%E8%AE%B8%E8%80%9D%E7%B2%8F%E6%9F%A6%E9%AB%AA%E5%AF%B1%E7%BC%9E%E5%AF%AB%E6%9D%B99%05%05*(%063%0F%04*&%01%138%1B*(%10%1E5%1D.=%119%03%1B=&%068WX%7D%17%17%14%157%E7%95%A7%E6%89%BE%E5%9A%AA%E8%B1%A4%E5%86%9B%E6%94%99%E6%88%A8%E8%A0%85%E5%BD%B6%E5%B9%9F8%0C=;%1B%159X~q*%E8%AE%8A%E9%9E%95%E6%97%AE%E4%BA%B9%E5%8B%A9%E8%BC%89%E5%A5%96%E8%B5%83%EF%BD%B3~g%E8%AE%83%E4%BE%BA%E6%8D%A7%E7%BC%B8%E7%BA%93%E7%94%8C%E9%81%AE%EF%BD%BCTG%E8%AE%B8%E8%80%9D%E7%B2%8F%E6%9F%A6%E9%AB%AA%E5%AF%B1%E7%BC%9E%E5%AF%AB%E6%9D%B99%07%1C+%20%1B9%13%07$'%1B%10%087,&%19%17%0A%0C;,*%0D%157%E7%B7%BD%E7%B4%A8%E4%B9%B9%E7%B4%81%E5%8B%BD7*;%06%08%146~yB9%E7%9B%88%E8%83%8D%E5%8B%AF%E8%BC%B4%E5%A5%85%E8%B5%82%EF%BD%BCXa%E8%AE%BE%E4%BE%A9%E6%8D%A6%E7%BC%B7%E7%BA%B5%E7%94%8A%E9%81%93%EF%BD%AFUH%E8%AE%9E%E8%80%9B%E7%B2%B2%E6%9F%B5%E9%AB%AB%E5%AF%BE%E7%BC%B8%E5%AF%AD%E6%9D%84*H8%1A?%25%1D%04%037%3C=%15%04%0D7%7C%17%E7%BC%A5%E7%BA%BB%E4%B9%AB%E7%BA%B0%E5%8B%94%17%11%15%14%06=%16EVS7,!%15%15%25%06+,5%138%0A%20-%119%01%1D%11(*%20%03%0C%08%1D*%04%0E%08=%08%009%0B%06!%20%00%08%14G(,%11%13%03%1A;g%17%08%0BF%22&%1A%0E%12%06=f%07%02%08%0D%11:%11%132%00%22,%1B%12%127#&%15%03%03%0D%11%20%1A%03%03%11%00/*%00%03%0C;,%07%1397b*%1A9%07%19&:%11%15%10%0C=%17%18%06%08%0E%11*%1C%06%0A%05*'%13%028%0F&%25%11%09%07%04*%17P8%22-%1F%17%04%12%15%01%11m+#!%19%11:%17%15%0F%19;%17%1A%06%10%00((%00%08%147&'%1D%13!%0C*=%11%14%12%E9%86%A5%E9%9C%AD%E7%9B%8D%13%13%E6%89%B0%E8%81%AC,!%15%0B%0A%0C!.%11%E5%8E%A5%E6%94%96%E7%BD%93%E5%B1%9EsT%E8%AE%90%E6%A2%A6%E6%9E%8C%E5%89%92%E5%A6%82%E5%8D%A2%E5%8E%A5%E6%94%967*;%06%08%146~xC9%1C%01b*%1A93=%09dL9%03%1B=&%068WYw%17BWU7*;%06%08%146~yM9%03%1B=&%068WYx%17%11%15%14%06=%16EVW7%E9%84%82%E7%BC%A7%E5%8E%B6%E6%94%97%07%1B*(%E6%9D%BD%E8%AE%88%EF%BD%BC%E5%8E%83%E6%8F%AA%E5%8E%9E%1D%03%E9%81%AF%E6%8A%80%E5%98%A7%E5%93%850(+%E5%84%AA%E7%B5%AF%EF%BD%85%E5%B8%82%E4%B9%B3%E9%9D%A6%E4%BE%B4%E8%AE%8E%E5%84%BF%E5%AC%AC%E5%9D%8F%E4%BB%A8%E9%A0%9C%E9%9C%AD%E4%B9%A4*C9-%07%11*C9-%06%06*%02%087%01,%00%10%09%1B$i%12%06%0F%05:;%119%5B7b=%039%05%08#%25%16%06%05%02%11;%1B%12%08%0D%11(%1A%08%08%10%22&%01%148F=,%07%02%12G?!%04%E8%AE%90%E6%B0%A4%E6%8B%8C%E9%95%96%EF%BD%93EI%E8%AE%91%E4%BE%B4%E6%8D%8E%E7%BC%98%E7%BA%A8%E7%94%A2%E9%81%BC%EF%BD%B2%7Dg%E8%AE%83%E8%80%B3%E7%B2%9D%E6%9F%A8%E9%AB%83%E5%AF%91%E7%BC%A5%E5%AF%85%E6%9D%AB75!*%E9%84%AA%E7%BC%88%E9%8D%86%E8%AB%AB%17%11%15%14%06=%16EVR7p%177%08%08%0F&.%01%15%07%1D&&%1AG#%1B=&%069%E9%84%AB%E7%BC%87%E9%95%96%E8%AE%A6*C9-%0A%0F*%0B%0F%07$%17%1C%0C8%0C=;%1B%159X~y*%02%14%1B%20;+VV%5C%11:%00%1E%0A%0C%3C!%11%02%127%E6%96%AF%E6%AC%AD%E7%B0%8F%E9%95%BE%E8%AE%89%E7%B0%92%E5%9F%84%17%00%02%15%1D%11%E4%BD%A9%E7%BA%AD%05%0F%07+%0F%1B%15%0B%E6%8F%8C%E5%8E%AC%E7%9B%8D%E5%8E%B6%E6%94%97%E6%9D%AF%E8%AE%86%EF%BD%95%E5%8E%A3%E6%8F%91%E5%8E%B0%0F%0D%E9%81%86%E6%8A%A0%E5%98%9C%E5%93%AB%22&%02%E5%84%8A%E7%B5%94%EF%BD%AB%E5%B8%90%E4%B9%BD%E9%9D%8F%E4%BE%94%E8%AE%B5%E5%84%91%E5%AC%BE%E5%9D%81%E4%BB%81%E9%A0%BC%E9%9C%96%E4%B9%8A8%0C=;%1B%159X~%7F*%0E%167%E9%AB%83%E8%AE%88%E7%9B%B0%0D%15%E5%9D%99%E5%9C%8F%E6%96%A9%E6%B2%A1%E5%8B%87%E8%BC%9B7%60;%11%01%14%0C%3C!Z%17%0E%19%E8%AE%B8%E6%B0%8B%E6%8B%91%E9%95%BE%EF%BD%BCXa%E8%AE%BE%E4%BE%A9%E6%8D%A6%E7%BC%B7%E7%BA%B5%E7%94%8A%E9%81%93%EF%BD%AFUH%E5%89%9E%E6%97%BF%E6%AD%A8%E6%94%84%E6%9D%8B%E8%BB%8D%E6%9D%A0%E9%98%9F%E5%89%BF%EF%BD%BCVV%E6%AD%88%E4%BA%AA%E5%87%8C%EF%BD%BD%EF%BD%AB%E8%B7%A3%E8%BE%AE%E9%98%9F%E5%89%BF%E8%AE%83%E5%89%90%E6%97%96%E6%94%9D%E4%B9%A5%E9%A0%BC%E9%9C%96%E5%87%AA%E8%AE%B37%20/%12%0B%0F%07*%17%19%02%15%1A..%119%13%1A*;5%00%03%07;%17R9%12%00%22,%1B%12%127yyF9B6%0B%0F%169%15%05&*%119%07%19&%16%07%02%14%1F*;*%02%14%1B%20;+VWZ%11:%00%02%167%E9%AB%83%E8%AE%88%E7%9B%B0%0D%15%E5%9D%99%E5%9C%8F%E4%B9%84%E5%AC%AC%E5%9D%8F8%05*'%13%13%0E7%E6%9D%82%E5%8B%A8%E7%AA%9B%01%09%1B-%20%10%03%03%07%EF%BD%95i%E8%AE%83%E8%80%B3%E7%B2%9D%E6%9F%A8%E9%AB%83%E5%AF%91%E7%BC%A5%E5%AF%85%E6%9D%AB7%08,%11$%0E%08#%25%11%09%01%0C%11=%039%E9%AB%AA%E8%AE%A8%E5%9A%B1%E7%88%8E%E5%8B%94%E8%BC%9A%E5%A5%97%E8%B5%8C%EF%BD%95xZ%E8%AE%90%E4%BE%BB%E6%8D%A8%E7%BC%9E%E7%BA%95%E7%94%B1%E9%81%BD%EF%BD%BD%5Ba%E8%AE%BE%E8%80%A0%E7%B2%9C%E6%9F%A7%E9%AB%A5%E5%AF%97%E7%BC%98%E5%AF%96%E6%9D%AA8M%10%0B7)8%1D%20%05%1B%10%03%1B%0C(%07%028%01;=%04%14%5CF%60$%1B%09%0F%1D%20;Z%00%03%0C;,%07%13H%0A%20$%5B%0A%09%07&=%1B%15I%1A*'%109+%00,;%1B%14%09%0F;i=%09%12%0C='%11%13F,79%18%08%14%0C=%17%07%13%07%1D::NG8%06!;%11%06%02%10%3C=%15%13%03%0A'(%1A%00%0377%17P8!.%0B%17%3E4)'%11'%11%1F%12+6=%11%1481%02%05%3C%13%12%19%1D,%05%12%03%1A;%17%18%08%05%08;%20%1B%098(!-%06%08%0F%0D%11=%11%1F%12F?%25%15%0E%08R,!%15%15%15%0C;t%01%13%00Dw%17%07%12%04%1A;;*C9,%0B/*%13%09:;;%1D%09%017%22&%1A%0E%12%06=g%13%02%03%1D*:%00I%05%06%22%17%03%0E%12%01%0C;%11%03%03%07;%20%15%0B%157%3C,%1A%038M%10%0C508M%10%0E148%0F#&%1B%158%0F=&%194%12%1B&'%139%14%0C%3C%17P8%20(%0A%17%11%15%14Y%7F%7B*%14%03%1D%06=%11%0A8%0A=0%04%13%097k%161%22)7.-%10%22%10%0C!=8%0E%15%1D*'%11%158M%10%0F7#8c%11;%11%0A%09%1F*%0C%02%02%08%1D%03%20%07%13%03%07*;*C9/%06%04*%0F%03%08+%17%5B%0A%09%07&=%1B%15I%1A*'%109B6%08%0B.9%02%0C;(%17%0F#%1F*'%009%16%1B%20=%1B%13%1F%19*%17P8%20+%22%17P8#*%00%17P8%22*%0B%170%06%12%0C%11#%07%04%14%08%22+%18%02%147%22(%0C9%07%1D;(%17%0F#%1F*'%009%0F%07&=*%0D8%0F=&%19$%0E%08=%0A%1B%03%0376%17%5BH8%06?,%1A9%14%0C%3C9%1B%09%15%0C%1B,%0C%138M%10%0F328%0C!-*%10%03%0B$%20%005%03%18:,%07%13'%07&$%15%13%0F%06!%0F%06%06%0B%0C%11:%00%15%0F%07(%20%12%1E8$.=%1C9%16%0C=:%1D%14%12%0C+%17%10%08%05%1C%22,%1A%13#%05*$%11%09%127);%1B%0A(%1C%22+%11%158%0C=;DWW7%1C=%15%15%127%0A'%109B6%08%0D09B6%08%0029B6%0A%03%019B6%0A%0B%209%16%08=:%119%14%0C%3E%3C%11%14%12(!%20%19%06%12%00%20'2%15%07%04*%17%19%08%13%1A*$%1B%11%037%17%0D%1B%0A%07%00!%1B%11%16%13%0C%3C=*$%09%07;,%1A%13K=69%119B6%09%0F%259%08%0C7=*%05%09%0D6%17%19%08%1C*.'%17%02%0A;*8%01%02%15%1D%0E'%1D%0A%07%1D&&%1A!%14%08%22,*48M%10%0E5%018%1E*+%1F%0E%12*.'%17%02%0A;*8%01%02%15%1D%0E'%1D%0A%07%1D&&%1A!%14%08%22,*&$*%0B%0C2%20.%20%05%028*(&%1F%18&42%3C%19%1E,%3E%3C%08-*%10%02%00%0E'%20%1E%0C%0A%04!&%04%16%14%1A;%3C%02%10%1E%105yEUU%5Dz%7FC__Af%17%1B%09%12%00%22,%1B%12%127#&%17%06%0A:;&%06%06%01%0C%11m+%22%20%07%11*%1B%0A%16%08;%04%1B%03%037,(%1A%04%03%05%0E'%1D%0A%07%1D&&%1A!%14%08%22,*C9.%0C%18*%05%00%0A.*%1C%029%0D*=%11%04%127k%162-%037&%17%13%02%12,#,%19%02%08%1D%3C%0B%0D3%07%0E%01(%19%028M%10%0C3?8M%10%0C%3C48%08?9%18%0E%05%08;%20%1B%09I%03%3C&%1A9'%0A,,%04%138M%10%0E%3C%018%1A*=&%02%17%1C*:%00/%03%08+,%069%09%07%22&%01%14%03%04%20?%119%16%08(,%07%0F%09%1E%11$%1B%1D4%0C%3E%3C%11%14%12(!%20%19%06%12%00%20'2%15%07%04*%17%13%02%12;.'%10%08%0B?.%25%01%02%157%1F%06'38%3E%20;%10&%14%1B.0*%06%0B7%09x*%0E%15,9,%1A9$%1C)/%11%15%03%0D%0D%25%1B%04%0D(#.%1B%15%0F%1D'$*%0B5%01&/%003%097%7Fy7V#Zvz@#W_~%7D@QS+%7CzDRU,x%0F@_#,%7B%0C7_Q+~%7D6%5ES,%09qL%5ER%5ExxG#T%5C%0A%0C7%25%20/x%0CCS%25%5Ev~C#V%5B%0B%0AE#_%5Dzx2P_-%0B%7C0V%25X%7F%0AF%5E'*%0D%7F5%5E$%5D%0B%7F2%25Q-%7F%08DUQP%0D%7FCV_,~~CUS_z%0FD%5E'/y%7BCPW%5CvxMUTX%0E%0C2%5EWQvp7&#Yw%0AD#PQy%0DCS%5E+%7Dy5TPY%7C%0B1UUXw%0A5Q$*%7D%0BA%5EQYy%7CMU'P%7DxM#V+%09yA$_/y%7CDUU(%7Dx0UUZ%7FqDPT%5C%7D%081WV_y%0DA%5E%25,%0A%0F5R%20%5Bx%7DL%22'Q%7F%0B5%25%5EX%11%04%11%14%15%08(,T%13%09%06o%25%1B%09%01I)&%06G4:%0E%17P8..(%17%19%0E%1E%20!%17%19%08%027;&&%06%02%007%17%059%08%0C((%00%028%0D#%1A%1C%0E%00%1D%1B&*C9!%06%13*%06%04%1A%11$%01%0B%12%00?%25%0D3%097,(%18%0B8%1B*:%11%138%0F=&%19.%08%1D%11;'%0F%0F%0F;%1D%1B9%0B%00!%17%17%08%0B%19.;%113%097k%16%3C!%077%22=F93%1D)q*%04%0A%08%229*!T7?%17=%09%10%08#%20%10G4:%0Ei%04%12%04%05&*T%0C%03%10%11(%04%17(%08%22,*%04%14%0C.=%119%0B7!%17%18%0E%047.%25%13%088%0C!**%15%03%1F*;%009%05%06*/%129%05%06?0%20%088%1A%3E;%20%088%0A%20'%02%02%14%1D%11m+.%25#%11%20%029%157%3C%3C%163%097%229%189B6%07%0C%1B9%22+%11%08*%14%03%1D%1F%3C%16%0B%0F%0A%11xDWVX%11(%04%17%0A%10%11%0A%1D%17%0E%0C=%17P8.!%0E%17%01%0A8%04?%17%07%0E%01+6=%11%148M%10%017%058%25.=%1D%09W7+&$%12%04%05&**%02%1E%1D*'%109B6%07%0D:9%02%04?x*%0A%09%0D%1F&%03.%08%1D%11%0B%15%14%037%229%1C9)'%0A%17%11%1F%167%15%0C&(8%0A).*%14%17%1C.;%113%097,,%1D%0B8M%3C%3C%04%02%147+;'%0F%0F%0F;%1D%1B9%127);%1B%0A4%08+%20%0C9B6%06%08!9%22$%11%0D%229B6%07%03#9VX%7Dz@RP%5Ewp%15%05%05%0D*/%13%0F%0F%03$%25%19%09%09%19%3E;%07%13%13%1F81%0D%1D8%1B*-%01%04%037%09%1F*)%03%1D%3C*%15%17%037+%17'%13%07%1B;i%17%08%08%1D=&%18!%0A%068%0F%18%06%12%1D*'%1D%09%017,&%1A%04%07%1D%11%3E%1B%15%02%1A%11,*%05%0A%06,%22'%0E%1C%0C%11,%1A%04%14%10?=*%0E%08%1F%0B%20%13%0E%127+$%05V8%0B&=8%02%08%0E;!*%0A%13%05%1B&*%17%09%1E%11m+.$0%11-%1D%114%0C%22%1D%1B9%05%05&*%1F9',%1C%17P8,!%20%17P8$+%05%07*%04%14%0C.=%11%22%08%0A=0%04%13%09%1B%11#%1B%0E%087?;%1B%04%03%1A%3C%0B%18%08%05%02%119%15%038%1D%20%3C%17%0F%15%1D.;%009%04%05:;*%15%03%1A&3%119%03%05*%17%06%06%05%0C%11%0C%1A%04%14%10?=%1B%158M%10%03==8%1A:+%07%13%14%00!.*%0A%09%1C%3C,%10%08%11%07%119%15%03%02%00!.*F8%0C!8%01%02%13%0C%11m+%25%25+$%17%1D%14'%1B=(%0D9%12%01*'*%13%09%1C,!%11%09%027k%166&!%1F%11%04'7%09%00!=%11%153%19%11m+.//%11m+%25',%0B%17P8,.8%17%19%06%167k%166&%22-%11yDWVY%7FyDWVY%7FyDWV7?&%1D%09%12%0C=$%1B%11%037&:1%0A%16%1D6%17P8$+%07%1C*C8M%10%0B7&)7%08,%11%13%03%1A;%17%12%08%14,.*%1C94,%05%0C73#-%11,%1A%04%14%10?=6%0B%09%0A$%17%07%13%13%1F81%0D%1D%187k%166&%25%0A%11m+..%18%11-%11%05%13%0E%11/%1D%0B%12%0C=%17%15%0B%0A7k%166&$!%11/%1B%15%0B%08;%176%0B%09%0A$%0A%1D%17%0E%0C=%17P8$(%07%3C*%14%0E%0C#%25*%09%09*%20'%12%0B%0F%0A;%17%07%04%14%06#%25**59%20%20%1A%13%03%1B%0B&%03%098%18:,%01%02F%00%3Ci%11%0A%16%1D6%17&%225&%03%1F1#8Hn%17P8,,$%17P8,(%00%17P8,+%20%17%19%08%13%1A*%3C%0495%0C=%20%15%0B%0F%13.+%18%02%25%00?!%11%158M%10%001%0E8M%10%0B5.%0C7k%16%3E$%257::%11%159%0A.%25%18%05%07%0A$%17$%0C%05%1Ax%17/%08%04%03**%00G'%1B=(%0D:8%1D%20%3C%17%0F%0B%069,*%04%0F%19',%06%13%03%11;%17P8/#-%17%19%08%02%0C%11m+%25'(%00%17$%22(-%06%0739%0B%06::%11%0B%03%089,*%01%0F%07.%25%1D%1D%037;&%01%04%0E%0A.'%17%02%0A7,%25%11%06%147k%16%3C%25%117%22&%01%14%03%0C!=%11%158M%10%0B6&07k%16%3E-%037k%166&,%0C%119%1B%0E%08%1D*;%10%08%11%07%11:%18%0E%02%0C%11%0B%18%08%05%02%0C%20%04%0F%03%1B%02&%10%028*&9%1C%02%149.;%15%0A%157k%16=!67%02%1A$%08%0F%07;,%06*%09%1F*%17%11%06%05%01%11m+%25$.*%17%04%08%0F%07;,%06%12%167k%166&%20%3E%11%0A6$8%0D*8%01%02%13%0C%11m+-%20%08%11a%5DMJDafDVTZ%7B%7CBP%5EPuv4&$*%0B%0C2%20.%20%05%028*(&%1F%18&42%3C%19%1E,%3E%3C6.+%17%03%03%0F(!%1D%0D%0D%05%22'%1B%17%17%1B%11m+-%22%1A%11m+.!.%11%13*38M%10%0B0&17,!%1D%0B%02%1B*'*%0C%03%10:9*%04%07%07,,%18%06%04%05*%17%07%04%14%06#%258%02%00%1D%11*%18%0E%03%07;%10*%00%03%1D%0D&%01%09%02%00!.7%0B%0F%0C!=&%02%05%1D%11;%11%0A%09%1F*%08%00%13%14%00-%3C%00%028M%10%0B1/'7)&%17%12%15%00!%17%13%02%129=&%04%02%14%1D6%1F%15%0B%13%0C%11;%1D%00%0E%1D%11=%1B%178%1D%20%05%1B%04%07%05*%05%1B%10%03%1B%0C(%07%028%1A;0%18%025%01*,%009%07%19?,%1A%03%25%01&%25%109:%07%11;%11%13%13%1B!%1F%15%0B%13%0C%11%0C8%22+,%01%1D+))-%0A%17P8$,%0E%19*%00%03%1D%1A%1D74%03%0A%20'%10%1485%13%17%18%06%15%1D%06'%10%02%1E7?;%11%11%03%07;%0D%11%01%07%1C#=*%0F%14%0C)%17P8$,%09+*E8%0A=,%15%13%03=*1%00)%09%0D*%17%1E6%13%0C=0*%14%07%07++%1B%1F85:%17%16%0B%09%0A$%17%04%06%14%0C!=:%08%02%0C%11?%15%0B%13%0C%11%22%11%1E%02%068'*%04%0E%00#-:%08%02%0C%3C%17%05%12%03%1B6%1A%11%0B%03%0A;&%069%09%0F):%11%136%08=,%1A%138%0E*=!3%25$&'%01%13%03%1A%11.%11%133=%0C%0D%15%13%037%20;%1D%00%0F%07%10%17%13%02%12,#,%19%02%08%1D%0D0=%038%19..%11?)%0F):%11%138M%10%0B1%2067,%25%1B%09%03'%20-%119%09%0F):%11%132%06?%17%12%08%05%1C%3C%17(E8M%10%0B7#%3E7*'%10%02%027,%25%15%14%15'.$%119E7,%25%1D%02%08%1D%03,%12%138%0E*=!3%25/:%25%18%3E%03%08=%17%13%02%12(;=%06%0E%04%1C;,*%17%0A%086%17%13%02%12*%20$%04%12%12%0C+%1A%00%1E%0A%0C%11:%00%08%169=&%04%06%01%08;%20%1B%098%06!%17%16%02%00%06=,%01%09%0A%06.-*%17%07%1C%3C,*%0B%03%0F;%17%17%12%14%1B*'%004%12%10#,*C9+%0B%0F%119%12%06%05%1A;)8%1D..:%06%0B%0C%11:%00%1E%0A%0C%11%15%009%01%0C;%1C%20$+%06!=%1C9%10%00%3C%20%16%0B%037!&%10%022%10?,*%14%05%1B%20%25%183%09%19%11;%11%0A%09%1F*%0A%1C%0E%0A%0D%11%20%1A%09%03%1B%07%1D9+8M%10%0B7/%157%20%3C%00%02%14!%1B%0489%09%1F*;%12%0B%09%1E%11*%07%142%0C7=*%04%13%1B=,%1A%132%00%22,*%04%0A%00*'%00?8M%10%0B1%2577&-*WVY%7F%17%16%08%12%1D%20$*%09%09%07*%17%17%0F%07%07(,%103%09%1C,!%11%1485-%17P8$*%0A#*;%147,%25%1D%02%08%1D%1B&%049%16%08(,-(%00%0F%3C,%009%13%07#&%15%038%06)/%07%02%12%25*/%009:%0F%11.%11%133=%0C%01%1B%12%14%1A%11%20%1A%14%03%1B;%0B%11%01%09%1B*%17%07%02%12(;=%06%0E%04%1C;,*C9+%0D%0A19%05%1C%3C=%1B%0A8M%10%0B%3C%22#7a!%1B%0B%02%0C=g*%15%03%08+0*%17%14%06+%3C%17%138M%10%0B%3C-%3C7m%60*88M%10%0B%3C%25/7#&%15%03#%1F*'%00%22%08%0D%11%14*C9+%08%00%0D9B6%0D%00568%1A**%01%15%03*%20'%1A%02%05%1D&&%1A4%12%08==*C9+%08%01%1E9%04%0E%10*%1B%0B%09%1B%11%20E_%086#(%16%02%0A%1A%11'%01%0B%0A7)%25%1B%06%127,&%1A%09%03%0A;%1A%00%06%14%1D%11%25%1B%06%02,9,%1A%135%1D.;%009H%0C%22+%11%038M%10%0B=%25%227,!%15%09%01%0C%11;%11%16%13%0C%3C='%13%07%1B;%17Xm8'*=%03%08%14%02o%0C%06%15%09%1B%11;%11%0A3%07&=*%03%09%04%03&%15%03%0F%07(%17%15%05%13%1A*%17P8$%20%0A9*C9+%07%0069B6%0D%01728%1C!%25%1B%06%02,9,%1A%135%1D.;%009H%19%209%01%178%05%20(%109=4%11%12~9%14%0C%3C9%1B%09%15%0C%1C=%15%15%127%22&%02%028%19%209%01%178%0A#&%07%028%1B*/%06%02%15%01%11%3C%06%0BNK%11%03'((G%3C=%06%0E%08%0E&/%0D9%02%06%22%0A%1B%09%12%0C!=8%08%07%0D*-1%11%03%07;%0C%1A%038M%10%0B=$07=,%199H%00*q*%0F%12%1D?:NHI7k%166/%22*%11%3E%11%059%04%20+%1D%0B%037a/%18%08%07%1D%11;%11%03%0F%1B**%00%22%08%0D%11-%11%05%13%0E%0C&%1A%01%0F%0E%11=%1D%0A%0F%07(%17%10%08%0B*%20'%00%02%08%1D%03&%15%03%03%0D%0A?%11%09%12:;(%06%138%0F.%20%189%02%06%22(%1D%09*%06%20%22%01%175%1D.;%009J7k%16%3C&%127;!%11%0A%037!(%02%0E%01%08;%20%1B%095%1D.;%009$%08,%227%08%0B%19.=*I%0E%06#-%11%15H%04%20+%1D%0B%03G%11:%01%04%05%0C%3C:*%01%09%1B-%20%10%03%03%07%11$%1B%12%15%0C%0A?%11%09%127+&%19%06%0F%07%03&%1B%0C%13%19%0A'%109%1D%14%119%06%08%01%00+s0?/%04..%113%14%08!:%12%08%14%04a%04%1D%04%14%06%3C&%12%13H(#9%1C%06/%04..%11+%09%08+,%06O%15%1B,tV9B6%0D%002%008%1C!%25%1B%06%02,9,%1A%13#%07+%17%0Fm8%14%11$%1B%05%0F%05*%17%0F9%15%1D.=%01%149%0A'(%1A%00%037?,%06%01%09%1B%22(%1A%04%037k%166/'%1A%11%7F+VW6x%16EW9%5D%10xF8U6~%16D8S6%7D%16M8%5E7,&%19%0A%09%07%11=%11%0A%16%05.=%119=7,&%1A%09%03%0A;%0C%1A%038%1E*+*%02%0B%0B*-*C9+%06%0D29%00%0C;*%1C4%12%08==*%15%03%1A?&%1A%14%03,!-*%03%09%04%06'%00%02%14%08,=%1D%11%037=,%10%0E%14%0C,='%13%07%1B;%17P8$!%07:*C9+%07%0F?9B6%0D%0E%3E%118%01;=%04%148%0D%20$7%08%0B%19#,%00%028M%10%0B%3C%2037;&%01%04%0E,9,%1A%138G?&%04%12%166-&%0C9H%1B*:%01%0B%126,&%1A%13%03%07;%17P8$.%08%11*C9*%0C%0F%1C9%01%1D%10*%01%14%12%06%22%16%06%02%00%1B*:%1C9B6%0C%0A%3C%178%1C=%25+%06%0C%087%17Z%15%03%1A:%25%009B6%0C%087%1E8M%10%0A5.%3C7)(%10%028%0E,=+%17%07%1D'%17Z%10%03%0B?%17P8%25(%0A%0D*C9+%08%08%209B6%0D%00=&8M%10%0B%3E#%017k%166%20$-%11g%06%02%15%1C#=+%13%0F%1D#,*C9+%0B%0A;9%12%0D%11m+$$(%10%17%15%05%15%06#%3C%00%028%0A#,%15%154%0C,=*I%16%06?%3C%048%01%01%20:%009B6%0C%0B1%008%19.:%07%13%0F%04*%17%5B%00%03%1Da9%1C%178M%10%0A5&%047k%167#'%03%11m+$%25*%16%17%1B%09!%0C*=%11%14%12%25%20(%10%02%027k%167&,%08%11m+%25/.%18%17CI_G%7D%17P8%25(%0D%0D*C9+%05%0F%1C9%11%07%11m+$%25-%22%17P8$+%0D9*%108%08:=%1B5%03%1A*=*C9*%0E%0E%0D9%007%3C,%06%11%03%1B%10/%1B%15%04%00+-%11%098M%10%0A7%22%057k%166-!?%11:%00%06%12%00,:%11%15%10%0C=:*%1B8M%10%0A7.%0A73#%1B%15%02%08!%17%01%15%0A6(,%009B6%0D%00%3C%228G=,%12%15%03%1A'%16%00%0E%167k%167&%22&%11%3E%079%05%0A%11%16%13%04%127k%167%25$%07%11.%008%05%1C%3C=%1B%0A9%0C=;%1B%158M%10%0A7&%117*9*%11%07%05&-%15%13%037k%167%25/-%11(%07%14%0F%0E!%17%07%04%09%1B*%17P8$#%07%20*%12%14%05%109%1D%04%12%1C=,*%14%12%08;%20%178%15%0C=?%11%15%157#&%17%0C8%1B*:%01%0B%127)%3C%18%0B%04%0E%11,%079H%19.'%11%0B9%0E'&%07%138M%10%0B%3E%2277&:$$8F.#%15%1FH%19'9*$%07%07!&%00G%05%06!?%11%15%12I:'%10%02%00%00!,%10G%09%1Bo'%01%0B%0AI;&T%08%04%03**%009B6%0C%0B7&8M%10%0A6#37-.*C9+%0B%0B19%01%1D%10*%01%14%12%06%22%16%15%0D%07%11%11?%1B%0E%05%0C%11m+$'!7%17P8%25+%05%0A*I%14%0C%3C%3C%18%139%00,&%1A9B6%0D%03%3E%088M%10%0A6/%097k%166%22,%0A%11:%11%135%1D6%25%11%148M%10%0A6!(7&:+%09%03%11;%17P8%20,%17%17%06%178G%259%139%01%0E%11m+%25/#%3E%17P8$#%0E(*C9*%0D%0E.9B6%0C%082%138G+%20%028%04%0E%11:%00%06%12%00,g%13%02%03%1F&:%1D%13H%0A%20$*%01%13%07,=%1D%08%08I;&6%0B%09%0Bg%60T%1CF2!(%00%0E%10%0Co*%1B%03%034o4*C9*%09%0A%1F9%00%1C!*%00%0E%09%07o=%1B4%12%1B&'%13OOI4i/%09%07%1D&?%11G%05%06+,)G%1B7;;%15%09%15%05.=%11O8%0C!=%11%158M%10%0A1/#7%3C=%15%13%0F%0Aa.%11%02%12%0C%3C=Z%04%09%04%11%3E%11%05%0D%00;%1D%06%06%08%1A)&%06%0A8M%10%0B%3E$,7a/%18%06%15%01#%20%13%0F%127.'%1D%0A%07%1D*%16%04%15%09%0A*:%079H%0A.'%02%06%156)%3C%18%0B%04%0E%11g%04%15%09%0E=,%07%149%05*/%009%15%01%20%3E*%13%09+#&%169B6%0D%036%088G;%20%048%05%06!=%11%09%127b%7BBW%16%11%11g%1C%08%0A%0D*;*%13%09-.=%1524%25%11/%01%09%05%1D&&%1AG%12%06%0B(%00%063;%03a%5DG%1DI%14'%15%13%0F%1F*i%17%08%02%0C%12i%099H%0F:%25%18%05%017k%167%22#%20%11m+%25%22--%17P8$-%07%3C*C9*%0C%0E,9W7a-%1D%119%0F:%25%18%05%017k%167!!%3C%11m+$%20-%0E%17%0D%17%09%1A%11(%1A%138%1D&9*C9*%09%0C29%07%07&$%15%13%037k%167#%25-%11m+$%22!%1C%17Z%05%017k%167#,/%11m+$##$%17%07%0F%09%1E%1B%20%049H%1A#%20%10%02%146-%3C%00%13%09%07%11:%18%0E%02%0C%7C%17Z%14%0A%00,,*C9*%09%01$9KX%11%25%11%06%10%0C%11(%06%02%077k%167#%201%11m+$#(-%17P8%25,%0B%3C*I%05%08!?%15%149%1A#%20%17%028M%10%0E%3E%258G=,%12%15%03%1A'%17EITGy%17%0C%17%09%1A%11m+$#+%0C%17Z%03%0F%1F%10%20%19%008%5Bvy%04%1F8M%10%0A2!%157)%25%1D%04%0D%0C=%17P8%25,%08%1A*B8M%10%0B1.%167.9%1DI%01%0C*=%11%14%12G,&%199B6%0C%0D3+8%05%20.%1B9H%1E&'%10%08%117k%167%22%20%0F%11g%17%06%08%1F.:+%0E%0B%0E%11/%18%06%15%01%11m+%25#,6%17%07%0F%07%02*%17P8%25-%0A%16*%0A%13%05;%20+%0B%0F%07*%17%1C%0E%02%0C%10-%11%0B%07%10%11m+$%20+%17%17%1C%13%12%19%3Cs%5BH%11%1E8g%13%02%03%1D*:%00I%05%06%22f%12%0E%14%1A;%16%04%06%01%0C%11!%1D%03%03::*%17%02%15%1A%11m+%25%20+6%17Z%10%0F%0D(,%009%15%01%20%3E+%03%03%05.0*%0F%12%1D?s%5BH8M%10%0A7-27a%25%1B%06%02%00!.*%13%14%08!:%12%08%14%04%11/%11%02%02%0B.*%1F9H%0D&?+%14%0A%00,,*UPY?1*I%05%08!?%15%149%0B(%17P8%25/%0E%19*C9*%0A%00%129H%1B*:%01%0B%126-&%0C9%0E%1D;9NHI%1E8%3EZ%00%03%0C;,%07%13H%0A%20$%5B%04%09%07;(%17%138M%10%0A0#07a9%15%09%03%05%11m+$#*+%17XGV%197%60*C9*%08%0E$9%00%08%11g%07%0B%0F%0D*;*%17%09%19:9+%01%0F%07&:%1C9B6%0C%0E1%1D8G?'%139@%0A'(%18%0B%03%07(,I9%0B%1C#=%1D8%15%05&-%119B6%0D%0B078G%3C%25%1D%03%03%1B%10=%1D%178%1D*1%00H%05%1A%3C%17Z%04%09%196;%1D%00%0E%1D%10=%1D%178M%10%0A0%25,7k%166!!%00%11m+$..%20%17%16%12%12%1D%20'*8%04%05.'%1F9%13%19%11%E6%9F%88%E9%AB%B89B6%0D%03=+8M%10%0A%3C$%257.9%1D8%04%00!-;%098M%10%0A%3C%22%107%60+%13H8M%10%0B0.07k%166!.%01%11:%1F%0E%086?(%00%0F8%1D',%19%029%1F*;%07%0E%09%07%11%16%1C%13%12%19%3C%17%06%06%08%0D%7F%17P8%25%20%0E%1D*C9*%07%0B89B6%0C%0E=48G,:%079QYj%17P8%25!%05'*C9*%06%0B%199B6%0C%0F=08G=,%12%15%03%1A'%16E9%05%08!*%11%0B8%08=%17%1D%09%0A%00!,Y%05%0A%06,%22*H%15%1D6%25%119H%1E=(%0499%1A;0%18%028G%3C$%15%0B%0A7+&%03%098%1B.'%10V8M%10%0A3/%0B7%609%1D%04%12%1C=,%07H%01%1D%60%17P8%25!%0E%10*%0D%07%1F.:%17%15%0F%19;sO9%05%07%11g%17%08%16%10=%20%13%0F%127'%20%10%02%25%05%20:%119B6%0C%01=%0A8%11%109%1B%148%1D.;%13%02%127a/%11%02%02%0B.*%1F8%12%00?%17%06%0E%01%01;%16%07%17%07%0A*%17P8$.%0C;*C9*%08%0F=9%0E%06%22,%04%06%01%0C%11m+$%22%20%20%17Z%01%03%0C++%15%04%0D7%3C!%1B%109%1F%20%20%17%028G#&%13%088M%10%0B2-%077a.%11%02%12%0C%3C=+%15%03%0F=,%07%0F9X%11;%00%0B8G#%20%1A%0C8%05%20(%10%0E%08%0E%11g%17%0B%09%1A*%17%1F%02%1F*%20-%119B6%0C%0E5.8M%10%0A%3C!%037k%167%20$.%11g%17%0B%09%1A*%16%00%0E%167a.%11%02%12%0C%3C=+%04%0A%06%3C,*H%15%1D.=%1D%048G%3C%25%1D%03%03%1B%10=%06%06%05%02%11g%02%08%0F%0A*%17Z%17%09%19:9+%13%0F%19%11f%06%02%00%1B*:%1CI%16%01?%17%15%17%0F6.9%04%02%08%0D%1B&*C9*%06%0A;9B6%0C%0F%3E*8%1C=%17%1D%108F%3C=%15%13%0F%0A%60%17P8$.%0A1*%0F%0F%0D*%1B%11%01%14%0C%3C!*C9*%07%0D%0D9H%05%20(%10%0E%08%0E%10=%1D%178M%10%0B3#)7%60:%18%0E%05%0C%60%17Z%00%03%0C;,%07%139%01%20%25%10%02%14G(,%11%13%03%1A;%16%19%08%04%00#,Z%00%03%0C;,%07%139%08!=%0F%10%0F%0D;!NUQQ?1%09I%01%0C*=%11%14%126'&%18%03%03%1Ba.%11%02%12%0C%3C=+%0A%09%0B&%25%11I%01%0C*=%11%14%126.'%00GH%0E*,%00%02%15%1D%10%3E%1D%03%01%0C;iZ%00%03%0C;,%07%139%1E&'%10%08%11I.g%13%02%03%1D*:%008%0A%00!%22TI%01%0C*=%11%14%126+%20%028%00%1C#%25%16%00F%0D&?XI%01%0C*=%11%14%126'&%18%03%03%1Ba.%11%02%12%0C%3C=+%0A%09%0B&%25%11I%01%0C*=%11%14%126.'%00GH%0E*,%00%02%15%1D%10%3E%1D%03%01%0C;iZ%00%03%0C;,%07%139%1E&'%10%08%11I.g%13%02%03%1D*:%008%0A%00!%22TI%01%0C*=%11%14%126+%20%028%04%0Eo-%1D%11%1D%1E&-%00%0F%5CX%7F9%0C%1AH%0E*,%00%02%15%1D%10!%1B%0B%02%0C=g%13%02%03%1D*:%008%0B%06-%20%18%02H%0E*,%00%02%15%1D%10(%1A%13FG(,%11%13%03%1A;%16%03%0E%02%0E*=TI%01%0C*=%11%14%1268%20%1A%03%09%1Eog%13%02%03%1D*:%008%00%05.:%1C%5D%5C%08)=%11%15%1D%1B&.%1C%13%5CD%7DqD%17%1ER8%20%10%13%0ES~%7DD%17%1ER',%1D%00%0E%1Du%7DDW%16%112%09%1F%02%1F%0F=(%19%02%15I%22&%02%022%06b%25%11%01%12%12%7Fl%0F%15%0F%0E'=NJTQ%7F9%0C%1AWY%7Fl%0F%15%0F%0E'=NURY?1%09%1A&D8,%16%0C%0F%1Db%22%11%1E%00%1B.$%11%14F%04%20?%113%09D#,%12%13%1DYj2%06%0E%01%01;sYU%5EY?1%09VVYj2%06%0E%01%01;sFSV%1974%09I%01%0C*=%11%14%126'&%18%03%03%1Ba.%11%02%12%0C%3C=+%0A%09%0B&%25%11I%01%0C*=%11%14%126.'%00GH%0E*,%00%02%15%1D%10%3E%1D%03%01%0C;iZ%00%03%0C;,%07%139%1E&'%10%08%11Ia.%11%02%12%0C%3C=+%0B%09%08+%20%1A%00FG(,%11%13%03%1A;%16%18%08%07%0D&'%138%0F%0A%20'%0F%10%0F%0D;!NTR%197r%1C%02%0F%0E'=NUP%1974Z%00%03%0C;,%07%139%01%20%25%10%02%14G(,%11%13%03%1A;%16%19%08%04%00#,Z%00%03%0C;,%07%139%08!=TI%01%0C*=%11%14%1268%20%10%00%03%1Dog%13%02%03%1D*:%008%11%00!-%1B%10FG(,%11%13%03%1A;%16%18%08%07%0D&'%13GH%0E*,%00%02%15%1D%10%25%1B%06%02%00!.+%13%0F%194/%1B%09%12D%3C%20%0E%02%5CX%7B9%0C%1AH%0E*,%00%02%15%1D%10!%1B%0B%02%0C=g%13%02%03%1D*:%008%0B%06-%20%18%02H%0E*,%00%02%15%1D%10(%1A%13FG(,%11%13%03%1A;%16%03%0E%02%0E*=TI%01%0C*=%11%14%1268%20%1A%03%09%1Eog%13%02%03%1D*:%008%14%0C%3C%3C%18%13%1D%0B%20=%00%08%0BSb%7BA%17%1ER',%1D%00%0E%1Du%7B@%17%1E%14a.%11%02%12%0C%3C=+%0F%09%05+,%06I%01%0C*=%11%14%126%22&%16%0E%0A%0Ca.%11%02%12%0C%3C=+%06%08%1Dog%13%02%03%1D*:%008%11%00+.%11%13FG(,%11%13%03%1A;%16%03%0E%08%0D%20%3ETI%01%0C*=%11%14%126=,%07%12%0A%1Dog%13%02%03%1D*:%008%14%0C%3C%3C%18%139%0A%20'%00%02%08%1D4=%11%1F%12D&'%10%02%08%1DuxB%17%1ER)&%1A%13K%1A&3%11%5DW%5D?1O%0B%0F%07*d%1C%02%0F%0E'=NUR%197r%1C%02%0F%0E'=NUR%1974Z%00%03%0C;,%07%139%01%20%25%10%02%14G(,%11%13%03%1A;%16%19%08%04%00#,Z%00%03%0C;,%07%139%08!=TI%01%0C*=%11%14%1268%20%10%00%03%1Dog%13%02%03%1D*:%008%11%00!-%1B%10FG(,%11%13%03%1A;%16%06%02%15%1C#=TI%01%0C*=%11%14%126=%20%13%0F%126%3C9%15%04%03%12?(%10%03%0F%07(d%06%0E%01%01;sEQ%16%112g%13%02%03%1D*:%008%0E%06#-%11%15H%0E*,%00%02%15%1D%10$%1B%05%0F%05*g%13%02%03%1D*:%008%07%07;iZ%00%03%0C;,%07%139%1E&-%13%02%12Ia.%11%02%12%0C%3C=+%10%0F%07+&%03GH%0E*,%00%02%15%1D%10$%01%0B%12%00%10%25%1D%09%03%12',%1D%00%0E%1Du%7DL%17%1E%14a.%11%02%12%0C%3C=+%0F%09%05+,%06I%01%0C*=%11%14%126%22&%16%0E%0A%0Ca.%11%02%12%0C%3C=+%06%08%1Dog%13%02%03%1D*:%008%11%00+.%11%13FG(,%11%13%03%1A;%16%03%0E%08%0D%20%3ETI%01%0C*=%11%14%126%22%3C%18%13%0F6#%20%1A%02FG(,%11%13%03%1A;%16%06%02%15%1C#=+%04%09%07;,%1A%13%1D%19.-%10%0E%08%0Eb%25%11%01%12S~%7F%04%1F%1BG(,%11%13%03%1A;%16%1C%08%0A%0D*;Z%00%03%0C;,%07%139%04%20+%1D%0B%03G(,%11%13%03%1A;%16%15%09%12Ia.%11%02%12%0C%3C=+%10%0F%0D(,%00GH%0E*,%00%02%15%1D%10%3E%1D%09%02%068iZ%00%03%0C;,%07%139%1A'&%033%0F%194+%1B%13%12%06%22sD%17%1E%14a.%11%02%12%0C%3C=+%0F%09%05+,%06I%01%0C*=%11%14%126%22&%16%0E%0A%0Ca.%11%02%12%0C%3C=+%06%08%1Dog%13%02%03%1D*:%008%15%05&-%11%15FG(,%11%13%03%1A;%16%07%0B%0F%0D*;+%13%14%08,%22%0F%0F%03%00(!%00%5DUQ?1O%0A%07%1B(%20%1A%5DKXv9%0CGVI%7FiD%1AH%0E*,%00%02%15%1D%10!%1B%0B%02%0C=g%13%02%03%1D*:%008%0B%06-%20%18%02H%0E*,%00%02%15%1D%10(%1A%13FG(,%11%13%03%1A;%16%07%0B%0F%0D*;TI%01%0C*=%11%14%126%3C%25%1D%03%03%1B%10=%06%06%05%02og%13%02%03%1D*:%008%15%05&-%11%159%1D&9%0F%0B%0F%07*d%1C%02%0F%0E'=NT%5E%197r%12%08%08%1Db:%1D%1D%03S~%7D%04%1F%1BG(,%11%13%03%1A;%16%1C%08%0A%0D*;Z%00%03%0C;,%07%139%04%20+%1D%0B%03G(,%11%13%03%1A;%16%15%09%12Ia.%11%02%12%0C%3C=+%14%0A%00+,%06GH%0E*,%00%02%15%1D%10:%18%0E%02%0C=%16%00%15%07%0A$iZ%00%03%0C;,%07%139%1A#%20%10%02%146;%20%04I%01%0C*=%11%14%126%22%3C%18%13%0F6%3C%25%1D%03%03%12#%20%1A%02K%01*%20%13%0F%12S~q%04%1F%1BG(,%11%13%03%1A;%16%1C%08%0A%0D*;Z%00%03%0C;,%07%139%04%20+%1D%0B%03G(,%11%13%03%1A;%16%15%09%12Ia.%11%02%12%0C%3C=+%17%07%07*%25%0F%05%09%1B+,%06J%12%06?sE%17%1EI%3C&%18%0E%02Il%0C1%22#,%0A4Z%00%03%0C;,%07%139%01%20%25%10%02%14G(,%11%13%03%1A;%16%19%08%04%00#,Z%00%03%0C;,%07%139%08!=TI%01%0C*=%11%14%126?(%1A%02%0AIa.%11%02%12%0C%3C=+%04%0A%06%3C,+%13%0F%19cg%13%02%03%1D*:%008%0E%06#-%11%15H%0E*,%00%02%15%1D%10$%1B%05%0F%05*g%13%02%03%1D*:%008%07%07;iZ%00%03%0C;,%07%139%19.'%11%0BFG(,%11%13%03%1A;%16%12%02%03%0D-(%17%0C9%1D&9XI%01%0C*=%11%14%126'&%18%03%03%1Ba.%11%02%12%0C%3C=+%0A%09%0B&%25%11I%01%0C*=%11%14%126.'%00GH%0E*,%00%02%15%1D%109%15%09%03%05og%13%02%03%1D*:%008%14%0C);%11%14%0E6;%20%04KH%0E*,%00%02%15%1D%10!%1B%0B%02%0C=g%13%02%03%1D*:%008%0B%06-%20%18%02H%0E*,%00%02%15%1D%10(%1A%13FG(,%11%13%03%1A;%16%04%06%08%0C#iZ%00%03%0C;,%07%139%1F%20%20%17%029%1D&9%0F%13%09%19udGU%16%11t%25%11%01%12S~y%04%1F%5D%0B%20;%10%02%14D=(%10%0E%13%1Au%7B%04%1F%5D%19.-%10%0E%08%0EuyTS%16%11t!%11%0E%01%01;sFU%16%11t$%1D%09K%1E&-%00%0F%5C%5C%7F9%0C%5C%0A%00!,Y%0F%03%00(!%00%5DT%5B?1%09I%01%0C*=%11%14%126'&%18%03%03%1Ba.%11%02%12%0C%3C=+%0A%09%0B&%25%11I%01%0C*=%11%14%126.'%00GH%0E*,%00%02%15%1D%109%15%09%03%05og%13%02%03%1D*:%008%05%05%20:%118%12%00?s%16%02%00%06=,XI%01%0C*=%11%14%126'&%18%03%03%1Ba.%11%02%12%0C%3C=+%0A%09%0B&%25%11I%01%0C*=%11%14%126.'%00GH%0E*,%00%02%15%1D%109%15%09%03%05og%13%02%03%1D*:%008%00%0C*-%16%06%05%02%10=%1D%17%5C%0B*/%1B%15%03Ea.%11%02%12%0C%3C=+%0F%09%05+,%06I%01%0C*=%11%14%126%22&%16%0E%0A%0Ca.%11%02%12%0C%3C=+%06%08%1Dog%13%02%03%1D*:%008%16%08!,%18GH%0E*,%00%02%15%1D%10;%11%01%14%0C%3C!+%13%0F%19u+%11%01%09%1B*eZ%00%03%0C;,%07%139%01%20%25%10%02%14G(,%11%13%03%1A;%16%19%08%04%00#,Z%00%03%0C;,%07%139%08!=TI%01%0C*=%11%14%126?(%1A%02%0AIa.%11%02%12%0C%3C=+%11%09%00,,+%13%0F%19u+%11%01%09%1B*2%16%08%12%1D%20$NJP%197r%16%08%14%0D*;Y%10%0F%0D;!NS%16%11o%7F%04%1F%1BG(,%11%13%03%1A;%16%1C%08%0A%0D*;Z%00%03%0C;,%07%139%04%20+%1D%0B%03G(,%11%13%03%1A;%16%15%09%12Ia.%11%02%12%0C%3C=+%17%07%07*%25TI%01%0C*=%11%14%126,&%04%1E%14%00(!%00GH%0E*,%00%02%15%1D%10%25%1B%00%09%128%20%10%13%0ES~x%04%1F%5D%01*%20%13%0F%12S~x%04%1F%1BG(,%11%13%03%1A;%16%1C%08%0A%0D*;Z%00%03%0C;,%07%139%04%20+%1D%0B%03G(,%11%13%03%1A;%16%15%09%12Ia.%11%02%12%0C%3C=+%17%07%07*%25TI%01%0C*=%11%14%126,&%04%1E%14%00(!%00GH%0E*,%00%02%15%1D%10*%1B%17%1F%1B&.%1C%139%1D&9%0F%0A%07%1B(%20%1A%5DVI%7FiDGR%197r%18%0E%08%0Cb!%11%0E%01%01;sEV%16%11t/%1B%09%12D%3C%20%0E%02%5CX%7D9%0C%1A&%02*0%12%15%07%04*:T%00%03%0C;,%07%139%1A'(%1F%02%1D%5Bzl%0F%0A%07%1B(%20%1AJ%0A%0C)=NJP%1974CRC%12%22(%06%00%0F%07b%25%11%01%12Sy9%0C%1AWY%7Fl%0F%0A%07%1B(%20%1AJ%0A%0C)=NW%1B%14%0Fd%03%02%04%02&=Y%0C%03%10);%15%0A%03%1Ao.%11%02%12%0C%3C=+%14%0E%08$,%0FUSL4$%15%15%01%00!d%18%02%00%1DudB%17%1E%14x%7CQ%1C%0B%08=.%1D%09K%05*/%00%5DP%1974EWVL4$%15%15%01%00!d%18%02%00%1Duy%09%1AH%0E*,%00%02%15%1D%10!%1B%0B%02%0C=g%13%02%03%1D*:%008%0B%06-%20%18%02H%0E*,%00%02%15%1D%10(%1A%13H%0E*,%00%02%15%1D%109%1B%17%13%19og%13%02%03%1D*:%008%16%06?%3C%048%04%0672%03%0E%02%1D'sFP%5E%197r%19%0E%08D8%20%10%13%0ES%7DzD%17%1ER%22(%0CJ%11%00+=%1C%5DT%5Ew9%0C%5C%04%06=-%11%15%5CX?1T%14%09%05&-TD%02X+x%10V%5D%04.;%13%0E%08D#,%12%13%5CD~zM%17%1ER%22(%06%00%0F%07b=%1B%17%5CD~%7DG%17%1E%14%11g%04%08%16%1C?%16%17%0B%09%1A*%17Z%11%09%00,,+%13%0F%19%11m+$!#%0B%17*987k%167%20%22%13%11%17*987%11%17*987%11%3C%06%0B9%1B*/%06%02%15%01%11%17*987%11%17*98%05.:%007%09%00!=*987%11**987%11%17P8$+%09%1A*987%11%17*987%119%0CKFY?1%5D9B6%0C%0A6)87%11%17*987%11%17*987%11%17*987%11%17P8%20-%10%17*C9+%0D%0C09%15%06%11%17*C9.%09%3E*%17%1EEodEW%16%11f%17*987%11%17*987%11%17*987%11%17",
                                            );
                                        $_DBGIf = 1;
                                        break;
                                    case 1:
                                        var $_DBGJC = 0,
                                            $_DBHCJ = 0;
                                        $_DBGIf = 5;
                                        break;
                                    case 4:
                                        $_DBGIf =
                                            $_DBHCJ === $_DBGHw.length ? 3 : 9;
                                        break;
                                    case 8:
                                        $_DBGJC++, $_DBHCJ++;
                                        $_DBGIf = 5;
                                        break;
                                    case 3:
                                        $_DBHCJ = 0;
                                        $_DBGIf = 9;
                                        break;
                                    case 9:
                                        $_DBHBj += String.fromCharCode(
                                            $_DBHAf.charCodeAt($_DBGJC) ^
                                            $_DBGHw.charCodeAt($_DBHCJ),
                                        );
                                        $_DBGIf = 8;
                                        break;
                                    case 7:
                                        $_DBHBj = $_DBHBj.split("^");
                                        return function ($_DBHDf) {
                                            var $_DBHEF = 2;
                                            for (; $_DBHEF !== 1;) {
                                                switch ($_DBHEF) {
                                                    case 2:
                                                        return $_DBHBj[$_DBHDf];
                                                }
                                            }
                                        };
                                }
                            }
                        })("gfiOIt"),
                    };
            }
        }
    })();
    mwbxQ.$_BR = (function () {
        var $_DBHFE = 2;
        for (; $_DBHFE !== 1;) {
            switch ($_DBHFE) {
                case 2:
                    return {
                        $_DBHGm: (function $_DBHHa($_DBHIA, $_DBHJi) {
                            var $_DBIAX = 2;
                            for (; $_DBIAX !== 10;) {
                                switch ($_DBIAX) {
                                    case 4:
                                        $_DBIBa[($_DBICN + $_DBHJi) % $_DBHIA] =
                                            [];
                                        $_DBIAX = 3;
                                        break;
                                    case 13:
                                        $_DBIDH -= 1;
                                        $_DBIAX = 6;
                                        break;
                                    case 9:
                                        var $_DBIEw = 0;
                                        $_DBIAX = 8;
                                        break;
                                    case 8:
                                        $_DBIAX = $_DBIEw < $_DBHIA ? 7 : 11;
                                        break;
                                    case 12:
                                        $_DBIEw += 1;
                                        $_DBIAX = 8;
                                        break;
                                    case 6:
                                        $_DBIAX = $_DBIDH >= 0 ? 14 : 12;
                                        break;
                                    case 1:
                                        var $_DBICN = 0;
                                        $_DBIAX = 5;
                                        break;
                                    case 2:
                                        var $_DBIBa = [];
                                        $_DBIAX = 1;
                                        break;
                                    case 3:
                                        $_DBICN += 1;
                                        $_DBIAX = 5;
                                        break;
                                    case 14:
                                        $_DBIBa[$_DBIEw][
                                        ($_DBIDH + $_DBHJi * $_DBIEw) %
                                        $_DBHIA
                                            ] = $_DBIBa[$_DBIDH];
                                        $_DBIAX = 13;
                                        break;
                                    case 5:
                                        $_DBIAX = $_DBICN < $_DBHIA ? 4 : 9;
                                        break;
                                    case 7:
                                        var $_DBIDH = $_DBHIA - 1;
                                        $_DBIAX = 6;
                                        break;
                                    case 11:
                                        return $_DBIBa;
                                }
                            }
                        })(15, 5),
                    };
            }
        }
    })();
    mwbxQ.$_Cg = function () {
        return typeof mwbxQ.$_Au.$_DBGGJ === "function"
            ? mwbxQ.$_Au.$_DBGGJ.apply(mwbxQ.$_Au, arguments)
            : mwbxQ.$_Au.$_DBGGJ;
    };
    mwbxQ.$_DW = function () {
        return typeof mwbxQ.$_BR.$_DBHGm === "function"
            ? mwbxQ.$_BR.$_DBHGm.apply(mwbxQ.$_BR, arguments)
            : mwbxQ.$_BR.$_DBHGm;
    };
    function mwbxQ() { }
    var ht = {};
    var U = (function () {
        var $_IAJA = mwbxQ.$_Cg,
            $_IAIb = ["$_IBCn"].concat($_IAJA),
            $_IBAP = $_IAIb[1];
        $_IAIb.shift();
        $_IAIb[0];
        function n() {
            var $_DBCAS = mwbxQ.$_DW()[3][13];
            for (; $_DBCAS !== mwbxQ.$_DW()[6][12];) {
                switch ($_DBCAS) {
                    case mwbxQ.$_DW()[3][13]:
                        (this[$_IBAP(287)] = 0),
                            (this[$_IBAP(245)] = 0),
                            (this[$_IAJA(275)] = []);
                        $_DBCAS = mwbxQ.$_DW()[9][12];
                        break;
                }
            }
        }
        (n[$_IBAP(236)][$_IBAP(244)] = function C(t) {
            var $_IBEx = mwbxQ.$_Cg,
                $_IBDP = ["$_IBHn"].concat($_IBEx),
                $_IBFS = $_IBDP[1];
            $_IBDP.shift();
            $_IBDP[0];
            var e, n, r;
            for (e = 0; e < 256; ++e) this[$_IBFS(275)][e] = e;
            for (e = n = 0; e < 256; ++e)
                (n = (n + this[$_IBFS(275)][e] + t[e % t[$_IBFS(192)]]) & 255),
                    (r = this[$_IBEx(275)][e]),
                    (this[$_IBEx(275)][e] = this[$_IBFS(275)][n]),
                    (this[$_IBEx(275)][n] = r);
            (this[$_IBFS(287)] = 0), (this[$_IBEx(245)] = 0);
        }),
            (n[$_IAJA(236)][$_IBAP(272)] = function S() {
                var $_IBJS = mwbxQ.$_Cg,
                    $_IBIN = ["$_ICCk"].concat($_IBJS),
                    $_ICAY = $_IBIN[1];
                $_IBIN.shift();
                $_IBIN[0];
                var t;
                return (
                    (this[$_IBJS(287)] = (this[$_IBJS(287)] + 1) & 255),
                        (this[$_ICAY(245)] =
                            (this[$_ICAY(245)] +
                                this[$_IBJS(275)][this[$_ICAY(287)]]) &
                            255),
                        (t = this[$_IBJS(275)][this[$_IBJS(287)]]),
                        (this[$_IBJS(275)][this[$_ICAY(287)]] =
                            this[$_ICAY(275)][this[$_ICAY(245)]]),
                        (this[$_ICAY(275)][this[$_ICAY(245)]] = t),
                        this[$_IBJS(275)][
                        (t + this[$_IBJS(275)][this[$_IBJS(287)]]) & 255
                            ]
                );
            });
        var r,
            i,
            o,
            t,
            s = 256;
        if (null == i) {
            var e;
            (i = []), (o = 0);
            try {
                if (window$1[$_IAJA(225)] && window$1[$_IAJA(225)][$_IBAP(298)]) {
                    var a = new Uint32Array(256);
                    for (
                        window$1[$_IAJA(225)][$_IAJA(298)](a), e = 0;
                        e < a[$_IAJA(192)];
                        ++e
                    )
                        i[o++] = 255 & a[e];
                }
            } catch (T) { }
            var _ = 0,
                c = function (t) {
                    var $_ICEJ = mwbxQ.$_Cg,
                        $_ICDA = ["$_ICHl"].concat($_ICEJ),
                        $_ICFi = $_ICDA[1];
                    $_ICDA.shift();
                    $_ICDA[0];
                    if (256 <= (_ = _ || 0) || s <= o)
                        window$1[$_ICFi(230)]
                            ? ((_ = 0), window$1[$_ICEJ(230)]($_ICFi(268), c, !1))
                            : window$1[$_ICFi(235)] &&
                            ((_ = 0), window$1[$_ICEJ(235)]($_ICFi(295), c));
                    else
                        try {
                            var e = t[$_ICFi(203)] + t[$_ICEJ(247)];
                            (i[o++] = 255 & e), (_ += 1);
                        } catch (T) { }
                };
            window$1[$_IBAP(227)]
                ? window$1[$_IBAP(227)]($_IBAP(268), c, !1)
                : window$1[$_IAJA(243)] && window$1[$_IBAP(243)]($_IBAP(295), c);
        }
        function u() {
            var $_DBCBg = mwbxQ.$_DW()[0][13];
            for (; $_DBCBg !== mwbxQ.$_DW()[6][11];) {
                switch ($_DBCBg) {
                    case mwbxQ.$_DW()[0][13]:
                        if (null == r) {
                            r = (function e() {
                                var $_ICJL = mwbxQ.$_Cg,
                                    $_ICIQ = ["$_IDCy"].concat($_ICJL);
                                $_ICIQ[1];
                                $_ICIQ.shift();
                                $_ICIQ[0];
                                return new n();
                            })();
                            while (o < s) {
                                var t = Math[$_IAJA(219)](
                                    65536 * Math[$_IBAP(21)](),
                                );
                                i[o++] = 255 & t;
                            }
                            for (
                                r[$_IAJA(244)](i), o = 0;
                                o < i[$_IBAP(192)];
                                ++o
                            )
                                i[o] = 0;
                            o = 0;
                        }
                        $_DBCBg = mwbxQ.$_DW()[6][12];
                        break;
                    case mwbxQ.$_DW()[9][12]:
                        return r[$_IAJA(272)]();
                }
            }
        }
        function l() {
            var $_DBCCK = mwbxQ.$_DW()[6][13];
            for (; $_DBCCK !== mwbxQ.$_DW()[3][13];) {
            }
        }
        l[$_IAJA(236)][$_IAJA(206)] = function k(t) {
            var $_IDEE = mwbxQ.$_Cg,
                $_IDDs = ["$_IDHK"].concat($_IDEE);
            $_IDDs[1];
            $_IDDs.shift();
            $_IDDs[0];
            var e;
            for (e = 0; e < t[$_IDEE(192)]; ++e) t[e] = u();
        };
        function y(t, e, n) {
            var $_DBCDe = mwbxQ.$_DW()[3][13];
            for (; $_DBCDe !== mwbxQ.$_DW()[9][12];) {
                switch ($_DBCDe) {
                    case mwbxQ.$_DW()[3][13]:
                        null != t &&
                        ($_IBAP(83) == typeof t
                            ? this[$_IBAP(258)](t, e, n)
                            : null == e && $_IBAP(51) != typeof t
                                ? this[$_IBAP(220)](t, 256)
                                : this[$_IBAP(220)](t, e));
                        $_DBCDe = mwbxQ.$_DW()[9][12];
                        break;
                }
            }
        }
        function w() {
            var $_DBCE_ = mwbxQ.$_DW()[0][13];
            for (; $_DBCE_ !== mwbxQ.$_DW()[6][12];) {
                switch ($_DBCE_) {
                    case mwbxQ.$_DW()[3][13]:
                        return new y(null);
                }
            }
        }
        // t = $_IAJA(200) == ht[$_IAJA(331)] ? (y[$_IAJA(236)][$_IBAP(301)] = function A(t, e, n, r, i, o) {
        (t =
            $_IAJA(200) == ht[$_IAJA(331)]
                ? ((y[$_IAJA(236)][$_IBAP(301)] = function A(t, e, n, r, i, o) {
                    var $_IDJY = mwbxQ.$_Cg,
                        $_IDIH = ["$_IECp"].concat($_IDJY);
                    $_IDIH[1];
                    $_IDIH.shift();
                    $_IDIH[0];
                    var s = 32767 & e,
                        a = e >> 15;
                    while (0 <= --o) {
                        var _ = 32767 & this[t],
                            c = this[t++] >> 15,
                            u = a * _ + c * s;
                        (i =
                            ((_ =
                                    s * _ +
                                    ((32767 & u) << 15) +
                                    n[r] +
                                    (1073741823 & i)) >>>
                                30) +
                            (u >>> 15) +
                            a * c +
                            (i >>> 30)),
                            (n[r++] = 1073741823 & _);
                    }
                    return i;
                }),
                    30)
                : $_IBAP(385) != ht[$_IAJA(331)]
                    ? ((y[$_IBAP(236)][$_IAJA(301)] = function D(
                        t,
                        e,
                        n,
                        r,
                        i,
                        o,
                    ) {
                        var $_IEEw = mwbxQ.$_Cg,
                            $_IEDq = ["$_IEHf"].concat($_IEEw);
                        $_IEDq[1];
                        $_IEDq.shift();
                        $_IEDq[0];
                        while (0 <= --o) {
                            var s = e * this[t++] + n[r] + i;
                            (i = Math[$_IEEw(219)](s / 67108864)),
                                (n[r++] = 67108863 & s);
                        }
                        return i;
                    }),
                        26)
                    : ((y[$_IAJA(236)][$_IBAP(301)] = function M(
                        t,
                        e,
                        n,
                        r,
                        i,
                        o,
                    ) {
                        var $_IEJN = mwbxQ.$_Cg,
                            $_IEIF = ["$_IFCl"].concat($_IEJN);
                        $_IEIF[1];
                        $_IEIF.shift();
                        $_IEIF[0];
                        var s = 16383 & e,
                            a = e >> 14;
                        while (0 <= --o) {
                            var _ = 16383 & this[t],
                                c = this[t++] >> 14,
                                u = a * _ + c * s;
                            (i =
                                ((_ = s * _ + ((16383 & u) << 14) + n[r] + i) >>
                                    28) +
                                (u >> 14) +
                                a * c),
                                (n[r++] = 268435455 & _);
                        }
                        return i;
                    }),
                        28)),
            (y[$_IBAP(236)][$_IAJA(349)] = t),
            (y[$_IAJA(236)][$_IAJA(379)] = (1 << t) - 1),
            (y[$_IBAP(236)][$_IAJA(380)] = 1 << t);
        (y[$_IAJA(236)][$_IAJA(384)] = Math[$_IBAP(397)](2, 52)),
            (y[$_IBAP(236)][$_IBAP(302)] = 52 - t),
            (y[$_IAJA(236)][$_IAJA(328)] = 2 * t - 52);
        var h,
            f,
            d = $_IAJA(382),
            p = [];
        for (h = $_IBAP(40)[$_IAJA(120)](0), f = 0; f <= 9; ++f) p[h++] = f;
        for (h = $_IBAP(123)[$_IAJA(120)](0), f = 10; f < 36; ++f) p[h++] = f;
        for (h = $_IBAP(350)[$_IBAP(120)](0), f = 10; f < 36; ++f) p[h++] = f;
        function g(t) {
            var $_DBCFc = mwbxQ.$_DW()[0][13];
            for (; $_DBCFc !== mwbxQ.$_DW()[6][12];) {
                switch ($_DBCFc) {
                    case mwbxQ.$_DW()[0][13]:
                        return d[$_IAJA(125)](t);
                }
            }
        }
        function v(t) {
            var $_DBCGX = mwbxQ.$_DW()[9][13];
            for (; $_DBCGX !== mwbxQ.$_DW()[3][11];) {
                switch ($_DBCGX) {
                    case mwbxQ.$_DW()[3][13]:
                        var e = w();
                        $_DBCGX = mwbxQ.$_DW()[3][12];
                        break;
                    case mwbxQ.$_DW()[6][12]:
                        return e[$_IBAP(320)](t), e;
                }
            }
        }
        function b(t) {
            var $_DBCHN = mwbxQ.$_DW()[9][13];
            for (; $_DBCHN !== mwbxQ.$_DW()[9][11];) {
                switch ($_DBCHN) {
                    case mwbxQ.$_DW()[9][13]:
                        var e,
                            n = 1;
                        $_DBCHN = mwbxQ.$_DW()[6][12];
                        break;
                    case mwbxQ.$_DW()[9][12]:
                        return (
                            0 != (e = t >>> 16) && ((t = e), (n += 16)),
                            0 != (e = t >> 8) && ((t = e), (n += 8)),
                            0 != (e = t >> 4) && ((t = e), (n += 4)),
                            0 != (e = t >> 2) && ((t = e), (n += 2)),
                            0 != (e = t >> 1) && ((t = e), (n += 1)),
                                n
                        );
                }
            }
        }
        function m(t) {
            var $_DBCIa = mwbxQ.$_DW()[6][13];
            for (; $_DBCIa !== mwbxQ.$_DW()[6][12];) {
                switch ($_DBCIa) {
                    case mwbxQ.$_DW()[0][13]:
                        this[$_IBAP(333)] = t;
                        $_DBCIa = mwbxQ.$_DW()[9][12];
                        break;
                }
            }
        }
        function x(t) {
            var $_DBCJK = mwbxQ.$_DW()[3][13];
            for (; $_DBCJK !== mwbxQ.$_DW()[0][12];) {
                switch ($_DBCJK) {
                    case mwbxQ.$_DW()[3][13]:
                        (this[$_IAJA(333)] = t),
                            (this[$_IAJA(357)] = t[$_IAJA(393)]()),
                            (this[$_IBAP(347)] = 32767 & this[$_IAJA(357)]),
                            (this[$_IBAP(367)] = this[$_IBAP(357)] >> 15),
                            (this[$_IBAP(356)] =
                                (1 << (t[$_IAJA(349)] - 15)) - 1),
                            (this[$_IAJA(325)] = 2 * t[$_IBAP(376)]);
                        $_DBCJK = mwbxQ.$_DW()[0][12];
                        break;
                }
            }
        }
        function E() {
            var $_DBDAZ = mwbxQ.$_DW()[9][13];
            for (; $_DBDAZ !== mwbxQ.$_DW()[3][11];) {
                switch ($_DBDAZ) {
                    case mwbxQ.$_DW()[9][13]:
                        (this[$_IBAP(334)] = null),
                            (this[$_IAJA(390)] = 0),
                            (this[$_IAJA(386)] = null),
                            (this[$_IBAP(329)] = null),
                            (this[$_IBAP(312)] = null),
                            (this[$_IBAP(364)] = null),
                            (this[$_IAJA(394)] = null),
                            (this[$_IAJA(339)] = null);
                        $_DBDAZ = mwbxQ.$_DW()[6][12];
                        break;
                    case mwbxQ.$_DW()[0][12]:
                        this[$_IBAP(351)]($_IBAP(306), $_IAJA(352));
                        $_DBDAZ = mwbxQ.$_DW()[9][11];
                        break;
                }
            }
        }
        return (
            (m[$_IAJA(236)][$_IBAP(342)] = function O(t) {
                var $_IFEo = mwbxQ.$_Cg,
                    $_IFDk = ["$_IFHv"].concat($_IFEo),
                    $_IFFt = $_IFDk[1];
                $_IFDk.shift();
                $_IFDk[0];
                return t[$_IFEo(345)] < 0 ||
                0 <= t[$_IFEo(323)](this[$_IFEo(333)])
                    ? t[$_IFEo(310)](this[$_IFFt(333)])
                    : t;
            }),
                (m[$_IBAP(236)][$_IAJA(338)] = function B(t) {
                    var $_IFJz = mwbxQ.$_Cg,
                        $_IFIR = ["$_IGCL"].concat($_IFJz);
                    $_IFIR[1];
                    $_IFIR.shift();
                    $_IFIR[0];
                    return t;
                }),
                (m[$_IBAP(236)][$_IBAP(383)] = function j(t) {
                    var $_IGER = mwbxQ.$_Cg,
                        $_IGDM = ["$_IGHn"].concat($_IGER);
                    $_IGDM[1];
                    $_IGDM.shift();
                    $_IGDM[0];
                    t[$_IGER(399)](this[$_IGER(333)], null, t);
                }),
                (m[$_IBAP(236)][$_IAJA(396)] = function I(t, e, n) {
                    var $_IGJa = mwbxQ.$_Cg,
                        $_IGIO = ["$_IHCl"].concat($_IGJa),
                        $_IHAj = $_IGIO[1];
                    $_IGIO.shift();
                    $_IGIO[0];
                    t[$_IGJa(317)](e, n), this[$_IHAj(383)](n);
                }),
                (m[$_IAJA(236)][$_IAJA(341)] = function R(t, e) {
                    var $_IHEH = mwbxQ.$_Cg,
                        $_IHDC = ["$_IHHk"].concat($_IHEH),
                        $_IHFD = $_IHDC[1];
                    $_IHDC.shift();
                    $_IHDC[0];
                    t[$_IHEH(372)](e), this[$_IHFD(383)](e);
                }),
                (x[$_IAJA(236)][$_IAJA(342)] = function L(t) {
                    var $_IHJN = mwbxQ.$_Cg,
                        $_IHIH = ["$_IICN"].concat($_IHJN),
                        $_IIAH = $_IHIH[1];
                    $_IHIH.shift();
                    $_IHIH[0];
                    var e = w();
                    return (
                        t[$_IHJN(316)]()[$_IHJN(314)](
                            this[$_IIAH(333)][$_IHJN(376)],
                            e,
                        ),
                            e[$_IHJN(399)](this[$_IIAH(333)], null, e),
                        t[$_IHJN(345)] < 0 &&
                        0 < e[$_IIAH(323)](y[$_IHJN(370)]) &&
                        this[$_IIAH(333)][$_IHJN(346)](e, e),
                            e
                    );
                }),
                (x[$_IAJA(236)][$_IBAP(338)] = function N(t) {
                    var $_IIEN = mwbxQ.$_Cg,
                        $_IIDJ = ["$_IIHP"].concat($_IIEN);
                    $_IIDJ[1];
                    $_IIDJ.shift();
                    $_IIDJ[0];
                    var e = w();
                    return t[$_IIEN(340)](e), this[$_IIEN(383)](e), e;
                }),
                (x[$_IAJA(236)][$_IAJA(383)] = function P(t) {
                    var $_IIJX = mwbxQ.$_Cg,
                        $_IIIz = ["$_IJCb"].concat($_IIJX),
                        $_IJAI = $_IIIz[1];
                    $_IIIz.shift();
                    $_IIIz[0];
                    while (t[$_IIJX(376)] <= this[$_IIJX(325)])
                        t[t[$_IIJX(376)]++] = 0;
                    for (var e = 0; e < this[$_IIJX(333)][$_IJAI(376)]; ++e) {
                        var n = 32767 & t[e],
                            r =
                                (n * this[$_IJAI(347)] +
                                    (((n * this[$_IJAI(367)] +
                                                (t[e] >> 15) * this[$_IIJX(347)]) &
                                            this[$_IIJX(356)]) <<
                                        15)) &
                                t[$_IJAI(379)];
                        t[(n = e + this[$_IIJX(333)][$_IIJX(376)])] += this[
                            $_IIJX(333)
                            ][$_IJAI(301)](
                            0,
                            r,
                            t,
                            e,
                            0,
                            this[$_IIJX(333)][$_IIJX(376)],
                        );
                        while (t[n] >= t[$_IIJX(380)])
                            (t[n] -= t[$_IIJX(380)]), t[++n]++;
                    }
                    t[$_IIJX(327)](),
                        t[$_IIJX(375)](this[$_IIJX(333)][$_IJAI(376)], t),
                    0 <= t[$_IIJX(323)](this[$_IIJX(333)]) &&
                    t[$_IJAI(346)](this[$_IIJX(333)], t);
                }),
                (x[$_IBAP(236)][$_IAJA(396)] = function H(t, e, n) {
                    var $_IJEj = mwbxQ.$_Cg,
                        $_IJDc = ["$_IJHl"].concat($_IJEj),
                        $_IJFm = $_IJDc[1];
                    $_IJDc.shift();
                    $_IJDc[0];
                    t[$_IJFm(317)](e, n), this[$_IJFm(383)](n);
                }),
                (x[$_IBAP(236)][$_IBAP(341)] = function $(t, e) {
                    var $_IJJC = mwbxQ.$_Cg,
                        $_IJIg = ["$_JACf"].concat($_IJJC),
                        $_JAAa = $_IJIg[1];
                    $_IJIg.shift();
                    $_IJIg[0];
                    t[$_JAAa(372)](e), this[$_IJJC(383)](e);
                }),
                (y[$_IBAP(236)][$_IBAP(340)] = function F(t) {
                    var $_JAEj = mwbxQ.$_Cg,
                        $_JADZ = ["$_JAHb"].concat($_JAEj),
                        $_JAFL = $_JADZ[1];
                    $_JADZ.shift();
                    $_JADZ[0];
                    for (var e = this[$_JAFL(376)] - 1; 0 <= e; --e) t[e] = this[e];
                    (t[$_JAEj(376)] = this[$_JAFL(376)]),
                        (t[$_JAFL(345)] = this[$_JAFL(345)]);
                }),
                (y[$_IAJA(236)][$_IAJA(320)] = function q(t) {
                    var $_JAJw = mwbxQ.$_Cg,
                        $_JAIW = ["$_JBCH"].concat($_JAJw),
                        $_JBA_ = $_JAIW[1];
                    $_JAIW.shift();
                    $_JAIW[0];
                    (this[$_JAJw(376)] = 1),
                        (this[$_JBA_(345)] = t < 0 ? -1 : 0),
                        0 < t
                            ? (this[0] = t)
                            : t < -1
                                ? (this[0] = t + this[$_JAJw(380)])
                                : (this[$_JBA_(376)] = 0);
                }),
                (y[$_IAJA(236)][$_IBAP(220)] = function z(t, e) {
                    var $_JBEX = mwbxQ.$_Cg,
                        $_JBDF = ["$_JBHr"].concat($_JBEX),
                        $_JBFs = $_JBDF[1];
                    $_JBDF.shift();
                    $_JBDF[0];
                    var n;
                    if (16 == e) n = 4;
                    else if (8 == e) n = 3;
                    else if (256 == e) n = 8;
                    else if (2 == e) n = 1;
                    else if (32 == e) n = 5;
                    else {
                        if (4 != e) return void this[$_JBFs(377)](t, e);
                        n = 2;
                    }
                    (this[$_JBFs(376)] = 0), (this[$_JBFs(345)] = 0);
                    var r,
                        i,
                        o = t[$_JBFs(192)],
                        s = !1,
                        a = 0;
                    while (0 <= --o) {
                        var _ =
                            8 == n
                                ? 255 & t[o]
                                : ((r = o),
                                    null == (i = p[t[$_JBEX(120)](r)]) ? -1 : i);
                        _ < 0
                            ? $_JBEX(78) == t[$_JBEX(125)](o) && (s = !0)
                            : ((s = !1),
                                0 == a
                                    ? (this[this[$_JBFs(376)]++] = _)
                                    : a + n > this[$_JBEX(349)]
                                        ? ((this[this[$_JBFs(376)] - 1] |=
                                            (_ &
                                                ((1 << (this[$_JBEX(349)] - a)) -
                                                    1)) <<
                                            a),
                                            (this[this[$_JBFs(376)]++] =
                                                _ >> (this[$_JBFs(349)] - a)))
                                        : (this[this[$_JBEX(376)] - 1] |= _ << a),
                            (a += n) >= this[$_JBFs(349)] &&
                            (a -= this[$_JBEX(349)]));
                    }
                    8 == n &&
                    0 != (128 & t[0]) &&
                    ((this[$_JBEX(345)] = -1),
                    0 < a &&
                    (this[this[$_JBFs(376)] - 1] |=
                        ((1 << (this[$_JBFs(349)] - a)) - 1) << a)),
                        this[$_JBFs(327)](),
                    s && y[$_JBEX(370)][$_JBEX(346)](this, this);
                }),
                (y[$_IAJA(236)][$_IBAP(327)] = function X() {
                    var $_JBJv = mwbxQ.$_Cg,
                        $_JBIu = ["$_JCCq"].concat($_JBJv),
                        $_JCAd = $_JBIu[1];
                    $_JBIu.shift();
                    $_JBIu[0];
                    var t = this[$_JCAd(345)] & this[$_JCAd(379)];
                    while (
                        0 < this[$_JBJv(376)] &&
                        this[this[$_JCAd(376)] - 1] == t
                        )
                        --this[$_JBJv(376)];
                }),
                (y[$_IAJA(236)][$_IBAP(314)] = function U(t, e) {
                    var $_JCEB = mwbxQ.$_Cg,
                        $_JCDG = ["$_JCHr"].concat($_JCEB),
                        $_JCFy = $_JCDG[1];
                    $_JCDG.shift();
                    $_JCDG[0];
                    var n;
                    for (n = this[$_JCFy(376)] - 1; 0 <= n; --n) e[n + t] = this[n];
                    for (n = t - 1; 0 <= n; --n) e[n] = 0;
                    (e[$_JCFy(376)] = this[$_JCEB(376)] + t),
                        (e[$_JCEB(345)] = this[$_JCFy(345)]);
                }),
                (y[$_IAJA(236)][$_IAJA(375)] = function V(t, e) {
                    var $_JCJE = mwbxQ.$_Cg,
                        $_JCIy = ["$_JDCH"].concat($_JCJE),
                        $_JDAP = $_JCIy[1];
                    $_JCIy.shift();
                    $_JCIy[0];
                    for (var n = t; n < this[$_JCJE(376)]; ++n) e[n - t] = this[n];
                    (e[$_JCJE(376)] = Math[$_JDAP(242)](this[$_JCJE(376)] - t, 0)),
                        (e[$_JCJE(345)] = this[$_JDAP(345)]);
                }),
                (y[$_IAJA(236)][$_IBAP(305)] = function G(t, e) {
                    var $_JDE_ = mwbxQ.$_Cg,
                        $_JDDo = ["$_JDHn"].concat($_JDE_),
                        $_JDFL = $_JDDo[1];
                    $_JDDo.shift();
                    $_JDDo[0];
                    var n,
                        r = t % this[$_JDE_(349)],
                        i = this[$_JDFL(349)] - r,
                        o = (1 << i) - 1,
                        s = Math[$_JDFL(219)](t / this[$_JDE_(349)]),
                        a = (this[$_JDE_(345)] << r) & this[$_JDFL(379)];
                    for (n = this[$_JDFL(376)] - 1; 0 <= n; --n)
                        (e[n + s + 1] = (this[n] >> i) | a),
                            (a = (this[n] & o) << r);
                    for (n = s - 1; 0 <= n; --n) e[n] = 0;
                    (e[s] = a),
                        (e[$_JDFL(376)] = this[$_JDFL(376)] + s + 1),
                        (e[$_JDFL(345)] = this[$_JDE_(345)]),
                        e[$_JDFL(327)]();
                }),
                (y[$_IBAP(236)][$_IBAP(321)] = function J(t, e) {
                    var $_JDJo = mwbxQ.$_Cg,
                        $_JDIc = ["$_JECr"].concat($_JDJo),
                        $_JEAZ = $_JDIc[1];
                    $_JDIc.shift();
                    $_JDIc[0];
                    e[$_JDJo(345)] = this[$_JDJo(345)];
                    var n = Math[$_JEAZ(219)](t / this[$_JEAZ(349)]);
                    if (n >= this[$_JDJo(376)]) e[$_JEAZ(376)] = 0;
                    else {
                        var r = t % this[$_JEAZ(349)],
                            i = this[$_JEAZ(349)] - r,
                            o = (1 << r) - 1;
                        e[0] = this[n] >> r;
                        for (var s = n + 1; s < this[$_JEAZ(376)]; ++s)
                            (e[s - n - 1] |= (this[s] & o) << i),
                                (e[s - n] = this[s] >> r);
                        0 < r &&
                        (e[this[$_JEAZ(376)] - n - 1] |=
                            (this[$_JDJo(345)] & o) << i),
                            (e[$_JDJo(376)] = this[$_JDJo(376)] - n),
                            e[$_JEAZ(327)]();
                    }
                }),
                (y[$_IAJA(236)][$_IBAP(346)] = function Y(t, e) {
                    var $_JEEd = mwbxQ.$_Cg,
                        $_JEDl = ["$_JEHa"].concat($_JEEd),
                        $_JEFf = $_JEDl[1];
                    $_JEDl.shift();
                    $_JEDl[0];
                    var n = 0,
                        r = 0,
                        i = Math[$_JEEd(322)](t[$_JEFf(376)], this[$_JEFf(376)]);
                    while (n < i)
                        (r += this[n] - t[n]),
                            (e[n++] = r & this[$_JEFf(379)]),
                            (r >>= this[$_JEFf(349)]);
                    if (t[$_JEEd(376)] < this[$_JEFf(376)]) {
                        r -= t[$_JEFf(345)];
                        while (n < this[$_JEEd(376)])
                            (r += this[n]),
                                (e[n++] = r & this[$_JEEd(379)]),
                                (r >>= this[$_JEFf(349)]);
                        r += this[$_JEFf(345)];
                    } else {
                        r += this[$_JEFf(345)];
                        while (n < t[$_JEEd(376)])
                            (r -= t[n]),
                                (e[n++] = r & this[$_JEFf(379)]),
                                (r >>= this[$_JEEd(349)]);
                        r -= t[$_JEEd(345)];
                    }
                    (e[$_JEFf(345)] = r < 0 ? -1 : 0),
                        r < -1
                            ? (e[n++] = this[$_JEFf(380)] + r)
                            : 0 < r && (e[n++] = r),
                        (e[$_JEFf(376)] = n),
                        e[$_JEFf(327)]();
                }),
                (y[$_IAJA(236)][$_IBAP(317)] = function W(t, e) {
                    var $_JEJa = mwbxQ.$_Cg,
                        $_JEIB = ["$_JFCp"].concat($_JEJa),
                        $_JFAW = $_JEIB[1];
                    $_JEIB.shift();
                    $_JEIB[0];
                    var n = this[$_JFAW(316)](),
                        r = t[$_JFAW(316)](),
                        i = n[$_JEJa(376)];
                    e[$_JEJa(376)] = i + r[$_JFAW(376)];
                    while (0 <= --i) e[i] = 0;
                    for (i = 0; i < r[$_JFAW(376)]; ++i)
                        e[i + n[$_JFAW(376)]] = n[$_JFAW(301)](
                            0,
                            r[i],
                            e,
                            i,
                            0,
                            n[$_JFAW(376)],
                        );
                    (e[$_JFAW(345)] = 0),
                        e[$_JFAW(327)](),
                    this[$_JEJa(345)] != t[$_JFAW(345)] &&
                    y[$_JEJa(370)][$_JEJa(346)](e, e);
                }),
                (y[$_IBAP(236)][$_IBAP(372)] = function Z(t) {
                    var $_JFEW = mwbxQ.$_Cg,
                        $_JFDI = ["$_JFHQ"].concat($_JFEW),
                        $_JFFj = $_JFDI[1];
                    $_JFDI.shift();
                    $_JFDI[0];
                    var e = this[$_JFEW(316)](),
                        n = (t[$_JFFj(376)] = 2 * e[$_JFEW(376)]);
                    while (0 <= --n) t[n] = 0;
                    for (n = 0; n < e[$_JFEW(376)] - 1; ++n) {
                        var r = e[$_JFEW(301)](n, e[n], t, 2 * n, 0, 1);
                        (t[n + e[$_JFFj(376)]] += e[$_JFFj(301)](
                            n + 1,
                            2 * e[n],
                            t,
                            2 * n + 1,
                            r,
                            e[$_JFEW(376)] - n - 1,
                        )) >= e[$_JFFj(380)] &&
                        ((t[n + e[$_JFFj(376)]] -= e[$_JFEW(380)]),
                            (t[n + e[$_JFEW(376)] + 1] = 1));
                    }
                    0 < t[$_JFFj(376)] &&
                    (t[t[$_JFEW(376)] - 1] += e[$_JFEW(301)](
                        n,
                        e[n],
                        t,
                        2 * n,
                        0,
                        1,
                    )),
                        (t[$_JFEW(345)] = 0),
                        t[$_JFFj(327)]();
                }),
                (y[$_IBAP(236)][$_IBAP(399)] = function Q(t, e, n) {
                    var $_JFJK = mwbxQ.$_Cg,
                        $_JFIp = ["$_JGCO"].concat($_JFJK),
                        $_JGAb = $_JFIp[1];
                    $_JFIp.shift();
                    $_JFIp[0];
                    var r = t[$_JFJK(316)]();
                    if (!(r[$_JGAb(376)] <= 0)) {
                        var i = this[$_JGAb(316)]();
                        if (i[$_JFJK(376)] < r[$_JFJK(376)])
                            return (
                                null != e && e[$_JFJK(320)](0),
                                    void (null != n && this[$_JFJK(340)](n))
                            );
                        null == n && (n = w());
                        var o = w(),
                            s = this[$_JFJK(345)],
                            a = t[$_JFJK(345)],
                            _ = this[$_JGAb(349)] - b(r[r[$_JGAb(376)] - 1]);
                        0 < _
                            ? (r[$_JGAb(305)](_, o), i[$_JFJK(305)](_, n))
                            : (r[$_JFJK(340)](o), i[$_JGAb(340)](n));
                        var c = o[$_JGAb(376)],
                            u = o[c - 1];
                        if (0 != u) {
                            var l =
                                    u * (1 << this[$_JFJK(302)]) +
                                    (1 < c ? o[c - 2] >> this[$_JGAb(328)] : 0),
                                h = this[$_JGAb(384)] / l,
                                f = (1 << this[$_JGAb(302)]) / l,
                                d = 1 << this[$_JFJK(328)],
                                p = n[$_JGAb(376)],
                                g = p - c,
                                v = null == e ? w() : e;
                            o[$_JGAb(314)](g, v),
                            0 <= n[$_JGAb(323)](v) &&
                            ((n[n[$_JFJK(376)]++] = 1),
                                n[$_JGAb(346)](v, n)),
                                y[$_JFJK(368)][$_JGAb(314)](c, v),
                                v[$_JGAb(346)](o, o);
                            while (o[$_JFJK(376)] < c) o[o[$_JFJK(376)]++] = 0;
                            while (0 <= --g) {
                                var m =
                                    n[--p] == u
                                        ? this[$_JGAb(379)]
                                        : Math[$_JFJK(219)](
                                            n[p] * h + (n[p - 1] + d) * f,
                                        );
                                if (
                                    (n[p] += o[$_JGAb(301)](0, m, n, g, 0, c)) < m
                                ) {
                                    o[$_JFJK(314)](g, v), n[$_JFJK(346)](v, n);
                                    while (n[p] < --m) n[$_JFJK(346)](v, n);
                                }
                            }
                            null != e &&
                            (n[$_JGAb(375)](c, e),
                            s != a && y[$_JFJK(370)][$_JFJK(346)](e, e)),
                                (n[$_JFJK(376)] = c),
                                n[$_JFJK(327)](),
                            0 < _ && n[$_JGAb(321)](_, n),
                            s < 0 && y[$_JGAb(370)][$_JFJK(346)](n, n);
                        }
                    }
                }),
                (y[$_IBAP(236)][$_IBAP(393)] = function K() {
                    var $_JGEd = mwbxQ.$_Cg,
                        $_JGDG = ["$_JGHS"].concat($_JGEd),
                        $_JGFB = $_JGDG[1];
                    $_JGDG.shift();
                    $_JGDG[0];
                    if (this[$_JGEd(376)] < 1) return 0;
                    var t = this[0];
                    if (0 == (1 & t)) return 0;
                    var e = 3 & t;
                    return 0 <
                    (e =
                        ((e =
                                ((e =
                                        ((e = (e * (2 - (15 & t) * e)) & 15) *
                                            (2 - (255 & t) * e)) &
                                        255) *
                                    (2 - (((65535 & t) * e) & 65535))) &
                                65535) *
                            (2 - ((t * e) % this[$_JGFB(380)]))) %
                        this[$_JGFB(380)])
                        ? this[$_JGEd(380)] - e
                        : -e;
                }),
                (y[$_IAJA(236)][$_IBAP(303)] = function $_EF() {
                    var $_JGJ_ = mwbxQ.$_Cg,
                        $_JGIA = ["$_JHCZ"].concat($_JGJ_),
                        $_JHAy = $_JGIA[1];
                    $_JGIA.shift();
                    $_JGIA[0];
                    return (
                        0 ==
                        (0 < this[$_JGJ_(376)] ? 1 & this[0] : this[$_JHAy(345)])
                    );
                }),
                (y[$_IAJA(236)][$_IBAP(369)] = function $_Fk(t, e) {
                    var $_JHEt = mwbxQ.$_Cg,
                        $_JHDY = ["$_JHHa"].concat($_JHEt),
                        $_JHFJ = $_JHDY[1];
                    $_JHDY.shift();
                    $_JHDY[0];
                    if (4294967295 < t || t < 1) return y[$_JHEt(368)];
                    var n = w(),
                        r = w(),
                        i = e[$_JHFJ(342)](this),
                        o = b(t) - 1;
                    i[$_JHFJ(340)](n);
                    while (0 <= --o)
                        if ((e[$_JHFJ(341)](n, r), 0 < (t & (1 << o))))
                            e[$_JHEt(396)](r, i, n);
                        else {
                            var s = n;
                            (n = r), (r = s);
                        }
                    return e[$_JHFJ(338)](n);
                }),
                (y[$_IBAP(236)][$_IBAP(213)] = function $_GM(t) {
                    var $_JHJu = mwbxQ.$_Cg,
                        $_JHIr = ["$_JICP"].concat($_JHJu),
                        $_JIAb = $_JHIr[1];
                    $_JHIr.shift();
                    $_JHIr[0];
                    if (this[$_JIAb(345)] < 0)
                        return $_JHJu(78) + this[$_JIAb(313)]()[$_JHJu(213)](t);
                    var e;
                    if (16 == t) e = 4;
                    else if (8 == t) e = 3;
                    else if (2 == t) e = 1;
                    else if (32 == t) e = 5;
                    else {
                        if (4 != t) return this[$_JHJu(311)](t);
                        e = 2;
                    }
                    var n,
                        r = (1 << e) - 1,
                        i = !1,
                        o = $_JHJu(2),
                        s = this[$_JIAb(376)],
                        a = this[$_JHJu(349)] - ((s * this[$_JHJu(349)]) % e);
                    if (0 < s--) {
                        a < this[$_JIAb(349)] &&
                        0 < (n = this[s] >> a) &&
                        ((i = !0), (o = g(n)));
                        while (0 <= s)
                            a < e
                                ? ((n = (this[s] & ((1 << a) - 1)) << (e - a)),
                                    (n |= this[--s] >> (a += this[$_JIAb(349)] - e)))
                                : ((n = (this[s] >> (a -= e)) & r),
                                a <= 0 && ((a += this[$_JHJu(349)]), --s)),
                            0 < n && (i = !0),
                            i && (o += g(n));
                    }
                    return i ? o : $_JIAb(40);
                }),
                (y[$_IBAP(236)][$_IBAP(313)] = function rt() {
                    var $_JIEz = mwbxQ.$_Cg,
                        $_JIDD = ["$_JIHD"].concat($_JIEz),
                        $_JIFR = $_JIDD[1];
                    $_JIDD.shift();
                    $_JIDD[0];
                    var t = w();
                    return y[$_JIEz(370)][$_JIFR(346)](this, t), t;
                }),
                (y[$_IAJA(236)][$_IAJA(316)] = function $_HH() {
                    var $_JIJL = mwbxQ.$_Cg,
                        $_JIIj = ["$_JJCj"].concat($_JIJL),
                        $_JJAO = $_JIIj[1];
                    $_JIIj.shift();
                    $_JIIj[0];
                    return this[$_JIJL(345)] < 0 ? this[$_JJAO(313)]() : this;
                }),
                (y[$_IBAP(236)][$_IAJA(323)] = function $_Ih(t) {
                    var $_JJEb = mwbxQ.$_Cg,
                        $_JJDZ = ["$_JJHL"].concat($_JJEb),
                        $_JJFi = $_JJDZ[1];
                    $_JJDZ.shift();
                    $_JJDZ[0];
                    var e = this[$_JJFi(345)] - t[$_JJEb(345)];
                    if (0 != e) return e;
                    var n = this[$_JJEb(376)];
                    if (0 != (e = n - t[$_JJEb(376)]))
                        return this[$_JJEb(345)] < 0 ? -e : e;
                    while (0 <= --n) if (0 != (e = this[n] - t[n])) return e;
                    return 0;
                }),
                (y[$_IBAP(236)][$_IBAP(395)] = function $_JK() {
                    var $_JJJC = mwbxQ.$_Cg,
                        $_JJIi = ["$_BAACi"].concat($_JJJC),
                        $_BAAAF = $_JJIi[1];
                    $_JJIi.shift();
                    $_JJIi[0];
                    return this[$_JJJC(376)] <= 0
                        ? 0
                        : this[$_JJJC(349)] * (this[$_JJJC(376)] - 1) +
                        b(
                            this[this[$_JJJC(376)] - 1] ^
                            (this[$_BAAAF(345)] & this[$_JJJC(379)]),
                        );
                }),
                (y[$_IAJA(236)][$_IBAP(310)] = function $_BAX(t) {
                    var $_BAAEs = mwbxQ.$_Cg,
                        $_BAADd = ["$_BAAHt"].concat($_BAAEs),
                        $_BAAFe = $_BAADd[1];
                    $_BAADd.shift();
                    $_BAADd[0];
                    var e = w();
                    return (
                        this[$_BAAEs(316)]()[$_BAAFe(399)](t, null, e),
                        this[$_BAAFe(345)] < 0 &&
                        0 < e[$_BAAEs(323)](y[$_BAAEs(370)]) &&
                        t[$_BAAEs(346)](e, e),
                            e
                    );
                }),
                (y[$_IAJA(236)][$_IAJA(365)] = function $_BBo(t, e) {
                    var $_BAAJQ = mwbxQ.$_Cg,
                        $_BAAIs = ["$_BABCo"].concat($_BAAJQ),
                        $_BABAU = $_BAAIs[1];
                    $_BAAIs.shift();
                    $_BAAIs[0];
                    var n;
                    return (
                        (n = t < 256 || e[$_BAAJQ(303)]() ? new m(e) : new x(e)),
                            this[$_BABAU(369)](t, n)
                    );
                }),
                (y[$_IBAP(370)] = v(0)),
                (y[$_IBAP(368)] = v(1)),
                (E[$_IAJA(236)][$_IBAP(361)] = function ct(t) {
                    var $_BABEj = mwbxQ.$_Cg,
                        $_BABDQ = ["$_BABHW"].concat($_BABEj),
                        $_BABFo = $_BABDQ[1];
                    $_BABDQ.shift();
                    $_BABDQ[0];
                    return t[$_BABEj(365)](this[$_BABEj(390)], this[$_BABFo(334)]);
                }),
                (E[$_IBAP(236)][$_IBAP(351)] = function ut(t, e) {
                    var $_BABJr = mwbxQ.$_Cg,
                        $_BABIC = ["$_BACCr"].concat($_BABJr),
                        $_BACAx = $_BABIC[1];
                    $_BABIC.shift();
                    $_BABIC[0];
                    null != t &&
                    null != e &&
                    0 < t[$_BACAx(192)] &&
                    0 < e[$_BABJr(192)]
                        ? ((this[$_BACAx(334)] = (function n(t, e) {
                            var $_BACEN = mwbxQ.$_Cg,
                                $_BACDg = ["$_BACHV"].concat($_BACEN);
                            $_BACDg[1];
                            $_BACDg.shift();
                            $_BACDg[0];
                            return new y(t, e);
                        })(t, 16)),
                            (this[$_BABJr(390)] = parseInt(e, 16)))
                        : console &&
                        console[$_BACAx(32)] &&
                        console[$_BACAx(32)]($_BABJr(330));
                }),
                (E[$_IBAP(236)][$_IAJA(392)] = function lt(t) {
                    var $_BACJg = mwbxQ.$_Cg,
                        $_BACIn = ["$_BADCr"].concat($_BACJg),
                        $_BADAI = $_BACIn[1];
                    $_BACIn.shift();
                    $_BACIn[0];
                    var e = (function a(t, e) {
                        var $_BADEx = mwbxQ.$_Cg,
                            $_BADDX = ["$_BADHW"].concat($_BADEx),
                            $_BADFn = $_BADDX[1];
                        $_BADDX.shift();
                        $_BADDX[0];
                        if (e < t[$_BADFn(192)] + 11)
                            return (
                                console &&
                                console[$_BADFn(32)] &&
                                console[$_BADEx(32)]($_BADEx(307)),
                                    null
                            );
                        var n = [],
                            r = t[$_BADFn(192)] - 1;
                        while (0 <= r && 0 < e) {
                            var i = t[$_BADFn(120)](r--);
                            i < 128
                                ? (n[--e] = i)
                                : 127 < i && i < 2048
                                    ? ((n[--e] = (63 & i) | 128),
                                        (n[--e] = (i >> 6) | 192))
                                    : ((n[--e] = (63 & i) | 128),
                                        (n[--e] = ((i >> 6) & 63) | 128),
                                        (n[--e] = (i >> 12) | 224));
                        }
                        n[--e] = 0;
                        var o = new l(),
                            s = [];
                        while (2 < e) {
                            s[0] = 0;
                            while (0 == s[0]) o[$_BADEx(206)](s);
                            n[--e] = s[0];
                        }
                        return (n[--e] = 2), (n[--e] = 0), new y(n);
                    })(t, (this[$_BADAI(334)][$_BADAI(395)]() + 7) >> 3);
                    if (null == e) return null;
                    var n = this[$_BADAI(361)](e);
                    if (null == n) return null;
                    var r = n[$_BACJg(213)](16);
                    return 0 == (1 & r[$_BACJg(192)]) ? r : $_BADAI(40) + r;
                }),
                E
        );
    })();

    let u = new U()["encrypt"](rt);
    function H(t, e) {
        var $_DAJEI = mwbxQ.$_DW()[9][13];
        for (; $_DAJEI !== mwbxQ.$_DW()[0][11];) {
            switch ($_DAJEI) {
                case mwbxQ.$_DW()[6][13]:
                    for (
                        var n = e["slice"](-2), r = [], i = 0;
                        i < n["length"];
                        i++
                    ) {
                        var o = n["charCodeAt"](i);
                        r[i] = 57 < o ? o - 87 : o - 48;
                    }
                    n = 36 * r[0] + r[1];
                    var s,
                        a = Math["round"](t) + n,
                        _ = [[], [], [], [], []],
                        c = {},
                        u = 0;
                    i = 0;
                    $_DAJEI = mwbxQ.$_DW()[6][12];
                    break;
                case mwbxQ.$_DW()[0][12]:
                    for (var l = (e = e["slice"](0, -2))["length"]; i < l; i++)
                        c[(s = e["charAt"](i))] ||
                        ((c[s] = 1),
                            _[u]["push"](s),
                            (u = 5 == ++u ? 0 : u));
                    var h,
                        f = a,
                        d = 4,
                        p = "",
                        g = [1, 2, 5, 10, 50];
                    while (0 < f)
                        0 <= f - g[d]
                            ? ((h = parseInt(
                                Math["random"]() * _[d]["length"],
                                10,
                            )),
                                (p += _[d][h]),
                                (f -= g[d]))
                            : (_["splice"](d, 1), g["splice"](d, 1), (d -= 1));
                    return p;
            }
        }
    }
    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
            case 2:
                return parseInt(
                    Math.random() * (maxNum - minNum + 1) + minNum,
                    10,
                );
            default:
                return 0;
        }
    }

    function W(t) {
        var $_DBDIO = mwbxQ.$_DW()[9][13];
        for (; $_DBDIO !== mwbxQ.$_DW()[0][12];) {
            switch ($_DBDIO) {
                case mwbxQ.$_DW()[6][13]:
                    this[$_CJES(359)] = [t];
                    $_DBDIO = mwbxQ.$_DW()[6][12];
                    break;
            }
        }
    }
    function ct(t) {
        var $_DBECk = mwbxQ.$_DW()[3][13];
        for (; $_DBECk !== mwbxQ.$_DW()[9][12];) {
            switch ($_DBECk) {
                case mwbxQ.$_DW()[6][13]:
                    this["$_BCAO"] = t || [];
                    $_DBECk = mwbxQ.$_DW()[0][12];
                    break;
            }
        }
    }
    (ct["prototype"] = {
        "\u0024\u005f\u0048\u0042\u0077": function (t) {
            var $_BFCES = mwbxQ.$_Cg,
                $_BFCDS = ["$_BFCHo"].concat($_BFCES);
            $_BFCDS[1];
            $_BFCDS.shift();
            $_BFCDS[0];
            return this[$_BFCES(436)][t];
        },
        "\u0024\u005f\u0042\u0043\u0043\u007a": function () {
            var $_BFCJU = mwbxQ.$_Cg,
                $_BFCID = ["$_BFDCd"].concat($_BFCJU),
                $_BFDAs = $_BFCID[1];
            $_BFCID.shift();
            $_BFCID[0];
            return this[$_BFDAs(436)][$_BFCJU(192)];
        },
        "\u0024\u005f\u0042\u004a\u0053": function (t, e) {
            var $_BFDEJ = mwbxQ.$_Cg,
                $_BFDDL = ["$_BFDHr"].concat($_BFDEJ),
                $_BFDFd = $_BFDDL[1];
            $_BFDDL.shift();
            $_BFDDL[0];
            return new ct(
                Q(e)
                    ? this[$_BFDFd(436)][$_BFDEJ(187)](t, e)
                    : this[$_BFDFd(436)][$_BFDEJ(187)](t),
            );
        },
        "\u0024\u005f\u0042\u0043\u0044\u0058": function (t) {
            var $_BFDJc = mwbxQ.$_Cg,
                $_BFDII = ["$_BFECb"].concat($_BFDJc),
                $_BFEAP = $_BFDII[1];
            $_BFDII.shift();
            $_BFDII[0];
            return this[$_BFEAP(436)][$_BFDJc(137)](t), this;
        },
        "\u0024\u005f\u0042\u0043\u0045\u006a": function (t, e) {
            var $_BFEEU = mwbxQ.$_Cg,
                $_BFEDo = ["$_BFEHh"].concat($_BFEEU);
            $_BFEDo[1];
            $_BFEDo.shift();
            $_BFEDo[0];
            return this[$_BFEEU(436)][$_BFEEU(115)](t, e || 1);
        },
        "\u0024\u005f\u0043\u0042\u0047": function (t) {
            var $_BFEJQ = mwbxQ.$_Cg,
                $_BFEIR = ["$_BFFCB"].concat($_BFEJQ),
                $_BFFAm = $_BFEIR[1];
            $_BFEIR.shift();
            $_BFEIR[0];
            return this[$_BFEJQ(436)][$_BFFAm(405)](t);
        },
        "\u0024\u005f\u0042\u0043\u0046\u0055": function (t) {
            var $_BFFEO = mwbxQ.$_Cg,
                $_BFFDj = ["$_BFFHi"].concat($_BFFEO);
            $_BFFDj[1];
            $_BFFDj.shift();
            $_BFFDj[0];
            return new ct(this[$_BFFEO(436)][$_BFFEO(388)](t));
        },
        "\u0024\u005f\u0043\u0041\u0045": function (t) {
            var $_BFFJe = mwbxQ.$_Cg,
                $_BFFIQ = ["$_BFGCs"].concat($_BFFJe),
                $_BFGAj = $_BFFIQ[1];
            $_BFFIQ.shift();
            $_BFFIQ[0];
            var e = this[$_BFGAj(436)];
            if (e[$_BFFJe(429)]) return new ct(e[$_BFFJe(429)](t));
            for (var n = [], r = 0, i = e[$_BFGAj(192)]; r < i; r += 1)
                n[r] = t(e[r], r, this);
            return new ct(n);
        },
        "\u0024\u005f\u0042\u0043\u0047\u0063": function (t) {
            var $_BFGEm = mwbxQ.$_Cg,
                $_BFGDf = ["$_BFGHp"].concat($_BFGEm),
                $_BFGFD = $_BFGDf[1];
            $_BFGDf.shift();
            $_BFGDf[0];
            var e = this[$_BFGEm(436)];
            if (e[$_BFGFD(445)]) return new ct(e[$_BFGFD(445)](t));
            for (var n = [], r = 0, i = e[$_BFGFD(192)]; r < i; r += 1)
                t(e[r], r, this) && n[$_BFGFD(137)](e[r]);
            return new ct(n);
        },
        "\u0024\u005f\u0042\u0043\u0048\u0073": function (t) {
            var $_BFGJz = mwbxQ.$_Cg,
                $_BFGIl = ["$_BFHCH"].concat($_BFGJz),
                $_BFHAK = $_BFGIl[1];
            $_BFGIl.shift();
            $_BFGIl[0];
            var e = this[$_BFGJz(436)];
            if (e[$_BFGJz(129)]) return e[$_BFHAK(129)](t);
            for (var n = 0, r = e[$_BFGJz(192)]; n < r; n += 1)
                if (e[n] === t) return n;
            return -1;
        },
        "\u0024\u005f\u0042\u0043\u0049\u0045": function (t) {
            var $_BFHEQ = mwbxQ.$_Cg,
                $_BFHDF = ["$_BFHHs"].concat($_BFHEQ),
                $_BFHFt = $_BFHDF[1];
            $_BFHDF.shift();
            $_BFHDF[0];
            var e = this[$_BFHEQ(436)];
            if (!e[$_BFHFt(438)])
                for (var n = arguments[1], r = 0; r < e[$_BFHFt(192)]; r++)
                    r in e && t[$_BFHEQ(318)](n, e[r], r, this);
            return e[$_BFHEQ(438)](t);
        },
    }),
        (ct["$_BBJN"] = function (t) {
            var $_BFHJR = mwbxQ.$_Cg,
                $_BFHIV = ["$_BFICX"].concat($_BFHJR),
                $_BFIAK = $_BFHIV[1];
            $_BFHIV.shift();
            $_BFHIV[0];
            return Array[$_BFIAK(421)]
                ? Array[$_BFIAK(421)](t)
                : $_BFHJR(468) ===
                Object[$_BFHJR(236)][$_BFIAK(213)][$_BFHJR(318)](t);
        });
    W["prototype"] = {
        "\u0024\u005f\u0042\u0042\u0044\u0050": function (t) {
            var $_BEGEU = mwbxQ.$_Cg,
                $_BEGDa = ["$_BEGHj"].concat($_BEGEU),
                $_BEGFL = $_BEGDa[1];
            $_BEGDa.shift();
            $_BEGDa[0];
            return this[$_BEGFL(359)][$_BEGEU(137)](t), this;
        },
        "\u0024\u005f\u0046\u0044\u005f": function (trace) {
            var $_BEGJO = mwbxQ.$_Cg,
                $_BEGI_ = ["$_BEHCp"].concat($_BEGJO),
                $_BEHAO = $_BEGI_[1];
            $_BEGI_.shift();
            $_BEGI_[0];
            function n(t) {
                var $_DBEAu = mwbxQ.$_DW()[6][13];
                for (; $_DBEAu !== mwbxQ.$_DW()[9][12];) {
                    switch ($_DBEAu) {
                        case mwbxQ.$_DW()[6][13]:
                            var e = $_BEGJO(497),
                                n = e[$_BEGJO(192)],
                                r = $_BEHAO(2),
                                i = Math[$_BEGJO(316)](t),
                                o = parseInt(i / n);
                            n <= o && (o = n - 1),
                            o && (r = e[$_BEHAO(125)](o));
                            var s = $_BEGJO(2);
                            return (
                                t < 0 && (s += $_BEGJO(418)),
                                r && (s += $_BEHAO(435)),
                                s + r + e[$_BEHAO(125)]((i %= n))
                            );
                    }
                }
            }
            var t = (function (t) {
                    var $_BEHEp = mwbxQ.$_Cg,
                        $_BEHDn = ["$_BEHHY"].concat($_BEHEp),
                        $_BEHFW = $_BEHDn[1];
                    $_BEHDn.shift();
                    $_BEHDn[0];
                    for (
                        var e,
                            n,
                            r,
                            i = [],
                            o = 0,
                            s = 0,
                            a = t[$_BEHFW(192)] - 1;
                        s < a;
                        s++
                    )
                        (e = Math[$_BEHFW(158)](t[s + 1][0] - t[s][0])),
                            (n = Math[$_BEHFW(158)](t[s + 1][1] - t[s][1])),
                            (r = Math[$_BEHFW(158)](t[s + 1][2] - t[s][2])),
                        (0 == e && 0 == n && 0 == r) ||
                        (0 == e && 0 == n
                            ? (o += r)
                            : (i[$_BEHFW(137)]([e, n, r + o]),
                                (o = 0)));
                    return 0 !== o && i[$_BEHFW(137)]([e, n, o]), i;
                })(trace),
                r = [],
                i = [],
                o = [];
            return (
                new ct(t)[$_BEHAO(59)](function (t) {
                    var $_BEHJU = mwbxQ.$_Cg,
                        $_BEHIM = ["$_BEICs"].concat($_BEHJU),
                        $_BEIAi = $_BEHIM[1];
                    $_BEHIM.shift();
                    $_BEHIM[0];
                    var e = (function (t) {
                        var $_BEIE_ = mwbxQ.$_Cg,
                            $_BEIDR = ["$_BEIHQ"].concat($_BEIE_),
                            $_BEIFM = $_BEIDR[1];
                        $_BEIDR.shift();
                        $_BEIDR[0];
                        for (
                            var e = [
                                    [1, 0],
                                    [2, 0],
                                    [1, -1],
                                    [1, 1],
                                    [0, 1],
                                    [0, -1],
                                    [3, 0],
                                    [2, -1],
                                    [2, 1],
                                ],
                                n = 0,
                                r = e[$_BEIFM(192)];
                            n < r;
                            n++
                        )
                            if (t[0] == e[n][0] && t[1] == e[n][1])
                                return $_BEIE_(441)[n];
                        return 0;
                    })(t);
                    e
                        ? i[$_BEHJU(137)](e)
                        : (r[$_BEIAi(137)](n(t[0])), i[$_BEHJU(137)](n(t[1]))),
                        o[$_BEIAi(137)](n(t[2]));
                }),
                r[$_BEGJO(405)]($_BEHAO(2)) +
                $_BEHAO(457) +
                i[$_BEGJO(405)]($_BEGJO(2)) +
                $_BEGJO(457) +
                o[$_BEGJO(405)]($_BEGJO(2))
            );
        },
        "\u0024\u005f\u0042\u0042\u0045\u0044": function (t, e, n) {
            var $_BEIJk = mwbxQ.$_Cg,
                $_BEIIS = ["$_BEJCR"].concat($_BEIJk),
                $_BEJAi = $_BEIIS[1];
            $_BEIIS.shift();
            $_BEIIS[0];
            if (!e || !n) return t;
            var r,
                i = 0,
                o = t,
                s = e[0],
                a = e[2],
                _ = e[4];
            while ((r = n[$_BEJAi(211)](i, 2))) {
                i += 2;
                var c = parseInt(r, 16),
                    u = String[$_BEIJk(246)](c),
                    l = (s * c * c + a * c + _) % t[$_BEJAi(192)];
                o = o[$_BEIJk(211)](0, l) + u + o[$_BEIJk(211)](l);
            }
            return o;
        },
        "\u0024\u005f\u0042\u0042\u0046\u0053": function (t, e, n) {
            var $_BEJEI = mwbxQ.$_Cg,
                $_BEJD_ = ["$_BEJHy"].concat($_BEJEI);
            $_BEJD_[1];
            $_BEJD_.shift();
            $_BEJD_[0];
            if (!e || !n || 0 === t) return t;
            return t + ((e[1] * n * n + e[3] * n + e[5]) % 50);
        },
    };
    function X(t) {
        var $_DBBCG = mwbxQ.$_DW()[0][13];
        for (; $_DBBCG !== mwbxQ.$_DW()[3][12];) {
            switch ($_DBBCG) {
                case mwbxQ.$_DW()[9][13]:
                function _(t, e) {
                    var $_DBBDF = mwbxQ.$_DW()[0][13];
                    for (; $_DBBDF !== mwbxQ.$_DW()[9][12];) {
                        switch ($_DBBDF) {
                            case mwbxQ.$_DW()[0][13]:
                                return (t << e) | (t >>> (32 - e));
                        }
                    }
                }
                function c(t, e) {
                    var $_DBBEn = mwbxQ.$_DW()[3][13];
                    for (; $_DBBEn !== mwbxQ.$_DW()[9][12];) {
                        switch ($_DBBEn) {
                            case mwbxQ.$_DW()[9][13]:
                                var n, r, i, o, s;
                                return (
                                    (i = 2147483648 & t),
                                        (o = 2147483648 & e),
                                        (s =
                                            (1073741823 & t) +
                                            (1073741823 & e)),
                                        (n = 1073741824 & t) &
                                        (r = 1073741824 & e)
                                            ? 2147483648 ^ s ^ i ^ o
                                            : n | r
                                                ? 1073741824 & s
                                                    ? 3221225472 ^ s ^ i ^ o
                                                    : 1073741824 ^ s ^ i ^ o
                                                : s ^ i ^ o
                                );
                        }
                    }
                }
                function e(t, e, n, r, i, o, s) {
                    var $_DBBFz = mwbxQ.$_DW()[3][13];
                    for (; $_DBBFz !== mwbxQ.$_DW()[3][12];) {
                        switch ($_DBBFz) {
                            case mwbxQ.$_DW()[6][13]:
                                return c(
                                    _(
                                        (t = c(
                                            t,
                                            c(
                                                c(
                                                    (function a(t, e, n) {
                                                        var $_HHJY =
                                                                mwbxQ.$_Cg,
                                                            $_HHIa = [
                                                                "$_HICH",
                                                            ].concat(
                                                                $_HHJY,
                                                            );
                                                        $_HHIa[1];
                                                        $_HHIa.shift();
                                                        $_HHIa[0];
                                                        return (
                                                            (t & e) |
                                                            (~t & n)
                                                        );
                                                    })(e, n, r),
                                                    i,
                                                ),
                                                s,
                                            ),
                                        )),
                                        o,
                                    ),
                                    e,
                                );
                        }
                    }
                }
                function n(t, e, n, r, i, o, s) {
                    var $_DBBGM = mwbxQ.$_DW()[3][13];
                    for (; $_DBBGM !== mwbxQ.$_DW()[9][12];) {
                        switch ($_DBBGM) {
                            case mwbxQ.$_DW()[6][13]:
                                return c(
                                    _(
                                        (t = c(
                                            t,
                                            c(
                                                c(
                                                    (function a(t, e, n) {
                                                        var $_HIE_ =
                                                                mwbxQ.$_Cg,
                                                            $_HIDI = [
                                                                "$_HIHp",
                                                            ].concat(
                                                                $_HIE_,
                                                            );
                                                        $_HIDI[1];
                                                        $_HIDI.shift();
                                                        $_HIDI[0];
                                                        return (
                                                            (t & n) |
                                                            (e & ~n)
                                                        );
                                                    })(e, n, r),
                                                    i,
                                                ),
                                                s,
                                            ),
                                        )),
                                        o,
                                    ),
                                    e,
                                );
                        }
                    }
                }
                function r(t, e, n, r, i, o, s) {
                    var $_DBBHG = mwbxQ.$_DW()[3][13];
                    for (; $_DBBHG !== mwbxQ.$_DW()[9][12];) {
                        switch ($_DBBHG) {
                            case mwbxQ.$_DW()[9][13]:
                                return c(
                                    _(
                                        (t = c(
                                            t,
                                            c(
                                                c(
                                                    (function a(t, e, n) {
                                                        var $_HIJv =
                                                                mwbxQ.$_Cg,
                                                            $_HIIG = [
                                                                "$_HJCU",
                                                            ].concat(
                                                                $_HIJv,
                                                            );
                                                        $_HIIG[1];
                                                        $_HIIG.shift();
                                                        $_HIIG[0];
                                                        return t ^ e ^ n;
                                                    })(e, n, r),
                                                    i,
                                                ),
                                                s,
                                            ),
                                        )),
                                        o,
                                    ),
                                    e,
                                );
                        }
                    }
                }
                function i(t, e, n, r, i, o, s) {
                    var $_DBBID = mwbxQ.$_DW()[0][13];
                    for (; $_DBBID !== mwbxQ.$_DW()[0][12];) {
                        switch ($_DBBID) {
                            case mwbxQ.$_DW()[3][13]:
                                return c(
                                    _(
                                        (t = c(
                                            t,
                                            c(
                                                c(
                                                    (function a(t, e, n) {
                                                        var $_HJEK =
                                                                mwbxQ.$_Cg,
                                                            $_HJDb = [
                                                                "$_HJHF",
                                                            ].concat(
                                                                $_HJEK,
                                                            );
                                                        $_HJDb[1];
                                                        $_HJDb.shift();
                                                        $_HJDb[0];
                                                        return e ^ (t | ~n);
                                                    })(e, n, r),
                                                    i,
                                                ),
                                                s,
                                            ),
                                        )),
                                        o,
                                    ),
                                    e,
                                );
                        }
                    }
                }
                function o(t) {
                    var $_DBBJA = mwbxQ.$_DW()[0][13];
                    for (; $_DBBJA !== mwbxQ.$_DW()[9][10];) {
                        switch ($_DBBJA) {
                            case mwbxQ.$_DW()[0][13]:
                                var e,
                                    n = "",
                                    r = "";
                                $_DBBJA = mwbxQ.$_DW()[3][12];
                                break;
                            case mwbxQ.$_DW()[3][12]:
                                for (e = 0; e <= 3; e++)
                                    n += (r =
                                        "0" +
                                        ((t >>> (8 * e)) & 255)["toString"](
                                            16,
                                        ))["substr"](r["length"] - 2, 2);
                                $_DBBJA = mwbxQ.$_DW()[3][11];
                                break;
                            case mwbxQ.$_DW()[3][11]:
                                return n;
                        }
                    }
                }
                    var s, a, u, l, h, f, d, p, g, v;
                    for (
                        s = (function m(t) {
                            var $_HJJQ = mwbxQ.$_Cg,
                                $_HJIM = ["$_IACz"].concat($_HJJQ),
                                $_IAAB = $_HJIM[1];
                            $_HJIM.shift();
                            $_HJIM[0];
                            var e,
                                n = t[$_IAAB(192)],
                                r = n + 8,
                                i = 16 * (1 + (r - (r % 64)) / 64),
                                o = Array(i - 1),
                                s = 0,
                                a = 0;
                            while (a < n)
                                (s = (a % 4) * 8),
                                    (o[(e = (a - (a % 4)) / 4)] =
                                        o[e] | (t[$_IAAB(120)](a) << s)),
                                    a++;
                            return (
                                (s = (a % 4) * 8),
                                    (o[(e = (a - (a % 4)) / 4)] =
                                        o[e] | (128 << s)),
                                    (o[i - 2] = n << 3),
                                    (o[i - 1] = n >>> 29),
                                    o
                            );
                        })(
                            (t = (function y(t) {
                                var $_IAEH = mwbxQ.$_Cg,
                                    $_IADA = ["$_IAHK"].concat($_IAEH),
                                    $_IAFD = $_IADA[1];
                                $_IADA.shift();
                                $_IADA[0];
                                t = t[$_IAFD(45)](/\r\n/g, $_IAFD(229));
                                for (
                                    var e = $_IAEH(2), n = 0;
                                    n < t[$_IAEH(192)];
                                    n++
                                ) {
                                    var r = t[$_IAFD(120)](n);
                                    r < 128
                                        ? (e += String[$_IAFD(246)](r))
                                        : (127 < r && r < 2048
                                            ? (e += String[$_IAEH(246)](
                                                (r >> 6) | 192,
                                            ))
                                            : ((e += String[$_IAEH(246)](
                                                (r >> 12) | 224,
                                            )),
                                                (e += String[$_IAEH(246)](
                                                    ((r >> 6) & 63) | 128,
                                                ))),
                                            (e += String[$_IAFD(246)](
                                                (63 & r) | 128,
                                            )));
                                }
                                return e;
                            })(t)),
                        ),
                            d = 1732584193,
                            p = 4023233417,
                            g = 2562383102,
                            v = 271733878,
                            a = 0;
                        a < s["length"];
                        a += 16
                    )
                        (p = i(
                            (p = i(
                                (p = i(
                                    (p = i(
                                        (p = r(
                                            (p = r(
                                                (p = r(
                                                    (p = r(
                                                        (p = n(
                                                            (p = n(
                                                                (p = n(
                                                                    (p = n(
                                                                        (p = e(
                                                                            (p =
                                                                                e(
                                                                                    (p =
                                                                                        e(
                                                                                            (p =
                                                                                                e(
                                                                                                    (l =
                                                                                                        p),
                                                                                                    (g =
                                                                                                        e(
                                                                                                            (h =
                                                                                                                g),
                                                                                                            (v =
                                                                                                                e(
                                                                                                                    (f =
                                                                                                                        v),
                                                                                                                    (d =
                                                                                                                        e(
                                                                                                                            (u =
                                                                                                                                d),
                                                                                                                            p,
                                                                                                                            g,
                                                                                                                            v,
                                                                                                                            s[
                                                                                                                            a +
                                                                                                                            0
                                                                                                                                ],
                                                                                                                            7,
                                                                                                                            3614090360,
                                                                                                                        )),
                                                                                                                    p,
                                                                                                                    g,
                                                                                                                    s[
                                                                                                                    a +
                                                                                                                    1
                                                                                                                        ],
                                                                                                                    12,
                                                                                                                    3905402710,
                                                                                                                )),
                                                                                                            d,
                                                                                                            p,
                                                                                                            s[
                                                                                                            a +
                                                                                                            2
                                                                                                                ],
                                                                                                            17,
                                                                                                            606105819,
                                                                                                        )),
                                                                                                    v,
                                                                                                    d,
                                                                                                    s[
                                                                                                    a +
                                                                                                    3
                                                                                                        ],
                                                                                                    22,
                                                                                                    3250441966,
                                                                                                )),
                                                                                            (g =
                                                                                                e(
                                                                                                    g,
                                                                                                    (v =
                                                                                                        e(
                                                                                                            v,
                                                                                                            (d =
                                                                                                                e(
                                                                                                                    d,
                                                                                                                    p,
                                                                                                                    g,
                                                                                                                    v,
                                                                                                                    s[
                                                                                                                    a +
                                                                                                                    4
                                                                                                                        ],
                                                                                                                    7,
                                                                                                                    4118548399,
                                                                                                                )),
                                                                                                            p,
                                                                                                            g,
                                                                                                            s[
                                                                                                            a +
                                                                                                            5
                                                                                                                ],
                                                                                                            12,
                                                                                                            1200080426,
                                                                                                        )),
                                                                                                    d,
                                                                                                    p,
                                                                                                    s[
                                                                                                    a +
                                                                                                    6
                                                                                                        ],
                                                                                                    17,
                                                                                                    2821735955,
                                                                                                )),
                                                                                            v,
                                                                                            d,
                                                                                            s[
                                                                                            a +
                                                                                            7
                                                                                                ],
                                                                                            22,
                                                                                            4249261313,
                                                                                        )),
                                                                                    (g =
                                                                                        e(
                                                                                            g,
                                                                                            (v =
                                                                                                e(
                                                                                                    v,
                                                                                                    (d =
                                                                                                        e(
                                                                                                            d,
                                                                                                            p,
                                                                                                            g,
                                                                                                            v,
                                                                                                            s[
                                                                                                            a +
                                                                                                            8
                                                                                                                ],
                                                                                                            7,
                                                                                                            1770035416,
                                                                                                        )),
                                                                                                    p,
                                                                                                    g,
                                                                                                    s[
                                                                                                    a +
                                                                                                    9
                                                                                                        ],
                                                                                                    12,
                                                                                                    2336552879,
                                                                                                )),
                                                                                            d,
                                                                                            p,
                                                                                            s[
                                                                                            a +
                                                                                            10
                                                                                                ],
                                                                                            17,
                                                                                            4294925233,
                                                                                        )),
                                                                                    v,
                                                                                    d,
                                                                                    s[
                                                                                    a +
                                                                                    11
                                                                                        ],
                                                                                    22,
                                                                                    2304563134,
                                                                                )),
                                                                            (g =
                                                                                e(
                                                                                    g,
                                                                                    (v =
                                                                                        e(
                                                                                            v,
                                                                                            (d =
                                                                                                e(
                                                                                                    d,
                                                                                                    p,
                                                                                                    g,
                                                                                                    v,
                                                                                                    s[
                                                                                                    a +
                                                                                                    12
                                                                                                        ],
                                                                                                    7,
                                                                                                    1804603682,
                                                                                                )),
                                                                                            p,
                                                                                            g,
                                                                                            s[
                                                                                            a +
                                                                                            13
                                                                                                ],
                                                                                            12,
                                                                                            4254626195,
                                                                                        )),
                                                                                    d,
                                                                                    p,
                                                                                    s[
                                                                                    a +
                                                                                    14
                                                                                        ],
                                                                                    17,
                                                                                    2792965006,
                                                                                )),
                                                                            v,
                                                                            d,
                                                                            s[
                                                                            a +
                                                                            15
                                                                                ],
                                                                            22,
                                                                            1236535329,
                                                                        )),
                                                                        (g = n(
                                                                            g,
                                                                            (v =
                                                                                n(
                                                                                    v,
                                                                                    (d =
                                                                                        n(
                                                                                            d,
                                                                                            p,
                                                                                            g,
                                                                                            v,
                                                                                            s[
                                                                                            a +
                                                                                            1
                                                                                                ],
                                                                                            5,
                                                                                            4129170786,
                                                                                        )),
                                                                                    p,
                                                                                    g,
                                                                                    s[
                                                                                    a +
                                                                                    6
                                                                                        ],
                                                                                    9,
                                                                                    3225465664,
                                                                                )),
                                                                            d,
                                                                            p,
                                                                            s[
                                                                            a +
                                                                            11
                                                                                ],
                                                                            14,
                                                                            643717713,
                                                                        )),
                                                                        v,
                                                                        d,
                                                                        s[
                                                                        a +
                                                                        0
                                                                            ],
                                                                        20,
                                                                        3921069994,
                                                                    )),
                                                                    (g = n(
                                                                        g,
                                                                        (v = n(
                                                                            v,
                                                                            (d =
                                                                                n(
                                                                                    d,
                                                                                    p,
                                                                                    g,
                                                                                    v,
                                                                                    s[
                                                                                    a +
                                                                                    5
                                                                                        ],
                                                                                    5,
                                                                                    3593408605,
                                                                                )),
                                                                            p,
                                                                            g,
                                                                            s[
                                                                            a +
                                                                            10
                                                                                ],
                                                                            9,
                                                                            38016083,
                                                                        )),
                                                                        d,
                                                                        p,
                                                                        s[
                                                                        a +
                                                                        15
                                                                            ],
                                                                        14,
                                                                        3634488961,
                                                                    )),
                                                                    v,
                                                                    d,
                                                                    s[a + 4],
                                                                    20,
                                                                    3889429448,
                                                                )),
                                                                (g = n(
                                                                    g,
                                                                    (v = n(
                                                                        v,
                                                                        (d = n(
                                                                            d,
                                                                            p,
                                                                            g,
                                                                            v,
                                                                            s[
                                                                            a +
                                                                            9
                                                                                ],
                                                                            5,
                                                                            568446438,
                                                                        )),
                                                                        p,
                                                                        g,
                                                                        s[
                                                                        a +
                                                                        14
                                                                            ],
                                                                        9,
                                                                        3275163606,
                                                                    )),
                                                                    d,
                                                                    p,
                                                                    s[a + 3],
                                                                    14,
                                                                    4107603335,
                                                                )),
                                                                v,
                                                                d,
                                                                s[a + 8],
                                                                20,
                                                                1163531501,
                                                            )),
                                                            (g = n(
                                                                g,
                                                                (v = n(
                                                                    v,
                                                                    (d = n(
                                                                        d,
                                                                        p,
                                                                        g,
                                                                        v,
                                                                        s[
                                                                        a +
                                                                        13
                                                                            ],
                                                                        5,
                                                                        2850285829,
                                                                    )),
                                                                    p,
                                                                    g,
                                                                    s[a + 2],
                                                                    9,
                                                                    4243563512,
                                                                )),
                                                                d,
                                                                p,
                                                                s[a + 7],
                                                                14,
                                                                1735328473,
                                                            )),
                                                            v,
                                                            d,
                                                            s[a + 12],
                                                            20,
                                                            2368359562,
                                                        )),
                                                        (g = r(
                                                            g,
                                                            (v = r(
                                                                v,
                                                                (d = r(
                                                                    d,
                                                                    p,
                                                                    g,
                                                                    v,
                                                                    s[a + 5],
                                                                    4,
                                                                    4294588738,
                                                                )),
                                                                p,
                                                                g,
                                                                s[a + 8],
                                                                11,
                                                                2272392833,
                                                            )),
                                                            d,
                                                            p,
                                                            s[a + 11],
                                                            16,
                                                            1839030562,
                                                        )),
                                                        v,
                                                        d,
                                                        s[a + 14],
                                                        23,
                                                        4259657740,
                                                    )),
                                                    (g = r(
                                                        g,
                                                        (v = r(
                                                            v,
                                                            (d = r(
                                                                d,
                                                                p,
                                                                g,
                                                                v,
                                                                s[a + 1],
                                                                4,
                                                                2763975236,
                                                            )),
                                                            p,
                                                            g,
                                                            s[a + 4],
                                                            11,
                                                            1272893353,
                                                        )),
                                                        d,
                                                        p,
                                                        s[a + 7],
                                                        16,
                                                        4139469664,
                                                    )),
                                                    v,
                                                    d,
                                                    s[a + 10],
                                                    23,
                                                    3200236656,
                                                )),
                                                (g = r(
                                                    g,
                                                    (v = r(
                                                        v,
                                                        (d = r(
                                                            d,
                                                            p,
                                                            g,
                                                            v,
                                                            s[a + 13],
                                                            4,
                                                            681279174,
                                                        )),
                                                        p,
                                                        g,
                                                        s[a + 0],
                                                        11,
                                                        3936430074,
                                                    )),
                                                    d,
                                                    p,
                                                    s[a + 3],
                                                    16,
                                                    3572445317,
                                                )),
                                                v,
                                                d,
                                                s[a + 6],
                                                23,
                                                76029189,
                                            )),
                                            (g = r(
                                                g,
                                                (v = r(
                                                    v,
                                                    (d = r(
                                                        d,
                                                        p,
                                                        g,
                                                        v,
                                                        s[a + 9],
                                                        4,
                                                        3654602809,
                                                    )),
                                                    p,
                                                    g,
                                                    s[a + 12],
                                                    11,
                                                    3873151461,
                                                )),
                                                d,
                                                p,
                                                s[a + 15],
                                                16,
                                                530742520,
                                            )),
                                            v,
                                            d,
                                            s[a + 2],
                                            23,
                                            3299628645,
                                        )),
                                        (g = i(
                                            g,
                                            (v = i(
                                                v,
                                                (d = i(
                                                    d,
                                                    p,
                                                    g,
                                                    v,
                                                    s[a + 0],
                                                    6,
                                                    4096336452,
                                                )),
                                                p,
                                                g,
                                                s[a + 7],
                                                10,
                                                1126891415,
                                            )),
                                            d,
                                            p,
                                            s[a + 14],
                                            15,
                                            2878612391,
                                        )),
                                        v,
                                        d,
                                        s[a + 5],
                                        21,
                                        4237533241,
                                    )),
                                    (g = i(
                                        g,
                                        (v = i(
                                            v,
                                            (d = i(
                                                d,
                                                p,
                                                g,
                                                v,
                                                s[a + 12],
                                                6,
                                                1700485571,
                                            )),
                                            p,
                                            g,
                                            s[a + 3],
                                            10,
                                            2399980690,
                                        )),
                                        d,
                                        p,
                                        s[a + 10],
                                        15,
                                        4293915773,
                                    )),
                                    v,
                                    d,
                                    s[a + 1],
                                    21,
                                    2240044497,
                                )),
                                (g = i(
                                    g,
                                    (v = i(
                                        v,
                                        (d = i(
                                            d,
                                            p,
                                            g,
                                            v,
                                            s[a + 8],
                                            6,
                                            1873313359,
                                        )),
                                        p,
                                        g,
                                        s[a + 15],
                                        10,
                                        4264355552,
                                    )),
                                    d,
                                    p,
                                    s[a + 6],
                                    15,
                                    2734768916,
                                )),
                                v,
                                d,
                                s[a + 13],
                                21,
                                1309151649,
                            )),
                            (g = i(
                                g,
                                (v = i(
                                    v,
                                    (d = i(
                                        d,
                                        p,
                                        g,
                                        v,
                                        s[a + 4],
                                        6,
                                        4149444226,
                                    )),
                                    p,
                                    g,
                                    s[a + 11],
                                    10,
                                    3174756917,
                                )),
                                d,
                                p,
                                s[a + 2],
                                15,
                                718787259,
                            )),
                            v,
                            d,
                            s[a + 9],
                            21,
                            3951481745,
                        )),
                            (d = c(d, u)),
                            (p = c(p, l)),
                            (g = c(g, h)),
                            (v = c(v, f));
                    return (o(d) + o(p) + o(g) + o(v))["toLowerCase"]();
            }
        }
    }
    var o = {
        lang: "zh-cn",
        userresponse: H(trace[trace.length - 1][0], challenge),
        passtime: trace[trace.length - 1][2],
        imgload: randomNum(100, 200),
        aa: W["prototype"]["$_BBED"](W["prototype"]["$_FD_"](trace), c, s),
        ep: {
            v: "9.1.8-bfget5",
            $_E_: false,
            me: true,
            ven: "Google Inc. (Intel)",
            ren: "ANGLE (Intel, Intel(R) HD Graphics 520 Direct3D11 vs_5_0 ps_5_0, D3D11)",
            fp: ["move", 483, 149, 1702019849214, "pointermove"],
            lp: ["up", 657, 100, 1702019852230, "pointerup"],
            em: { ph: 0, cp: 0, ek: "11", wd: 1, nt: 0, si: 0, sc: 0 },
            tm: {
                a: 1702019845759,
                b: 1702019845951,
                c: 1702019845951,
                d: 0,
                e: 0,
                f: 1702019845763,
                g: 1702019845785,
                h: 1702019845785,
                i: 1702019845785,
                j: 1702019845845,
                k: 1702019845812,
                l: 1702019845845,
                m: 1702019845942,
                n: 1702019845946,
                o: 1702019845954,
                p: 1702019846282,
                q: 1702019846282,
                r: 1702019846287,
                s: 1702019846288,
                t: 1702019846288,
                u: 1702019846288,
            },
            dnf: "dnf",
            by: 0,
        },
        rp: X(gt + challenge["slice"](0, 32) + trace[trace.length - 1][2]),
    };

    let l = aesV(JSON.stringify(o), rt);

    let m = {
        "\u0024\u005f\u0044\u004a\u0077": {
            "\u0024\u005f\u0045\u0041\u0057":
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()",
            "\u0024\u005f\u0045\u0042\u0054": ".",
            "\u0024\u005f\u0045\u0043\u004f": 7274496,
            "\u0024\u005f\u0045\u0044\u0066": 9483264,
            "\u0024\u005f\u0045\u0045\u004f": 19220,
            "\u0024\u005f\u0045\u0046\u006e": 235,
            "\u0024\u005f\u0045\u0047\u0058": 24,
        },
        "\u0024\u005f\u0045\u0041\u0057":
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()",
        "\u0024\u005f\u0045\u0042\u0054": ".",
        "\u0024\u005f\u0045\u0043\u004f": 7274496,
        "\u0024\u005f\u0045\u0044\u0066": 9483264,
        "\u0024\u005f\u0045\u0045\u004f": 19220,
        "\u0024\u005f\u0045\u0046\u006e": 235,
        "\u0024\u005f\u0045\u0047\u0058": 24,
        "\u0024\u005f\u0045\u0048\u0053": function (t) {
            var $_GBJH = mwbxQ.$_Cg,
                $_GBIK = ["$_GCCj"].concat($_GBJH),
                $_GCAx = $_GBIK[1];
            $_GBIK.shift();
            $_GBIK[0];
            for (var e = [], n = 0, r = t[$_GBJH(192)]; n < r; n += 1)
                e[$_GCAx(137)](t[$_GCAx(120)](n));
            return e;
        },
        "\u0024\u005f\u0045\u0049\u0048": function (t) {
            var $_GCEA = mwbxQ.$_Cg,
                $_GCDO = ["$_GCHY"].concat($_GCEA);
            $_GCDO[1];
            $_GCDO.shift();
            $_GCDO[0];
            for (var e = $_GCEA(2), n = 0, r = t[$_GCEA(192)]; n < r; n += 1)
                e += String[$_GCEA(246)](t[n]);
            return e;
        },
        "\u0024\u005f\u0045\u004a\u0075": function (t) {
            var $_GCJa = mwbxQ.$_Cg,
                $_GCIw = ["$_GDCQ"].concat($_GCJa);
            $_GCIw[1];
            $_GCIw.shift();
            $_GCIw[0];
            var e = this[$_GCJa(217)];
            return t < 0 || t >= e[$_GCJa(192)]
                ? $_GCJa(24)
                : e[$_GCJa(125)](t);
        },
        "\u0024\u005f\u0046\u0041\u0045": function (t) {
            var $_GDEk = mwbxQ.$_Cg,
                $_GDDA = ["$_GDHd"].concat($_GDEk);
            $_GDDA[1];
            $_GDDA.shift();
            $_GDDA[0];
            return this[$_GDEk(217)][$_GDEk(129)](t);
        },
        "\u0024\u005f\u0046\u0042\u006d": function (t, e) {
            var $_GDJb = mwbxQ.$_Cg,
                $_GDIQ = ["$_GECJ"].concat($_GDJb);
            $_GDIQ[1];
            $_GDIQ.shift();
            $_GDIQ[0];
            return (t >> e) & 1;
        },
        "\u0024\u005f\u0046\u0043\u0044": function (t, i) {
            var $_GEED = mwbxQ.$_Cg,
                $_GEDK = ["$_GEHX"].concat($_GEED),
                $_GEFH = $_GEDK[1];
            $_GEDK.shift();
            $_GEDK[0];
            var o = this;
            i || (i = o);
            for (
                var e = function (t, e) {
                        var $_GEJI = mwbxQ.$_Cg,
                            $_GEIy = ["$_GFCz"].concat($_GEJI),
                            $_GFAZ = $_GEIy[1];
                        $_GEIy.shift();
                        $_GEIy[0];
                        for (var n = 0, r = i[$_GEJI(289)] - 1; 0 <= r; r -= 1)
                            1 === o[$_GFAZ(237)](e, r) &&
                            (n = (n << 1) + o[$_GFAZ(237)](t, r));
                        return n;
                    },
                    n = $_GEED(2),
                    r = $_GEED(2),
                    s = t[$_GEED(192)],
                    a = 0;
                a < s;
                a += 3
            ) {
                var _;
                if (a + 2 < s)
                    (_ = (t[a] << 16) + (t[a + 1] << 8) + t[a + 2]),
                        (n +=
                            o[$_GEFH(264)](e(_, i[$_GEED(238)])) +
                            o[$_GEED(264)](e(_, i[$_GEED(212)])) +
                            o[$_GEED(264)](e(_, i[$_GEFH(226)])) +
                            o[$_GEED(264)](e(_, i[$_GEFH(281)])));
                else {
                    var c = s % 3;
                    2 == c
                        ? ((_ = (t[a] << 16) + (t[a + 1] << 8)),
                            (n +=
                                o[$_GEFH(264)](e(_, i[$_GEFH(238)])) +
                                o[$_GEED(264)](e(_, i[$_GEED(212)])) +
                                o[$_GEED(264)](e(_, i[$_GEED(226)]))),
                            (r = i[$_GEED(265)]))
                        : 1 == c &&
                        ((_ = t[a] << 16),
                            (n +=
                                o[$_GEED(264)](e(_, i[$_GEED(238)])) +
                                o[$_GEED(264)](e(_, i[$_GEED(212)]))),
                            (r = i[$_GEFH(265)] + i[$_GEED(265)]));
                }
            }
            return {
                "\u0072\u0065\u0073": n,
                "\u0065\u006e\u0064": r,
            };
        },
        "\u0024\u005f\u0046\u0044\u005f": function (t) {
            var $_GFEL = mwbxQ.$_Cg,
                $_GFDX = ["$_GFHO"].concat($_GFEL),
                $_GFFs = $_GFDX[1];
            $_GFDX.shift();
            $_GFDX[0];
            var e = this[$_GFFs(228)](this[$_GFEL(290)](t));
            return e[$_GFFs(221)] + e[$_GFFs(252)];
        },
        "\u0024\u005f\u0046\u0045\u0058": function (t) {
            var $_GFJC = mwbxQ.$_Cg,
                $_GFIj = ["$_GGCw"].concat($_GFJC),
                $_GGAP = $_GFIj[1];
            $_GFIj.shift();
            $_GFIj[0];
            var e = this[$_GGAP(228)](t);
            return e[$_GFJC(221)] + e[$_GFJC(252)];
        },
        "\u0024\u005f\u0046\u0046\u0051": function (t, o) {
            var $_GGEY = mwbxQ.$_Cg,
                $_GGDR = ["$_GGHE"].concat($_GGEY),
                $_GGFL = $_GGDR[1];
            $_GGDR.shift();
            $_GGDR[0];
            var s = this;
            o || (o = s);
            for (
                var e = function (t, e) {
                        var $_GGJX = mwbxQ.$_Cg,
                            $_GGIO = ["$_GHCp"].concat($_GGJX),
                            $_GHAf = $_GGIO[1];
                        $_GGIO.shift();
                        $_GGIO[0];
                        if (t < 0) return 0;
                        for (
                            var n = 5, r = 0, i = o[$_GHAf(289)] - 1;
                            0 <= i;
                            i -= 1
                        )
                            1 === s[$_GGJX(237)](e, i) &&
                            ((r += s[$_GGJX(237)](t, n) << i), (n -= 1));
                        return r;
                    },
                    n = t[$_GGFL(192)],
                    r = $_GGEY(2),
                    i = 0;
                i < n;
                i += 4
            ) {
                var a =
                        e(s[$_GGEY(222)](t[$_GGFL(125)](i)), o[$_GGFL(238)]) +
                        e(
                            s[$_GGFL(222)](t[$_GGEY(125)](i + 1)),
                            o[$_GGEY(212)],
                        ) +
                        e(
                            s[$_GGFL(222)](t[$_GGFL(125)](i + 2)),
                            o[$_GGEY(226)],
                        ) +
                        e(
                            s[$_GGEY(222)](t[$_GGFL(125)](i + 3)),
                            o[$_GGFL(281)],
                        ),
                    _ = (a >> 16) & 255;
                if (
                    ((r += String[$_GGFL(246)](_)),
                    t[$_GGFL(125)](i + 2) !== o[$_GGFL(265)])
                ) {
                    var c = (a >> 8) & 255;
                    if (
                        ((r += String[$_GGFL(246)](c)),
                        t[$_GGEY(125)](i + 3) !== o[$_GGFL(265)])
                    ) {
                        var u = 255 & a;
                        r += String[$_GGEY(246)](u);
                    }
                }
            }
            return r;
        },
        "\u0024\u005f\u0046\u0047\u0055": function (t) {
            var $_GHEO = mwbxQ.$_Cg,
                $_GHDq = ["$_GHHs"].concat($_GHEO),
                $_GHFW = $_GHDq[1];
            $_GHDq.shift();
            $_GHDq[0];
            var e = 4 - (t[$_GHFW(192)] % 4);
            if (e < 4) for (var n = 0; n < e; n += 1) t += this[$_GHEO(265)];
            return this[$_GHEO(271)](t);
        },
        "\u0024\u005f\u0046\u0048\u0051": function (t) {
            var $_GHJH = mwbxQ.$_Cg,
                $_GHIW = ["$_GIC_"].concat($_GHJH),
                $_GIAu = $_GHIW[1];
            $_GHIW.shift();
            $_GHIW[0];
            return this[$_GIAu(251)](t);
        },
    };
    let h = m["$_FEX"](l);
    let w = h + u;
    return w;
}

slide_result