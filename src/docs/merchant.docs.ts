export const merchantDocs = {
  paths: {
    "/merchant/createOrUpdateSelection": {
      post: {
        summary: "Create or Update Merchant Blockchain & Token Selection",
        tags: ["Merchant"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  selections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        chainId: {
                          type: "integer",
                          example: 11155111,
                        },
                        tokenAddresses: {
                          type: "array",
                          items: {
                            type: "string",
                            example: "0x123abc...",
                          },
                        },
                      },
                      required: ["chainId", "tokenAddresses"],
                    },
                  },
                },
                required: ["selections"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Merchant subscriptions updated successfully",
          },
          400: {
            description: "Merchant ID and valid selections array required",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/merchant/getMySelection": {
      get: {
        summary: "Get current merchant blockchain & token selections",
        tags: ["Merchant"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Merchant subscription details fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  example: {
                    statusCode: 200,
                    message:
                      "Merchant subscription details fetched successfully",
                    data: [
                      {
                        chainId: 11155111,
                        tokenAddresses: ["0x123...", "0x456..."],
                      },
                      {
                        chainId: 1,
                        tokenAddresses: [
                          "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
          401: {
            description: "Merchant ID not found in session / Unauthorized",
          },
        },
      },
    },
    "/merchant/createPaymentIntent": {
      post: {
        summary: "Create Payment Intent (Merchant API)",
        tags: ["Merchant Payments"],
        security: [
          {
            apiKeyAuth: [],
          },
        ],
        parameters: [
          {
            in: "header",
            name: "x-api-key",
            required: true,
            schema: {
              type: "string",
              example: "sk_live_abc123",
            },
            description: "Merchant API Key",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  amountInInr: {
                    type: "number",
                    example: 1000,
                  },
                  tokenSymbol: {
                    type: "string",
                    example: "USDT",
                  },
                  chainId: {
                    type: "integer",
                    example: 11155111,
                  },
                },
                required: ["amountInInr", "tokenSymbol", "chainId"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Payment intent created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  example: {
                    statusCode: 200,
                    message: "Please pay exactly $12.34 USDT",
                    data: {
                      intentId: "uuid-generated-id",
                      amountInInr: 1000,
                      amountInUsd: 12.34,
                      tokenSymbol: "USDT",
                      chainId: 11155111,
                      status: "PENDING",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request or token not found",
          },
          403: {
            description: "Merchant not subscribed or invalid API key",
          },
        },
      },
    },
    "/merchant/saveMerchantConfig": {
  post: {
    summary: "Save or Create Merchant Configuration",
    tags: ["Merchant Configuration"],
    security: [
      {
        bearerAuth: []
      }
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              monitoringAddress: {
                type: "string",
                example: "0xMerchantReceivingWallet"
              },
              webhookUrl: {
                type: "string",
                example: "https://merchant.com/webhook"
              }
            },
            required: ["monitoringAddress", "webhookUrl"]
          }
        }
      }
    },
    responses: {
      200: {
        description: "Merchant config updated successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: {
                statusCode: 200,
                message: "Merchant config updated successfully",
                data: null
              }
            }
          }
        }
      },
      400: {
        description: "Not enough data"
      },
      401: {
        description: "Unauthorized"
      }
    }
  }
},
  },
};
