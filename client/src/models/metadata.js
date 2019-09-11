import { status } from '../helpers/enums'

export default {
  save: async (payload, ipfs) => {
    if (payload.status === status.published.id) {
      // save to ipfs
      const cid = await ipfs.addJSON(payload)

      window.localStorage.removeItem('metadata')

      // TODO save to contract cid
      return cid
    }
    window.localStorage.setItem('metadata', JSON.stringify(payload));
    return false;
  },
  get: () => {
    const result = window.localStorage.getItem('metadata');
    return JSON.parse(result);
  },
  model: {
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