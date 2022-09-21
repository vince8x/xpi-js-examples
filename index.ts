import BCHJS from "@bcpros/xpi-js";

const XPI = new BCHJS({
    restURL: 'https://api.sendlotus.com/v4/'
});

const lang = 'english';
const Bip39128BitMnemonic = XPI.Mnemonic.generate(128, XPI.Mnemonic.wordLists()[lang]);

console.log(Bip39128BitMnemonic);