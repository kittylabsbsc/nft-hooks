export type RequestType = 'Tuli' | 'Graph' | 'IPFS' | 'OpenSea';
export type TimeoutsLookupType = Record<RequestType, number>;
export const DEFAULT_NETWORK_TIMEOUTS_MS: TimeoutsLookupType = {
  Tuli: 20 * 1000,
  Graph: 10 * 1000,
  IPFS: 10 * 1000,
  OpenSea: 8 * 1000,
};
