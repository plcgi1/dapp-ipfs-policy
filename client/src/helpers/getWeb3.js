export const getWeb3 = () => {
  return new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
      let web3 = window.web3;
      console.log('codepen load' + web3.eth.accounts);

      setTimeout(function() {
        console.log('codepen timeout ' + web3.eth.accounts);
      }, 2000)

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        web3 = new Web3(web3.currentProvider);
        console.log('Injected web3 detected.');
      } else {
        return reject(new Error('No web3 instance injected.'));
      }

      web3.eth.getAccounts((err, accounts) => {
        if (err) {
          return reject(err);
        }

        web3.eth.defaultAccount = accounts[0];
        console.log('Using account:', web3.eth.defaultAccount);
        return resolve(web3);
      });
    });
  });
}
export const asyncCoinBase = (web3) => {
  return new Promise((resolve, reject) => {
    return web3.eth.getCoinbase((err, address) => {
      if (err) return reject(err)
      return resolve(address.toLowerCase())
    })
  })
}

export const asyncSign = (web3, param) => {
  return new Promise((resolve, reject) => {
    console.info('web3.eth.personal', web3.eth.personal)
    return web3.personal.sign(param.data, param.publicAddress, param.password, (err, signature) => {
      if (err) return reject(err)
      return resolve(signature)
    })
  })
}
