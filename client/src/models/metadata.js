import IpfsHttpClient from 'ipfs-http-client'
import { Buffer } from 'buffer/'
import TruffleContract from '@truffle/contract'
import { status, contractBaseUrl } from '../helpers/enums'
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
    risk: {
      type: "string",
      fieldType: "text",
      description: "Describes the risk",
    },
    parameters: {
      type: "string",
      fieldType: "text",
      description: "Describes further parameters characterizing the risk",
    },
    status: {
      type: "string",
      fieldType: "select",
      description: "Defines the status of the policy, e.g. Applied, Underwritten, Claimed, Paid out, etc."
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
          if (!accounts[0]) {
            return Promise.reject('Empty account.Check metamask')
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

  subscribeToMetamaskUpdates (callback) {
    this.web3.currentProvider.publicConfigStore.on('update', (ev) => {
      this.web3.eth.defaultAccount = ev.selectedAddress
      callback(ev.selectedAddress)
    });
  }

  async initContract () {
    this.contracts = {
      erc721: TruffleContract(ERC721abi),
      tokenManager: TruffleContract(TokenManagerabi)
    };

    if (!this.web3) {
      throw new Error('Empty contracts')
    }
    this.contracts.erc721.setProvider(this.web3.currentProvider)
    this.contracts.tokenManager.setProvider(this.web3.currentProvider)

    const tokenInstance = await this.contracts.erc721.deployed()

    const managerInstance = await this.contracts.tokenManager.deployed()

    const name = await tokenInstance.name()
    const symbol = await tokenInstance.symbol()

    const balanceOf = await tokenInstance.balanceOf(this.web3.eth.defaultAccount)

    this.balanceOf = balanceOf.toNumber()
    const chainId = await this.web3.eth.net.getId()

    this.tokenInfo = {
      contractAddress: tokenInstance.address,
      tokenManagerAddress: managerInstance.address,
      name: name,
      symbol: symbol,
      chainId
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

  _convertToEip712 () {
    /*
 https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
 https://github.com/ethereum/EIPs/blob/master/assets/eip-712/Example.js

{
  types: {
    EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
    ],
    Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' }
    ],
    Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' }
    ],
  },
  primaryType: 'Mail',
  domain: {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  message: {
      from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
  },
}
    * */
    // TODO refactor to module
    const { tokenManagerAddress } = this.tokenInfo
    const { schema } = this

    const _schemaToMetadata = (schema) => {
      const result = Object.keys(schema.properties)
        .map(property => {
          return { name: property, type: schema.properties[property].type }
        })

      return result
    }

    const _valuesToObject = (schema) => {
      const result = {}
      Object.keys(schema.properties)
        .forEach(property => {
          result[property] = schema.properties[property].value
        })
      return result
    }

    return {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Metadata: _schemaToMetadata(schema)
      },
      primaryType: 'Metadata',
      domain: {
        name: schema.title,
        version: '1',
        chainId: this.tokenInfo.chainId,
        verifyingContract: tokenManagerAddress
      },
      message: _valuesToObject(schema)
    }
  }

  async sendAsync (convertedData) {
    return new Promise((resolve, reject) => {
      this.web3.currentProvider.sendAsync({
        method: 'eth_signTypedData_v3',
        params: [this.web3.eth.defaultAccount, JSON.stringify(convertedData)],
        from: this.web3.eth.defaultAccount
      }, (err, signedData) => {
        if (err) return reject(err)

        return resolve(signedData)
      })
    })
  }

  async save (values, tokenId) {
    Object.keys(values).forEach(key => {
      this.schema.properties[key].value = values[key]
    })
    try {
      if (values.status === status.published.id) {
        const content = Buffer.from(JSON.stringify(this.schema))
        const results = await this.ipfs.add(content)
        this.schema.cid = results[0].hash // "Qm...WW"

        window.localStorage.setItem('metadata', JSON.stringify(this.schema));

        // address to, uint256 tokenId, string memory cid, string memory baseUri
        const managerInstance = await this.contracts.tokenManager.deployed()

        // TODO we can send it with this.web3.eth.signTypedData in future
        const convertedData = this._convertToEip712()

        const signedData = await this.sendAsync(convertedData)

        await managerInstance.mint(
          this.web3.eth.defaultAccount,
          tokenId,
          this.schema.cid,
          // TODO make me configurable from form fields
          contractBaseUrl,
          {
            from: this.web3.eth.defaultAccount,
            data: { message: signedData },
            message: signedData
          }
        )

        return this
      }
      window.localStorage.setItem('metadata', JSON.stringify(this.schema));

      return this
    } catch (error) {
      throw new Error(error)
    }
  }

  get () {
    const result = window.localStorage.getItem('metadata');
    return JSON.parse(result);
  }
}

export default Metadata;
