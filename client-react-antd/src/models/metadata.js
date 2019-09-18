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
    console.info('TODO init ipfs here')
    console.info('TODO init web3 here')
    this.schema = schema
  }

  setSchema (newSchema) {
    this.schema = newSchema
  }

  async save (values) {
    Object.keys(values).forEach(key => {
      this.schema.properties[key].value = values[key]
    })
    return new Promise(( resolve, reject) => {
      if (values.status === status.published.id) {
        // save to ipfs
        // payload.cid = await this.ipfs.addJSON(payload)

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
