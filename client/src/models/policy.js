export default {
  "title": "Asset Metadata",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Identifies the asset to which this NFT represents",
    },
    "description": {
      "type": "string",
      "description": "Describes the asset to which this NFT represents",
    },
    "carrier": {
      "type": "string",
      "description": "Describes the carrier which takes the primary risk",
    },
    "risk": {
      "type": "string",
      "description": "Describes the risk",
    },
    "parameters": {
      "type": "string",
      "description": "Describes further parameters characterizing the risk",
    },
    "status": {
      "type": "string",
      "description": "Defines the status of the policy, e.g. Applied, Underwritten, Claimed, Paid out, etc."
    }
  }
}