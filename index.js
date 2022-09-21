"use strict";
exports.__esModule = true;
var xpi_js_1 = require("@bcpros/xpi-js");
var XPI = new xpi_js_1["default"]({
    restURL: 'https://api.sendlotus.com/v4/'
});
var lang = 'english';
var Bip39128BitMnemonic = XPI.Mnemonic.generate(128, XPI.Mnemonic.wordLists()[lang]);
console.log(Bip39128BitMnemonic);
