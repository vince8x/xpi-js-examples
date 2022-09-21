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

async function getBalance () {
    try {
      // first get BCH balance
      const balance = await XPI.Electrumx.balance(walletInfo.lotusAddress)
  
      // Sats
      const total = balance.balance.confirmed + balance.balance.unconfirmed
  
      // Convert sats to XEC.
      const xpi = XPI.eCash.toXec(total)
  
      console.log('XEC Balance: ', xpi)
    } catch (err) {
      console.error('Error in getBalance: ', err)
      throw err
    }
  }
  getBalance();
