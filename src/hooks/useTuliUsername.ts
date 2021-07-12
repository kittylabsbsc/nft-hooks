import { useContext } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

import { NFTFetchContext } from '../context/NFTFetchContext';

/**
 * useTuliUsername - Load tuli username for pretty display
 *
 * @param address string address to fetch tuli username of
 * @returns UsernameResponseType
 */
export function useTuliUsername(address: string, options?: SWRConfiguration<any>) {
  const fetcher = useContext(NFTFetchContext);
  const { error, data } = useSWR(
    ['loadUsername', address],
    (_, address: string) => fetcher.loadUsername(address),
    options,
  );

  return { error, username: data };
}
