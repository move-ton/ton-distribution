const fs = require('fs');
const airdrop = require('./../contracts/airdropContract');

const {
  ton,
  getConfig,
} = require('./utils');

const config = getConfig();

(async () => {
  await ton.setup();

  try {
    const contract = new airdrop(ton, null, config.keys);
    const info = await contract.calcDeployData(config.constructorParams);
    console.log(`Deploy fee: ${info.deployFee / 10 ** 9}`);

    const sendFeeResponse = await ton.contracts.run({
      address: config.feeWallet,
      functionName: 'submitTransaction',
      abi: config.feeWalletAbi,
      input: {
        dest: info.address, 
        value: info.deployFee, 
        bounce: false, 
        allBalance: false, 
        payload: ""
      },
      keyPair: config.feeWalletKeys
    });
    
    const deployResponse = await contract.deploy(config.constructorParams);

    fs.writeFileSync('deploy.json', JSON.stringify(info));
    console.log(`Contract deployed at ${contract.address}`);
    
    process.exit(0);

  } catch (e) {
    console.error(e);
  }
  
})();
