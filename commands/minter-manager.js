const commandLineArgs = require('command-line-args');
const Web3 = require('web3')
const abi = require('../client/src/contracts/ERC721MetadataMintable')

const etherUrl = "http://localhost:8545";

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(etherUrl));

const checkAddress = (address, optionName) => {
    const isAddress = web3.utils.isAddress(address)

    if(!isAddress) {
      throw new Error(`Option "${optionName}".address should be valid eth address`)
    }
    return address
}

const optionDefinitions = [
  {
    name: 'from',
    alias: 'f',
    type: address => {
      return checkAddress(address, 'from')
    }
  },
  {
    name: 'command',
    alias: 'c',
    type: command => {
      const ready = /^(add|rm)$/.test(command)

      if(!ready) {
        throw new Error('command argument values should be add|rm')
      }
      return command
    }
  },
  {
    name: 'address',
    alias: 'a',
    type: address => {
      return checkAddress(address, 'from')
    }
  }
];

const options = commandLineArgs(optionDefinitions);

class TokenManager {
  constructor (from) {
    this.from = from
  }

  async add (addressTo) {
    //  add minter - minter account address
  }

  async remove (addressTo) {
    //  remove minter - minter account address
  }
}

const main = async () => {
  console.info('options', options)
}

main()