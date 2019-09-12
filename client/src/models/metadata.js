import { status } from '../helpers/enums'

const model = {
  save: async (payload, ipfs) => {
    if (payload.status === status.published.id) {
      // save to ipfs
      payload.cid = await ipfs.addJSON(payload)

      // TODO save cid to contract
    }
    window.localStorage.setItem('metadata', JSON.stringify(payload));

    return payload;
  },
  get: () => {
    const result = window.localStorage.getItem('metadata');
    return JSON.parse(result);
  },
  schema: {
    "title": "Asset Metadata",
    "type": "object",
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
}
export default model;
