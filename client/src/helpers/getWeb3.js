import Web3 from 'web3'

export const getWeb3 = () => {
  return new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    let web3 = window.web3;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);
      console.log('getWeb3.Injected web3 detected.');
    } else {
      return reject(new Error('getWeb3.No web3 instance injected.'));
    }

    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return reject(err);
      }

      web3.eth.defaultAccount = accounts[0];
      console.log('getWeb3.Using account:', web3.eth.defaultAccount);
      return resolve(web3);
    });
  });
}
