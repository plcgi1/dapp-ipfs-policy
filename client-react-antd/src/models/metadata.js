import { status } from '../helpers/enums'

const schema = {
  title: 'Asset Metadata',
  type: 'object',
  cid: null,
  "properties": {
    "name": {
      "type": "string",
      "fieldType": "text",
      "description": "Identifies the asset to which this NFT represents",
    },
    "description": {
      "type": "string",
      "fieldType": "text",
      "description": "Describes the asset to which this NFT represents",
    },
    "carrier": {
      "type": "string",
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

  setValues (form) {
    Object.keys(form).forEach((key) => {
      this.schema.properties[key].value = form[key]
    })
  }

  async save (payload) {
    if (payload.status === status.published.id) {
      // save to ipfs
      // payload.cid = await this.ipfs.addJSON(payload)

      // TODO mint to contract

      return payload
    }

    window.localStorage.setItem('metadata', JSON.stringify(payload));

    return payload;
  }

  get () {
    const result = window.localStorage.getItem('metadata');
    return JSON.parse(result);
  }
}

export default Metadata;
