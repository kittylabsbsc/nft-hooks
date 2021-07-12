import { renderHook } from '@testing-library/react-hooks';
import { IMockStore } from '@graphql-tools/mock';
import { cache } from 'swr';

import { mockGraphQLQuery } from './setupTuliGQLMock';

import fetchMock from './setupFetchMock';

import { useXNFTGroup } from '../src';

describe('useXNFTGroup', () => {
  beforeEach(() => {
    fetchMock.reset();
    cache.clear();
  });
  const MEDIA_MOCK = {
    id: '2974',
    contentURI: 'https://tuli.ink/content',
    metadataURI: 'https://tuli.ink/content',
    currentBids: [
      {
        amount: '10000',
        bidder: { id: 10 },
      },
    ],
  };
  const RESERVE_AUCTION_MOCK = {
    tokenId: 2974,
    status: 'Active',
    curatorFeePercentage: 100,
    approved: true,
  };

  it('loads an nft currently in an auction', async () => {
    const mockOverrides = {
      Media: () => MEDIA_MOCK,
      ReserveAuction: () => RESERVE_AUCTION_MOCK,
    };

    mockGraphQLQuery(
      'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubrinkeby',
      mockOverrides
    );

    const { waitFor, result } = renderHook(() => useXNFTGroup(['2974']));

    await waitFor(() => !!result.current.medias);

    expect(result.current.error).toBeUndefined();
    expect(result.current.medias).toMatchSnapshot();
  });

  it('correctly loads auction information from uniswap', async () => {
    const mockTuliOverrides = {
      Media: () => MEDIA_MOCK,
      ReserveAuction: () => RESERVE_AUCTION_MOCK,
    };
    const mockUniswapOverrides = {
      Token: () => ({
        id: '0xFACE',
        decimals: 18,
      }),
    };

    mockGraphQLQuery(
      'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
      mockUniswapOverrides,
      {},
      'Uniswap'
    );

    mockGraphQLQuery(
      'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubrinkeby',
      mockTuliOverrides,
      {},
      'Tuli'
    );

    const { waitFor, result } = renderHook(() =>
      useXNFTGroup(['2974'], 'id', { loadCurrencyInfo: true })
    );

    await waitFor(() => !!result.current.medias);

    expect(result.current.error).toBeUndefined();
    expect(result.current.medias).toMatchSnapshot();

    await waitFor(() => result.current.currencyLoaded === true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.medias).toMatchSnapshot();
  });

  it('loads an NFT not in an auction with bids', async () => {
    const mockOverrides = {
      Media: () => MEDIA_MOCK,
      // make an invalid reserve auction record to not be picked up by the fetch API
      ReserveAuction: () => ({ ...RESERVE_AUCTION_MOCK, tokenId: '-1' }),
    };

    mockGraphQLQuery(
      'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubrinkeby',
      mockOverrides
    );

    const { waitFor, result } = renderHook(() => useXNFTGroup(['2974']));

    await waitFor(() => !!result.current.medias);

    expect(result.current.error).toBeUndefined();
    expect(result.current.medias).toMatchSnapshot();
  });

  it('shows an error when an NFT cannot be loaded', async () => {
    fetchMock.post(
      'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubrinkeby',
      'server failure',
      { response: { status: 500 } }
    );

    const { waitFor, result } = renderHook(() => useXNFTGroup(['2972']));

    await waitFor(() => !!result.current.error);

    expect(result.current.medias).toBeUndefined();
    expect(result.current.error?.toString()).toEqual(
      'RequestError: Request Status = 500'
    );
  });

  it('loads an NFT with no bids and no auction', async () => {
    const mediaWithNoBids = { ...MEDIA_MOCK, currentBids: [] };
    const mockOverrides = {
      Media: () => mediaWithNoBids,
      // make an invalid reserve auction record to not be picked up by the fetch API
      ReserveAuction: () => ({ ...RESERVE_AUCTION_MOCK, tokenId: '-1' }),
    };

    mockGraphQLQuery(
      'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubrinkeby',
      mockOverrides
    );

    const { waitFor, result } = renderHook(() => useXNFTGroup(['2974']));

    await waitFor(() => !!result.current.medias);

    expect(result.current.error).toBeUndefined();
    expect(result.current.medias).toMatchSnapshot();
  });

  it('caches multiple NFTs being loaded', async () => {
    mockGraphQLQuery(
      'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubrinkeby',
      {},
      (store: IMockStore) => {
        return {
          Query: {
            medias: () => {
              // Fix returning ID for each record with multiple records.
              return [store.get('Media', '1'), store.get('Media', '2')];
            },
          },
        };
      }
    );

    const { waitFor, result } = renderHook(() => useXNFTGroup(['1', '2']));

    await waitFor(() => !!result.current.medias);

    expect(result.current.error).toBeUndefined();
    expect(result.current.medias).toMatchSnapshot();

    const { waitFor: waitFor2, result: result2 } = renderHook(() =>
      useXNFTGroup(['1', '2'])
    );

    // If this attempts to make a new HTTP request,
    //  the request will fail since the mock only works once.
    await waitFor2(() => !!result2.current.medias);

    expect(result2.current.error).toBeUndefined();
    expect(result2.current.medias).toMatchSnapshot();
  });
});
