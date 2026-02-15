export const blockchainDocs = {
  paths: {
    "/blockchains/getBlockchainDetails": {
      get: {
        summary: "Get supported blockchains of the platform",
        tags: ["Getters"],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {},
              },
            },
          },
        },
        responses: {
          200: { description: "Blockchains fetched successfully" },
          400: { description: "Error while fetching blockchains" },
        },
      },
    },
    "/blockchains/tokens": {
      get: {
        summary: "Get supported tokens by chainId",
        tags: ["Getters"],
        parameters: [
          {
            in: "query",
            name: "chainId",
            required: true,
            schema: {
              type: "integer",
              example: 1,
            },
            description: "Blockchain Chain ID (e.g., 1 for Ethereum)",
          },
        ],
        responses: {
          200: {
            description: "Tokens fetched successfully",
          },
          400: {
            description: "Invalid Chain ID provided",
          },
          404: {
            description: "No tokens found for this chain ID",
          },
        },
      },
    },
    "/blockchains/getAllTokensGroupedByChain": {
      get: {
        summary: "Get all supported tokens grouped by blockchain",
        tags: ["Getters"],
        responses: {
          200: {
            description: "Tokens grouped by chain fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  example: {
                    statusCode: 200,
                    message: "Tokens grouped by chain fetched successfully",
                    data: {
                      Ethereum: [
                        {
                          symbol: "USDT",
                          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                        },
                      ],
                      BSC: [
                        {
                          symbol: "USDT",
                          address: "0x55d398326f99059fF775485246999027B3197955",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Error while fetching grouped tokens",
          },
        },
      },
    },
    "/blockchains/receive_quicknode_events": {
      post: {
        summary: "QuickNode Webhook - Validate and Process Payment Intent",
        tags: ["Webhooks"],
        description:
          "Receives blockchain event payloads from QuickNode and validates payment intents.",
        parameters: [
          {
            in: "header",
            name: "x-qn-signature",
            required: true,
            schema: {
              type: "string",
              example: "your_quicknode_security_token",
            },
            description:
              "Security token provided by QuickNode to verify webhook authenticity",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    intentId: {
                      type: "string",
                      example: "intent_123456",
                    },
                    txHash: {
                      type: "string",
                      example: "0xabc123...",
                    },
                    merchantAddress: {
                      type: "string",
                      example: "0xMerchantWalletAddress",
                    },
                    amount: {
                      type: "number",
                      example: 100,
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Events processed successfully",
          },
          401: {
            description: "Invalid Security Token",
          },
          400: {
            description: "Error while processing webhook",
          },
        },
      },
    },
    
  },
};
