import { Request, Response } from 'express';
import { getBlockchains, getAllTokensGroupedByChain, getTokensByChainId } from '../../daos/blockchain.dao';
import { ApiResponse } from '../../utils/apiResponse.utils';
import { ApiError } from '../../utils/apiError.utils';
import { asyncHandler } from '../../utils/asyncHandler.utils';

export const getBlockchainController = asyncHandler(async (req: Request, res: Response) => {
  try {
    const blockchains = await getBlockchains();
    return new ApiResponse(200, blockchains, "Blockchains fetched successfully");
  } catch (error) {
    console.error("Error fetching blockchains:", error);
    throw new ApiError("Error while fetching blockchains", 400);
  }
});

export const getTokensByChainIdController = asyncHandler(async (req: Request, res: Response) => {
  const { chainId } = req.query;
  try {
    if (isNaN(Number(chainId))) {
    throw new ApiError("Invalid Chain ID provided in URL", 400);
  }
    const tokens = await getTokensByChainId(Number(chainId));
    if (!tokens) {
      return new ApiResponse(404, null, "No tokens found for this chain ID");
    }
    return new ApiResponse(200, tokens, "Tokens fetched successfully");
  } catch (error) {
    console.error("Error fetching tokens:", error);
    throw new ApiError("Error while fetching tokens", 400);
  }
});

export const getAllTokensGroupedByChainController = asyncHandler(async (req: Request, res: Response) => {
  try {
    const groupedTokens = await getAllTokensGroupedByChain();
    return new ApiResponse(200, groupedTokens, "Tokens grouped by chain fetched successfully");
  } catch (error) {
    console.error("Error fetching grouped tokens:", error);
    throw new ApiError("Error while fetching grouped tokens", 400);
  }
});
