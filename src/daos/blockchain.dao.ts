import { BlockchainSchema, IBlockchain } from '../models/blockchain.model';
import { ChainTokens, IChainTokens } from '../models/token.model';


export const getBlockchains = async (): Promise<IBlockchain[]> => {
   return await BlockchainSchema.find().lean();
};

export const getTokensByChainId = async (chainId: number): Promise<IChainTokens | null> => {
  return await ChainTokens.findOne({ chainId }).lean();
};

export const getAllTokensGroupedByChain = async () => {
  const tokens = await ChainTokens.find().lean();

  // This transforms the array into an object like { "1": [tokens], "137": [tokens] }
  const grouped = tokens.reduce((acc, token) => {
    const { chainId } = token;
    if (!acc[chainId]) {
      acc[chainId] = [];
    }
    acc[chainId].push(token);
    return acc;
  }, {} as Record<number, any[]>);

  return grouped;
};