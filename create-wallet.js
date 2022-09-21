import BCHJS from "@bcpros/xpi-js";
import * as fs from 'fs';

const XPI = new BCHJS({
    restURL: 'http://127.0.0.1:3000/v4/'
});

const lang = 'english';

const outObj = {};

async function createWallet() {
    try {
        const Bip39128BitMnemonic = XPI.Mnemonic.generate(128, XPI.Mnemonic.wordLists()[lang]);

        console.log('BIP44 $XPI Wallet:', Bip39128BitMnemonic);

        const mnemonic = Bip39128BitMnemonic;

        // root seed buffer
        const rootSeed = await XPI.Mnemonic.toSeed(mnemonic);

        const masterHDNode = XPI.HDNode.fromSeed(rootSeed);

        // Generate the first 10 seed addresses.
        for (let i = 0; i < 10; i++) {
            const childNode = masterHDNode.derivePath(`m/44'/10605'/0'/0/${i}`);

            // Generate XPI address
            const xAddress = XPI.HDNode.toXAddress(childNode);

            // outputs the address in ecash format
            console.log(`m/44'/10605'/0'/0/${i}: ${xAddress}`)

            // Save the first seed address for use in the .json output file.
            if (i === 0) {
                outObj.lotusAddress = xAddress;
                outObj.legacyAddress = XPI.HDNode.toLegacyAddress(childNode);
                outObj.WIF = XPI.HDNode.toWIF(childNode);
            }
        }

        fs.writeFile('wallet.json', JSON.stringify(outObj, null, 2), function (err) {
            if (err) return console.error(err)
            console.log('wallet.json written successfully.')
        });
    } catch (err) {
        console.error('Error in createWallet(): ', err)
    }
}

createWallet();


