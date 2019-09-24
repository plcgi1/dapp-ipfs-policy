import IpfsHttpClient from 'ipfs-http-client'
import { Buffer } from 'buffer/'
import TruffleContract from '@truffle/contract'
import { status } from '../helpers/enums'
import { getWeb3 } from '../helpers/getWeb3'
import ERC721abi from '../contracts/ERC721MetadataMintable.json'
import TokenManagerabi from '../contracts/TokenManager.json'

const schema = {
  title: 'Asset Metadata',
  type: 'object',
  cid: null,
  properties: {
    name: {
      type: "string",
      fieldType: "text",
      description: "Identifies the asset to which this NFT represents",
    },
    description: {
      type: "string",
      fieldType: "text",
      description: "Describes the asset to which this NFT represents",
    },
    carrier: {
      type: "string",
      "fieldType": "text",
      "description": "Describes the carrier which takes the primary risk",
    },
    "risk": {
      "type": "string",
      "fieldType": "text",
      "description": "Describes the risk",
    },
    "parameters": {
      "type": "string",
      "fieldType": "text",
      "description": "Describes further parameters characterizing the risk",
    },
    "status": {
      "type": "string",
      "fieldType": "select",
      "description": "Defines the status of the policy, e.g. Applied, Underwritten, Claimed, Paid out, etc."
    }
  }
}

class Metadata {
  constructor () {
    this.schema = schema
  }

  initIpfs () {
    // TODO make it configurable
    this.ipfs = IpfsHttpClient('localhost', '5001')
  }

  async initWeb3 () {
    return getWeb3()
      .then((web3) => {

        return web3.eth.getAccounts((err, accounts) => {
          if (err) {
            throw new Error(err);
          }

          web3.eth.defaultAccount = accounts[0];
          console.log('getWeb3.Using account:', web3.eth.defaultAccount);
          this.web3 = web3
        });
      })
      .catch((error) => {
        throw new Error(error)
      })
  }

  async initContract () {
    this.contracts = {
      erc721: TruffleContract(ERC721abi),
      tokenManager: TruffleContract(TokenManagerabi)
    };

    this.contracts.erc721.setProvider(this.web3.currentProvider)
    this.contracts.tokenManager.setProvider(this.web3.currentProvider)

    const tokenInstance = await this.contracts.erc721.deployed()
    const managerInstance = await this.contracts.tokenManager.deployed()

    const name = await tokenInstance.name()
    const symbol = await tokenInstance.symbol()

    const balanceOf = await tokenInstance.balanceOf(this.web3.eth.defaultAccount)

    this.balanceOf = balanceOf.toNumber()
    this.tokenInfo = {
      contractAddress: tokenInstance.address,
      tokenManagerAddress: managerInstance.address,
      name: name,
      symbol: symbol
    }
  }

  getTokenInfo() {
    return this.tokenInfo
  }

  getAccountId () {
    return this.web3 ? this.web3.eth.defaultAccount : null
  }

  setSchema (newSchema) {
    this.schema = newSchema
  }

  async save (values) {
    console.info('values.status', values.status)
    Object.keys(values).forEach(key => {
      this.schema.properties[key].value = values[key]
    })
    return new Promise(async ( resolve, reject) => {
      if (values.status === status.published.id) {
        // save to ipfs
        const content = Buffer.from(JSON.stringify(this.schema))
        try {
          const results = await this.ipfs.add(content)
          this.schema.cid = results[0].hash // "Qm...WW"

          window.localStorage.setItem('metadata', JSON.stringify(this.schema));

          // address to, uint256 tokenId, string memory cid, string memory baseUri
          const managerInstance = await this.contracts.tokenManager.deployed()

          const minted = await managerInstance.mint(
            this.web3.eth.defaultAccount,
            1000,
            this.schema.cid,
            'http://localhost:8080/ipfs',
            { from: this.web3.eth.defaultAccount, message: 'test' }
          )
          return resolve(this)
        } catch (error) {
          // reset schema status
          this.schema.properties.status.value = status.draft.id

          window.localStorage.setItem('metadata', JSON.stringify(this.schema));

          return reject(error)
        }
      }

      window.localStorage.setItem('metadata', JSON.stringify(this.schema));

      return resolve(this);
    })
  }

  get () {
    const result = window.localStorage.getItem('metadata');
    return JSON.parse(result);
  }
}

export default Metadata;
