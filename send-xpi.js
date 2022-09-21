import BCHJS from "@bcpros/xpi-js";
import * as fs from 'fs';

const XPI = new BCHJS({
    restURL: 'http://127.0.0.1:3000/v4/'
});

let walletInfo;

try {
    walletInfo = JSON.parse(fs.readFileSync('./wallet.json', 'utf8'));
} catch (err) {
    console.log(
        'Could not open wallet.json. Generate a wallet with create-wallet first.'
    )
    process.exit(0)
}





async function sendXpi() {

    try {

        const SATOSHIS_TO_SEND = 1000000

        const SEND_ADDR = walletInfo.lotusAddress;
        const SEND_WIF = walletInfo.WIF;

        const RECV_ADDR = 'lotus_16PSJQi534eKQc4yrYmd9HoQFgjYKmR3ckXPhM5r7';

        const utxos = await XPI.Electrumx.utxo(SEND_ADDR);

        if (utxos.utxos.length === 0) throw new Error('No UTXOs found.');

        // instance of transaction builder
        const transactionBuilder = new XPI.TransactionBuilder();

        // Use the first utxo
        const utxo = utxos.utxos[0];

        const satoshisToSend = SATOSHIS_TO_SEND;
        const originalAmount = utxo.value;
        const vout = utxo.tx_pos;
        const txid = utxo.tx_hash;

        transactionBuilder.addInput(txid, vout);

        // get byte count to calculate fee. paying 1.2 sat/byte
        const byteCount = XPI.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 2 })
        console.log(`Transaction byte count: ${byteCount}`)
        const satoshisPerByte = 1.2
        const txFee = Math.floor(satoshisPerByte * byteCount)
        console.log(`Transaction fee: ${txFee}`)

        // amount to send back to the sending address.
        // It's the original amount - 1 sat/byte for tx size
        const remainder = originalAmount - satoshisToSend - txFee;

        if (remainder < 0) {
            throw new Error('Not enough BCH to complete transaction!')
        }

        // add output w/ address and amount to send
        transactionBuilder.addOutput(RECV_ADDR, satoshisToSend)
        transactionBuilder.addOutput(SEND_ADDR, remainder);

        const redeemScript = undefined;
        const keyPair = XPI.ECPair.fromWIF(SEND_WIF);
        transactionBuilder.sign(
            0,
            keyPair,
            redeemScript,
            transactionBuilder.hashTypes.SIGHASH_ALL,
            originalAmount
        );

        // build tx
        const tx = transactionBuilder.build()
        // output rawhex
        const hex = tx.toHex()
        // console.log(`TX hex: ${hex}`);
        console.log(' ')

        // Broadcast transation to the network
        const txidStr = await XPI.RawTransactions.sendRawTransaction([hex])
        // import from util.js file
        // const util = require('../util.js')
        console.log(`Transaction ID: ${txidStr}`)

    } catch (err) {
        console.error('Error in getBalance: ', err)
        throw err
    }
}
sendXpi();
