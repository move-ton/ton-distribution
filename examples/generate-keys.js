const fs = require('fs');

const {
  ton,
} = require('./utils');


(async () => {
  await ton.setup();
  const keys = await ton.crypto.ed25519Keypair();
  fs.writeFileSync('keys.json', JSON.stringify(keys));
  
  console.log(`New keys written in the keys.json`);
  process.exit(0);
})();
