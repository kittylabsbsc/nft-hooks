import { useContext } from 'react';

import { NFTFetchContext } from '../context/NFTFetchContext';
import { NFTDataType } from '../fetcher/AuctionInfoTypes';
import { useOpenseaNFT } from './useOpenseaNFT';
import { TULI_MEDIA_CONTRACT_BY_NETWORK } from '../constants/addresses';
import { useXNFT } from './useXNFT';

export type useNFTType = {
  currencyLoaded: boolean;
  error?: string;
  data?: NFTDataType;
};

type OptionsType = {
  refreshInterval?: number;
  initialData?: any;
  loadCurrencyInfo?: boolean;
};

/**
 * Fetches on-chain NFT data and pricing for the given xNFT id
 *
 * @param contractAddress address of the contract, if null and tokenID is passed in, a XNFT is assumed
 * @param tokenId id of NFT to fetch blockchain information for
 * @param options SWR flags and an option to load currency info
 * @returns useNFTType hook results include loading, error, and chainNFT data.
 */
export function useNFT(
  contractAddress?: string,
  tokenId?: string,
  options: OptionsType = {}
): useNFTType {
  const fetcher = useContext(NFTFetchContext);

  if (!contractAddress) {
    contractAddress = TULI_MEDIA_CONTRACT_BY_NETWORK[fetcher.networkId];
  }

  const isTuliContractAddress =
    contractAddress === TULI_MEDIA_CONTRACT_BY_NETWORK[fetcher.networkId];

  const openseaNFT = useOpenseaNFT(
    !isTuliContractAddress ? contractAddress : undefined,
    !isTuliContractAddress ? tokenId : undefined,
    options
  );

  const tuliNFT = useXNFT(isTuliContractAddress ? tokenId : undefined, options);

  let data = isTuliContractAddress ? tuliNFT : openseaNFT;

  return {
    currencyLoaded: !!data.currencyLoaded,
    error: data.error,
    data: data.data,
  };
}
