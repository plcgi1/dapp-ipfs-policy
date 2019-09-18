import IpfsHttpClient from 'ipfs-http-client'
import { Buffer } from 'buffer/'
import { status } from '../helpers/enums'

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
    this.ipfs = IpfsHttpClient('localhost', '5001')
  }

  initWeb3 () {
    console.info('TODO init web3 here')
  }

  setSchema (newSchema) {
    this.schema = newSchema
  }

  async save (values) {
    Object.keys(values).forEach(key => {
      this.schema.properties[key].value = values[key]
    })
    return new Promise(async ( resolve, reject) => {
      if (values.status === status.published.id) {
        // save to ipfs
        const content = Buffer.from(JSON.stringify(this.schema))
        const results = await this.ipfs.add(content)
        this.schema.cid = results[0].hash // "Qm...WW"

        window.localStorage.setItem('metadata', JSON.stringify(this.schema));

        // TODO mint to contract

        return resolve(this)
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
